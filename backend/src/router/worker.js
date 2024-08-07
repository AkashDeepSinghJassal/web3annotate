import config from "../config/index.js";
import prismaClient from "../databaseClient/prismaClient.js";
import { workerMiddleware } from "../middleware.js";

const router = express.Router()



router.get("/nextTask", workerMiddleware, async (req, res) => {

    const userId = req.userId;

    const task = await getNextTask(Number(userId));

    if (!task) {
        res.status(411).json({   
            message: "No more tasks left for you to review"
        })
    } else {
        res.json({   
            task
        })
    }
})

router.post("/signin", async(req, res) => {
    const { publicKey, signature } = req.body;
    // const message = new TextEncoder().encode("Sign into survery/annotate as a worker");

    // const result = nacl.sign.detached.verify(
    //     message,
    //     new Uint8Array(signature.data),
    //     new PublicKey(publicKey).toBytes(),
    // );

    // if (!result) {
    //     return res.status(411).json({
    //         message: "Incorrect signature"
    //     })
    // }

    const existingWorker = await prismaClient.worker.findFirst({
        where: {
            address: publicKey
        }
    })

    if (existingWorker) {
        const token = jwt.sign({
            userId: existingWorker.id
        }, config.jwt.workerSecret)

        res.json({
            token,
            amount: existingWorker.pending_amount / TOTAL_DECIMALS
        })
    } else {
        const worker = await prismaClient.worker.create({
            data: {
                address: publicKey,
                pending_amount: 0,
                locked_amount: 0
            }
        });

        const token = jwt.sign({
            userId: worker.id
        }, config.jwt.workerSecret)

        res.json({
            token,
            amount: 0
        })
    }
})

/**
 * Get next task which hadn't been submitted by worker and is not already done
 * @param {} userId id of user
 * @returns task details
 */
const getNextTask = async (userId) => {
    const task = await prismaClient.task.findFirst({
        where: {
            done: false,
            submissions: {
                none: {
                    worker_id: userId
                }
            }
        },
        select: {
            id: true,
            amount: true,
            title: true,
            options: true
        }
    })

    return task
}

export default router
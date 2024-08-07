import config from "../config/index.js";
import prismaClient from "../databaseClient/prismaClient.js";
import { workerMiddleware } from "../middleware.js";
import express from "express"
import jwt from "jsonwebtoken"
import { createSubmissionInput } from "../types.js";
const router = express.Router()


router.get("/balance", workerMiddleware, async (req, res) => {
    const userId = req.userId;

    const worker = await prismaClient.worker.findFirst({
        where: {
            id: Number(userId)
        }
    })

    res.json({
        pendingAmount: worker?.pending_amount,
        lockedAmount: worker?.pending_amount,
    })
})


router.get("/nextTask", workerMiddleware, async (req, res) => {


    try {
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
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: err.message
        })
    }
})

router.post("/signin", async (req, res) => {
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
            amount: existingWorker.pending_amount / config.token.currencyPrecision
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


router.post("/submission", workerMiddleware, async (req, res) => {

    try {

        const userId = req.userId;
        const body = req.body;
        const parsedBody = createSubmissionInput.safeParse(body);

        if (parsedBody.success) {
            // check if submission is done for current assigned task
            const task = await getNextTask(Number(userId));
            if (!task || task?.id !== Number(parsedBody.data.taskId)) {
                return res.status(411).json({
                    message: "Incorrect task id"
                })
            }

            const submissionAmount = task.amount / config.worker.submissionCount
            // start transaction
            await prismaClient.$transaction(async tx => {
                // create submission
                const submission = await tx.submission.create({
                    data: {
                        option_id: Number(parsedBody.data.optionId),
                        worker_id: userId,
                        task_id: Number(parsedBody.data.taskId),
                        amount: Number(submissionAmount)
                    }
                })
                // update worker amount increment by submission amount
                await tx.worker.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        pending_amount: {
                            increment: Number(submissionAmount)
                        }
                    }
                })

                return submission;
            })
            // send new task response
            const nextTask = await getNextTask(Number(userId));
            res.json({
                nextTask,
                amount: submissionAmount
            })


        } else {
            console.log(parsedBody.error);
            res.status(411).json({
                message: `Incorrect inputs ${parsedBody.error.message}`
            })

        }
    } catch (err) {
        console.error(`Exception in submission ${err.message}`)
        console.error(err)
        res.status(500).json({
            message: err.message
        })
    }

})


router.post("/payout", workerMiddleware, async (req, res) => {
    try {

        const workerId = req.userId;
        const worker = await prismaClient.worker.findFirst({
            where: { id: Number(workerId) }
        })
        console.log(`worker ${worker.id} initiate payout of ${worker.pending_amount}`);
        if (!worker) {
            return res.status(403).json({
                message: "User worker not found"
            })
        }
        // using a temp transaction id 
        const tnx_id = "0x1234abef"
        await prismaClient.$transaction(async tx => {
            await tx.worker.update({
                where: {
                    id: Number(workerId)
                },
                data: {
                    pending_amount: {
                        decrement: worker.pending_amount
                    },
                    locked_amount: {
                        increment: worker.pending_amount
                    }
                }
            })

            await tx.payouts.create({
                data: {
                    worker_id: Number(workerId),
                    amount: worker.pending_amount,
                    status: "Processing",
                    signature: tnx_id
                }
            })
        })

        res.json({
            message: "Processing payout",
            amount: worker.pending_amount
        })
    } catch (err) {
        console.error(`Exception in payout ${err.message}`)
        console.error(err)
        res.status(500).json({
            message: err.message
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
import express from "express"
import { userMiddleware } from "../middleware.js";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import s3Client from "../storageClient/s3Client.js";
import prismaClient from "../databaseClient/prismaClient.js";
import jwt from "jsonwebtoken"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();


router.post("/signin", async (req, res) => {
    const { publicKey, signature } = req.body;
    // const message = new TextEncoder().encode("Sign into mechanical turks");

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
    console.log(`Sign in user with ${publicKey}`)
    const existingUser = await prismaClient.user.findFirst({
        where: {
            address: publicKey
        }
    })

    if (existingUser) {
        console.log("user exists");
        const token = jwt.sign({
            userId: existingUser.id
        }, process.env.JWT_SECRET)

        res.json({
            token
        })
    } else {
        console.log("create new user");
        const user = await prismaClient.user.create({
            data: {
                address: publicKey,
            }
        })

        const token = jwt.sign({
            userId: user.id
        }, process.env.JWT_SECRET)

        res.json({
            token
        })
    }
});
router.get("/presignedUrl", userMiddleware, async (req, res) => {

    const userId = req.userId;

    const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: process.env.AWS_BUCKET ?? "",
        Key: `web3_annotate_s3/${userId}/${Math.random()}.jpg`,
        Conditions: [
            ['content-length-range', 0, 5 * 1024 * 1024] // 5 MB max
        ],
        Fields : {
            "Content-Type" : "image/png"
        },
        Expires: 3600
    })
    console.log({url, fields});
    res.json({
        preSignedUrl: url,
        fields
    })

})

router.get("/presignedUrlPut", userMiddleware, async (req, res) => {

    const userId = req.userId;


    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET ?? "",
        Key: `web3_annotate_s3/${userId}/${Math.random()}.jpg`
    })

    const preSignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600
    })

    console.log(preSignedUrl)

    res.json({
        preSignedUrl: preSignedUrl
    })

})

export default router
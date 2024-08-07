import express from 'express'
import userRouter from './src/router/user.js';
import cors from 'cors'
import "dotenv/config";

const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/user', userRouter)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
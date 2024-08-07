import express from 'express'
import userRouter from './src/router/user.js';
import cors from 'cors'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => res.send('Welcome to Web3 Annotate'))
app.use('/user', userRouter)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
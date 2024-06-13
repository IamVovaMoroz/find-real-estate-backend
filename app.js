import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './api/routes/auth.route.js'
import postRouter from './api/routes/post.route.js'
import dotenv from 'dotenv';
import userRouter from './api/routes/user.route.js';

const app = express()
dotenv.config();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/posts', postRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter);


app.listen(8800, ()=>{
	console.log('server is running port 8800')
})
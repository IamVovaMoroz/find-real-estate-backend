import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js'


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use('/api/posts', postRouter)
app.use('/api/auth', authRouter)


app.listen(8800, ()=>{
	console.log('server is running port 8800')
})
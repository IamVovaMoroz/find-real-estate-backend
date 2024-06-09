import express from 'express'

const app = express()

app.use('/api/test', (req, res) => {
	res.send('it works')
})

console.log('test3')

app.listen(8800, ()=>{
	console.log('server is running port 8800')
})
/**
 * Express Server
 */

const express = require('express')
const PORT = 3000

const app = express()

app.get('/', (req, res) => {
	res.send({ message: "What's up bitch!" })
})

app.post('/', (req, res) => {
	res.send("What are you trying to post?...")
})

app.get('/coffee', (req, res) => {
	res.send("Coffee is nasty, precious, but we needs it, yes we needs it to survive, precious, yeees...")
})

app.listen(PORT, () => {
	console.log(`Server started on localhost:${PORT}`)
})

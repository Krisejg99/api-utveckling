/**
 * Express Server
 */

const express = require('express')
const { on } = require('nodemon')
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



/**
 * Workshop start
 */

const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

const oneliners = require('./data/oneliners.json')

app.get('/joke', (req, res) => {
	shuffleArray(oneliners)
	res.json({ joke: oneliners[0] })
})

/**
 * Workshop end
 */

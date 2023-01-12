/**
 * Express Server
 */

const express = require('express')
const _ = require('lodash')
const morgan = require('morgan')
const { on } = require('nodemon')

const oneliners = require('./data/oneliners.json')
const users = require('./data/users.json')

const PORT = 3000
const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
	res.send({ message: "What's up bitch!" })
})

app.post('/', (req, res) => {
	res.send("What are you trying to post?...")
})

app.get('/coffee', (req, res) => {
	res.send("Coffee is nasty, precious, but we needs it, we needs it to survive, precious, yeees...")
})

app.get('/joke', (req, res) => {
	const joke = _.sample(oneliners)
	res.send({
		joke: joke
	})
})

app.get('/users', (req, res) => {
	res.send(users)
})

app.get('/users/:userId', (req, res) => {
	const user = users.find(user => user.id === Number(req.params.userId))
	if (user) {
		res.send(user)
	}
	else {
		res.status(404).send({
			message: `Sorry, no user with id '${req.params.userId}' exists.`
		})
	}

})

app.post('/users', (req, res) => {
	console.log(req.body)
	res.send(req.body)
})

app.use((req, res) => {
	res.status(404).send({
		message: `Sorry, no route exists for ${req.method} ${req.path}`
	})
})

app.listen(PORT, () => {
	console.log(`Server started on localhost:${PORT}`)
})

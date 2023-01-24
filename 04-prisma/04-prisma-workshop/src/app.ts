import express from "express"
import prisma from "./prisma" // importing the prisma instance we created
import morgan from "morgan"

const app = express()
app.use(express.json())
app.use(morgan('dev'))

/**
 * GET /
 */
app.get('/', (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP",
	})
})

/**
 * GET /users
 */

app.get('/users', async (req, res) => {
	try {
		const users = await prisma.users.findMany()
		res.send(users)
	}
	catch (err) {
		console.log(err)

		res.status(500).send({
			message: 'Server offline.'
		})
	}
})

app.get('/users/:userId', async (req, res) => {
	const userId = Number(req.params.userId)

	try {
		const user = await prisma.users.findUnique({
			where: {
				id: userId,
			},
			include: {
				phones: true,
			},
		})

		if (!user) {
			res.status(404).send({
				message: `404. There is no user with id ${userId}.`
			})
			return
		}

		res.send(user)
	}
	catch (err) {
		console.log(err)

		res.status(500).send({
			message: 'Server offline.'
		})
	}
})

/**
 * GET /phones
 */

app.get('/phones', async (req, res) => {

	try {
		const phones = await prisma.phones.findMany()
		res.send(phones)
	}
	catch (err) {
		console.log(err)

		res.status(500).send({
			message: 'Server offline.'
		})
	}
})

app.get('/phones/:phoneId', async (req, res) => {
	const phoneId = Number(req.params.phoneId)

	try {
		const phone = await prisma.phones.findUnique({
			where: {
				id: phoneId,
			},
			include: {
				user: true,
			},
		})

		if (!phone) {
			res.status(404).send({
				message: `404. There is no phone with id ${phoneId}.`
			})
			return
		}

		res.send(phone)
	}
	catch (err) {
		console.log(err)

		res.status(500).send({
			message: 'Server offline.'
		})
	}
})

/**
 * POST /users
 */

app.post('/users', async (req, res) => {
	const { name } = req.body

	// Check that the data is correctly formatted
		if (typeof name !== 'string') {

			res.send({
				message: "That's not a valid name."
			})
			return
		}

	try {
		const user = await prisma.users.create({
			data: {
				name,
			},
			include: {
				phones: true,
			},
		})

		res.send(user)
	}
	catch (err) {
		console.log(err)

		res.status(500).send({
			message: 'Server offline.'
		})
	}
})

/**
 * POST /phones
 */

app.post('/phones', async (req, res) => {
	const { manufacturer, model, imei, user_id } = req.body

	// Check that the data is correctly formatted
	if (typeof manufacturer !== 'string'
	|| typeof model !== 'string'
	|| typeof imei !== 'string'
	|| typeof user_id !== 'number') {

		res.send({
			message: "Manufacturer, model and imei must be strings and user_id must be a number."
		})

		return
	}

	try {
		const phone = await prisma.phones.create({
			data: {
				manufacturer,
				model,
				imei,
				user_id,
			},
			include: {
				user: true,
			},
		})

		res.send(phone)
	}
	catch (err) {
		console.log(err)

		res.status(500).send({
			message: 'Server offline.'
		})
	}
})

export default app

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
	const users = await prisma.users.findMany()
	res.send(users)
})

app.get('/users/:userId', async (req, res) => {
	const userId = Number(req.params.userId)

	const user = await prisma.users.findUnique({
		where: {
			id: userId,
		},
		include: {
			phones: true,
		},
	})

	res.send(user)
})

/**
 * GET /phones
 */

app.get('/phones', async (req, res) => {
	const phones = await prisma.phones.findMany()
	res.send(phones)
})

app.get('/phones/:phoneId', async (req, res) => {
	const phoneId = Number(req.params.phoneId)

	const phone = await prisma.phones.findUnique({
		where: {
			id: phoneId,
		},
		include: {
			users: true,
		},
	})

	res.send(phone)
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

	const user = await prisma.users.create({
		data: {
			name,
		},
		include: {
			phones: true,
		},
	})

	res.send(user)
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

	const phone = await prisma.phones.create({
		data: {
			manufacturer,
			model,
			imei,
			user_id,
		},
	})

	res.send(phone)
})

export default app

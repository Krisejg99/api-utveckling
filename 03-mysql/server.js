/**
 * Express Server
 */

// Require stuff
require('dotenv').config()
const express = require('express')
const _ = require('lodash')
const morgan = require('morgan')
const PORT = 3000

// Get the client
const mysql = require('mysql2/promise')

// Create connection to the database
const connection = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
})

// Create a new Express app
const app = express()

// Parse any incoming JSON
app.use(express.json())

// Log information about all incoming requests using morgan
app.use(morgan('dev'))

/**
 * GET
 */

app.get('/', (req, res) => {
	res.send({
		message: "What's up bitch!",
	})
})

/**
 * GET /URL
 */

const appGet = database => {
	app.get(`/${database}`, async (req, res) => {
		const db = await connection
		const [rows] = await db.query(`SELECT * FROM ${database}`)
		res.send(rows)
	})
}

appGet('movies')
appGet('directors')
appGet('director_movie')

/**
 * GET /URL/:id
 */

const appGetId = database => {
	app.get(`/${database}/:id`, async (req, res) => {
		const { id } = req.params
		const db = await connection
		const [rows] = await db.query(`SELECT * FROM ${database} WHERE id="${id}"`)

		if (!rows.length) {
			res.status(404).send({
				message: `Sorry, there is no record of id '${id}'.`
			})
			return
		}

		res.send(rows[0])
	})
}

appGetId('movies')
appGetId('directors')
appGetId('director_movie')

// Catch requests where a route does not exist
app.use((req, res) => {
	res.status(404).send({
		message: `Sorry, no route exists for ${req.method} ${req.path}`,
	})
})

// Start listening for incoming requests on port 3000
app.listen(PORT, () => {
	console.log(`YEY! Server started on localhost:${PORT}`)
})
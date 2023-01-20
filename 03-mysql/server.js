/**
 * Express Server
 */

// Require stuff
require('dotenv').config()
const express = require('express')
const { isString } = require('lodash')
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
 * GET /movies
 */

app.get('/movies', async (req, res) => {
	const db = await connection
	const [rows] = await db.query('SELECT * FROM movies')
	res.send(rows)
})

app.get('/movies/:movieId', async (req, res) => {
	const { movieId } = req.params
	const db = await connection
	const [rows] = await db.query('SELECT * FROM movies WHERE id=?', [movieId])

	if (!rows.length) {
		res.status(404).send({
			message: `Sorry, there is no record of id ${movieId}.`
		})
		return
	}

	res.send(rows[0])
})

/**
 * POST /movies
 */

app.post('/movies', async (req, res) => {
	console.log(req.body)

	const { title, genre, runtime, release_date } = req.body

	if (typeof title !== 'string' || typeof genre !== 'string') {
		res.status(400).send({
			message: "400 Bad Request. 'Title' or 'genre' is missing or of the wrong type."
		})
		return
	}

	if (runtime && typeof runtime !== 'number') {
		res.status(400).send({
			message: 'Runtime has to be a number.'
		})
		return
	}

	const releaseDate = new Date(release_date)

	if (release_date && (!releaseDate instanceof Date || isNaN(releaseDate))) {
		res.status(400).send({
			message: 'Release date has to be a valid date.'
		})
		return
	}

	const db = await connection
	const [result] = await db.query('INSERT INTO movies SET ?', {
		title,
		genre,
		runtime,
		release_date,
	})

	res.status(201).send({
		...req.body,
		id: result.insertId,
	})
})

/**
 * PATCH /movies/:movieId
 */

app.patch('/movies/:movieId', async (req, res) => {
	const db = await connection

	// It always runs 'try' because the SQL command is valid, even though nothing happens in the table.
	try {
		db.query('UPDATE movies SET ? WHERE id = ?', [req.body, req.params.movieId])
	}
	catch (err) {
		res.status(500).send({ message: 'I do not compute.' })
	}

	res.send(req.body)
})

/**
 * DELETE /movies/:movieId
 */

app.delete('/movies/:movieId', async (req, res) => {
	const { movieId } = req.params
	const db = await connection

	// It always runs 'try' because the SQL command is valid, even though nothing happens in the table.
	try {
		db.query('DELETE FROM movies WHERE id = ?', [movieId])
	}
	catch (err) {
		res.status(500).send({ message: 'There is nothing to delete here...' })
	}

	res.send({
		message: 'You deleted a movie.',
		id: movieId
	})
})

/**
 * GET /directors
 */

app.get('/directors', async (req, res) => {
	const db = await connection
	const [rows] = await db.query('SELECT * FROM directors')
	res.send(rows)
})

app.get('/directors/:directorId', async (req, res) => {
	const { directorId } = req.params
	const db = await connection
	const [rows] = db.query('SELECT * FROM directors WHERE id=?', [directorId])

	if (!rows.length) {
		res.status(404).send({
			message: `Sorry, there is no record of id ${directorId}.`
		})
		return
	}

	res.send(rows[0])
})

/**
 * GET /director_movie
 */

app.get('/director_movie', async (req, res) => {
	const db = await connection
	const [rows] = db.query('SELECT * FROM director_movie')
	res.send(rows)
})

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

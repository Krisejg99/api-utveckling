import express from 'express'
import { Movie } from './resources/movie/movie.model'

// instantiate a new router
const router = express.Router()

/**
 * GET /
 */
router.get('/', async (req, res) => {
	const movies = await Movie.find()

	res.send({
		message: "I AM MOVIE-DB-API, GIVES POPCORN",
		data: movies,
	})
})

export default router

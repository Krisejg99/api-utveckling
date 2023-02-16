import express from 'express'
import movie_router from './resources/movie/movie.router'
import person_router from './resources/person/person.router'

// instantiate a new router
const router = express.Router()

/**
 * GET /
 */
router.get('/', (req, res) => {
	res.send({
		message: "I AM MOVIE-DB-API, GIVES POPCORN",
	})
})

/**
 * /movies
 */
router.use('/movies', movie_router)

/**
 * /people
 */
router.use('/people', person_router)

export default router

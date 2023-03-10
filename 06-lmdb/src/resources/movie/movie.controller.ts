/**
 * Movie Controller
 */
import { Request, Response } from 'express'
import Debug from 'debug'
import { Movie } from './movie.model'
import mongoose from 'mongoose'

const debug = Debug('lmdb:movie_controller')

/**
 * Get all movies
 */
export const index = async (req: Request, res: Response) => {
	try {
		const movies = await Movie.find()

		res.send({
			status: "success",
			data: movies,
		})
	}
	catch (err) {
		debug("Error thrown when finding movies:", err)
		res.status(500).send({ status: "error", message: "Could not get movies in database"})
	}
}

/**
 * Get a single movie
 */
export const show = async (req: Request, res: Response) => {
	const movieId = req.params.movieId

	try {
		const movie = await Movie
			.findById(movieId)
			.populate('director', 'name')
			.populate('actors', 'name')

		if (!movie) {
			return res.sendStatus(404)
		}

		res.send({
			status: "success",
			data: movie,
		})
	}
	catch (err) {
		res.status(500).send({ status: "error", message: "Could not get movie in database"})
	}
}

/**
 * Create a movie
 */
export const store = async (req: Request, res: Response) => {
	try {
		const movie = await new Movie(req.body).save()

		res.status(201).send({
			status: "success",
			data: movie,
		})
	}
	catch (err) {
		debug("Error thrown when finding movies:", err)

		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).send({ status: "error", message: err.message })
		}
		res.status(500).send({ status: "error", message: "Could not create movie in database"})
	}
}

/**
 * Update a movie
 */
export const update = async (req: Request, res: Response) => {
	const movieId = req.params.movieId

   try {
	   await Movie.findByIdAndUpdate(movieId, req.body)

	   const movie = await Movie.findById(movieId)

	   if (!movie) {
		   return res.sendStatus(404)
	   }

	   res.send({
		   status: "success",
		   data: movie,
	   })
   }
   catch (err) {
	   debug("Error thrown when updating movies:", err)

	   if (err instanceof mongoose.Error.ValidationError) {
		   return res.status(400).send({ status: "error", message: err.message })
	   }
	   res.status(500).send({ status: "error", message: "Could not update movie in database"})
   }
}

// /**
//  * Delete a movie
//  */
// export const destroy = async (req: Request, res: Response) => {
// 	const movieId = req.params.movieId

// 	try {
// 		const movie = await Movie.findByIdAndDelete(movieId)

// 		if (!movie) {
// 			return res.sendStatus(404)
// 		}

// 		res.send({
// 			status: "success",
// 			data: movie,
// 		})
// 	}
// 	catch (err) {
// 		res.status(500).send({ status: "error", message: "Could not delete movie in database"})
// 	}
// }

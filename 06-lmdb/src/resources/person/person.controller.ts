/**
 * Person Controller
 */
import { Request, Response } from 'express'
import Debug from 'debug'
import { Person } from './person.model'
import { validationResult } from 'express-validator'
import { matchedData } from 'express-validator/src/matched-data'
import mongoose from 'mongoose'
import { Movie } from '../movie/movie.model'

const debug = Debug('lmdb:person_controller')

/**
 * Get all people
 */
export const index = async (req: Request, res: Response) => {
	try {
		const people = await Person.find()

		res.send({
			status: "success",
			data: people,
		})
	}
	catch (err) {
		debug("Error thrown when finding people:", err)
		res.status(500).send({ status: "error", message: "Could not get people in database"})
	}
}

/**
 * Get a single person
 */
export const show = async (req: Request, res: Response) => {
	const personId = req.params.personId

	try {
		const person = await Person.findById(personId)

		if (!person) {
			return res.sendStatus(404)
		}

		const directing = await Movie.find({ director: personId }, ['title', 'releaseYear'])
		const acting = await Movie.find({ actors: personId }, ['title', 'releaseYear'])


		res.send({
			status: "success",
			data: {
				person,
				directing,
				acting,
			},
		})
	}
	catch (err) {
		res.status(500).send({ status: "error", message: "Could not get person in database"})
	}
}

/**
 * Create a person
 */
export const store = async (req: Request, res: Response) => {
	// const validationErrors = validationResult(req);
    // if (!validationErrors.isEmpty()) {
    // 	return res.status(400).json({
	// 		status: "fail",
	// 		message: validationErrors.array()
	// 	});
    // }

	// const validatedData = matchedData(req)
	// debug(validatedData)

	// const { name } = validatedData

	try {
		const person = await new Person(req.body).save()

		res.send({
			status: "success",
			data: person,
		})
	}
	catch (err) {
		debug("Error thrown when finding people:", err)

		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).send({ status: "error", message: err.message })
		}
		res.status(500).send({ status: "error", message: "Could not create person in database"})
	}
}

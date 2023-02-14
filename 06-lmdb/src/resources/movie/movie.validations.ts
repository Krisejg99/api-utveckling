/**
 * Movie Validations
 */
import { body } from 'express-validator'

export const createMovieRules = [
	body('title')
		.isString().withMessage("has to be a string").bail()
		.isLength({ min: 3 }).withMessage("has to be at least 3 chars long"),

	body('runtime')
		.optional()
		.isInt({ min: 1 }).withMessage("has to be a number of minimum 1")
		.not().isString().withMessage("has to be a number")
		.not().isArray().withMessage("has to be a number"),

	body('releaseYear')
		.optional()
		.isInt({ min: 1888, max: 2023 }).withMessage("has to be a number from 1888")
		.not().isString().withMessage("has to be a number")
		.not().isArray().withMessage("has to be a number"),

]

export const updateMovieRules = [
	body('title')
		.optional()
		.isString().withMessage("has to be a string").bail()
		.isLength({ min: 3 }).withMessage("has to be at least 3 chars long"),

	body('runtime')
		.optional()
		.isInt({ min: 1 }).withMessage("has to be a number of minimum 1")
		.not().isString().withMessage("has to be a number")
		.not().isArray().withMessage("has to be a number"),

	body('releaseYear')
		.optional()
		.isInt({ min: 1888, max: 2023 }).withMessage("has to be a number from 1888")
		.not().isString().withMessage("has to be a number")
		.not().isArray().withMessage("has to be a number"),

]

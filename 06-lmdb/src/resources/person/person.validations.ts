/**
 * Director Validations
 */
import { body } from 'express-validator'

export const createDirectorRules = [
	body('name')
		.isString().withMessage("has to be a string").bail()
		.isLength({ min: 3 }).withMessage("has to be at least 3 chars long"),
]

export const updateDirectorRules = [
	body('name')
		.isString().withMessage("has to be a string").bail()
		.isLength({ min: 3 }).withMessage("has to be at least 3 chars long"),
]

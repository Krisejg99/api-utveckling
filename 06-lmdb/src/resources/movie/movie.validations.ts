// /**
//  * Movie Validations
//  */
// import { body } from 'express-validator'

// export const createMovieRules = [
// 	body('title')
// 		.isString().withMessage("has to be a string").bail()
// 		.isLength({ min: 3 }).withMessage("has to be at least 3 chars long"),

// 	body('runtime')
// 		.isInt().withMessage("has to be a number of minimum 1").bail()
// 		.not().isString().withMessage("has to be a number")
// 		.not().isArray().withMessage("has to be a number"),

// 	body('releaseYear')
// 		.isInt().withMessage("has to be a number from 1888 to the current year").bail()
// 		.not().isString().withMessage("has to be a number")
// 		.not().isArray().withMessage("has to be a number"),

// 	body('watched')
// 		.optional()
// ]

// export const updateMovieRules = [
// 	body('title')
// 		.optional()
// 		.isString().withMessage("has to be a string").bail()
// 		.isLength({ min: 3 }).withMessage("has to be at least 3 chars long"),

// 	body('runtime')
// 		.optional()
// 		.isInt().withMessage("has to be a number of minimum 1").bail()
// 		.not().isString().withMessage("has to be a number")
// 		.not().isArray().withMessage("has to be a number"),

// 	body('releaseYear')
// 		.optional()
// 		.isInt().withMessage("has to be a number from 1888 to the current year").bail()
// 		.not().isString().withMessage("has to be a number")
// 		.not().isArray().withMessage("has to be a number"),

// 	body('watched')
// 		.optional()
// ]

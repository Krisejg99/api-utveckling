import { body, CustomValidator } from 'express-validator'

/**
 * Validation rules
 */

// const isValidEmail: CustomValidator = value => {
// 	return User.findUserByEmail(value).then(user => {
// 		if (user) {
// 			return Promise.reject('E-mail already in use');
// 		}
// 	});
// };

export const createUserRules = [
	body('name').isString().bail().isLength({ min: 2, max: 191 }),
	body('email').isEmail(),
	body('password').isString().bail().isLength({ min: 6, max: 191 })
]

export const updateUserRules = [
	body('name').optional().isString().bail().isLength({ min: 2, max: 191 }),
	body('email').optional().isEmail(),
	body('password').optional().isString().bail().isLength({ min: 6, max: 191 })
]

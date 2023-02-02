import { body } from 'express-validator'
import { getUserByEmail } from '../services/user_service'

/**
 * Validation rules
 */
export const createUserRules = [
	body('name').isString().bail().isLength({ min: 2, max: 191 }),
	body('email').isEmail().custom(async value => {
		const user = await getUserByEmail(value)
		if (user) {
			return Promise.reject('E-mail already in use')
		}
	}),
	body('password').isString().bail().isLength({ min: 6, max: 191 })
]

// export const updateUserRules = [
// 	body('name').optional().isString().bail().isLength({ min: 2, max: 191 }),
// 	body('email').optional().isEmail().custom(async value => {
// 		const user = await getUserByEmail(value)
// 		if (user) {
// 			return Promise.reject('E-mail already in use')
// 		}
// 	}),
// 	body('password').optional().isString().bail().isLength({ min: 6, max: 191 })
// ]

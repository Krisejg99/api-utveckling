import prisma from '../prisma'
import { body, CustomValidator } from 'express-validator'

/**
 * Validation rules
 */

const isValidEmail: CustomValidator = async email => {
	const foundEmail = await prisma.user.findUnique({ where: { email } })

	if (foundEmail) {
		return Promise.reject('E-mail already in use')
	}
}

export const createUserRules = [
	body('name').isString().bail().isLength({ min: 2, max: 191 }),
	body('email').isEmail().custom(isValidEmail),
	body('password').isString().bail().isLength({ min: 6, max: 191 })
]

export const updateUserRules = [
	body('name').optional().isString().bail().isLength({ min: 2, max: 191 }),
	body('email').optional().isEmail().custom(isValidEmail),
	body('password').optional().isString().bail().isLength({ min: 6, max: 191 })
]

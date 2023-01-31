import { prisma } from '@prisma/client'
import express from 'express'
import { body, CustomValidator } from 'express-validator'
import authors from './authors'
import books from './books'
import publishers from './publishers'
import { register } from '../controllers/register_controller'

const router = express.Router()

/**
 * GET /
 */
router.get('/', (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP",
	})
})

/**
 * POST /register
 */
// const isValidEmail: CustomValidator = value => {
// 	return User.findUserByEmail(value).then(user => {
// 		if (user) {
// 			return Promise.reject('E-mail already in use');
// 		}
// 	});
// };

router.post('/register', [
	body('name').isString().bail().isLength({ min: 2, max: 191 }),
	body('email').isEmail()

	,
	body('password').isString().bail().isLength({ min: 6, max: 191 })
], register)

/**
 * GET /profile
 */

router.use('/authors', authors)
router.use('/books', books)
router.use('/publishers', publishers)

export default router

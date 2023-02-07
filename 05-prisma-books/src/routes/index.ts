import express from 'express'
import authors from './authors'
import books from './books'
import profile from './profile'
import publishers from './publishers'
import { register, login } from '../controllers/user_controller'
import { createUserRules } from '../validations/user_rules'
import { basic } from '../middlewares/auth/basic'

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
 * POST /login
 */
router.post('/login', login)

/**
 * POST /register
 */
router.post('/register', createUserRules, register)





/**
 * /authors
 */
router.use('/authors', authors)

/**
 * /books
 */
router.use('/books', books)

/**
 * /profile
 */
router.use('/profile', basic, profile)

/**
 * /publishers
 */
router.use('/publishers', publishers)

export default router

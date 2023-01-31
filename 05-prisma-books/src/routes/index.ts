import { prisma } from '@prisma/client'
import express from 'express'
import authors from './authors'
import books from './books'
import publishers from './publishers'
import { register } from '../controllers/register_controller'
import { createUserRules, updateUserRules } from '../validations/user_rules'

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
router.post('/register', createUserRules, register)

/**
 * GET /profile
 */

router.use('/authors', authors)
router.use('/books', books)
router.use('/publishers', publishers)

export default router

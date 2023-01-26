import express from 'express'
import authors from './authors'
import books from './books'
import publishers from './publishers'
const router = express.Router()

/**
 * GET /
 */
router.get('/', (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP",
	})
})

router.use('/authors', authors)
router.use('/books', books)
router.use('/publishers', publishers)

export default router

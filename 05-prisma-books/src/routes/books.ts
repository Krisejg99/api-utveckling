
/**
 * Handles all '/books' routs
 */

import express from 'express'
import prisma from '../prisma'
import { index, show, store, update, destroy } from '../controllers/book_controller'

const router = express.Router()



// GET /
router.get('/', index)

// GET /:bookId
router.get('/:bookId', show)

// GET /:bookId/authors
router.get('/:bookId/authors', async (req, res) => {
	const { bookId } = req.params

	try {
		const authorsOfBook = await prisma.author.findMany({
			where: {
				books: {
					some: {
						id: Number(bookId),
					},
				},
			},
		})

		res.send(authorsOfBook)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

// POST /
router.post('/', store)



export default router

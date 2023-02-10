import express from 'express'
import { body } from 'express-validator'
import prisma from '../prisma'
import { index, show, store, update, destroy, connectBook, disconnectBook } from '../controllers/author_controller'

const router = express.Router()

// GET /
router.get('/', index)

// GET /:authorId
router.get('/:authorId', show)

// GET /:authorId/books
router.get('/:authorId/books', async (req, res) => {
	const { authorId } = req.params

	try {
		const booksByAuthor = await prisma.author.findUniqueOrThrow({
			where: {
				id: Number(authorId),
			},
			include: {
				books: true,
			},
		})

		res.send(booksByAuthor.books)
	}
	catch (err) {
		res.status(404).send({ message: 'Something went wrong' })
	}
})

// POST /
router.post('/', [
	body('name').isString().bail().isLength({ min: 3, max: 191 }).withMessage('has to be 3-191 chars long')
], store)

// POST /:authorId/books
router.post('/:authorId/books', connectBook)

// DELETE /:authorId/books
router.delete('/:authorId/books/:bookId', disconnectBook)



export default router

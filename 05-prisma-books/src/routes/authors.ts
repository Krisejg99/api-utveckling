/**
 * Handles all '/authors' routs
 */

import express from 'express'
import prisma from '../prisma'

const router = express.Router()


/**
 * GET /
 */

router.get('/', async (req, res) => {
	try {
		const authors = await prisma.author.findMany()
		res.send(authors)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * GET /:authorId
 */

router.get('/:authorId', async (req, res) => {
	const { authorId } = req.params

	try {
		const author = await prisma.author.findUnique({
			where: {
				id: Number(authorId),
			},
			include: {
				books: true,
			},
		})

		res.send(author)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * GET /:authorId/books
 */

router.get('/:authorId/books', async (req, res) => {
	const { authorId } = req.params

	try {
		const booksByAuthor = await prisma.book.findMany({
			where: {
				authors: {
					some: {
						id: Number(authorId),
					},
				},
			},
		})

		res.send(booksByAuthor)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * POST /
 */

router.post('/', async (req, res) => {
	const { name, birthdate } = req.body
	try {
		const author = await prisma.author.create({
			data: {
				name,
				birthdate,
			},
			include: {
				books: true,
			},
		})

		res.send(author)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * POST /:authorId/books
 */

router.post('/:authorId/books', async (req, res) => {
	const { authorId } = req.params
	const { bookId } = req.body

	try {
		const result = await prisma.author.update({
			where: {
				id: Number(authorId),
			},
			data: {
				books: {
					connect: {
						id: bookId,
					},
				},
			},
			include: {
				books: true,
			},
		})

		res.status(201).send(result)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * PATCH /:authorId/books
 */

// Disconnect the book from the author
router.patch('/:authorId/books', async (req, res) => {
	const { authorId } = req.params
	const { bookId } = req.body

	try {
		const result = await prisma.author.update({
			where: {
				id: Number(authorId),
			},
			data: {
				books: {
					disconnect: {
						id: bookId,
					},
				},
			},
			include: {
				books: true,
			},
		})

		res.send(result)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

export default router


/**
 * Handles all '/books' routs
 */

import express from 'express'
import prisma from '../prisma'

const router = express.Router()

/**
 * GET /
 */

router.get('/', async (req, res) => {
	try {
		const books = await prisma.book.findMany()
		res.send(books)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * GET /:bookId
 */

router.get('/:bookId', async (req, res) => {
	const { bookId } = req.params

	try {
		const book = await prisma.book.findUniqueOrThrow({
			where: {
				id: Number(bookId),
			},
			include: {
				authors: true,
			},
		})

		res.send(book)
	}
	catch (err) {
		res.status(404).send({ message: 'Something went wrong' })
	}
})

/**
 * GET /:bookId/authors
 */

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

/**
 * POST /
 */

router.post('/', async (req, res) => {
	const { title, pages, isbn, publisherId } = req.body
	try {
		const book = await prisma.book.create({
			data: {
				title,
				pages,
				isbn,
				publisherId,
			},
		})

		res.status(201).send(book)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

export default router

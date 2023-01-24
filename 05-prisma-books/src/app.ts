import express from "express"
import prisma from "./prisma" // importing the prisma instance we created
import morgan from "morgan"

const app = express()
app.use(express.json())
app.use(morgan('dev'))

/**
 * GET /
 */
app.get('/', (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP",
	})
})

/**
 * GET /authors
 */

app.get('/authors', async (req, res) => {
	try {
		const authors = await prisma.author.findMany({
			include: {
				books: true,
			},
		})
		res.send(authors)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * POST /authors
 */

app.post('/authors', async (req, res) => {
	const { name } = req.body
	try {
		const author = await prisma.author.create({
			data: {
				name,
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
 * POST /authors/:authorId/books
 */

app.post('/authors/:authorId/books', async (req, res) => {
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
 * GET /books
 */

app.get('/books', async (req, res) => {
	try {
		const books = await prisma.book.findMany({
			include: {
				authors: true,
			},
		})
		res.send(books)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * POST /books
 */

app.post('/books', async (req, res) => {
	const { title, pages } = req.body
	try {
		const book = await prisma.book.create({
			data: {
				title,
				pages,
			},
			include: {
				authors: true,
			},
		})

		res.status(201).send(book)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})


/**
 * POST /authors/:authorId/books
 */

app.post('/books/:bookId/authors', async (req, res) => {
	const { bookId } = req.params
	const { authorId } = req.body

	try {
		const result = await prisma.book.update({
			where: {
				id: Number(bookId),
			},
			data: {
				authors: {
					connect: {
						id: authorId,
					},
				},
			},
			include: {
				authors: true,
			},
		})

		res.status(201).send(result)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

export default app

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
			// include: {
			// 	books: true,
			// },
		})

		res.send(authors)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * GET /authors/:id
 */

app.get('/authors/:authorId', async (req, res) => {
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
 * GET /author/:authorId/books
 */

app.get('/authors/:authorId/books', async (req, res) => {
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
 * POST /authors
 */

app.post('/authors', async (req, res) => {
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
 * PATCH /authors/:authorId/books
 */

// Disconnect the book from the author
app.patch('/authors/:authorId/books', async (req, res) => {
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














/**
 * GET /books
 */

app.get('/books', async (req, res) => {
	try {
		const books = await prisma.book.findMany({
			// include: {
			// 	authors: true,
			// },
		})
		res.send(books)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * GET /books/:bookId
 */

app.get('/books/:bookId', async (req, res) => {
	const { bookId } = req.params

	try {
		const book = await prisma.book.findUnique({
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
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * GET /books/:bookId/authors
 */

app.get('/books/:bookId/authors', async (req, res) => {
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
 * POST /books
 */

app.post('/books', async (req, res) => {
	const { title, pages, isbn, publisherId } = req.body
	try {
		const book = await prisma.book.create({
			data: {
				title,
				pages,
				isbn,
				publisherId,
			},
			// include: {
			// 	authors: true,
			// },
		})

		res.status(201).send(book)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * GET /publishers
 */

app.get('/publishers', async (req, res) => {
	try {
		const publishers = await prisma.publisher.findMany()
		res.send(publishers)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * GET /publishers/:publisherId
 */

app.get('/publishers/:publisherId', async (req, res) => {
	const { publisherId } = req.params

	try {
		const publisher = await prisma.publisher.findUniqueOrThrow({
			where: {
				id: Number(publisherId),
			},
			include: {
				books: true,
			},
		})

		res.send(publisher)
	}
	catch (err) {
		res.status(404).send({ message: 'Something went wrong' })
	}
})

/**
 * POST /publishers
 */

app.post('/publishers', async (req, res) => {
	const { name } = req.body
	try {
		const publisher = await prisma.publisher.create({
			data: {
				name,
			},
		})

		res.status(201).send(publisher)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

export default app

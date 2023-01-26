import express from "express"
import prisma from "./prisma" // importing the prisma instance we created
import morgan from "morgan"
import routes from "./routes"

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(routes)

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

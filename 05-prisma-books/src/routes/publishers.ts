
/**
 * Handles all '/publishers' routs
 */

import express from 'express'
import prisma from '../prisma'
import { index, show, store } from '../controllers/publisher_controller'

const router = express.Router()

// GET /
router.get('/', index)

// GET /:publisherId
router.get('/:publisherId', show)

//GET /:publisherId/books
router.get('/:publisherId/books', async (req, res) => {
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

		res.send(publisher.books)
	}
	catch (err) {
		res.status(404).send({ message: 'Something went wrong' })
	}
})

// POST
router.post('/', store)


export default router

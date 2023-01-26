
/**
 * Handles all '/publishers' routs
 */

import express from 'express'
import prisma from '../prisma'

const router = express.Router()


/**
 * GET /
 */

router.get('/', async (req, res) => {
	try {
		const publishers = await prisma.publisher.findMany()
		res.send(publishers)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
})

/**
 * GET /:publisherId
 */

router.get('/:publisherId', async (req, res) => {
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
 * POST /
 */

router.post('/', async (req, res) => {
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


export default router

/**
 * Publisher Controller
 */

import { Request, Response } from 'express'
import prisma from '../prisma'



export const index = async (req: Request, res: Response) => {
	try {
		const publishers = await prisma.publisher.findMany()
		res.send(publishers)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
}



export const show = async (req: Request, res: Response) => {
	const { publisherId } = req.params

	try {
		const publisher = await prisma.publisher.findUniqueOrThrow({
			where: {
				id: Number(publisherId),
			},
		})

		res.send(publisher)
	}
	catch (err) {
		res.status(404).send({ message: 'Something went wrong' })
	}
}



export const store = async (req: Request, res: Response) => {
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
}



export const update = async (req: Request, res: Response) => {
	const { name } = req.body
	const { publisherId } = req.params

	try {
		const result = await prisma.publisher.update({
			where: {
				id: Number(publisherId),
			},
			data: {
				name,
			},
		})

		res.send(result)
	}
	catch (err) {
		res.status(404).send({ message: 'Something went wrong' })
	}
}



export const destroy = async (req: Request, res: Response) => {
	const publisherId = Number(req.params.publisherId)

	// Check that the publisher doesn't have any books likned to them
	try {
		const publisher = await prisma.publisher.findFirstOrThrow({
			where: {
				id: publisherId,
			},
			include: {
				_count: {
					select: {
						books: true,
					},
				},
			},
		})

		if (publisher._count.books) {
			return res.status(400).send({
				message: `There are ${publisher._count.books} books likned to this publisher.`
			})
		}
	}
	catch (err) {
		return res.status(404).send({ message: 'Something went wrong' })
	}

	// Delete the publisher
	try {
		const publisher = await prisma.publisher.delete({
			where: {
				id: publisherId,
			},
		})

		res.send(publisher)
	}
	catch (err) {
		res.status(404).send({ message: 'Something went wrong' })
	}
}

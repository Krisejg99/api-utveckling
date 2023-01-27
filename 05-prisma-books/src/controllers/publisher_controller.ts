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
			include: {
				books: true,
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

}

export const destroy = async (req: Request, res: Response) => {

}

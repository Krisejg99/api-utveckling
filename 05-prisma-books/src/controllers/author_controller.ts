/**
 * Publisher Controller
 */

import Debug from 'debug'
import { Request, Response } from 'express'
import prisma from '../prisma'

const debug = Debug('prisma-books:author_controller')



export const index = async (req: Request, res: Response) => {
	try {
		const authors = await prisma.author.findMany()
		res.send(authors)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
}



export const show = async (req: Request, res: Response) => {
	const { authorId } = req.params

	try {
		const author = await prisma.author.findUniqueOrThrow({
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
		res.status(404).send({ message: 'Something went wrong' })
	}
}



export const store = async (req: Request, res: Response) => {
	const { name } = req.body
	const birthdate = (new Date(req.body.birthdate)).toISOString()

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

		res.status(201).send(author)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
}



export const update = async (req: Request, res: Response) => {

}



export const destroy = async (req: Request, res: Response) => {

}



export const connect = async (req: Request, res: Response) => {
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

		res.send(result)
	}
	catch (err) {
		debug("Error thrown when adding book %o to a author %o: %o", bookId, authorId, err)
		res.status(500).send({ message: 'Something went wrong' })
	}
}



export const disconnect = async (req: Request, res: Response) => {
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
}

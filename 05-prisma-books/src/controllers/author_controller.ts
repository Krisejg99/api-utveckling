/**
 * Publisher Controller
 */

import Debug from 'debug'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../prisma'
import { createAuthor, getAuthor, getAuthors } from '../services/author_service'

const debug = Debug('prisma-books:author_controller')



export const index = async (req: Request, res: Response) => {
	try {
		const authors = await getAuthors()
		res.send(authors)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
}



export const show = async (req: Request, res: Response) => {
	const { authorId } = req.params

	try {
		const author = await getAuthor(Number(authorId))
		res.send(author)
	}
	catch (err) {
		res.status(404).send({ message: 'Something went wrong' })
	}
}



export const store = async (req: Request, res: Response) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array()
		})
	}

	try {
		const author = await createAuthor(req.body)

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
		res.status(404).send({ message: 'Something went wrong' })
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

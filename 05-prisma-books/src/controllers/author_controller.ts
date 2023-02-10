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
		res.send({
			status: "success",
			data: authors,
		})
	}
	catch (err) {
		res.status(500).send({
			status: "error",
			message: 'Something went wrong',
		})
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

	const { name } = req.body

	try {
		const author = await createAuthor({ name })

		res.status(201).send({
			status: "success",
			data: author,
		})
	}
	catch (err) {
		res.status(500).send({
			status: "error",
			message: 'Something went wrong',
		})
	}
}



export const update = async (req: Request, res: Response) => {

}



export const destroy = async (req: Request, res: Response) => {

}



export const connectBook = async (req: Request, res: Response) => {

	// Expected input: { "bookIds": [ 8, 9 ] }
	const bookIds = req.body.bookIds.map((bookId: Number) => {
		return {
			id: bookId,
		}
	}) // Output:[{ id: 8 }, { id: 9 } ]

	debug(bookIds)

	try {
		const result = await prisma.author.update({
			where: {
				id: Number(req.params.authorId),
			},
			data: {
				books: {
					connect: bookIds,
				},
			},
			include: {
				books: true,
			},
		})

		res.status(201).send({
			status: "success",
			data: result,
		})
	}
	catch (err) {
		debug("Error thrown when adding book %o to a author %o: %o", bookIds, err)
		res.status(500).send({
			status: "error",
			message: 'Something went wrong',
		})
	}
}



export const disconnectBook = async (req: Request, res: Response) => {
	try {
		const result = await prisma.author.update({
			where: {
				id: Number(req.params.authorId),
			},
			data: {
				books: {
					disconnect: {
						id: Number(req.params.bookId),
					},
				},
			},
			include: {
				books: true,
			},
		})

		res.send(res.send({
			status: "success",
			data: result,
		}))
	}
	catch (err) {
		res.status(500).send({
			status: "error",
			message: 'Something went wrong',
		})
	}
}

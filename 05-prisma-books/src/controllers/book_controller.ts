/**
 * Book Controller
 */

import Debug from 'debug'
import { Request, Response } from 'express'
import prisma from '../prisma'

const debug = Debug('prisma-books:book_controller')



export const index = async (req: Request, res: Response) => {
	try {
		const books = await prisma.book.findMany()
		res.send({
			status: 'success',
			data: books,
		})
	}
	catch (err) {
		res.status(500).send({
			status: 'error',
			message: 'Something went wrong'
		})
	}
}



export const show = async (req: Request, res: Response) => {
	const { bookId } = req.params

	try {
		const book = await prisma.book.findUniqueOrThrow({
			where: {
				id: Number(bookId),
			},
			include: {
				publisher: true,
				authors: true,
			},
		})

		res.send({
			status: 'success',
			data: book,
		})
	}
	catch (err) {
		res.status(404).send({
			status: 'error',
			message: 'Something went wrong'
		})
	}
}



export const store = async (req: Request, res: Response) => {
	const { title, pages, isbn, publisherId, cover } = req.body
	try {
		const book = await prisma.book.create({
			data: {
				title,
				pages,
				isbn,
				publisherId,
				cover,
			},
		})

		res.status(201).send({
			status: 'success',
			data: book,
		})
	}
	catch (err) {
		res.status(500).send({
			status: 'error',
			message: 'Something went wrong'
		})
	}
}



export const update = async (req: Request, res: Response) => {

}



export const destroy = async (req: Request, res: Response) => {

}

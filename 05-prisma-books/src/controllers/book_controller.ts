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
		res.send(books)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
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
				authors: true,
				publisher: true,
			},
		})

		res.send(book)
	}
	catch (err) {
		res.status(404).send({ message: 'Something went wrong' })
	}
}



export const store = async (req: Request, res: Response) => {
	const { title, pages, isbn, publisherId } = req.body
	try {
		const book = await prisma.book.create({
			data: {
				title,
				pages,
				isbn,
				publisherId,
			},
		})

		res.status(201).send(book)
	}
	catch (err) {
		res.status(500).send({ message: 'Something went wrong' })
	}
}



export const update = async (req: Request, res: Response) => {

}



export const destroy = async (req: Request, res: Response) => {

}

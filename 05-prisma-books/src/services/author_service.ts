/**
 * Author Service
 */
import prisma from "../prisma"
import { CreateAuthorData } from "../types"

/**
 * Get all authors
 */
export const getAuthors = async () => {
	return await prisma.author.findMany()
}

/**
 * Get a single author
 * @param id The id of the author to get
 */
export const getAuthor = async (authorId: number) => {
	return await prisma.author.findUniqueOrThrow({
		where: {
			id: Number(authorId),
		},
		include: {
			books: true,
		},
	})
}

/**
 * Create an author
 * @param data Author details
 */
export const createAuthor = async (data: CreateAuthorData) => {
	const { name } = data

	return await prisma.author.create({
		data: {
			name,
		},
	})
}

/**
 * User Service
 */
import prisma from '../prisma'
import { CreateUserData } from '../types'
// import { CustomValidator } from 'express-validator'

/**
 * Get a user by finding a unique email
 *
 * @param email The email of the user to get
 * @returns
 */
export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email: email,
		},
	})
}

/**
 * Create a user
 *
 * @param data User details
 */
export const createUser = async (data: CreateUserData) => {
	return await prisma.user.create({ data })
}

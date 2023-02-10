/**
 * User Service
 */
import prisma from '../prisma'
import { CreateUserData, UpdateUserData } from '../types'
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

/**
 *
 * @param id Id of user
 * @param data Data to update on user
 */
export const updateUser = async (id: number, data: UpdateUserData) => {
	return await prisma.user.update({
		where: { id },
		data,
	})
}

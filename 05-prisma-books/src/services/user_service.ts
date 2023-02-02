/**
 * User Service
 */
import prisma from '../prisma'
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

export const createUser = async () => {

}

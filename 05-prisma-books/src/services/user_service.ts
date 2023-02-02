/**
 * User Service
 */
import prisma from '../prisma'
// import { CustomValidator } from 'express-validator'

export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email: email,
		},
	})
}

/**
 * Book Controller
 */

import Debug from 'debug'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import { getUserByEmail, updateUser } from '../services/user_service'

const debug = Debug('prisma-books:profile_controller')

/**
 * Get the authenticated user's profile
 */
export const getProfile = async (req: Request, res: Response) => {
	const profile = await getUserByEmail(req.token!.email)

	res.send({
		status: "success",
		data: {
			id: profile?.id,
			name: profile?.name,
			email: profile?.email,
		},
	})
}

/**
 * Update the authenticated user's profile
 */
export const updateProfile = async (req: Request, res: Response) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		})
	}

	const validatedData = matchedData(req)

	if (validatedData.password) {
		const hashedPassword = await bcrypt.hash(validatedData.password, Number(process.env.SALT_ROUNDS) || 10)
		debug("Hashed password:", hashedPassword)

		validatedData.password = hashedPassword
	}

	try {
		const updatedUserData = await updateUser(req.token!.sub, validatedData)

		res.send({
			status: "success",
			data: updatedUserData,
		})
	}
	catch (err) {
		res.status(500).send({
			status: "error",
			message: "Could not update profile in database",
		})
	}
}



export const destroy = async (req: Request, res: Response) => {

}

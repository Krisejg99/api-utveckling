/**
 * Register Controller
 */
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import { createUser } from '../services/user_service'

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array()
		})
	}

	const validatedData = matchedData(req)
	const hashedPassword = await bcrypt.hash(validatedData.password, process.env.SALT_ROUNDS || 10)

	try {
		const user = await createUser(req.body, hashedPassword)

		res.status(201).send({
			status: "success",
			data: user,
		})
	}
	catch (err) {
		res.status(500).send({
			status: "error",
			message: "Something went wrong",
		})
	}
}

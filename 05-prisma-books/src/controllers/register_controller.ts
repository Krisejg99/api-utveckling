/**
 * Register Controller
 */
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import prisma from '../prisma'

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

	const { name, email } = req.body

	try {
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		})

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

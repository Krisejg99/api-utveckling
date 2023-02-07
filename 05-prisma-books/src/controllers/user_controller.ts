/**
 * User Controller
 */
import Debug from 'debug'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import { createUser, getUserByEmail } from '../services/user_service'
import { JwtPayload } from '../types'

const debug = Debug('prisma-books:user_controller')

/**
 * Login a user
 */
export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body

	const user = await getUserByEmail(email)
	if (!user) {
		debug("Could not find user in database")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	const result = await bcrypt.compare(password, user.password)
	if (!result) {
		debug("Incorrect password")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	const payload: JwtPayload = {
		sub: user.id,
		name: user.name,
		email: user.email,
	}

	if (!process.env.ACCESS_TOKEN_SECRET) {
		debug("No ACCESS_TOKEN_SECRET defined")

		return res.status(500).send({
			status: "error",
			data: "No ACCESS_TOKEN_SECRET defined",
		})
	}

	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '4h',
	})

	res.send({
		status: "success",
		data: {
			access_token,
		},
	})
}

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
	validatedData.password = hashedPassword

	const { name, email, password } = validatedData

	try {
		const user = await createUser({
			name,
			email,
			password,
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

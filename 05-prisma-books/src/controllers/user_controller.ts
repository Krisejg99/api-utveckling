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

	if (!process.env.REFRESH_TOKEN_SECRET) {
		debug("No REFRESH_TOKEN_SECRET defined")

		return res.status(500).send({
			status: "error",
			data: "No REFRESH_TOKEN_SECRET defined",
		})
	}

	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1d',
	})

	res.send({
		status: "success",
		data: {
			access_token,
			refresh_token,
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

export const refresh = (req: Request, res: Response) => {
	// Make sure authorization header exists
	if (!req.headers.authorization) {
		debug("Authorization header missing")

		return res.status(401).send({
			status: "fail",
			message: "Authorization required",
		})
	}

	// Split authorization header on ' '
	const [ authSchema, token ] = req.headers.authorization.split(' ')

	// Make sure athourization schema is "Bearer"
	if (authSchema.toLowerCase() !== "bearer") {
		debug("Authorization schema isn't Bearer")

		return res.status(401).send({
			status: "fail",
			message: "Authorization required",
		})
	}

	// Verify refresh-token and get refresh-token payload
	try {
		const refresh_payload = (jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "") as unknown) as JwtPayload
		// debug('payload:', payload)

		req.token = refresh_payload
	}
	catch (err) {
		debug('Token failed verification', err)

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	// Construct acces-token payload
	const { sub, name, email } = req.token
	const payload: JwtPayload = {
		sub,
		name,
		email,
	}
	// debug(payload)

	// Issue a new access token
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
	// debug(access_token)

	// Resposnd with new access token
	res.send({
		status: "success",
		data: {
			access_token,
		},
	})
}

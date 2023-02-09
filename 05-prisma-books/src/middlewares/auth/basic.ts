/**
 * HTTP Basic Authentication Middleware
 */
import bcrypt from 'bcrypt'
import Debug from 'debug'
import { Request, Response, NextFunction } from 'express'
import { getUserByEmail } from '../../services/user_service'

const debug = Debug('prisma-books:basic')

export const basic = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		debug('Authorization header required')

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	const [ authSchema, base64Payload ] = req.headers.authorization.split(' ')

	if (authSchema.toLowerCase() !== 'basic') {
		debug("Authorization schema isn't Basic")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii')

	const [ email, password ] = decodedPayload.split(':')

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
			data: "Incorrect password",
		})
	}

	req.user = user

	next()
}

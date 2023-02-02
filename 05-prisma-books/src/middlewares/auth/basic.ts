/**
 * HTTP Basic Authentication Middleware
 */
import Debug from 'debug'
import { Request, Response, NextFunction } from 'express'

const debug = Debug('prisma-books:basic')

export const basic = (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		debug('Authorization header required')

		return res.status(401).send({
			status: "fail",
			data: "Authorization required"
		})
	}

	const [ authSchema, base64Payload ] = req.headers.authorization.split(' ')

	if (authSchema.toLowerCase() !== 'basic') {
		debug("Authorization schema isn't basic")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required"
		})
	}

	const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii')

	const [ email, password ] = decodedPayload.split(':')
	debug(email)
	debug(password)

	next()
}

/**
 * JWT Authentication Middleware
 */
import Debug from 'debug'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from '../../types'

const debug = Debug('prisma-books:jwt')

/**
 * Validate JWT Access Token
 *
 * Authorization: Bearer <token>
 */
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		debug('Authorization header required')

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	const [ authSchema, token ] = req.headers.authorization.split(' ')

	if (authSchema.toLowerCase() !== 'bearer') {
		debug("Authorization schema isn't Bearer")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	try {
		const payload = (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "") as unknown) as JwtPayload
		debug('payload:', payload)

		req.user = payload
	}
	catch (err) {
		debug('Token failed verification', err)

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	next()
}

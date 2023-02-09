/**
 * Book Controller
 */

import Debug from 'debug'
import { Request, Response } from 'express'
import prisma from '../prisma'

const debug = Debug('prisma-books:profile_controller')

/**
 * Get the authenticated user's profile
 */
export const getProfile = async (req: Request, res: Response) => {

	res.send({
		status: "success",
		data: req.token,
	})
}

/**
 * Update the authenticated user's profile
 */
export const updateProfile = async (req: Request, res: Response) => {

}



export const destroy = async (req: Request, res: Response) => {

}

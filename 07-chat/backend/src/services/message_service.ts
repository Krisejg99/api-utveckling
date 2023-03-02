/**
 * Message Service
 */
import prisma from '../prisma'
import { ChatMessageData } from '../types/shared/SocketTypes'

export const createMessage = (message: ChatMessageData) => {
	return prisma.message.create({ data: message })
}

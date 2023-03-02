/**
 * Room Service
 */
import prisma from '../prisma'

export const getRooms = () => {
	return prisma.room.findMany()
}

export const getRoom = (roomId: string) => {
	return prisma.room.findUnique({
		where: { id: roomId },
		include: {
			messages: {
				where: { timestamp: { gte:  Date.now() - 60 * 60 * 1000 } },
				take: -100,
			},
		 },
	})
}

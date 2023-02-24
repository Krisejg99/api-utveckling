import { Room } from '@prisma/client'

export {}

// Events emitted by the server to the client
export interface ServerToClientEvents {
	hello: () => void
	chatMessage: (message: ChatMessageData) => void
	userJoined: (notice: NoticeData) => void
}

// Events emitted by the client to the server
export interface ClientToServerEvents {
	sendChatMessage: (message: ChatMessageData) => void
	userJoin: (username: string, roomId: string, callback: (success: boolean) => void) => void
	getRoomList: (callback: (rooms: Room[]) => void) => void
}

// Events between servers
export interface InterServerEvents {
}

// Message payload
export interface ChatMessageData {
	content: string
	username: string
	timestamp: number
}

export interface NoticeData {
	username: string
	timestamp: number
}

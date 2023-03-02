import { Message, Room, User } from '@prisma/client'

export { Room, User }

// Events emitted by the server to the client
export interface ServerToClientEvents {
	hello: () => void
	chatMessage: (message: ChatMessageData) => void
	userJoined: (notice: NoticeData) => void
	onlineUsers: (users: User[]) => void
}

// Events emitted by the client to the server
export interface ClientToServerEvents {
	sendChatMessage: (message: ChatMessageData) => void
	userJoin: (username: string, roomId: string, callback: (result: UserJoinResult) => void) => void
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
	roomId: string
}

// Notice payload
export interface NoticeData {
	username: string
	timestamp: number
}

// Room info payload
export interface RoomInfoData extends Room {
	users: User[]
	messages: Message[]
}

// User Join result
export interface UserJoinResult {
	success: boolean
	data: RoomInfoData | null
}
// 	{
// 		success: true,
// 		data: {
// 			id: '',
// 			name: '',
// 			users: []
// 		}
// }

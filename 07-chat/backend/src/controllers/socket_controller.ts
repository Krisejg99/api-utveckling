/**
 * Socket Controller
 */
import prisma from '../prisma'
import Debug from 'debug'
import { Socket } from 'socket.io'
import { ClientToServerEvents, NoticeData, RoomInfoData, ServerToClientEvents, UserJoinResult } from '../types/shared/SocketTypes'
import { getUsersInRoom } from '../services/user_service'
import { getRoom, getRooms } from '../services/room_service'
import { createMessage } from '../services/message_service'

// Create a new debug instance
const debug = Debug('chat:socket_controller')

// Handle the user connecting
export const handleConnection = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
	debug("Yey, a user connected to our server!!!", socket.id)

	// Say hello to the user
	debug("Hello Mr. User")
	socket.emit('hello')

	// Listen for room list request
	socket.on('getRoomList', async (callback) => {

		const rooms = await getRooms()
		debug("Got a request for rooms, sending list %o", rooms)

		// Send room list
		callback(rooms)
	})

	// Listen for incoming chat messages
	socket.on('sendChatMessage', async (message) => {
		debug("New chat message:", socket.id, message)
		socket.broadcast.to(message.roomId).emit('chatMessage', message)

		debug('Creating message in database:', message)
		await createMessage(message)
	})

	// Listen for a user join request
	socket.on('userJoin', async (username, roomId, callback) => {
		debug("%s wants to join the chat!!", username)

		// Get room from database
		const room = await getRoom(roomId)
		debug("room:", room)
		if (!room) {
			const result: UserJoinResult = {
				success: false,
				data: null,
			}

			return callback(result)
		}

		const notice: NoticeData = {
			username,
			timestamp: Date.now(),
		}

		// Add user to room 'roomId'
		socket.join(roomId)

		// Create a User in the database and set roomId
		await prisma.user.upsert({
			where: {
				id: socket.id,
			},
			update: {
				name: username,
				roomId,
			},
			create: {
				id: socket.id,
				name: username,
				roomId,
			}
		})

		debug('THIS ROOM:', room)

		// Retrieve a list of Users in the room
		const usersInRoom = await getUsersInRoom(roomId)
		debug("Users in this chat room:", usersInRoom)

		// Let everyone know a new user has joined
		socket.broadcast.to(roomId).emit('userJoined', notice)

		// Broadcast an updated userlist to everyone (else) in the room
		socket.broadcast.to(roomId).emit('onlineUsers', usersInRoom)

		// Let user know they are welcome
		const result: UserJoinResult = {
			success: true,
			data: {
				id: room.id,
				name: room.name,
				users: usersInRoom,			// Send the user the list of users in the room
				messages: room.messages,	// Send the user the latest messages in the room
			},
		}

		callback(result)
	})

	// Handle the user disconnecting
	socket.on('disconnect', async() => {
		debug("A user disconnected", socket.id)

		// Find room user was in (if any)
		const user = await prisma.user.findUnique({ where: { id: socket.id } })
		if (!user) return

		// Remove the user
		await prisma.user.delete({ where: { id: socket.id } })

		const users = await getUsersInRoom(user.roomId)

		// Broadcast an updated userlist to everyone (else) in the room
		socket.broadcast.to(user.roomId).emit('onlineUsers', users)
	})
}

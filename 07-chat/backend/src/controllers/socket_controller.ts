/**
 * Socket Controller
 */
import prisma from '../prisma'
import Debug from 'debug'
import { Socket } from 'socket.io'
import { ClientToServerEvents, NoticeData, ServerToClientEvents } from '../types/shared/SocketTypes'

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

		const rooms = await prisma.room.findMany()
		debug("Got a request for rooms, sending list %o", rooms)

		// Send room list
		callback(rooms)
	})

	// Listen for incoming chat messages
	socket.on('sendChatMessage', (message) => {
		debug("New chat message:", socket.id, message)
		socket.broadcast.emit('chatMessage', message)
	})

	// Listen for a user join request
	socket.on('userJoin', (username, roomId, callback) => {
		debug("%s wants to join the chat!!", username)

		const notice: NoticeData = {
			username,
			timestamp: Date.now(),
		}

		// Add user to room 'roomId'
		socket.join(roomId)

		// Let everyone know a new user has joined
		socket.broadcast.to(roomId).emit('userJoined', notice)

		// Let user know they are welcome
		callback(true)
	})

	// Handle the user disconnecting
	socket.on('disconnect', () => {
		debug("A user disconnected", socket.id)
	})
}

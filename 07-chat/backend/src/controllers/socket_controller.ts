/**
 * Socket Controller
 */
import Debug from 'debug'
import { Socket } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from '../types/shared/SocketTypes'

// Create a new debug instance
const debug = Debug('chat:socket_controller')

// Handle the user connecting
export const handleConnection = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
	debug('Yey, a user connected to our server!!!', socket.id)

	// Say hello to the user
	debug('Hello Mr. User')
	socket.emit('hello')

	// Handle the user disconnecting
	socket.on('disconnect', () => {
		debug('A user disconnected', socket.id)
	})
}

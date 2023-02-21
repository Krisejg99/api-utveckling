import './assets/scss/style.scss'
import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from '@backend/types/shared/SocketTypes'

const SOCKED_HOST = import.meta.env.VITE_APP_SOCKET_HOST

const messageEl = document.querySelector('#message') as HTMLInputElement
const messageFormEl = document.querySelector('#message-form') as HTMLFormElement
const messagesEl = document.querySelector('#messages') as HTMLDivElement


// Connect to Socket.IO server
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKED_HOST)


// Listen for when connection is established
socket.on('connect', () => {
	console.log('CONNECTED TO SERVER!!!')
})

// Listen for when the server disocnnects
socket.on('disconnect', () => {
	console.log('DISCONNECTED FROM SERVER... :(')
})

socket.on('hello', () => {
	console.log('Server saying hello')
})

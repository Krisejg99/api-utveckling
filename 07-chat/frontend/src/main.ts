import './assets/scss/style.scss'
import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents, ChatMessageData } from '@backend/types/shared/SocketTypes'

const SOCKED_HOST = import.meta.env.VITE_APP_SOCKET_HOST

const messageEl = document.querySelector('#message') as HTMLInputElement
const messageFormEl = document.querySelector('#message-form') as HTMLFormElement
const messagesEl = document.querySelector('#messages') as HTMLUListElement


// Connect to Socket.IO server
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKED_HOST)

// Add a essage to the chat
const addMessageToChat = (message: ChatMessageData, ownMessage = false) => {
	const messageEl = document.createElement('li')
	messageEl.classList.add('message')
	messageEl.textContent = message.content
	messagesEl.appendChild(messageEl)
	messageEl.scrollIntoView({ behavior: 'smooth' })
	if (ownMessage) messageEl.classList.add('own-message')
}

// Listen for when connection is established
socket.on('connect', () => {
	console.log('CONNECTED TO SERVER!!!')
})

// Listen for when the server disocnnects
socket.on('disconnect', () => {
	console.log('DISCONNECTED FROM SERVER... :(')
})

// Listen for when the server says hello
socket.on('hello', () => {
	console.log('Server saying hello')
})

// Listen for a new chat message
socket.on('chatMessage', (message) => {
	console.log('Yay, someone wrote to me :D', message)

	addMessageToChat(message)
})

// Send a message to the server when form is submitted
messageFormEl.addEventListener('submit', e => {
	e.preventDefault()

	if (!messageEl.value.trim()) return

	// Construct message payload
	const message: ChatMessageData = {
		content:messageEl.value
	}

	// Send (emit) message to server
	socket.emit('sendChatMessage', message)

	addMessageToChat(message, true)

	messageEl.value = ''
	messageEl.focus()
})

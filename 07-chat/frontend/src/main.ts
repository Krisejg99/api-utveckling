import './assets/scss/style.scss'
import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents, ChatMessageData } from '@backend/types/shared/SocketTypes'

const SOCKED_HOST = import.meta.env.VITE_APP_SOCKET_HOST

// Forms
const messageEl = document.querySelector('#message') as HTMLInputElement
const messageFormEl = document.querySelector('#message-form') as HTMLFormElement
const usernameFormEl = document.querySelector('#username-form') as HTMLFormElement

// Lists
const messagesEl = document.querySelector('#messages') as HTMLUListElement

// Views
const chatWrapperEl = document.querySelector('#chat-wrapper') as HTMLDivElement
const startEl = document.querySelector('#start') as HTMLDivElement

// User details
let roomId: string | null = null
let username: string | null = null

// Connect to Socket.IO server
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKED_HOST)

// Add a message to the chat
const addMessageToChat = (message: ChatMessageData, ownMessage = false) => {
	const messageEl = document.createElement('li')
	messageEl.classList.add('message')
	if (ownMessage) {
		messageEl.classList.add('own-message')
	}

	const time = new Date(message.timestamp).toLocaleTimeString()

	messageEl.innerHTML = ownMessage
		? `
			<span class="content">${message.content}</span>
			<span class="time">${time}</span>
		`
		: `
			<span class="user">${message.username}</span>
			<span class="content">${message.content}</span>
			<span class="time">${time}</span>
		`

	messagesEl.appendChild(messageEl)
	messageEl.scrollIntoView({ behavior: 'smooth' })
}

const addNoticeToChat = (content: string, timestamp: number) => {
	const time = new Date(timestamp).toLocaleTimeString()
	const noticeEl = document.createElement('li')
	noticeEl.classList.add('notice')
	noticeEl.innerHTML = `
		<span class="content">${content}</span>
		<span class="time">${time}</span>
	`
	messagesEl.appendChild(noticeEl)
	noticeEl.scrollIntoView({ behavior: 'smooth' })
}

const showChatView = () => {
	startEl.classList.add('hide')
	chatWrapperEl.classList.remove('hide')
}

// Show welcome view
const showWelcomeView = () => {
	const connectBtnEl = document.querySelector('#connectBtn') as HTMLButtonElement
	const roomEl = document.querySelector('#room') as HTMLSelectElement

	// Clear room list and disable connect-button
	connectBtnEl.disabled = true
	roomEl.innerHTML = `<option selected>Loading...</option>`

	// Request a list of rooms from the server
	console.log("Requesting rooms")
	socket.emit('getRoomList', (rooms) => {
		console.log("So many rooms :O", rooms)

		// Update #room with options for each room
		roomEl.innerHTML = rooms
			.map(room => `<option value="${room.id}">${room.name}</option>`)
			.join('')

		// Enable 'Connect'-button once we have a room list
		connectBtnEl.disabled = false
	})


	chatWrapperEl.classList.add('hide')
	startEl.classList.remove('hide')
}

// Listen for when connection is established
socket.on('connect', () => {
	console.log("CONNECTED TO SERVER!")
	// Show welcome view
	showWelcomeView()

})

// Listen for when the server disocnnects
socket.on('disconnect', () => {
	console.log("Disconnected from server... :(")
})

// Listen for when we're reconnected
socket.io.on('reconnect', () => {
	console.log("Reconnected to server")

	// Broadcast userJoin event, but only if we were in the chat previously
	if (username && roomId) {
		socket.emit('userJoin', username, roomId, (success) => {
			addNoticeToChat(`${username} reconnected`, Date.now())
		})
	}
})

// Listen for when the server says hello
socket.on('hello', () => {
	console.log("Server saying hello")
})

// Listen for a new chat message
socket.on('chatMessage', (message) => {
	console.log("Yay, someone wrote to me :D", message)

	addMessageToChat(message)
})

// Listen for when a user joins the chat
socket.on('userJoined', (notice) => {
	console.log(notice, "has joined WOW!")

	// addNoticeToChat(notice)
	addNoticeToChat(`${notice.username} joined`, notice.timestamp)
})

// Send a message to the server when form is submitted
messageFormEl.addEventListener('submit', e => {
	e.preventDefault()

	if (!messageEl.value.trim() || !username) return

	// Construct message payload
	const message: ChatMessageData = {
		content:messageEl.value,
		username,
		timestamp: Date.now(),
	}

	// Send (emit) message to server
	socket.emit('sendChatMessage', message)

	addMessageToChat(message, true)

	messageEl.value = ''
	messageEl.focus()
})

// Get username from form and the show chat
usernameFormEl.addEventListener('submit', e => {
	e.preventDefault()

	// Get a roomId
	roomId = (usernameFormEl.querySelector('#room') as HTMLSelectElement).value
	// Get username
	username = (usernameFormEl.querySelector('#username') as HTMLInputElement).value.trim()

	// If not username or roomId, then no chat
	if (!username && !roomId) {
		return
	}

	// Emit `userJoin`-event to the server and wait for acknowledgement before showing the chat view
	socket.emit('userJoin', username, roomId, (success) => {
		console.log("Join was success!", success)

		if (!success) {
			alert("You are not welcome here!")
			return
		}

		// Show chat view
		showChatView()
		console.log("Showing chat view")
	})

	console.log("Emitted 'userJoin' to server.", username, "has joined.")
})

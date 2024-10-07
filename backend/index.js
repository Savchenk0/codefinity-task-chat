const express = require("express")
const cors = require("cors")
const { createServer } = require("node:http")
const { Server } = require("socket.io")

const app = express()
const server = createServer(app)
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
	},
})

const users = {
	reversebotID: {
		username: "Reverse Bot",
		isOnline: true,
		avatar: "./bot-avatars/reverso-bot.jpg",
		id: "reversebotID",
	},
	echobotID: {
		username: "Echo bot",
		isOnline: true,
		avatar: "./bot-avatars/echo-bot.jpg",
		id: "echobotID",
	},
	spambotID: {
		username: "Spam bot",
		isOnline: true,
		avatar: "./bot-avatars/spam-bot.jpg",
		id: "spambotID",
	},
	ignorebotID: {
		username: "Ignore bot",
		isOnline: true,
		avatar: "./bot-avatars/ignore-bot.jpg",
		id: "ignorebotID",
	},
}

const botsIds = ["reversebotID", "echobotID", "spambotID", "ignorebotID"]
const messages = {}

const startSpamBot = socket => {
	const sendSpamMessage = socket => {
		const message = "I'm spamming!"
		const timestamp = new Date()
		if (messages[socket.user.id]) {
			messages[socket.user.id].spambotID = [
				...(messages[socket.user.id].spambotID || []),
				{
					text: message,
					timestamp,
					sender: "other",
					userId: "spambotID",
					username: "Spam bot",
				},
			]
			socket.emit("getMessages", messages[socket.user.id])
		} else {
			messages[socket.user.id] = {
				spambotID: [
					{
						text: message,
						timestamp,
						sender: "other",
						userId: "spambotID",
						username: "Spam bot",
					},
				],
			}
			socket.emit("getMessages", messages[socket.user.id])
		}
		const randomTimeout =
			Math.floor(Math.random() * (120000 - 20000 + 1)) + 20000
		setTimeout(() => sendSpamMessage(socket), randomTimeout)
	}

	const initialTimeout =
		Math.floor(Math.random() * (120000 - 20000 + 1)) + 20000
	setTimeout(() => sendSpamMessage(socket), initialTimeout)
}

io.on("connection", socket => {
	socket.on("userJoin", user => {
		socket.user = user
		if (users[user.id]) {
			users[user.id].isOnline = true
			if (!users[user.id].spamBotActive) {
				users[user.id].spamBotActive = true
				startSpamBot(socket)
			}
		} else {
			users[user.id] = { ...user, isOnline: true, spamBotActive: true }
			startSpamBot(socket)
		}

		if (messages[user.id]) {
			socket.emit("getMessages", messages[user.id])
		}
		socket.join(user.id)
		io.emit("updateUserList", users)
	})

	socket.on(
		"privateMessage",
		({ recipientId, message, timestamp, username }) => {
			if (messages[socket.user.id]) {
				messages[socket.user.id][recipientId] = [
					...(messages[socket.user.id][recipientId] || []),
					{
						text: message,
						timestamp,
						sender: "user",
						userId: socket.user.id,
						username,
					},
				]
			} else {
				messages[socket.user.id] = {
					[recipientId]: [
						{
							text: message,
							timestamp,
							sender: "user",
							userId: socket.user.id,
							username,
						},
					],
				}
			}
			if (!botsIds.find(el => el === recipientId)) {
				if (messages[recipientId]) {
					messages[recipientId][socket.user.id] = [
						...(messages[recipientId][socket.user.id] || []),
						{
							text: message,
							timestamp,
							sender: "other",
							userId: socket.user.id,
							username,
						},
					]
				} else {
					messages[recipientId] = {
						[socket.user.id]: [
							{
								text: message,
								timestamp,
								sender: "other",
								userId: socket.user.id,
								username,
							},
						],
					}
				}
				socket.to(recipientId).emit("getMessages", messages[recipientId])
				socket.emit("getMessages", messages[socket.user.id])
			} else {
				if (recipientId === "reversebotID") {
					socket.emit("getMessages", messages[socket.user.id])
					const reverseMessage = message.split("").reverse().join("")
					setTimeout(() => {
						messages[socket.user.id][recipientId] = [
							...(messages[socket.user.id][recipientId] || []),
							{
								text: reverseMessage,
								timestamp: new Date(),
								sender: "other",
								userId: "reversebotID",
								username: "Reverse bot",
							},
						]
						socket.emit("getMessages", messages[socket.user.id])
					}, 3000)
				}
				if (recipientId === "ignorebotID" || recipientId === "spambotID") {
					socket.emit("getMessages", messages[socket.user.id])
				}
				if (recipientId === "echobotID") {
					messages[socket.user.id][recipientId] = [
						...(messages[socket.user.id][recipientId] || []),
						{
							text: message,
							timestamp: new Date(),
							sender: "other",
							userId: "echobotID",
							username: "Echo bot",
						},
					]
					socket.emit("getMessages", messages[socket.user.id])
				}
			}
		}
	)

	socket.on("disconnect", () => {
		if (socket.user && users[socket.user.id]) {
			users[socket.user.id].isOnline = false
			io.emit("updateUserList", users)
		}
	})
})

server.listen(3001, () => {
	console.log("Server running at http://localhost:3001")
})

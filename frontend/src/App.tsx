import { useEffect, useMemo, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import "./App.css"
import { generateRandomAvatar, generateRandomUsername } from "./helpers/helpers"
import Message, { MessageI } from "./components/Message/Message"
import ChatList from "./components/ChatList/ChatList"
import UserInfoBar from "./components/UserInfoBar/UserInfoBar"

export interface UserI {
	username: string
	avatar: string
	isOnline: boolean
	id: string
}

export interface UsersI {
	[key: string]: UserI
}

export interface MessagesI {
	[key: string]: MessageI[]
}

function App() {
	const existingUserRef = useRef<UserI | null>(null)
	const [socket, setSocket] = useState<Socket | null>(null)
	const [inputValue, setInputValue] = useState<string>("")
	const [messages, setMessages] = useState<MessagesI | null>(null)
	const [users, setUsers] = useState<UsersI>({})
	const [chatterId, setChatterId] = useState<string>("")
	const [isShowOnline, setIsShowOnline] = useState(true)
	const [visibleUsers, setIsVisibleUsers] = useState<UserI[]>([])
	const currentMessages = useMemo(
		() => messages?.[chatterId] || [],
		[messages, chatterId]
	)
	const messagesEndRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const storageUser = localStorage.getItem("chat-user")
		if (storageUser) {
			existingUserRef.current = JSON.parse(storageUser) as UserI
		}

		const newSocket: Socket = io("http://localhost:3001")
		setSocket(newSocket)

		if (!existingUserRef.current) {
			existingUserRef.current = {
				id: Math.random().toString(36).substring(2, 15),
				username: generateRandomUsername(),
				avatar: generateRandomAvatar(),
				isOnline: true,
			}
			localStorage.setItem("chat-user", JSON.stringify(existingUserRef.current))
		}

		if (existingUserRef.current)
			newSocket.emit("userJoin", existingUserRef.current)

		newSocket.on("updateUserList", (users: UsersI) => {
			setUsers(users)
		})
		newSocket.on("getMessages", (messages: MessagesI) => setMessages(messages))
		return () => {
			newSocket.disconnect()
		}
	}, [])

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setInputValue(e.target.value)

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			sendMessage()
		}
	}

	const handleChatClick = (id: string) => {
		setChatterId(id)
	}

	const handleTabClick = (flag: boolean) => {
		setIsShowOnline(flag)
	}

	useEffect(() => {
		let visibleUsers: UserI[] = []
		if (Object.entries(users).length) {
			visibleUsers = Object.entries(users).reduce((acc, [key, value]) => {
				acc.push({ ...value, id: key })
				return acc
			}, [] as UserI[])
			visibleUsers = visibleUsers.filter(
				user => user.id !== existingUserRef.current?.id
			)
			if (isShowOnline)
				visibleUsers = visibleUsers.filter(({ isOnline }) => isOnline)
			if (!isShowOnline)
				visibleUsers = visibleUsers.filter(({ isOnline }) => !isOnline)

			setIsVisibleUsers(visibleUsers)
		}
	}, [users, isShowOnline])

	const sendMessage = () => {
		if (inputValue.trim() && socket && existingUserRef.current && chatterId) {
			const newMessage: MessageI = {
				text: inputValue,
				sender: "user",
				username: existingUserRef.current.username,
				timestamp: new Date(),
			}

			socket.emit("privateMessage", {
				message: newMessage.text,
				timestamp: newMessage.timestamp,
				recipientId: chatterId,
				username: existingUserRef.current.username,
			})

			setInputValue("")
		}
	}

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
		}
	}, [currentMessages])

	return (
		<>
			<div className="header">
				<div className="header-container">
					<h2 className="header-container--heading">Chat bots 2.0</h2>
				</div>
			</div>
			<div className="app-container">
				<div className="app-wrapper">
					<div className="chat-container">
						<UserInfoBar {...users[chatterId]} />
						<div className="messages-wrapper">
							<div className="messages-container">
								{currentMessages.map((msg, index) => (
									<Message {...msg} key={index} />
								))}
								<div ref={messagesEndRef} />
							</div>
						</div>
						{chatterId ? (
							<div className="input-container">
								<input
									value={inputValue}
									onChange={onInputChange}
									onKeyDown={handleKeyDown}
									className="chat--input"
									placeholder="Start chatting!"
								/>
								<button className="chat--send-button" onClick={sendMessage}>
									Send message
								</button>
							</div>
						) : (
							<div className="input-placeholder">
								Please select a user to start a chat
							</div>
						)}
					</div>
					<ChatList
						users={visibleUsers}
						handleChatClick={handleChatClick}
						handleTabClick={handleTabClick}
						isOnline={isShowOnline}
					/>
				</div>
			</div>
		</>
	)
}

export default App

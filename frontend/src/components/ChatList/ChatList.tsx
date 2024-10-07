import { useState } from "react"
import { UserI } from "../../App"
import ListItem from "./ListItem/ListItem"
import "./styles.css"

interface ChatListI {
	users: UserI[]
	handleChatClick: (id: string) => void
	handleTabClick: (id: boolean) => void
	isOnline: boolean
}

function ChatList({
	users,
	handleChatClick,
	handleTabClick,
	isOnline,
}: ChatListI) {
	const [filterText, setFilterText] = useState("")

	const filteredUsers = users.filter(user =>
		user.username.toLowerCase().includes(filterText.toLowerCase())
	)

	return (
		<div className="chat-list--wrapper">
			<div className="chat-list--tab-container">
				<p
					onClick={() => handleTabClick(true)}
					className={isOnline ? "active" : ""}
				>
					Online
				</p>
				<p
					onClick={() => handleTabClick(false)}
					className={isOnline ? "" : "active"}
				>
					All
				</p>
			</div>
			<div className="chat-list--container">
				{filteredUsers.map(({ avatar, username, id, isOnline }) => (
					<ListItem
						onClick={() => handleChatClick(id)}
						key={id}
						avatar={avatar}
						username={username}
						isOnline={isOnline}
					/>
				))}
			</div>
			<div className="chat-list--filter-input__container">
				<input
					type="text"
					placeholder="Search..."
					value={filterText}
					onChange={e => setFilterText(e.target.value)}
					className="chat-list--filter-input"
				/>
			</div>
		</div>
	)
}

export default ChatList

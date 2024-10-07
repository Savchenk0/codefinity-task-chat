import { getFormattedDate } from "../../helpers/helpers"
import "./styles.css"
export interface MessageI {
	text: string
	sender: "user" | "other"
	username?: string
	timestamp?: Date
}

export default function Message({
	sender,
	username,
	text,
	timestamp,
}: MessageI) {
	const timeString = timestamp ? getFormattedDate(timestamp) : ""
	return (
		<div className={`message ${sender}-message`}>
			<div className="message-header">
				<span className="message-header--username">{username}</span>
				<span className="message-header--timestamp">{timeString}</span>
			</div>
			<div className="message-text">{text}</div>
		</div>
	)
}

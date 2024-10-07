import "./styles.css"

interface ListItemI {
	username: string
	avatar: string
	onClick: () => void
	isOnline: boolean
}

const ListItem = ({ avatar, username, onClick, isOnline }: ListItemI) => {
	return (
		<div className="item--container" onClick={onClick}>
			{isOnline ? (
				<div className="item--avatar-wrapper">
					<img src={avatar} alt="user avatar" className="item--avatar" />
				</div>
			) : (
				<img src={avatar} alt="user avatar" className="item--avatar" />
			)}
			<div className="item--content-wrapper">
				<p className="item--name">{username}</p>
				<p className="item--message">Click to chat</p>
			</div>
		</div>
	)
}

export default ListItem

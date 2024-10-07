import { UserI } from "../../App"
import "./styles.css"

export default function UserInfoBar({ username, avatar }: UserI) {
	return (
		<div className="chat--about-user">
			{avatar && (
				<img
					className="chat--about-user__image"
					src={avatar}
					alt="User avatar"
				/>
			)}
			{username && (
				<div className="chat--about-user__content">
					<p className="chat--about-user__username">{username}</p>
					<p className="chat--about-user__description">
						Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit
						numquam deserunt fugiat quis maiores molestiae natus dignissimos
						laborum! Ad optio voluptas recusandae laborum illo cum a laudantium
						porro veritatis ducimus.
					</p>
				</div>
			)}
		</div>
	)
}

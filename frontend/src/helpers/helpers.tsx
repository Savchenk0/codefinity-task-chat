export const generateRandomUsername = () => {
	const adjectives = ["Cool", "Happy", "Sad", "Brave", "Clever"]
	const nouns = ["Lion", "Tiger", "Bear", "Eagle", "Shark"]
	const randomAdjective =
		adjectives[Math.floor(Math.random() * adjectives.length)]
	const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
	return `${randomAdjective} ${randomNoun}`
}

export const generateRandomAvatar = () => {
	const randomNumber = Math.ceil(Math.random() * 100)

	return `https://avatar.iran.liara.run/public/${randomNumber}`
}
export const getFormattedDate = (timestamp: Date) =>
	new Date(timestamp)
		.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		})
		.replace(" ", "")

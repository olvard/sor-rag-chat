const Bubble = ({ message }) => {
	const {content, role} = message

	let bubbleSwitch = true

	if (role === "user"){
		bubbleSwitch = false 
	}

	return (
		<div className={bubbleSwitch ? "bg-gray-600 rounded-4xl m-4 p-4" : "m-4 "}>{content}</div>
	)
}

export default Bubble
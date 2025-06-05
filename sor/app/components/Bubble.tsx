const Bubble = ({ message }) => {
	const {content, role} = message
	return (
		<div className="m-2 p-2">{content}</div>
	)
}

export default Bubble
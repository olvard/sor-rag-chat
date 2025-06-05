const PromptSuggestionButton = ({ onClick, text }) => {
	return(
		<button className="p-3 m-2 bg-amber-600 rounded-4xl" onClick={onClick}>
			{text}
		</button>
	)
}

export default PromptSuggestionButton
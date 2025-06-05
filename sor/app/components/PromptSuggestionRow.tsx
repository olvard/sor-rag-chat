import PromptSuggestionButton from "./PrompSuggestionButton"

const PromptSuggestionRow = ({ onPromptClick }) => {
	const prompts = [
		"Who is Haymitch?",
		"Who is Betee?",
		"What happends at the end of the book?",
		"Give me some easter eggs from the book"
	]
	return (
		<div className="">
			{prompts.map((prompt, index) => 
			<PromptSuggestionButton 
				key={`suggestion-${index}`} 
				text={prompt} 
				onClick={() => onPromptClick(prompt)}/>
			)}
		</div>
	)
}

export default PromptSuggestionRow
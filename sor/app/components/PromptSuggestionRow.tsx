import PromptSuggestionButton from "./PrompSuggestionButton"

const PromptSuggestionRow = ({ onPromptClick }) => {
	const prompts = [
		"Is Lenore Dove a Covey?",
		"Who is Carmine?",
		"Why does Haymitch call Katniss sweetheart?",
		"Is Lucy Gray Baird dead?"
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
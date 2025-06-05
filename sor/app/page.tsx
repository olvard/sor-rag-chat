'use client'

import { useChat } from '@ai-sdk/react'
import { Message } from 'ai'
import Bubble from './components/Bubble'
import LoadingBubble from './components/LoadingBubble'
import PromptSuggestionRow from './components/PromptSuggestionRow'

const Home = () => {
	const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()

	const noMessages = !messages || messages.length === 0

	const handlePrompt = (promptText) => {
		const msg: Message = {
			id: crypto.randomUUID(),
			content: promptText,
			role: "user"
		}
		append(msg)
	}

	return (
		<main className='flex flex-col items-center w-full h-screen px-4 py-10 bg-gray-900'>
			<h1 className='font-sans text-5xl text-center mb-6'>Sunrise Of The Reaping GPT</h1>

			<section
				className={`${
					noMessages
						? 'flex flex-col items-center justify-center w-full h-full'
						: 'flex flex-col justify-end w-full h-full overflow-y-auto pb-28'
				} transition-all duration-300`}
			>
				{noMessages ? (
					<>
						<p className='text-lg text-gray-600 text-center max-w-xl'>
							Ask SOR GPT anything about the SOR book.
						</p>
						<br />
						<PromptSuggestionRow onPromptClick={handlePrompt} />
					</>
				) : (
					<>
						{messages.map((message, index) => (<Bubble key={`messages-${index}`} message={message}/>))}
						{isLoading && <LoadingBubble />}
					</>
				)}

				<div
					className={`${
						noMessages ? 'mt-10' : 'fixed bottom-0 left-1/2 transform -translate-x-1/2'
					} w-full max-w-2xl flex justify-center px-4`}
				>
					<form onSubmit={handleSubmit} className='flex w-full bg-gray-800  rounded-lg p-2 gap-2'>
						<input
							className='flex-1 px-4 py-2 border rounded-md focus:outline-none text-white'
							onChange={handleInputChange}
							value={input}
							placeholder='Ask anything...'
						/>
						<button
							type='submit'
							className='px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900 transition font-medium'
						>
							Send
						</button>
					</form>
				</div>
			</section>
		</main>
	)
}

export default Home

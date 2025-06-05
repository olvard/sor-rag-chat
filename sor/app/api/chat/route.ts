import { streamText, embed } from 'ai';
import { DataAPIClient } from "@datastax/astra-db-ts"
import { openai } from '@ai-sdk/openai';

const { 
	ASTRA_DB_NAMESPACE,
	ASTRA_DB_COLLECTION, 
	ASTRA_DB_API_ENDPOINT, 
	ASTRA_DB_APPLICATION_TOKEN, 
} = process.env

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})

export async function POST(req: Request){
	const {messages} = await req.json()
	const latestMessage = messages[messages?.length - 1]?.content

	let docContext = ""

	const embedding  = await embed({
		model: openai.embedding('text-embedding-3-small'),
		value: latestMessage,
	});

	console.log(embedding.embedding)

	try {
		const collection = await db.collection(ASTRA_DB_COLLECTION)
		const cursor = collection.find(null, {
			sort: {
				$vector: embedding.embedding
			},
			limit: 10
		})

		const documents = await cursor.toArray()
		const docsMap = documents?.map(doc => doc.text)

		docContext = JSON.stringify(docsMap)


	} catch(err){
		console.log("Error in post", err)
		docContext = ""
	}

	const template = {
		role: "system",
		content: `You are an AI assistant who knows everything about the book Sunrise on the reaping.
		Use the context below to augment what you know about sunrise on the reaping. The context will 
		provide you with the most recent page data from wikipedia, the official hunger games wiki and
		others. If the context doesn't include the information you need to answer based on your 
		existing knowledge and don't mention the source of your information or what the context does
		and doesn't include. Format responses using markdown where applicable and don't return images.
		
		--------
		START CONTEXT
		${docContext}
		END CONTEXT
		--------
		QUESTION: ${latestMessage}
		--------
		
		`
	}

	const response = await streamText({
		model: openai("gpt-4o-mini"),
		messages: [template, ...messages]
	})

	return response.toDataStreamResponse();

} 

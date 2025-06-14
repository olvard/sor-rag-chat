import { DataAPIClient } from '@datastax/astra-db-ts'
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer'
import OpenAI from 'openai'

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import 'dotenv/config'

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

const { 
	ASTRA_DB_NAMESPACE,
	ASTRA_DB_COLLECTION, 
	ASTRA_DB_API_ENDPOINT, 
	ASTRA_DB_APPLICATION_TOKEN, 
	OPEN_API_KEY 
} = process.env

const openai = new OpenAI({apiKey: OPEN_API_KEY})

const sordata = [
	"https://en.wikipedia.org/wiki/Sunrise_on_the_Reaping",
	"https://thehungergames.fandom.com/wiki/Sunrise_on_the_Reaping",
	"https://www.businessinsider.com/sunrise-on-the-reaping-details-you-missed-hunger-games-prequel-2025-3",
	"https://www.estapinto.com/book-blog/sunrise-on-the-reaping-spoilers",
	"https://www.browndailyherald.com/article/2025/04/sunrise-on-the-reaping-unveils-the-gruesome-hidden-history-of-panem",
	"https://www.buzzfeed.com/leylamohammed/hunger-games-sunrise-on-the-reaping-details-easter-eggs",
	"https://www.sparknotes.com/lit/sunrise-on-the-reaping/summary/"
] 

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 512,
	chunkOverlap: 100
})

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
	const res = await db.createCollection(ASTRA_DB_COLLECTION, {
		vector: {
			dimension: 1536,
			metric: similarityMetric
		}
	})
	console.log(res)
}

const loadSampleData = async () => {
	const collection = await db.collection(ASTRA_DB_COLLECTION)
	for await (const url of sordata) {
		const content = await scrapePage(url)
		const chunks = await splitter.splitText(content)
		for await (const chunk of chunks){
			const embedding = await openai.embeddings.create({
				model: "text-embedding-3-small",
				input: chunk
			})

			const vector = embedding.data[0].embedding

			const res = await collection.insertOne({
				$vector: vector,
				text: chunk
			})
			console.log(res)
		}
	}
}

const scrapePage = async (url: string) => {
	const loader = new PuppeteerWebBaseLoader(url, {
		launchOptions: {
			headless: true
		},
		gotoOptions: {
			waitUntil: "domcontentloaded"
		},
		evaluate: async (page, browser) => {
			const result = await page.evaluate(() => document.body.innerHTML)
			await browser.close()
			return result
			
		}
	})
	return ( await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(() => loadSampleData())
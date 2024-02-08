'use server'

import { SearchParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";

const SearchableTypes = ['question', 'user', 'answer', 'tag']
export async function globalSearch(params: SearchParams) {
	try {
		connectToDatabase();

		const { query, type } = params;

		const regexQuery = { $regex: query, $options: "i" };

		let result = [];

		const modelsAndTypes = [
			{ model: Question, searchField: 'title', type: 'question' },
			{ model: User, searchField: 'name', type: 'user' },
			{ model: Answer, searchField: 'content', type: 'answer' },
			{ model: Tag, searchField: 'name', type: 'tag' },]

			const typeLower = type?.toLowerCase()

			if (!typeLower || !SearchableTypes.includes(typeLower) ){
				for (const { model, searchField, type } of modelsAndTypes) {
					const queryResult = await model.find({ [searchField]: regexQuery }).limit(2)
					result.push(...queryResult.map((item) => ({
						title: type === 'answer' ? `Answers containing ${query}` : item[searchField],
						type,
						id: type === 'user' ? item.clerkId : type === 'answer' ? item.question : item._id
					})))
				}

			} else {
				const modelInfo = modelsAndTypes.find((modelInfo) => modelInfo.type === type)

				if (!modelInfo) {
					throw new Error('Invalid type')
				}

				const queryResult = await modelInfo.model.find({ [modelInfo.searchField]: regexQuery }).limit(8)

				result = queryResult.map((item) => ({
					title: type === 'answer' ? `Answers containing ${query}` : item[modelInfo.searchField],
					type,
					id: type === 'user' ? item.clerkId : type === 'answer' ? item.question : item._id
				})
				)
			}

			return JSON.stringify(result)
	} catch (error) {
		console.error(error);
		throw error;
	}
}
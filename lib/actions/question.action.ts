'use server'

import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model"
import User from "@/database/user.model"
import Question from "@/database/question.model"
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams } from "./shared.types"
import { revalidatePath } from "next/cache"

export async function createQuestion(params: CreateQuestionParams) {
	try {
		connectToDatabase()

		const { title, content, tags, author, path } = params

		const question = await Question.create({
			title,
			content,
			author
		})

		const tagDocuments = [];

		for (const tag of tags){
			const existingTag = await Tag.findOneAndUpdate(
				{ name: { $regex: new RegExp(`^${tag}$`, 'i') } },
				{ $setOnInsert: { name: tag }, $push: { question: question._id } },
				{ upsert: true, new: true }
			)
			tagDocuments.push(existingTag._id)
		}

		await Question.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagDocuments} }})

		// create an interaction record
		// implement the reputation system here as well

		revalidatePath(path)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getQuestions(params: GetQuestionsParams) {
	try {
 		connectToDatabase()

		const questions = await Question.find({})
		.populate({ path: 'tags', model: Tag })
		.populate({ path: 'author', model: User })
		.sort({ createdAt: -1})

		return { questions }
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
	try {
	connectToDatabase()

	const { questionId } = params	
	
	const question = await Question.findById(questionId)
	.populate({ path: 'tags', model: Tag, select: '_id name' })
	.populate({ path: 'author', model: User, select: '_id clerkId name picture' })

	return question 
	} catch (error) {
		console.error(error)
		throw error
	}
}

// export async function name(params: any) {
// 	try {
	// connectToDatabase()

		
// 	} catch (error) {
// 		console.error(error)
// 		throw error
// 	}
// }
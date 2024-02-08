'use server'

import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model"
import User from "@/database/user.model"
import Question from "@/database/question.model"
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import Answer from "@/database/answer.model"
import Interaction from "@/database/interaction.model"
import { FilterQuery } from "mongoose"

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
				{ $setOnInsert: { name: tag }, $push: { questions: question._id } },
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

		const { filter, searchQuery, page = 1, pageSize = 20 } = params

		const skip = (page - 1) * pageSize

		const query: FilterQuery<typeof Question> = {}

		if (searchQuery) {
			query.$or = [
				{ title: { $regex: new RegExp(searchQuery, 'i') } },
				{ content: { $regex: new RegExp(searchQuery, 'i') } }
			]
		}

		let filterOptions = {}

		switch (filter) {
			case 'newest':
				filterOptions = { createdAt: -1 }
				break
			case 'frequent':
				filterOptions = { views: -1 }
				break
			case 'unanswered':
				query.answers = { $size: 0 }
				break
			default:
				break
		}

		const questions = await Question.find(query)
		.populate({ path: 'tags', model: Tag })
		.populate({ path: 'author', model: User })
		.skip(skip)
		.limit(pageSize)
		.sort(filterOptions)

		const totalQuestions = await Question.countDocuments(query)

		const isNext = totalQuestions > skip +  questions.length

		return { questions, isNext }
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
export async function upvoteQuestion(params: QuestionVoteParams) {
	try {
		connectToDatabase()

		const { questionId, userId, hasupVoted, hasdownVoted, path } = params

		let updateQuesry = {}

		if (hasupVoted) {
			updateQuesry = { $pull: { upvotes: userId } }
		} else if (hasdownVoted) {
			updateQuesry = { $pull: { downvotes: userId}, $push: { upvotes: userId } }
		} else {
			updateQuesry = { $addToSet: { upvotes: userId } }
		}

		const question = await Question.findByIdAndUpdate(
			questionId,
			updateQuesry,
			{ new: true }
		)

		if (!question) {
			throw new Error('Question not found')
		}

		// TODO: create an interaction record

		revalidatePath(path)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function downvoteQuestion(params: QuestionVoteParams) {
	try {
		connectToDatabase()

		const { questionId, userId, hasupVoted, hasdownVoted, path } = params

		let updateQuesry = {}

		if (hasdownVoted) {
			updateQuesry = { $pull: { downvotes: userId } }
		} else if (hasupVoted) {
			updateQuesry = { $pull: { upvotes: userId}, $push: { downvotes: userId } }
		} else {
			updateQuesry = { $addToSet: { downvotes: userId } }
		}

		const question = await Question.findByIdAndUpdate(
			questionId,
			updateQuesry,
			{ new: true }
		)

		if (!question) {
			throw new Error('Question not found')
		}

		// TODO: create an interaction record

		revalidatePath(path)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function deleteQuestion(params: DeleteQuestionParams) {
	try {
		connectToDatabase()

		const { questionId, path } = params	
		
		await Question.deleteOne({ _id: questionId })
		await Answer.deleteMany({ question: questionId })
		await Interaction.deleteMany({ question: questionId })
		await Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId } })

		revalidatePath(path)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function editQuestion(params: EditQuestionParams) {
	try {
		connectToDatabase()

		const { questionId, title, content, path } = params

		const question = await Question.findById(questionId).populate('tags')

		if (!question) {
			throw new Error('Question not found')
		}

		question.title = title
		question.content = content

		await question.save()

		revalidatePath(path)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getHotQuestions() {
	try {
		connectToDatabase()

		const hotQuestions = await Question.find({})
		.sort({ upvotes: -1 , views : -1 })
		.limit(5)

		return hotQuestions
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
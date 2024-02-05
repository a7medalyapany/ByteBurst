'use server'

import Answer from "@/database/answer.model"
import { connectToDatabase } from "../mongoose"
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.types"
import Question from "@/database/question.model"
import { revalidatePath } from "next/cache"

export async function CreateAnswer(params: CreateAnswerParams) {
	try {
		connectToDatabase()
	
		const { author, question, content, path } = params

		const newAnswer = await Answer.create({
			content,
			author,
			question
		})

		await Question.findByIdAndUpdate(question, { $push: { answers: newAnswer._id } })

		// TODO: create an interaction record

		revalidatePath(path)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getAnswers(params: GetAnswersParams) {
	try {
		connectToDatabase()

		const { questionId } = params

		const answers = await Answer.find({ question: questionId })
		.populate('author', '_id clerkId name picture')
		.sort({ createdAt: -1 })

		return { answers }
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function upvoteAnswer(params: AnswerVoteParams) {
	try {
		connectToDatabase()

		const { answerId, userId, hasupVoted, hasdownVoted, path } = params

		let updateQuesry = {}

		if (hasupVoted) {
			updateQuesry = { $pull: { upvotes: userId } }
		} else if (hasdownVoted) {
			updateQuesry = { $pull: { downvotes: userId}, $push: { upvotes: userId } }
		} else {
			updateQuesry = { $addToSet: { upvotes: userId } }
		}

		const answer = await Answer.findByIdAndUpdate(
			answerId,
			updateQuesry,
			{ new: true }
		)

		if (!answer) {
			throw new Error('Answer not found')
		}

		// TODO: create an interaction record

		revalidatePath(path)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function downvoteAnswer(params: AnswerVoteParams) {
	try {
		connectToDatabase()

		const { answerId, userId, hasupVoted, hasdownVoted, path } = params

		let updateQuesry = {}

		if (hasdownVoted) {
			updateQuesry = { $pull: { downvotes: userId } }
		} else if (hasupVoted) {
			updateQuesry = { $pull: { upvotes: userId}, $push: { downvotes: userId } }
		} else {
			updateQuesry = { $addToSet: { downvotes: userId } }
		}

		const answer = await Answer.findByIdAndUpdate(
			answerId,
			updateQuesry,
			{ new: true }
		)

		if (!answer) {
			throw new Error('Answer not found')
		}

		// TODO: create an interaction record

		revalidatePath(path)
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
'use server'

import Answer from "@/database/answer.model"
import { connectToDatabase } from "../mongoose"
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types"
import Question from "@/database/question.model"
import { revalidatePath } from "next/cache"
import Interaction from "@/database/interaction.model"
import User from "@/database/user.model"

export async function CreateAnswer(params: CreateAnswerParams) {
	try {
		connectToDatabase()
	
		const { author, question, content, path } = params

		const newAnswer = await Answer.create({
			content,
			author,
			question
		})

		 const questionObject = await Question.findByIdAndUpdate(question, { $push: { answers: newAnswer._id } })

		await Interaction.create({
			user: author,
			question,
			answer: newAnswer._id,
			action: 'answer',
			tags: questionObject.tags
		})

		await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } })

		revalidatePath(path)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getAnswers(params: GetAnswersParams) {
	try {
		connectToDatabase()

		const { questionId, sortBy, page = 1, pageSize = 10 } = params

		const skip = (page - 1) * pageSize

		let filterOptions = {}

		switch (sortBy) {
			case 'highestUpvotes':
				filterOptions = { upvotes: -1 }
				break;
			case 'lowestUpvotes':
				filterOptions = { upvotes: 1 }
				break;
			case 'old':
				filterOptions = { createdAt: 1 }
				break;
			case 'recent':
				filterOptions = { createdAt: -1 }
				break;
			default:
				break
		}

		const answers = await Answer.find({ question: questionId })
		.populate('author', '_id clerkId name picture')
		.sort(filterOptions)
		.skip(skip)
		.limit(pageSize)

		const totalAnswers = await Answer.countDocuments({ question: questionId })
		
		const isNext = totalAnswers > skip + answers.length

		return { answers, isNext }
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

		await User.findByIdAndUpdate(userId,
			{ $inc: { reputation: hasupVoted ? -3 : 3 } })

		await User.findByIdAndUpdate(answer.author,
			{ $inc: { reputation: hasupVoted ? -10 : 10 } })


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

		await User.findByIdAndUpdate(userId,
			{ $inc: { reputation: hasdownVoted ? -3 : 3 } })

		await User.findByIdAndUpdate(answer.author,
			{ $inc: { reputation: hasdownVoted ? -10 : 10 } })

		revalidatePath(path)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function deleteAnswer(params: DeleteAnswerParams) {
	try {
		connectToDatabase()

		const { answerId, path } = params	

		const answer = await Answer.findById(answerId)

		if (!answer) {
			throw new Error('Answer not found')
		}

		await answer.deleteOne({ _id: answerId })
		await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId } })
		await Interaction.deleteMany({ answer: answerId })

		revalidatePath(path)
	} catch (error) {
		console.error(error)
		throw error
	}
}

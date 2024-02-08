'use server'

import User, { IUser } from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

export async function getUserById(params: GetUserByIdParams) {
	try {
		connectToDatabase()

		const { userId } = params;

		const user = await User.findOne({ clerkId: userId });

		return user;
	}
	catch (error) {
		console.error(error)
		throw error
	}
}

export async function updateUser(params: UpdateUserParams) {
	try {
		connectToDatabase()
		
		const { clerkId, updateData, path } = params;
		await User.findOneAndUpdate({ clerkId }, updateData, { new: true});
		
		revalidatePath(path);
	}
	catch (error) {
		console.error(error)
		throw error
	}
}
		
export async function deleteUser(params: DeleteUserParams) {
	try {
		connectToDatabase()

		const { clerkId } = params;

		const user = await User.findOne({ clerkId})

		if (!user) {
			throw new Error('User not found')
		}

		// const userQuestionIds = await Question.find({ author: user._id }).distinct('_id');

		await Question.deleteMany({ author: user._id });

		// Todo: delete user answers , comments, etc

		const deletedUser = await User.findByIdAndDelete(user._id)

		return deletedUser;
	}
	catch (error) {
		console.error(error)
		throw error
	}
}
export async function createUser(params: CreateUserParams) {
	try {
		connectToDatabase()

		const newUser = await User.create(params);
		return newUser;
	}
	catch (error) {
		console.error(error)
		throw error
	}
}

export async function getAllUsers(params: GetAllUsersParams) {
	try {
		connectToDatabase()

		const { filter, searchQuery, page = 1, pageSize = 10 } = params;
		const skip = (page - 1) * pageSize

		const query: FilterQuery<typeof User> = {}

		if (searchQuery) {
			query.$or = [
				{ name: { $regex: new RegExp(searchQuery, 'i') } },
				{ username: { $regex: new RegExp(searchQuery, 'i') } }
			]
		}

		let filterOptions = {};

		switch (filter) {
			case 'new_users':
				filterOptions = { joinedAt: -1 }
				break;
			case 'old_users':
				filterOptions = { joinedAt: 1 }
				break;
			case 'top_contributors':
				filterOptions = { reputation: -1 }
				break;
			default:
				break;
		}

		const users = await User.find(query)	
		.sort(filterOptions)
		.skip(skip)
		.limit(pageSize)

		const totalUsers = await User.countDocuments(query);

		const isNext = totalUsers > skip + users.length;


		return { users, isNext }
	}
	catch (error) {
		console.error(error)
		throw error
	}
}

export async function saveQuestion(params: ToggleSaveQuestionParams) {
	try {
		connectToDatabase()

		const { userId, questionId, path } = params;

		const user = await User.findById(userId);

		if (!user) {
			throw new Error('User not found');
		}

		const isQuestionSaved = user.saved.includes(questionId); 

		if (isQuestionSaved) {
			await User.findByIdAndUpdate(userId, { $pull: { saved: questionId } }, { new: true });
		} else {
			await User.findByIdAndUpdate(userId, { $addToSet: { saved: questionId } }, { new: true });
		}
		revalidatePath(path);
	}

	catch (error) {
		console.error(error)
		throw error
	}
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
	try {
		connectToDatabase()

		const { clerkId, filter, searchQuery, page = 1, pageSize = 20 } = params;

		const skipAmount = (page - 1) * pageSize

		const query: FilterQuery<typeof Question> = {}

		if (searchQuery) {
			query.$or = [
				{ title: { $regex: new RegExp(searchQuery, 'i') } },
			]
		}

		let filterOptions = {};

		switch (filter) {
			case 'most_recent':
				filterOptions = { createdAt: -1 }
				break;
			case 'oldest':
				filterOptions = { createdAt: 1 }
				break;
			case 'most_viewed':
				filterOptions = { views: -1 }
				break;
			case 'most_voted':
				filterOptions = { upvotes: -1 }
				break;
			case 'most_answered':
				filterOptions = { answers: -1 }
				break;
			default:
				break;
		}

		const user = await User.findOne({ clerkId })
		.populate({ 
			path: 'saved',
			match: query,
			options: {
				sort: filterOptions,
				skip: skipAmount,
				limit: pageSize + 1
			},
			populate: [
				{
				path: 'tags',
				model: Tag,
				select: '_id name'
				},
				{
				path: 'author',
				model: User,
				select: '_id clerkId name picture'
				},
			]
		})

		if (!user){
			throw new Error('User not found')
		}

		const savedQuestions = user.saved;

		const isNext = user.saved.length > pageSize;

		return { questions: savedQuestions, isNext } 
	}
	catch (error) {
		console.error(error)
		throw error
	}
}

export async function getUserInfo(params: GetUserByIdParams) {
	try {
		connectToDatabase()

		const { userId } = params;

		const user = await User.findOne({ clerkId: userId })

		if (!user){
			throw new Error('User not found')
		}

		const totalQuestions = await Question.countDocuments({ author: user._id });
		const totalAnswers = await Answer.countDocuments({ author: user._id });

		return { user, totalQuestions, totalAnswers }

	}
	catch (error) {
		console.error(error)
		throw error
	}
}

export async function getUserQuestions(params: GetUserStatsParams) {
	try {
		connectToDatabase()

		const { userId, page =  1, pageSize = 10 } = params;

		const skip = (page - 1) * pageSize;

		const totalQuestions = await Question.countDocuments({ author: userId });

		const userQuestions = await Question.find({ author: userId })
		.sort({ createdAt: -1,views: -1, upvotes: -1 })
		.skip(skip)
		.limit(pageSize)
		.populate('tags', '_id name')
		.populate('author', '_id clerkId name picture')

		const isNext = totalQuestions > skip + userQuestions.length;

		return { totalQuestions, questions: userQuestions, isNext }
	}
	catch (error) {
		console.error(error)
		throw error
	}
}

export async function getUserAnswers(params: GetUserStatsParams) {
    try {
        connectToDatabase()

        const { userId, page = 1, pageSize = 10 } = params;

		const skip = (page - 1) * pageSize;

        const totalAnswers = await Answer.countDocuments({ author: userId });

        const userAnswers = await Answer.find({ author: userId })
                .sort({ upvotes: -1 })
				.skip(skip)
				.limit(pageSize)
                .populate('question', '_id title')
                .populate('author', '_id clerkId name picture');

		const isNextAnswers = totalAnswers > skip + userAnswers.length;

        return { totalAnswers, answers: userAnswers, isNextAnswers };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getUserDataByQuestionId(questionId: string): Promise<IUser | null> {
	try {
	  const question = await Question
		.findById(questionId)
		.populate('author', 'clerkId name username email bio picture location portfolio reputation saved joinedAt');
	  
	  if (!question) {
		console.log('Question not found!');
		return null;
	  }
  
	  const { author } = question;
	  const user: IUser | null = await User.findById(author._id);
  
	  if (!user) {
		console.log('User not found!');
		return null;
	  }

	  return user ;
	} catch (error) {
		console.error(error)
		throw error
	}
}

// export async function getAllUsers(params: GetAllUsersParams) {
// 	try {
// 		connectToDatabase()

		
// 	}
// 	catch (error) {
// 		console.error(error)
// 		throw error
// 	}
// }
		
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

		// const { page = 1, pageSize = 20, filter, searchQuery } = params

		const users = await User.find({})	
		.sort({ createdAt: -1 })

		return { users }
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

		const { clerkId, searchQuery } = params;

		const query: FilterQuery<typeof Question> = searchQuery
		? { title: { $regex: new RegExp(searchQuery, 'i') } } : 
		{ };

		const user = await User.findOne({ clerkId })
		.populate({ 
			path: 'saved',
			match: query,
			options: {
				sort: { createdAt: -1 },
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

		return { questions: savedQuestions } 
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

		const { userId } = params;

		const totalQuestions = await Question.countDocuments({ author: userId });

		const userQuestions = await Question.find({ author: userId })
		.sort({ views: -1, upvotes: -1 })
		.populate('tags', '_id name')
		.populate('author', '_id clerkId name picture')

		return { totalQuestions, questions: userQuestions }
	}
	catch (error) {
		console.error(error)
		throw error
	}
}

export async function getUserAnswers(params: GetUserStatsParams) {
    try {
        connectToDatabase()

        const { userId } = params;

        const totalAnswers = await Answer.countDocuments({ author: userId });

        const userAnswers = await Answer.find({ author: userId })
                .sort({ upvotes: -1 })
                .populate('question', '_id title')
                .populate('author', '_id clerkId name picture');


		console.log({ userAnswers} );
        return { totalAnswers, answers: userAnswers };
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
		
'use server'

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUserById(params: any) {
	try {
		connectToDatabase()

		const {userid} = params;

		const user = await User.findOne({ clerjId: userid });

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
		
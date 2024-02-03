'use server'

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"

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
		
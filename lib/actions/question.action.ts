'use server'

import { connectToDatabase } from "../mongoose"

export async function createQuestion(params: any) {
	try {
		connectToDatabase()
		
	} catch (error) {
		console.error(error)
		throw error
	}
}

// export async function name(params) {
// 	try {
		
// 	} catch (error) {
// 		console.error(error)
// 		throw error
// 	}
// }
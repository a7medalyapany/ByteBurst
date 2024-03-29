'use server'

import { connectToDatabase } from "../mongoose"
import Question from "@/database/question.model"
import Interaction from "@/database/interaction.model"
import { ViewQuestionParams } from "./shared.types"
import Tag from "@/database/tag.model"

export async function viewQuestion(params: ViewQuestionParams) {

    try {
        await connectToDatabase();

        const { questionId, userId } = params;

        await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

        if (userId) {
            const existingInteraction = await Interaction.findOne({
                user: userId,
                action: 'view',
                question: questionId,
            });

            if (existingInteraction) {
                console.log('User already viewed this question');
            } 
            else {
            const question = await Question.findById(questionId)
	        .populate({ path: 'tags', model: Tag, select: '_id name' })

                if (question) {
                    const tagIds = question.tags.map((tag: { _id: any }) => tag._id);
                    await Interaction.create({
                        user: userId,
                        action: 'view',
                        question: questionId,
                        tags: tagIds,
                    });
                } else {
                    await Interaction.create({
                        ser: userId,
                        action: 'view',
                        question: questionId,
                });
                }
            }
            
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// export async function viewQuestion(params: ViewQuestionParams) {
//     try {
//         connectToDatabase();

//         const { questionId, userId } = params;

//         // Check if the user already viewed this question
//         const existingInteraction = await Interaction.findOne({
//             user: userId,
//             action: 'view',
//             question: questionId,
//         });

//         if (existingInteraction) {
//             console.log('User already viewed this question');
//         } else {
//             // Update the views count only if the user hasn't viewed it before
//             await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

//             // Create a new interaction record
//             await Interaction.create({
//                 user: userId,
//                 action: 'view',
//                 question: questionId,
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// export async function getAllTags(params: any) {
// 	try {
// 		connectToDatabase()

// 	}
// 	catch (error) {
// 		console.error(error)
// 		throw error
// 	}
// }
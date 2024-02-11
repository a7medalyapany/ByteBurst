'use server'

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types"
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export async function getTopUserTags(params: GetTopInteractedTagsParams) {
  try {
    const { userId } = params;

    const userInteractions = await Interaction.find({ user: userId });

    const tagCounts: { [tagId: string]: number } = {};

    userInteractions.forEach((interaction) => {
      interaction.tags.forEach((tagId: string) => {
        if (tagCounts[tagId]) {
          tagCounts[tagId]++;
        } else {
          tagCounts[tagId] = 1;
        }
      });
    });

    const sortedTags = Object.keys(tagCounts).sort(
      (tagIdA, tagIdB) => tagCounts[tagIdB] - tagCounts[tagIdA]
    );

    const topTags = sortedTags.slice(0, 3);

    const topTagDetails = await Tag.find({ _id: { $in: topTags } });

    return topTagDetails.map((tag) => ({
      _id: tag._id,
      name: tag.name,
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
	try {
		connectToDatabase()
		const { filter, searchQuery , page = 1, pageSize = 10} = params;

		const skip = (page - 1) * pageSize

		const query: FilterQuery<typeof Tag> = {}

		if (searchQuery) {
			query.$or =[
				{ name: { $regex: new RegExp(searchQuery, 'i' ) } }
			]
		}

		let filterOptions = {}

		switch (filter) {
			case 'popular':
				filterOptions = { questions: -1 }
				break;
			case 'recent':
				filterOptions = { createdAt: -1 }
				break;
			case 'name':
				filterOptions = { name: 1 }
				break;
			case 'old':
				filterOptions = { createdAt: 1 }
				break;
			default:
				break;
		}


		const tags = await Tag.find(query)
		.sort(filterOptions)
		.skip(skip)
		.limit(pageSize)

		const totalTags = await Tag.countDocuments(query);

		const isNext = totalTags > skip + tags.length;

		return { tags, isNext  }
	}
	catch (error) {
		console.error(error)
		throw error
	}
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
	try {
		connectToDatabase()

		const { tagId, searchQuery, page = 1, pageSize = 20 } = params;

		const skipAmount = (page - 1) * pageSize

		const tagFilter: FilterQuery<ITag> = { _id: tagId }

		const tag = await Tag.findOne(tagFilter)
		.populate({ 
			path: 'questions',
			model: Question,
			match: searchQuery ? { title: { $regex: searchQuery, $options: 'i' } } 
			: {},
			options: {
				sort: { createdAt: -1 },
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

		if (!tag){
			throw new Error('Tag not found')
		}

		const questions = tag.questions;

		const isNext = questions.length > pageSize;

		return { tagTitle: tag.name, questions, isNext } 
	}
	catch (error) {
		console.error(error)
		throw error
	}
}

export async function getPopularTags() {
	try {
		connectToDatabase()

		const popularTags = await Tag.aggregate([
			{ $project: { name: 1, questionsNumber: { $size: '$questions' } } },
			{ $sort: { questionsNumber: -1 } },
			{ $limit: 5 }
		])
		return popularTags
	}
	catch (error) {
		console.error(error)
		throw error
	}
}

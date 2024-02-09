'use server'

import Follow from "@/database/follow.model";
import { connectToDatabase } from "../mongoose";
import { FollowUserParams } from "./shared.types";


export async function followUser(params: FollowUserParams){
    try {
		connectToDatabase()

        const { userId, targetUserId } = params;

        if (userId === targetUserId) {
            throw new Error('Cannot follow yourself');
        }
    
        const existingFollow = await Follow.findOne({ follower: userId, following: targetUserId });
        if (existingFollow) {
            throw new Error('Already following this user');
        }
    
        await Follow.create({ follower: userId, following: targetUserId });
        
        const followerCount = await Follow.countDocuments({ following: targetUserId });
		
        return { followerCount };
    } catch (error) {
        console.error('Error following user:', error);
        throw error;
    }
}

export async function unfollowUser(params: FollowUserParams){
    try {
		connectToDatabase()

        const { userId, targetUserId } = params;

        const existingFollow = await Follow.findOne({ follower: userId, following: targetUserId });
        if (!existingFollow) {
            throw new Error('Not following this user');
        }
    
        await Follow.deleteOne({ follower: userId, following: targetUserId });
        

        const followerCount = await Follow.countDocuments({ following: targetUserId });
		return { followerCount };
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
}

export async function checkIsFollowing(params: FollowUserParams): Promise<boolean> {
    try {
        connectToDatabase();

        const { userId, targetUserId } = params;

        if (userId === targetUserId) {
            throw new Error('You cannot follow yourself.');
        }
    
        const existingFollow = await Follow.findOne({ follower: userId, following: targetUserId });

        return !!existingFollow; // Convert truthy/falsy value to boolean
    } catch (error) {
        console.error('An error occurred while checking follow status:', error);
        throw error;
    }
}
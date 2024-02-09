"use client";
import { FC, useState } from "react";
import { FollowUserParams } from "@/lib/actions/shared.types";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/lib/actions/follow.action";

interface FollowButtonProps extends FollowUserParams {
  Following: boolean;
}

const FollowButton: FC<FollowButtonProps> = ({
  userId,
  targetUserId,
  Following,
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(Following);

  const currentUser = JSON.parse(userId);
  const targetUser = JSON.parse(targetUserId);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        const { followerCount } = await unfollowUser({
          userId: currentUser,
          targetUserId: targetUser,
        });

        console.log(followerCount);
        setIsFollowing(false);
      } else {
        const followerCount = await followUser({
          userId: currentUser,
          targetUserId: targetUser,
        });

        console.log(followerCount);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      className={`paragraph-medium min-w-[120px] rounded-3xl px-4 py-3  ${
        isFollowing ? "border hover:border-red-500" : ""
      }`}
      onClick={handleFollowToggle}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;

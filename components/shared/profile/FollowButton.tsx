"use client";
import { FC, useState } from "react";
import { FollowUserParams } from "@/lib/actions/shared.types";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/lib/actions/follow.action";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface FollowButtonProps extends FollowUserParams {
  Following: boolean;
  className?: string;
}

const FollowButton: FC<FollowButtonProps> = ({
  userId,
  targetUserId,
  Following,
  className,
}) => {
  const pathname = usePathname();
  const [isFollowing, setIsFollowing] = useState<boolean>(Following);

  const currentUser = JSON.parse(userId);
  const targetUser = JSON.parse(targetUserId);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser({
          userId: currentUser,
          targetUserId: targetUser,
          path: pathname,
        });
        setIsFollowing(false);
      } else {
        await followUser({
          userId: currentUser,
          targetUserId: targetUser,
          path: pathname,
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      className={cn(
        `paragraph-medium min-w-[120px] rounded-3xl px-4 py-3  ${
          isFollowing ? "border hover:border-red-500" : ""
        }`,
        className
      )}
      onClick={handleFollowToggle}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;

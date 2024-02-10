import { FC } from "react";
import Link from "next/link";
import { getTopUserTags } from "@/lib/actions/tag.action";
import Tag from "../shared/Tag";
import { auth } from "@clerk/nextjs";
import FollowButton from "../shared/profile/FollowButton";
import { getUserById } from "@/lib/actions/user.action";
import { checkIsFollowing, getFollowCount } from "@/lib/actions/follow.action";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserCardProps {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard: FC<UserCardProps> = async ({ user }) => {
  const { userId: clerkId } = auth();
  const currentUserID = await getUserById({ userId: clerkId! });
  const interactedTags = await getTopUserTags({ userId: user._id });
  const isUserFollowing = await checkIsFollowing({
    userId: currentUserID._id,
    targetUserId: user._id,
  });
  const { followers, following } = await getFollowCount(user._id);

  return (
    <div className="w-full rounded-md border p-3 shadow-md">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-start">
        <Link
          href={`/profile/${user.clerkId}`}
          className="mb-4 size-16 rounded-full sm:mr-4"
        >
          <Avatar className="mt-2 size-[4rem]">
            <AvatarImage src={user.picture} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <h2 className="mb-1 text-lg font-bold text-foreground sm:mb-0">
            {user.name}
          </h2>
          <Link
            href={`/profile/${user.clerkId}`}
            className="text-muted-foreground"
          >
            @{user.username}
          </Link>
          <div className="sm:paragraph-regular mt-2 flex w-full justify-between space-x-3 text-sm sm:w-auto">
            <Link
              // href={`/followers/${user.clerkId}`}
              href="#"
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              Followers: {followers}
            </Link>
            <Link
              // href={`/followers/${user.clerkId}`}
              href="#"
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              Following: {following}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:ml-auto sm:items-end sm:justify-end">
          {user.clerkId !== clerkId && (
            <FollowButton
              userId={JSON.stringify(currentUserID._id)}
              targetUserId={JSON.stringify(user._id)}
              Following={isUserFollowing}
              className="mt-1 w-auto sm:w-auto"
            />
          )}
          <div>
            <div>
              {interactedTags.length > 0 && (
                <div className="mt-1 flex justify-center gap-2 sm:mt-1">
                  {interactedTags.map((tag) => (
                    <Tag
                      key={tag._id}
                      _id={tag._id}
                      name={tag.name}
                      className="rounded-3xl bg-accent/90 text-card-foreground"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

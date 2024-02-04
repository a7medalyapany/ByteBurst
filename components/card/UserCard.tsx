import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTopUserTags } from "@/lib/actions/tag.action";
import { Badge } from "../ui/badge";
import Tag from "../shared/Tag";
import { Button } from "../ui/button";
import { auth } from "@clerk/nextjs";

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
  const { userId } = auth();
  const interactedTags = await getTopUserTags({ userId: user._id });

  return (
    <div className="w-full rounded-md border p-3 shadow-md">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-start">
        <Link
          href={`/profile/${user.clerkId}`}
          className="mb-4 size-16 rounded-full sm:mr-4"
        >
          <Image
            src={user.picture}
            alt={user.name}
            width={100}
            height={100}
            className="mt-2 rounded-full"
          />
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
              href={`/followers/${user.clerkId}`}
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              Followers: 10k
            </Link>
            <Link
              href={`/followers/${user.clerkId}`}
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              Following: 4781
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:ml-auto">
          {user.clerkId !== userId && (
            <Button variant={"outline"} className="mt-2 rounded-full sm:mt-0">
              Follow
            </Button>
          )}
          <div>
            {interactedTags.length > 0 ? (
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
            ) : (
              <Badge>No tags</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

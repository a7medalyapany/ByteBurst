import { FC } from "react";
import { URLProps } from "@/types";
import { getUserById, getUserInfo } from "@/lib/actions/user.action";
import Image from "next/image";
import { SignedIn, auth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatJoinAt } from "@/lib/utils";
import ProfileLink from "@/components/shared/profile/ProfileLink";
import Stats from "@/components/shared/profile/Stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionTab from "@/components/shared/profile/QuestionTab";
import AnswerTab from "@/components/shared/profile/AnswerTab";
import FollowButton from "@/components/shared/profile/FollowButton";
import { checkIsFollowing } from "@/lib/actions/follow.action";

const page: FC<URLProps> = async ({ params, searchParams }: URLProps) => {
  const userInfo = await getUserInfo({ userId: params.id });
  const { userId: clerkId } = auth();
  const currentUserID = await getUserById({ userId: clerkId! });
  const isUserFollowing = await checkIsFollowing({
    userId: currentUserID._id,
    targetUserId: userInfo.user._id,
  });

  return (
    <>
      <div className="flex items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <Image
            src={userInfo?.user.picture}
            alt="profile picture"
            width={100}
            height={100}
            className="rounded-full border object-cover md:size-[150px]"
          />

          <div className="mt-3">
            <h2 className="sm:h3-bold whitespace-nowrap font-bold">
              {userInfo.user.name}
            </h2>
            <p className="text-muted-foreground/70">
              @{userInfo.user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo.user.portfolio && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolio}
                  title="Portfolio"
                />
              )}

              {userInfo.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={formatJoinAt(userInfo.user.joinedAt)}
              />
            </div>

            {userInfo.user.bio && (
              <p className="paragraph-regular mt-8">{userInfo.user.bio}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId !== userInfo.user.clerkId && (
              <FollowButton
                userId={JSON.stringify(currentUserID._id)}
                targetUserId={JSON.stringify(userInfo.user._id)}
                Following={isUserFollowing}
              />
            )}
          </SignedIn>
        </div>
      </div>

      <div className="my-8 border" />

      <Stats
        activeNow={userInfo.user.reputation}
        badges={userInfo.badgeCounts}
      />

      <Tabs defaultValue="top-posts" className="flex-1">
        <div className="flex flex-col-reverse gap-4 pt-6 sm:flex-row">
          <TabsList className="min-h-[42px] w-full justify-between p-1 sm:w-fit">
            <TabsTrigger className="w-full rounded-md" value="top-posts">
              Top Posts
            </TabsTrigger>
            <TabsTrigger className="w-full rounded-md" value="answers">
              Answers
            </TabsTrigger>
          </TabsList>
          <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link className="ml-auto w-full sm:w-fit" href="/profile/edit">
                <Button className="w-full">Edit Profile</Button>
              </Link>
            )}
          </SignedIn>
        </div>

        <TabsContent value="top-posts" className="mt-4 space-y-4">
          <QuestionTab
            userId={userInfo.user._id}
            clerkId={clerkId}
            searchParams={searchParams}
          />
        </TabsContent>
        <TabsContent value="answers">
          <AnswerTab
            userId={userInfo.user._id}
            clerkId={clerkId}
            searchParams={searchParams}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default page;

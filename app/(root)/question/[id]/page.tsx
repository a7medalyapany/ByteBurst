import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { getQuestionById } from "@/lib/actions/question.action";
import Metric from "@/components/shared/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import Tag from "@/components/shared/Tag";
import Answer from "@/components/form/Answer";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";

interface pageProps {}

const Page: FC<pageProps> = async ({ params, searchParams }: any) => {
  const { userId: clerkId } = auth();
  let mongoUser: any;
  const result = await getQuestionById({ questionId: params.id });

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              alt="profile picture"
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold">{result.author.name}</p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(mongoUser._id)}
              downvotes={result.downvotes.length}
              hasdownVoted={result.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold mt-3.5 w-full text-left">{result.title}</h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock"
          title=" Asked"
          value={`asked ${getTimeStamp(result.createdAt)}`}
          textStyle="small-medium text-muted-foreground"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Messages"
          value={formatNumber(result.answers.length)}
          title="Answers"
          textStyle="small-medium text-muted-foreground"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye "
          value={formatNumber(result.views)}
          title="Views"
          textStyle="small-medium text-muted-foreground"
        />
      </div>

      <ParseHTML data={result.content} />

      <div className="mt-8 flex flex-wrap gap-2 rounded-lg">
        {result.tags.map((tag: any) => (
          <Tag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
            className="mb-1 rounded-3xl"
          />
        ))}
      </div>

      <AllAnswers
        questionId={result._id}
        userId={mongoUser._id}
        totalAnswers={result.answers.length}
      />

      <Answer
        question={result.content}
        authorId={JSON.stringify(mongoUser._id)}
        questionId={JSON.stringify(result._id)}
      />
    </>
  );
};

export default Page;

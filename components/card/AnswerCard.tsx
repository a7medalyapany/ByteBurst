import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import Metric from "../shared/Metric";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";
import { getUserDataByQuestionId } from "@/lib/actions/user.action";
import ParseHTML from "../shared/ParseHTML";

interface AnswerCardProps {
  clerkId?: string | null;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  content: string;
  createdAt: Date;
}

const AnswerCard: FC<AnswerCardProps> = async ({
  clerkId,
  _id,
  question,
  author,
  content,
  createdAt,
}) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  const questionAuthor = await getUserDataByQuestionId(question._id);

  return (
    <>
      <div className="mt-4 rounded-[10px] bg-card-foreground/90 p-5 text-secondary sm:px-8">
        <div className="flex-between w-full flex-wrap gap-3">
          <Metric
            imgUrl={questionAuthor!.picture}
            alt="Author Picture"
            value={questionAuthor!.name}
            title={`- asked ${getTimeStamp(createdAt)}`}
            href={`/profile/${questionAuthor!.clerkId}`}
            isAuthor
            textStyle="body-medium text-muted-foreground"
          />

          <div className="flex-center gap-3">
            <SignedIn>
              {showActionButtons && (
                <EditDeleteAction type="answer" itemId={JSON.stringify(_id)} />
              )}
            </SignedIn>
          </div>
        </div>

        <div className="mt-2">
          <div className="mb-2 flex justify-start">
            <Link
              href={`/question/${question?._id}/#${_id}`}
              className="flex flex-col rounded-lg bg-card p-2 text-card-foreground"
            >
              <span className="font-semibold text-muted-foreground/40">
                {questionAuthor?.name}
              </span>
              <span className="ml-2 line-clamp-1">{question.title}</span>
            </Link>
          </div>

          <div className="flex justify-end">
            <Link
              href={`/question/${question?._id}/#${_id}`}
              className="flex flex-col rounded-lg bg-card-foreground p-2 text-primary-foreground"
            >
              <span className="ml-auto font-semibold text-muted/40">
                {author?.name}
              </span>
              <span className="">
                <ParseHTML
                  data={content}
                  className="line-clamp-1 bg-transparent p-0 pr-2 dark:bg-transparent "
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnswerCard;

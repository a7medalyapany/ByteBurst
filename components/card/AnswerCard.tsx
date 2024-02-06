import { formatNumber, getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import Metric from "../shared/Metric";

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
  upvotes: number;
  createdAt: Date;
}

const AnswerCard: FC<AnswerCardProps> = ({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}) => {
  return (
    <div className="mt-4 rounded-[10px] bg-card-foreground/90 p-9 text-secondary sm:px-11">
      <Link href={`/question/${question?._id}/#${_id}`} className="space-y-4">
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div>
            <span className="subtle-regular line-clamp-1 flex sm:hidden">
              {getTimeStamp(createdAt)}
            </span>
            <h3 className="sm:h3-semibold base-semibold line-clamp-1 flex-1">
              {question.title}
            </h3>
          </div>
        </div>

        <div className="flex-between mt-6 w-full flex-wrap gap-3">
          <Metric
            imgUrl={author.picture}
            alt="Author Picture"
            value={author.name}
            title={`- asked ${getTimeStamp(createdAt)}`}
            href={`/profile/${author.clerkId}`}
            isAuthor
            textStyle="body-medium text-muted-foreground"
          />

          <div className="flex-center gap-3">
            <Metric
              imgUrl="/assets/icons/like.svg"
              alt="like icon"
              value={formatNumber(upvotes)}
              title={" Votes"}
              textStyle="small-medium text-muted-foreground"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnswerCard;

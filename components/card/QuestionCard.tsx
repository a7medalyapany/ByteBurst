import Link from "next/link";
import { FC } from "react";
import Tag from "../shared/Tag";
import Metric from "../shared/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface QuestionCardProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    clerkId?: string | null;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
  clerkId?: string | null;
}

const QuestionCard: FC<QuestionCardProps> = ({
  _id,
  clerkId,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  return (
    <div className="rounded-[10px] bg-card-foreground/90 p-9 text-secondary sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            className="rounded-3xl"
          />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          href={`/profile/${author.clerkId}`}
          imgUrl={author.picture}
          alt="Author Picture"
          value={author.name}
          title={`- asked ${getTimeStamp(createdAt)}`}
          textStyle="body-medium text-muted-foreground"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatNumber(upvotes)}
            title="Votes"
            textStyle="small-medium text-muted-foreground"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Messages"
            value={formatNumber(answers.length)}
            title="Answers"
            textStyle="small-medium text-muted-foreground"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye "
            value={formatNumber(views)}
            title="Views"
            textStyle="small-medium text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

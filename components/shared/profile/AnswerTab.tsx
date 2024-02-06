import { FC } from "react";
import { SearchParamsProps } from "@/types";
import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "@/components/card/AnswerCard";

interface AnswerTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab: FC<AnswerTabProps> = async ({
  searchParams,
  userId,
  clerkId,
}) => {
  const result = await getUserAnswers({ userId });
  return (
    <>
      {result.answers.map((answer: any) => (
        <AnswerCard
          key={answer._id}
          _id={answer._id}
          clerkId={clerkId}
          question={answer.question}
          author={answer.author}
          content={answer.content}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
};

export default AnswerTab;

import QuestionCard from "@/components/card/QuestionCard";
import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { FC } from "react";
import Pagination from "../Pagination";

interface QuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab: FC<QuestionTabProps> = async ({
  searchParams,
  userId,
  clerkId,
}) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {result.questions.map((question: any) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes.length}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default QuestionTab;

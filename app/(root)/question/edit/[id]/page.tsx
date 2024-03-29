import { FC } from "react";
import { auth } from "@clerk/nextjs";
import Question from "@/components/form/Question";
import { getUserById } from "@/lib/actions/user.action";
import { getQuestionById } from "@/lib/actions/question.action";
import { ParamsProps } from "@/types";

const Page: FC<ParamsProps> = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });
  return (
    <>
      <h1 className="h1-bold">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;

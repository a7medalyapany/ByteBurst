import { FC } from "react";
import { SearchParamsProps } from "@/types";

interface AnswerTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab: FC<AnswerTabProps> = async ({
  searchParams,
  userId,
  clerkId,
}) => {
  return <div>AnswerTab</div>;
};

export default AnswerTab;

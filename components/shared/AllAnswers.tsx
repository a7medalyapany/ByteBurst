import { FC } from "react";
import Filters from "./Filters";
import { AnswerFilters } from "@/constants";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

interface AllAnswersProps {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: number;
}

const AllAnswers: FC<AllAnswersProps> = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}) => {
  const result = await getAnswers({ questionId });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3>{totalAnswers} Answers</h3>
        <Filters filters={AnswerFilters} />
      </div>

      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="rounded-md border py-10">
            <div className="flex items-center justify-between">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt="profile picture"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col  sm:flex-row sm:items-center">
                    <p className="body-semibold">{answer.author.name}</p>

                    <p className="small-regular ml-0.5 mt-0.5 line-clamp-1">
                      answered {getTimeStamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Votes />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { getQuestionById } from "@/lib/actions/question.action";
import Metric from "@/components/shared/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import Tag from "@/components/shared/Tag";
import Answer from "@/components/form/Answer";

interface pageProps {}

const page: FC<pageProps> = async ({ params, searchParams }: any) => {
  const result = await getQuestionById({ questionId: params.id });

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
          <div className="flex justify-end">Voting</div>
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

      <Answer />
    </>
  );
};

export default page;

import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import Tag from "./Tag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

interface RightSidebarProps {}

const RightSidebar: FC<RightSidebarProps> = async () => {
  const hotQuestions = await getHotQuestions();
  const popularTags = await getPopularTags();

  return (
    <section className="sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 max-xl:hidden lg:w-[350px]">
      <div>
        <h3 className="h3-bold">Top Questions</h3>
        <div className="mt-5 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={`/question/${question._id}`}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-lg p-2 hover:bg-accent-foreground/10"
            >
              <p className="body-medium">{question.title}</p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="Arrow Right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold">Popular Tags</h3>
        <div className="mt-5 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <Tag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.questionsNumber}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;

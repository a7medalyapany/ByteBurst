import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import Tag from "./Tag";

interface RightSidebarProps {}

const hotQuestions = [
  {
    _id: "1",
    title: "How to use Next.js",
  },
  {
    _id: "2",
    title: "How to use React",
  },
  {
    _id: "3",
    title: "How to use TypeScript",
  },
  {
    _id: "4",
    title: "How to use Express",
  },
  {
    _id: "5",
    title: "How to use MongoDB",
  },
];

const popularTags = [
  {
    _id: "1",
    title: "Next.js",
    totalQuestions: 130,
  },
  {
    _id: "2",
    title: "React",
    totalQuestions: 100,
  },
  {
    _id: "3",
    title: "TypeScript",
    totalQuestions: 108,
  },
  {
    _id: "4",
    title: "Express",
    totalQuestions: 125,
  },
  {
    _id: "5",
    title: "MongoDB",
    totalQuestions: 80,
  },
];

const RightSidebar: FC<RightSidebarProps> = () => {
  return (
    <section className="sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 max-xl:hidden lg:w-[350px]">
      <div>
        <h3 className="h3-bold">Top Questions</h3>
        <div className="mt-5 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={`/questions/${question._id}`}
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
              name={tag.title}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;

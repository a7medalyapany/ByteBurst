import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filters from "@/components/shared/Filters";
import { HomePageFilters } from "@/constants";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/card/QuestionCard";

interface pageProps {}

const questions = [
  {
    _id: "1",
    title: "How to use React?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "JavaScript" },
    ],
    author: {
      _id: "Alyapany",
      name: "Alyapany",
      picture: "url/to/picture",
    },
    upvotes: 10,
    views: 10950,
    answers: [],
    createdAt: new Date("2021-10-10T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to use Next?",
    tags: [
      { _id: "1", name: "Next" },
      { _id: "2", name: "TypeScript" },
    ],
    author: {
      _id: "Alyapany",
      name: "Alyapany",
      picture: "url/to/picture",
    },
    upvotes: 10,
    views: 100,
    answers: [],
    createdAt: new Date("2023-10-10T12:00:00.000Z"),
  },
  {
    _id: "3",
    title: "How to use Rust?",
    tags: [{ _id: "1", name: "Rust" }],
    author: {
      _id: "Alyapany",
      name: "Alyapany",
      picture: "url/to/picture",
    },
    upvotes: 10,
    views: 100,
    answers: [],
    createdAt: new Date("2021-10-10T12:00:00.000Z"),
  },
];

const page: FC<pageProps> = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="min-h-[46px] bg-popover-foreground px-4 py-3">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filters
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to ask a question, or check back later for new questions. Crack the code or Roll in expert mode."
            link="/"
            linkText="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default page;

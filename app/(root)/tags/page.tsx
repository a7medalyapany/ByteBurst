import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants";
import { getAllTags } from "@/lib/actions/tag.action";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async () => {
  const result = await getAllTags({});
  return (
    <>
      <h1 className="h1-bold">All Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />

        <Filters
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link href={`/tags/${tag._id}`} key={tag._id}>
              <article className="flex w-full flex-col items-center justify-center rounded-2xl border px-8 py-10">
                <div className="w-fit rounded-3xl bg-accent/90 px-5 py-2">
                  <p className="paragraph-semibold">{tag.name}</p>
                </div>
                <p className="small-medium mt-3.5 flex items-center justify-center text-center">
                  Questions:
                  <span className="body-semibold ml-1.5 text-blue-300">
                    {tag.questions.length}
                  </span>
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tags found"
            description="There are no tags yet"
            link="/ask-question"
            linkText="Ask a question"
          />
        )}
      </section>
    </>
  );
};

export default page;

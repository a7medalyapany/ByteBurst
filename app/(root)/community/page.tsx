import UserCard from "@/components/card/UserCard";
import Filters from "@/components/shared/Filters";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import { FC } from "react";

const Page: FC<SearchParamsProps> = async ({
  searchParams,
}: SearchParamsProps) => {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });
  return (
    <>
      <h1 className="h1-bold">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for experts"
          otherClasses="flex-1"
        />

        <Filters
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular mx-auto max-w-4xl text-center">
            <p>No users found</p>
            <Link href="/register" className="mt-1 font-bold text-blue-400">
              Join and be the first to be found
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Page;

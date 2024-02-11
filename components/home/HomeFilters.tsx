"use client";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { HomePageFilters } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import { SignedIn, SignedOut } from "@clerk/nextjs";

interface HomeFiltersProps {}

const HomeFilters: FC<HomeFiltersProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("");

  const handleFilterClick = (filter: string) => {
    if (active === filter) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(filter);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      <SignedIn>
        {HomePageFilters.map((filter) => (
          <Button
            key={filter.value}
            className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
              active === filter.value
                ? "bg-card-foreground"
                : "bg-card-foreground/50 hover:bg-card-foreground"
            }`}
            onClick={() => handleFilterClick(filter.value)}
          >
            {filter.name}
          </Button>
        ))}
      </SignedIn>
      <SignedOut>
        {HomePageFilters.filter(
          (filter) =>
            filter.value !== "recommended" && filter.value !== "following"
        ).map((filter) => (
          <Button
            key={filter.value}
            className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
              active === filter.value
                ? "bg-card-foreground"
                : "bg-card-foreground/50 hover:bg-card-foreground"
            }`}
            onClick={() => handleFilterClick(filter.value)}
          >
            {filter.name}
          </Button>
        ))}
      </SignedOut>
    </div>
  );
};

export default HomeFilters;

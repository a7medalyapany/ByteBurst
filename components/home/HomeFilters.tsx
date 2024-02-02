"use client";
import { FC } from "react";
import { Button } from "../ui/button";
import { HomePageFilters } from "@/constants";

interface HomeFiltersProps {}

const HomeFilters: FC<HomeFiltersProps> = () => {
  const active = "";
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === filter.value
              ? "bg-card-foreground"
              : "bg-card-foreground/50 hover:bg-card-foreground"
          }`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;

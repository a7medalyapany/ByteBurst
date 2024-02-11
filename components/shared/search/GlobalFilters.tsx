"use client";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalSearchFilters } from "@/constants";
import { useSearchParams, useRouter } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

interface GlobalFiltersProps {}

const GlobalFilters: FC<GlobalFiltersProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [active, setActive] = useState("");

  const handleFilterClick = (filter: string) => {
    if (active === filter) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(filter);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: filter.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="body-medium">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter) => (
          <Button
            key={filter.value}
            className={`
			body-medium rounded-2xl px-5 py-2 capitalize text-muted
			${
        active === filter.value
          ? "bg-card-foreground text-card"
          : "bg-card-foreground/50 hover:bg-card-foreground"
      }`}
            onClick={() => handleFilterClick(filter.value)}
          >
            {filter.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;

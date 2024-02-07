"use client";
import { FC } from "react";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  pageNumber: number;
  isNext: boolean;
}

const Pagination: FC<PaginationProps> = ({ pageNumber, isNext }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "next" ? pageNumber + 1 : pageNumber - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) {
    return null;
  }
  return (
    <div className="flex w-full items-center justify-center gap-1">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("prev")}
        className="flex min-h-[36px] w-fit items-center justify-center gap-2 rounded-lg border bg-accent-foreground/80"
      >
        <p className="body-medium">Prev</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-accent-foreground/50 px-3.5 py-2">
        <p className="body-semibold">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
        className="flex min-h-[36px] w-fit items-center justify-center gap-2 rounded-lg border bg-accent-foreground/80"
      >
        <p className="body-medium">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;

"use client";
import { FC } from "react";
import { Button, buttonVariants } from "../ui/button";
import { cn, formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        variant={"ghost"}
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("prev")}
        className="gap-1 pl-2.5"
      >
        <ChevronLeft className="size-4" />

        <p className="body-medium">Prev</p>
      </Button>
      <p
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "body-semibold rounded-lg"
        )}
      >
        {pageNumber}
      </p>
      <Button
        variant={"ghost"}
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
        className="gap-1 pr-2.5"
      >
        <p className="body-medium">Next</p>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export default Pagination;

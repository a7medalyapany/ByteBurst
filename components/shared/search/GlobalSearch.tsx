import React, { FC } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface GlobalSearchProps {}

const GlobalSearch: FC<GlobalSearchProps> = () => {
  return (
    <div className="relative w-full max-w-[600px] rounded-xl bg-muted max-lg:hidden">
      <div className="relative flex min-h-[56px] grow items-center gap-1 rounded-xl bg-muted px-4">
        <Image
          src="assets/icons/search.svg"
          alt="Search Icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search globaly"
          className="paragraph-regular placeholder rounded-xl border-none bg-transparent outline-none"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;

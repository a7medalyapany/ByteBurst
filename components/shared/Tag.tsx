import Link from "next/link";
import React, { FC } from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface TagProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
  className?: string;
}

const Tag: FC<TagProps> = ({
  _id,
  name,
  totalQuestions,
  showCount,
  className,
}) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <Badge
        className={cn(
          "subtle-medium rounded-md border-none bg-card-foreground px-4 py-2 uppercase",
          className
        )}
      >
        {name}
      </Badge>
      {showCount && (
        <p className="small-medium text-muted-foreground">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default Tag;

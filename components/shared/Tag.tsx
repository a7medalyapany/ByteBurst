import Link from "next/link";
import React, { FC } from "react";
import { Badge } from "../ui/badge";

interface TagProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const Tag: FC<TagProps> = ({ _id, name, totalQuestions, showCount }) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <Badge className="subtle-medium rounded-md border-none bg-card-foreground px-4 py-2 uppercase">
        {name}
      </Badge>
      {showCount && (
        <p className="small-medium text-muted-foreground">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default Tag;

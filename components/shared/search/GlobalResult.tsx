"use client";
import { FC, useEffect, useState } from "react";
import { RotateCwIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/global.action";

interface GlobalResultProps {}

const GlobalResult: FC<GlobalResultProps> = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);

  const global = searchParams.get("g");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);
      setResult([]);
      try {
        const res = await globalSearch({
          query: global,
          type,
        });

        setResult(JSON.parse(res));
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
  }, [global, type]);

  const renderLink = (type: string, id: any) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "user":
        return `/profile/${id}`;
      case "answer":
        return `/question/${id}`;
      case "tag":
        return `/tags/${id}`;
      default:
        return "/";
    }
  };

  return (
    <div className="absolute  top-full z-10 mt-3 w-full rounded-xl bg-muted py-5 shadow-sm">
      <GlobalFilters />
      <Separator className="my-5 bg-foreground" />
      <div className="space-y-5">
        <p className="paragraph-semibold px-5">Top Match</p>

        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <RotateCwIcon className="my-2 size-10 animate-spin" />
            <p className="body-regular">Working on it</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  key={item.id + item.type + index}
                  href={renderLink(item.type, item.id)}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:rounded-lg hover:bg-muted-foreground/50"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    alt="tags"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium line-clamp-1">{item.title}</p>
                    <p className="small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="body-regular px-5 py-2.5">No result found for</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;

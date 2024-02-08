import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="flex items-center gap-3 sm:gap-5">
        <Skeleton className="size-[100px] rounded-full sm:size-[150px]" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20 sm:h-4 sm:w-28" />
          <Skeleton className="h-3 w-32 sm:h-4 sm:w-48" />
          <Skeleton className="h-3 w-36 sm:h-4 sm:w-52" />
        </div>
      </div>

      <Separator className="my-6 bg-foreground/20 sm:my-9" />

      <div className="mb-6 flex gap-3 sm:mb-8 sm:gap-5 ">
        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            className="size-[100px] rounded-lg sm:size-[150px]"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {[...Array(10)].map((_, index) => (
          <Skeleton
            key={index}
            className="h-[140px] w-full rounded-lg sm:h-[180px]"
          />
        ))}
      </div>
    </section>
  );
};

export default Loading;

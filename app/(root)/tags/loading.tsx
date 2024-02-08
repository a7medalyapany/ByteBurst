import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold">All Tags</h1>
      <div className="mb-12 mt-11 flex flex-wrap gap-5">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </div>

      <div className="flex flex-wrap gap-4">
        {[...Array(20)].map((_, index) => (
          <Skeleton key={index} className="size-[150px] rounded-lg" />
        ))}
      </div>
    </section>
  );
};

export default Loading;

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold">Ask a question</h1>
      <div className="mb-12 mt-11 flex flex-col gap-5">
        <div className="space-y-1">
          <Skeleton className="h-8 w-full rounded-lg" />
          <div className="flex gap-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-14 w-full" />
        </div>
        <div className="mt-5 space-y-1">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-[250px] w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-14 w-full" />
        </div>
        <Skeleton className="ml-auto h-14 w-36 rounded-lg" />
      </div>
    </section>
  );
};

export default Loading;

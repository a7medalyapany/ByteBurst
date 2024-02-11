import Question from "@/components/form/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const Page: FC<pageProps> = async () => {
  const { userId } = auth();
  if (!userId) redirect("/login");
  const mongoUser = await getUserById({ userId });
  return (
    <div>
      <h1 className="h1-bold">Ask a question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default Page;

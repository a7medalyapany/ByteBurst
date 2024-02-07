import { FC } from "react";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import Profile from "@/components/form/Profile";

const page: FC<ParamsProps> = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }

  const mongoUser = await getUserById({ userId });
  return (
    <>
      <h1 className="h1-bold">Edit Profile</h1>

      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};

export default page;
import { FC } from "react";
import { UserButton } from "@clerk/nextjs";

interface pageProps {}

const page: FC<pageProps> = () => {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default page;

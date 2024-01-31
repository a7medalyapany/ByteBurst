import { UserButton } from "@clerk/nextjs";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default page;

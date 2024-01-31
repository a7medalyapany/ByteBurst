import { FC } from "react";
import { SignIn } from "@clerk/nextjs";

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  return <SignIn />;
};

export default Page;

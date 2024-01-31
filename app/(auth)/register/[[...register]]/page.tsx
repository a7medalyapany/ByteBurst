import { FC } from "react";
import { SignUp } from "@clerk/nextjs";

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  return <SignUp />;
};

export default Page;

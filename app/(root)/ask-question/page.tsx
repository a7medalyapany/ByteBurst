import Question from "@/components/form/Question";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = () => {
  return (
    <div>
      <h1 className="h1-bold">Ask a question</h1>
      <div className="mt-9">
        <Question />
      </div>
    </div>
  );
};

export default page;

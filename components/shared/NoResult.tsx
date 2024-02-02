import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface NoResultProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const NoResult: FC<NoResultProps> = ({
  title,
  description,
  link,
  linkText,
}) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        alt="No result found"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="No result found"
        width={270}
        height={200}
        className="hidden object-contain dark:flex"
      />

      <h2 className="h2-bold mt-8">{title}</h2>
      <p className="body-regular max-w-md text-center">{description}</p>
      <Link href={link}>
        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-card-foreground px-4 py-3 hover:bg-card-foreground/80">
          {linkText}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;

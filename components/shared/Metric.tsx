import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  href?: string;
  title: string;
  textStyle?: string;
  isAuthor?: boolean;
}

const Metric: FC<MetricProps> = ({
  imgUrl,
  alt,
  value,
  href,
  title,
  textStyle,
  isAuthor,
}) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={16}
        height={16}
        className={`object-contain ${href ? "size-[28px] rounded-full" : ""}`}
      />
      <p className={`${textStyle} flex items-center gap-1`}>
        {value}

        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {metricContent}
      </Link>
    );
  }
  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;

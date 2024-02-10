"use client";

import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { SignedOut, useAuth } from "@clerk/nextjs";

interface LeftSidebarProps {}

const LeftSidebar: FC<LeftSidebarProps> = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  return (
    <section className="sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          if (item.route === "/profile") {
            if (userId) {
              item.route = `${item.route}/${userId}`;
            } else {
              return null;
            }
          }
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`${
                isActive
                  ? "rounded-lg bg-muted-foreground text-foreground"
                  : "text-muted-foreground"
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={"invert-colors"}
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href={"/login"}>
            <Button className="small-medium min-h-[41px] w-full rounded-lg bg-secondary-foreground/90 px-4 py-3">
              <Image
                src="/assets/icons/account.svg"
                alt="login Icon"
                width={20}
                height={20}
                className={"invert-colors lg:hidden"}
              />
              <span className="text-primary-foreground max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>
          <Link href={"/register"}>
            <Button className="small-medium min-h-[41px] w-full rounded-lg bg-muted-foreground px-4 py-3">
              <Image
                src="/assets/icons/sign-up.svg"
                alt="register Icon"
                width={20}
                height={20}
                className={"invert-colors lg:hidden"}
              />
              <span className="text-primary-foreground max-lg:hidden">
                Sign Up
              </span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;

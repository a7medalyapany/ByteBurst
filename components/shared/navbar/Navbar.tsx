"use client";
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/ModeToggle";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";
import { useTheme } from "next-themes";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const { theme } = useTheme();
  return (
    <nav className="flex-between fixed z-50 w-full gap-5 border-b bg-background/95 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        {theme === "light" ? (
          <Image
            src="dark-logo.svg"
            alt="ByteBurst Logo"
            width={150}
            height={150}
            className="sm:h-fit sm:w-[180px]"
          />
        ) : (
          <Image
            src="light-logo.svg"
            alt="ByteBurst Logo"
            width={150}
            height={150}
            className="sm:h-fit sm:w-[180px]"
          />
        )}
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <ModeToggle />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#acacac",
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;

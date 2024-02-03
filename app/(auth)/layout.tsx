import React, { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const Layout: FC<layoutProps> = ({ children }: layoutProps) => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      {children}
    </main>
  );
};

export default Layout;

import TopNav from "@/components/public-nav/TopNav";
import React from "react";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full min-h-screen">
      <TopNav />
      {children}
    </div>
  );
};

export default PublicLayout;

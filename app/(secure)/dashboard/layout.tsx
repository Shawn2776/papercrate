import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="max-w-2xl mx-auto mt-2">{children}</div>;
};

export default DashboardLayout;

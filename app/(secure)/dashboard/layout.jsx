import PublicNav from "@/components/nav/PublicNav";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      {/* <PublicNav /> */}
      {children}
    </div>
  );
};

export default DashboardLayout;

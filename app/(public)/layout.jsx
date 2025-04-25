import PublicNav from "@/components/nav/PublicNav";
import React from "react";

const PublicLayout = ({ children }) => {
  return (
    <div>
      <PublicNav />
      <div>{children}</div>
    </div>
  );
};

export default PublicLayout;

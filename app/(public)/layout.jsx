import Footer from "@/components/footer/Footer";
import PublicNav from "@/components/nav/PublicNav";
import React from "react";

const PublicLayout = ({ children }) => {
  return (
    <div>
      <PublicNav />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default PublicLayout;

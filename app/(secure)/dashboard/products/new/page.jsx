import NewProductForm from "@/components/forms/products/NewProductForm";
import React from "react";

const NewProductPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <NewProductForm />
    </div>
  );
};

export default NewProductPage;

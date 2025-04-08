import React from "react";

interface FormHeaderProps {
  h2: string;
  p?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ h2, p }) => {
  return (
    <div className="flex flex-col bg-primary md:mt-5 text-primary-foreground py-8 pl-8">
      <h2 className="text-4xl font-extrabold">{h2}</h2>
      {p && <p className="text-primary-foreground/70">{p}</p>}
    </div>
  );
};

export default FormHeader;

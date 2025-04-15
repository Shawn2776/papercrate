import React from "react";

interface FormHeaderProps {
  h2: string;
  p?: string;
}

const FormHeader = ({ h2, p }: { h2: string; p?: string }) => (
  <div className="mb-6 text-center md:text-left">
    <h2 className="text-3xl font-bold text-primary mb-1">{h2}</h2>
    {p && <p className="text-muted-foreground">{p}</p>}
  </div>
);

export default FormHeader;

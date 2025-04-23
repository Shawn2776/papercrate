"use client";

import { useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="flex min-h-screen">
      {/* Left: Splash Screen */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-primary text-white px-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to PaperCrate</h1>
        <p className="text-lg text-white/90">
          Streamline your invoicing and billing with our powerful platform.
        </p>
      </div>

      {/* Right: Sign Up Form */}
      <div className="flex justify-center items-center w-full md:w-1/2 px-4 py-12">
        <SignUp
          redirectUrl="/new-user/1"
          initialValues={{
            emailAddress: email,
          }}
        />
      </div>
    </div>
  );
}

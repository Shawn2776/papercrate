// app/sign-up/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="flex min-h-screen">
      {/* Left: Splash Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-emerald-600 via-green-500 to-lime-400 text-white flex-col justify-center items-center px-10 py-12">
        <Image
          src="/signup.png"
          alt="PaperCrate Logo"
          width={250}
          height={250}
          className="mb-6"
        />
        <h1 className="text-6xl font-bold mb-4 text-black">
          Welcome to PaperCrate
        </h1>
        <p className="text-2xl text-black text-center max-w-lg">
          Modern tools for managing invoices, clients, and operations — all in
          one place.
        </p>
      </div>

      {/* Right: Sign Up Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center px-6 py-12">
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

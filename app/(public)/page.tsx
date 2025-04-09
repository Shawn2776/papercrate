"use client";

import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { DotIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MdDashboard } from "react-icons/md";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center">
      {/* Navbar */}
      <header className="w-full py-4 px-6 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">PaperCrate</h1>
        <nav className="space-x-4 flex items-center">
          <Link href="/features" className="hover:underline">
            Features
          </Link>
          <Link href="/pricing" className="hover:underline">
            Pricing
          </Link>
          <SignedOut>
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Go to Dashboard"
                  labelIcon={<MdDashboard />}
                  onClick={() => redirect("/dashboard")}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Text */}
          <div className="text-center lg:text-left w-full lg:w-1/2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Invoicing & Job Tracking Made Simple
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6">
              PaperCrate helps cleaners, contractors, and small business owners
              stay organized and get paid faster.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/sign-up"
                className="px-6 py-3 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition text-sm font-medium"
              >
                Start for Free
              </Link>
              <Link
                href="/sign-in"
                className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/hero.png"
              alt="PaperCrate illustration"
              width={500} // 👈 Set a fixed width
              height={500} // 👈 Set a fixed height (you can adjust this or use `layout="intrinsic"` if needed)
              className="w-[200px] sm:w-[250px] md:w-[300px] lg:w-[400px] xl:w-[500px]"
              priority // 👈 Optional: preload the image for better performance
            />
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { redirect } from "next/navigation";

const PublicNav = () => {
  return (
    <nav>
      <header className="w-full py-4 px-6 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">PaperCrate</h1>
        <nav className="space-x-4 flex items-center">
          {/* <Link href="/features" className="hover:underline">
            Features
          </Link>
          <Link href="/pricing" className="hover:underline">
            Pricing
          </Link> */}
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
    </nav>
  );
};

export default PublicNav;

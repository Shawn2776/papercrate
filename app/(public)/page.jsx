"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { Sparkles, Send, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-slate-100 px-6 py-12">
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Welcome to <span className="text-blue-600">PaperCrate.io</span>
        </h1>
        <p className="text-xl text-slate-600 mb-6">
          The easiest way to create, send, and track invoices for your business.
        </p>

        <Button className="text-lg px-8 py-6" size="lg" asChild>
          <SignUpButton redirecturl="/dashboard" />
        </Button>
      </section>

      <section className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="hover:shadow-xl transition-shadow">
          <CardContent className="p-6 text-center">
            <Send className="w-10 h-10 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Send Invoices Instantly
            </h3>
            <p className="text-gray-600">
              Generate professional invoices and send them to your customers in
              seconds.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="w-10 h-10 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Manage Customers</h3>
            <p className="text-gray-600">
              Add, view, and organize your clients with ease — all in one place.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-10 h-10 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Payments</h3>
            <p className="text-gray-600">
              Stay on top of what's paid, pending, or overdue at a glance.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

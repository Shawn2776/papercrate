"use client";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalError({ error, reset }) {
  const [showNote, setShowNote] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const backHref = isDashboard ? "/dashboard" : "/";

  useEffect(() => {
    const timeout1 = setTimeout(() => setShowNote(true), 2000);
    const timeout2 = setTimeout(() => reset(), 10000);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [reset]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 overflow-hidden px-4">
      <h1 className="text-5xl font-bold mb-4 animate-bounce">
        Something Went Wrong 😵‍💫
      </h1>
      <p className="text-lg mb-6 text-center">
        We hit a snag trying to load this page.
        <br />
        Retrying automatically in 10 seconds…
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={reset}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
        >
          🔁 Try Again Now
        </button>
        <Link
          href={backHref}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          🏠 Back to {isDashboard ? "Dashboard" : "Home"}
        </Link>
      </div>

      {/* Animated floating crate */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <div className="text-6xl animate-float">📦</div>
      </div>

      {/* Flying paper */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-xl animate-paperFlight">
          📄
        </div>
        <div className="absolute top-20 left-1/2 text-xl animate-paperFlight delay-200">
          📄
        </div>
        <div className="absolute top-36 right-20 text-xl animate-paperFlight delay-500">
          📄
        </div>
      </div>

      {/* Sticky note message */}
      {showNote && (
        <div className="absolute top-8 right-8 bg-yellow-100 border border-yellow-300 shadow p-2 rounded rotate-6">
          🧾 Something broke — but we’re working on it!
        </div>
      )}

      {/* Tailwind animations */}
      <style jsx>{`
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-paperFlight {
          animation: paperFlight 6s linear infinite;
        }

        @keyframes paperFlight {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}

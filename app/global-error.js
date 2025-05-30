"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      reset();
    }, 10000); // Retry after 10 seconds

    return () => clearTimeout(timer);
  }, [reset]);

  return (
    <html>
      <body className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-gray-700 mb-4">
            Something went wrong while loading the page.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            We’ll try again automatically in 10 seconds.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => reset()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Try Again Now
            </button>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

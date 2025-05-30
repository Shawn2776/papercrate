"use client";

export default function ErrorTestPage() {
  // Simulate an error when the component renders
  throw new Error("Test error for GlobalError");

  return <div>You won't see this text.</div>;
}

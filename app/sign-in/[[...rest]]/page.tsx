import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full mx-auto flex justify-center align-middle my-auto h-full pt-40">
      <SignIn redirectUrl="/dashboard" />
    </div>
  );
}

import StepOneBusinessType from "@/components/forms/new-user/StepOneBusinessType";

export default async function StepOnePage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-3xl mx-auto">
        <StepOneBusinessType />
      </div>
    </main>
  );
}

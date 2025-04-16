import StepFiveReviewSubmit from "@/components/forms/new-user/StepFiveReviewSubmit";

export default async function StepFivePage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-3xl mx-auto">
        <StepFiveReviewSubmit />
      </div>
    </main>
  );
}

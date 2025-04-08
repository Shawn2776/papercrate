export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="bg-white rounded-md shadow-xl p-8 max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-green-600">🎉 Success!</h1>
        <p className="text-gray-700 mb-6">
          Your business has been registered. You can now manage your dashboard,
          invite others, or set up products.
        </p>

        <div className="space-y-2">
          <a
            href="/dashboard"
            className="block w-full bg-primary text-white py-2 rounded hover:opacity-90"
          >
            Go to Dashboard
          </a>
          <a
            href="/profile"
            className="block w-full border py-2 rounded hover:bg-gray-50"
          >
            Manage Profile
          </a>
        </div>
      </div>
    </div>
  );
}

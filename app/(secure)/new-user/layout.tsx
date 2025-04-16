export default async function NewUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-3xl mx-auto">{children}</div>
    </main>
  ); // or a wrapper div if needed
}

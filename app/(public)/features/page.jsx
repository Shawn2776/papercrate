export default function FeaturesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Powerful Features, Built for Scale
        </h1>
        <p className="text-muted-foreground mt-2">
          Everything you need to streamline contracts, invoices, and business
          operations.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Multi-Tenant Support",
            desc: "Manage multiple businesses or clients under one account with complete separation.",
          },
          {
            title: "Role-Based Permissions",
            desc: "Full access control across users and organizations — platform and tenant-level.",
          },
          {
            title: "Invoice Customization",
            desc: "Flexible templates, tax options, discount handling, and auto-numbering.",
          },
          {
            title: "Real-Time Audit Logging",
            desc: "Track every action and change across your system for compliance and peace of mind.",
          },
          {
            title: "Inline Product & Customer Management",
            desc: "Add, edit, and search inline while creating invoices — no context switching.",
          },
          {
            title: "Upcoming: Goal Tracking & Budgeting",
            desc: "Set savings goals, manage categories, and track toward financial milestones.",
          },
        ].map(({ title, desc }) => (
          <div
            key={title}
            className="border p-6 rounded-2xl shadow-sm bg-background hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-1">{title}</h2>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

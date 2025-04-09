import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="w-full pb-10">
      <header className="bg-secondary text-primary-foreground text-center p-10 items-center flex flex-col w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
          Provacy Policy
        </h1>
        <p className="text-sm md:text-xl">
          Please read this agreement carefully before using this service.
        </p>
      </header>
      <main className="p-1 md:max-w-3xl mx-auto text-sm">
        <p>
          <em>Last Updated: 4/8/2025</em>
        </p>
        <section className="px-10 mx-auto flex flex-col gap-1 text-xs">
          <ul className="list-disc list-inside">
            <li>
              1. No Data Selling. Ever. We do not sell, share, or trade your
              personal information with anyone. Period. Not now. Not ever.
            </li>
            <li>
              2. Minimal Data Collection We only collect the information
              that&apos;s absolutely necessary to make the site or service work
              — like your email if you choose to sign up. No tracking. No hidden
              data collection. No creepy stuff.
            </li>
            <li>
              3. No Third-Party Ads We don&apos;t run ads and we don&apos;t use
              any ad networks that track you. Your data stays between you and
              us.
            </li>
            <li>
              4. Cookies? Only If We Need Them We may use essential cookies to
              keep things running smoothly (like remembering that you&apos;re
              signed in). We do not use cookies to track you across the
              internet.
            </li>
            <li>
              5. Your Data, Your Choice You can ask us to delete your account
              and your data at any time. Just reach out — we&apos;ll take care
              of it.
            </li>
            <li>
              6. Secure by Default We use industry-standard security practices
              to protect any information you give us. Everything is encrypted
              and stored safely.
            </li>
            <li>
              7. Contact Us Have questions or concerns? Contact us at{" "}
              <Link href="mailto:webdev2776@gmail.com">
                webdev2776@gmail.com
              </Link>
              .
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

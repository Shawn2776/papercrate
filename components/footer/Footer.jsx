export default function Footer() {
  return (
    <footer className="mt-24 border-t pt-6 text-center text-sm text-gray-500 pb-10">
      <div className="mb-2">&copy; {new Date().getFullYear()} PaperCrate. All rights reserved.</div>
      <div className="space-x-4">
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
        <a href="/terms" className="hover:underline">
          Terms of Service
        </a>
        <a href="/contact" className="hover:underline">
          Contact
        </a>
      </div>
    </footer>
  );
}

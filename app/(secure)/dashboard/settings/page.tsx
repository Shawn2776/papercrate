"use client";

// app/dashboard/settings/page.tsx
import dynamic from "next/dynamic";

const SettingsTabs = dynamic(() => import("./tabs"), { ssr: false });

export default function SettingsPage() {
  return <SettingsTabs />;
}

"use client";

import { useEffect, useState } from "react";

export default function PermissionSelector({
  selected = [],
  onChange,
}: {
  selected?: string[];
  onChange: (val: string[]) => void;
}) {
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/enums/permissions")
      .then((res) => res.json())
      .then(setPermissions);
  }, []);

  const toggle = (perm: string) => {
    const updated = selected.includes(perm)
      ? selected.filter((p) => p !== perm)
      : [...selected, perm];
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {permissions.map((perm) => (
        <label key={perm} className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(perm)}
            onChange={() => toggle(perm)}
          />
          <span>{perm}</span>
        </label>
      ))}
    </div>
  );
}

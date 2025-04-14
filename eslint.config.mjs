import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ✅ Assign to variable first
const config = [
  {
    ignores: ["node_modules/**", "app/generated/prisma/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      // You can optionally add other rules here
      // "@typescript-eslint/no-this-alias": "off",
      // "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];

// ✅ Export the variable
export default config;

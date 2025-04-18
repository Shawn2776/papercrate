import { Permission } from "@prisma/client";
import { useAppSelector } from "@/lib/redux/hooks";

export const useHasPermission = (
  perm: Permission | Permission[],
  mode: "all" | "any" = "all"
): boolean => {
  const { permissions } = useAppSelector((state) => state.auth);

  if (!permissions) return false;

  if (Array.isArray(perm)) {
    return mode === "all"
      ? perm.every((p) => permissions.includes(p))
      : perm.some((p) => permissions.includes(p));
  }

  return permissions.includes(perm);
};

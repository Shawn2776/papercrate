import { Permission } from "@prisma/client";
import { useAppSelector } from "../redux/hooks";

export const useHasPermission = (perm: Permission | Permission[]) => {
  const { permissions } = useAppSelector((state) => state.auth);

  if (Array.isArray(perm)) return perm.every((p) => permissions.includes(p));
  return permissions.includes(perm);
};

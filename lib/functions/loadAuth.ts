import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { AppDispatch } from "@/lib/redux/store";
import { setAuth } from "@/lib/redux/slices/authSlice";

export async function loadAuthState(dispatch: AppDispatch) {
  try {
    const user = await currentUser();
    if (!user) {
      dispatch(
        setAuth({
          role: null,
          permissions: [],
          loading: false,
          hasTenant: false,
        })
      );
      return;
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { memberships: true },
    });

    if (!dbUser) {
      dispatch(
        setAuth({
          role: null,
          permissions: [],
          loading: false,
          hasTenant: false,
        })
      );
      return;
    }

    const allPermissions = dbUser.memberships.flatMap((m) => m.permissions);
    const hasTenant = dbUser.memberships.length > 0;

    dispatch(
      setAuth({
        role: dbUser.role,
        permissions: allPermissions,
        loading: false,
        hasTenant,
      })
    );
  } catch (err) {
    dispatch(
      setAuth({ role: null, permissions: [], loading: false, hasTenant: false })
    );
  }
}

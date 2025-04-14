// app/admin/users/page.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchAdminUsers,
  restoreUser,
  softDeleteUser,
  hardDeleteUser,
  selectAdminUsers,
  setFilter,
  setPage,
  updateUser,
} from "@/lib/redux/slices/adminUsersSlice";
import { useState } from "react";
import { ClipboardCopy, Slash, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminUsersPage() {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showUserIds, setShowUserIds] = useState<Record<string, boolean>>({});

  const [editValues, setEditValues] = useState<{ name: string; role: string }>({
    name: "",
    role: "SUPPORT",
  });
  const [deletingUser, setDeletingUser] = useState<null | {
    id: string;
    name?: string;
    deleted: boolean;
  }>(null);

  const dispatch = useAppDispatch();
  const { users, loading, error, filter, page, pageSize, total } =
    useAppSelector(selectAdminUsers);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch, filter, page, pageSize]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Users</h1>

      <div className="flex gap-2">
        {["active", "deleted", "all"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            onClick={() => dispatch(setFilter(f as typeof filter))}
          >
            {f.toUpperCase()}
          </Button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Card>
          <CardContent className="p-4 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b text-sm font-medium text-muted-foreground">
                  <th className="p-2 w-[4%]">ID</th>
                  <th className="p-2 w-[20%]">Name</th>
                  <th className="p-2 w-[25%]">Email</th>
                  <th className="p-2 w-[10%]">Role</th>
                  <th className="p-2 w-[25%]">Tenants</th>
                  <th className="p-2 w-[10%]">Status</th>
                  <th className="p-2 text-right w-[10%]">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isEditing = editingUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className={`border-b transition-colors ${
                        isEditing ? "bg-muted/30" : "hover:bg-muted/10"
                      }`}
                    >
                      {/* ID */}
                      <td className="p-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={async () => {
                                  await navigator.clipboard.writeText(user.id);
                                  toast.success("Copied user ID");
                                }}
                                className="text-muted-foreground hover:text-foreground p-1"
                              >
                                <ClipboardCopy className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy User ID</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>

                      {/* Name */}
                      <td className="p-2">
                        {isEditing ? (
                          <input
                            value={editValues.name}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full border rounded px-2 py-1 text-sm"
                          />
                        ) : (
                          user.name || "—"
                        )}
                      </td>

                      {/* Email */}
                      <td className="p-2">{user.email}</td>

                      {/* Role */}
                      <td className="p-2">
                        {isEditing ? (
                          <select
                            value={editValues.role}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                role: e.target.value,
                              }))
                            }
                            className="w-full border rounded px-2 py-1 text-sm"
                          >
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            <option value="SUPPORT">SUPPORT</option>
                            <option value="DEVELOPER">DEVELOPER</option>
                          </select>
                        ) : (
                          user.role
                        )}
                      </td>

                      {/* Tenant memberships */}
                      <td className="p-2 text-sm leading-5">
                        <div className="flex flex-wrap gap-2">
                          {user.memberships.length === 0 ? (
                            <span className="text-muted-foreground italic">
                              None
                            </span>
                          ) : (
                            user.memberships.map((m, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs font-medium"
                              >
                                {m.tenantName}
                                <span className="ml-1 text-muted-foreground">
                                  ({m.role})
                                </span>
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-2">
                        <span
                          className={`font-medium ${
                            user.deleted ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {user.deleted ? "Deleted" : "Active"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  dispatch(
                                    updateUser({
                                      id: user.id,
                                      data: editValues,
                                    })
                                  );
                                  setEditingUserId(null);
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingUserId(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  setEditingUserId(user.id);
                                  setEditValues({
                                    name: user.name || "",
                                    role: user.role,
                                  });
                                }}
                              >
                                Edit
                              </Button>

                              {user.isTenantOwner ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="relative group inline-flex hover:cursor-pointer">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        disabled
                                        className="p-2 group-hover:ring-2 group-hover:ring-red-500 group-hover:ring-offset-2 cursor-not-allowed"
                                      >
                                        <Trash2 className="text-muted-foreground" />
                                      </Button>
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    Tenant owners cannot be deleted
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setDeletingUser(user)}
                                  className="hover:cursor-pointer"
                                >
                                  <Trash2 />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {users.length} of {total}
              </p>
              <div className="space-x-2">
                <Button
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => dispatch(setPage(page - 1))}
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  disabled={page * pageSize >= total}
                  onClick={() => dispatch(setPage(page + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 max-w-sm w-full space-y-4">
            <h2 className="text-lg font-semibold">
              {deletingUser.deleted
                ? "Permanently Delete User?"
                : "Soft Delete User?"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to{" "}
              {deletingUser.deleted ? "permanently delete" : "soft delete"}{" "}
              <span className="font-medium">
                {deletingUser.name || "this user"}
              </span>
              ?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setDeletingUser(null)}>
                Cancel
              </Button>
              <Button
                variant={deletingUser.deleted ? "destructive" : "default"}
                onClick={() => {
                  if (deletingUser.deleted) {
                    dispatch(hardDeleteUser(deletingUser.id));
                  } else {
                    dispatch(softDeleteUser(deletingUser.id));
                  }
                  setDeletingUser(null);
                }}
              >
                {deletingUser.deleted
                  ? "Yes, Permanently Delete"
                  : "Yes, Soft Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

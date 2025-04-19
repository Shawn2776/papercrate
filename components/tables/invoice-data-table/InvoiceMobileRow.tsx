"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Permission } from "@prisma/client";

type Props = {
  id: string;
  status: string;
  customer: string;
  amount: string;
  userPermissions: Permission[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  expanded: boolean;
  toggleExpand: () => void;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "text-green-600 border-green-600";
    case "overdue":
      return "text-red-600 border-red-600";
    case "pending":
      return "text-yellow-600 border-yellow-600";
    default:
      return "text-blue-600 border-blue-600";
  }
};

// Dynamically import swipeable components only when needed
const SwipeableList = dynamic(
  () => import("react-swipeable-list").then((mod) => mod.SwipeableList),
  { ssr: false }
);
const SwipeableListItem = dynamic(
  () => import("react-swipeable-list").then((mod) => mod.SwipeableListItem),
  { ssr: false }
);
const SwipeAction = dynamic(
  () => import("react-swipeable-list").then((mod) => mod.SwipeAction),
  { ssr: false }
);
const TrailingActions = dynamic(
  () => import("react-swipeable-list").then((mod) => mod.TrailingActions),
  { ssr: false }
);

export function InvoiceMobileRow({
  id,
  status,
  customer,
  amount,
  userPermissions,
  onEdit,
  onDelete,
  expanded,
  toggleExpand,
}: Props) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const canEdit = userPermissions.includes(Permission.EDIT_INVOICE);
  const canDelete = userPermissions.includes(Permission.DELETE_INVOICE);

  const fallback = (
    <div
      className="w-full flex items-center justify-between my-3 px-2"
      onClick={toggleExpand}
      data-mobile-summary
    >
      <div className="w-full flex flex-col">
        <Badge
          variant="outline"
          className={`capitalize text-lg px-2 py-0.5 ${getStatusColor(status)}`}
        >
          {status}
        </Badge>
        <div className="text-muted-foreground text-lg font-medium truncate">
          {customer}
        </div>
      </div>
      <div className="w-full text-right text-xl font-semibold">{amount}</div>
    </div>
  );

  if (!isTouchDevice) return fallback;

  return (
    <SwipeableList threshold={0.25} fullSwipe={false}>
      <SwipeableListItem
        trailingActions={
          <TrailingActions>
            {canEdit && (
              <SwipeAction onClick={() => onEdit(id)}>
                <div className="flex items-center justify-center h-full px-4 bg-blue-600 text-white font-medium">
                  Edit
                </div>
              </SwipeAction>
            )}
            {canDelete && (
              <SwipeAction
                destructive
                onClick={() => {
                  if (confirm("Delete this invoice?")) onDelete(id);
                }}
              >
                <div className="flex items-center justify-center h-full px-4 bg-red-600 text-white font-medium">
                  Delete
                </div>
              </SwipeAction>
            )}
          </TrailingActions>
        }
      >
        {fallback}
      </SwipeableListItem>
    </SwipeableList>
  );
}

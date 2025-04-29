// components/ColumnVisibilityMenu.jsx
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnKey, useColumnVisibility } from "@/hooks/useColumnVisibility";
import { SlidersHorizontal } from "lucide-react";

export function ColumnVisibilityMenu({
  tableKey,
  allColumns,
  defaultVisible,
  labels = {},
}) {
  const { isVisible, toggleColumn } = useColumnVisibility(
    tableKey,
    defaultVisible
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto flex items-center gap-1"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {allColumns.map((key) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={isVisible(key)}
            onCheckedChange={() => toggleColumn(key)}
          >
            {labels[key] || key}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

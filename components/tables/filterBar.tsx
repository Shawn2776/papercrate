"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  action: string;
  onActionChange: (value: string) => void;
  entity: string;
  onEntityChange: (value: string) => void;
  user: string;
  onUserChange: (value: string) => void;
  field: string;
  onFieldChange: (value: string) => void;
  actions: string[];
  entities: string[];
  users: string[];
  fields: string[];
  onReset: () => void;
  onExport: (type: "json" | "csv") => void;
  onSave: (type: "pdf" | "print") => void;
}

export function FilterBar({
  search,
  onSearchChange,
  action,
  onActionChange,
  entity,
  onEntityChange,
  user,
  onUserChange,
  field,
  onFieldChange,
  actions,
  entities,
  users,
  fields,
  onReset,
  onExport,
  onSave,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Input
          placeholder="Search logs..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-[200px]"
        />

        <select
          value={action}
          onChange={(e) => onActionChange(e.target.value)}
          className="text-sm border rounded p-2"
        >
          <option value="">Action</option>
          {actions.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>

        <select
          value={entity}
          onChange={(e) => onEntityChange(e.target.value)}
          className="text-sm border rounded p-2"
        >
          <option value="">Entity</option>
          {entities.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <select
          value={user}
          onChange={(e) => onUserChange(e.target.value)}
          className="text-sm border rounded p-2"
        >
          <option value="">User</option>
          {users.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>

        <select
          value={field}
          onChange={(e) => onFieldChange(e.target.value)}
          className="text-sm border rounded p-2"
        >
          <option value="">Field</option>
          {fields.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>

        <Button size="sm" variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="flex gap-2">
        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport("json")}>
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("csv")}>
              Export CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Save */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Save
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSave("pdf")}>
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSave("print")}>
              Print Table
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

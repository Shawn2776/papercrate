"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchAdminEnums,
  selectAdminEnums,
  updateEnumValue,
} from "@/lib/redux/slices/adminEnumsSlice";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

type EnumGroupName =
  | "role"
  | "tenantRole"
  | "permission"
  | "invoiceStatus"
  | "paymentType"
  | "productIdentifierType"
  | "planTier";

const descriptions: Record<EnumGroupName, Record<string, string>> = {
  role: {
    SUPER_ADMIN: "Full platform access",
    ADMIN: "Tenant-level administrator",
    SUPPORT: "Support team access",
    DEVELOPER: "Developer access",
  },
  tenantRole: {
    OWNER: "Owns the business data",
    ADMIN: "Manages users and settings",
    VIEWER: "Read-only access",
  },
  permission: {
    VIEW_TENANT_SETTINGS: "Allows viewing tenant config",
    ASSIGN_ROLES: "Grants ability to assign roles to users",
  },
  invoiceStatus: {},
  paymentType: {},
  productIdentifierType: {},
  planTier: {},
};

export default function EnumDashboard() {
  const dispatch = useAppDispatch();
  const { enums, error, loading } = useAppSelector(selectAdminEnums);
  const [activeTab, setActiveTab] = useState<EnumGroupName>("role");
  const [editMode, setEditMode] = useState<EnumGroupName | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (
      Object.keys(enums).every(
        (key) => Object.keys(enums[key as EnumGroupName]).length === 0
      )
    ) {
      dispatch(fetchAdminEnums());
    }
  }, [dispatch, enums]);

  const handleEditClick = (group: EnumGroupName) => {
    setEditMode(group);
    setDrafts({ ...enums[group] }); // clone values
  };

  const handleCancel = () => {
    setEditMode(null);
    setDrafts({});
  };

  const handleSave = () => {
    if (editMode) {
      Object.entries(drafts).forEach(([original, updated]) => {
        if (original !== updated) {
          dispatch(
            updateEnumValue({
              group: editMode,
              oldValue: original,
              newValue: updated,
            })
          );
        }
      });
    }
    setEditMode(null);
    setDrafts({});
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Enum Explorer</h2>
      {loading && <p className="text-muted-foreground">Loading enums...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as EnumGroupName)}
      >
        <TabsList className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(enums) as EnumGroupName[]).map((key) => (
            <TabsTrigger key={key} value={key}>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())}
            </TabsTrigger>
          ))}
        </TabsList>

        {(
          Object.entries(enums) as [EnumGroupName, Record<string, string>][]
        ).map(([group, values]) => (
          <TabsContent key={group} value={group}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold capitalize">
                {group.replace(/([A-Z])/g, " $1")}
              </h3>
              {editMode === group ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleEditClick(group)}
                >
                  Edit
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(values).map(([value, display]) => {
                const tooltip = descriptions[group]?.[value];

                return (
                  <Card key={value}>
                    <CardContent className="p-4 space-y-1">
                      <Label
                        htmlFor={`enum-${group}-${value}`}
                        className="sr-only"
                      >
                        {value}
                      </Label>

                      {editMode === group ? (
                        <Input
                          id={`enum-${group}-${value}`}
                          value={drafts[value] ?? display}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [value]: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-base font-medium cursor-default">
                              {display}
                            </div>
                          </TooltipTrigger>
                          {tooltip && (
                            <TooltipContent>{tooltip}</TooltipContent>
                          )}
                        </Tooltip>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

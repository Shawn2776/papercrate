import {
  selectSelectedTenant,
  selectExpandedTenantData,
  clearSelectedTenant,
} from "@/lib/redux/slices/adminTenantsSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Clipboard,
  Mail,
  Phone,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AdminUser } from "@/lib/redux/slices/adminUsersSlice";

interface AdminUserWithTenantRole extends AdminUser {
  tenantRole?: string;
}

interface AdminTenantWithDetails {
  id: string;
  name: string;
  email?: string;
  website?: string;
  supportEmail?: string;
  deleted: boolean;
  plan: string;
  createdAt: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
}

export function TenantDetailCard() {
  const dispatch = useDispatch();
  const tenant = useSelector(
    selectSelectedTenant
  ) as AdminTenantWithDetails | null;
  const detail = useSelector(selectExpandedTenantData);
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!tenant || !detail) return null;

  const toggle = (section: string) =>
    setOpenSection((prev) => (prev === section ? null : section));

  const users = detail.users as AdminUserWithTenantRole[];
  const owner = users.find((u) => u.tenantRole === "OWNER");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-4xl font-extrabold flex justify-between">
          <span className="flex gap-2 items-center">{tenant.name}</span>
          <span
            className={`px-2 py-1 text-white shadow ${
              tenant.deleted ? "bg-red-700" : "bg-green-700"
            }`}
          >
            {tenant.deleted ? "DELETED" : "ACTIVE"}
          </span>
        </CardTitle>
        <CardDescription>
          <div className="flex justify-between text-sm mt-2">
            <div className="leading-snug">
              {tenant.addressLine1 || "123 Example St."}
              <br />
              {tenant.city || "Example City"}, {tenant.state || "ST"}{" "}
              {tenant.zip || "12345"}
              <div className="mt-2 space-y-1">
                <p className="flex items-center gap-2">
                  <Phone size={15} />
                  <a href={`tel:${tenant.phone || "555-555-5555"}`}>
                    {tenant.phone || "555-555-5555"}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Globe size={15} />
                  <a href={`https://${tenant.website || "tenantdomain.com"}`}>
                    {tenant.website || "tenantdomain.com"}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={15} />
                  <a
                    href={`mailto:${
                      tenant.email || "support@tenantdomain.com"
                    }`}
                  >
                    {tenant.email || "support@tenantdomain.com"}
                  </a>
                </p>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <div className="text-sm">Owner:</div>
                <Button variant="outline" className="rounded-none shadow">
                  {owner?.name ?? owner?.email ?? "Unknown Owner"}
                </Button>
              </div>
            </div>
            <div className="text-right space-y-2">
              <Button variant="outline" className="rounded-none shadow">
                {tenant.plan}
              </Button>
            </div>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Collapsible open={openSection === "users"}>
          <CollapsibleTrigger
            onClick={() => toggle("users")}
            className="font-bold text-2xl w-full flex justify-between items-center"
          >
            USERS
            <div className="flex items-center gap-2">
              <span className="font-normal text-xl">
                ({users.filter((u) => u.tenantRole !== "OWNER").length})
              </span>
              {openSection === "users" ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {users
              .filter((u) => u.tenantRole !== "OWNER")
              .map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center border p-2"
                >
                  <span className="flex items-center gap-2">
                    <Clipboard size={14} className="text-gray-500" />
                    {user.name ?? user.email}
                  </span>
                  <Badge variant={user.deleted ? "destructive" : "default"}>
                    {user.deleted ? "Deleted" : "Active"}
                  </Badge>
                </div>
              ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="rounded-none"
          onClick={() => dispatch(clearSelectedTenant())}
        >
          Close
        </Button>
        <Button variant="destructive" className="rounded-none">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

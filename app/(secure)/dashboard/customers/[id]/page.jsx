"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CustomerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [original, setOriginal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
        setOriginal(data);
      });
  }, [id]);

  const handleSave = async () => {
    const res = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      }),
    });

    if (res.ok) {
      setIsEditing(false);
      setOriginal(customer);
    }
  };

  const handleCancel = () => {
    setCustomer(original);
    setIsEditing(false);
  };

  if (!customer) return <p className="p-4">Loading customer...</p>;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const created = new Date(customer.createdAt);
  const updated = new Date(customer.updatedAt);
  const hasBeenUpdated = created.getTime() !== updated.getTime();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Link href="/dashboard/customers" className="inline-block mb-4">
        <Button variant="ghost" className="rounded-none">
          <ChevronLeft /> Back to Customers
        </Button>
      </Link>

      <Card className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center rounded-none">
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-white">
            {initials}
          </div>
          <Badge
            variant={customer.deleted ? "destructive" : "default"}
            className="text-xs"
          >
            {customer.deleted ? "Deleted" : "Active"}
          </Badge>
        </div>

        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <Input
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                className="text-xl font-bold"
              />
            ) : (
              <h2 className="text-xl font-bold">{customer.name}</h2>
            )}
            <div className="space-x-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Button
                    className="rounded-none"
                    size="sm"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    className="rounded-none"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  className="rounded-none"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
            <EditableField
              label="Email"
              value={customer.email}
              isEditing={isEditing}
              onChange={(val) => setCustomer({ ...customer, email: val })}
            />
            <EditableField
              label="Phone"
              value={formatPhone(customer.phone)}
              rawValue={customer.phone}
              isEditing={isEditing}
              onChange={(val) => setCustomer({ ...customer, phone: val })}
            />
            <EditableField
              label="Address"
              value={customer.address}
              isEditing={isEditing}
              multiline
              onChange={(val) => setCustomer({ ...customer, address: val })}
            />
            <div>
              <span className="text-muted-foreground block">Created</span>
              <span>
                {created.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {hasBeenUpdated && (
              <div>
                <span className="text-muted-foreground block">Updated</span>
                <span>
                  {updated.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  isEditing,
  multiline,
  rawValue,
}) {
  return (
    <div>
      <span className="text-muted-foreground block">{label}</span>
      {isEditing ? (
        multiline ? (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        ) : (
          <Input
            value={rawValue || value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        )
      ) : (
        <span className="whitespace-pre-wrap">
          {value || <em className="text-muted">N/A</em>}
        </span>
      )}
    </div>
  );
}

function formatPhone(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length !== 10) return phone || "";
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { ChevronLeft } from "lucide-react";
// import Link from "next/link";

// export default function CustomerPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [customer, setCustomer] = useState(null);
//   const [original, setOriginal] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     fetch(`/api/customers/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setCustomer(data);
//         setOriginal(data);
//       });
//   }, [id]);

//   const handleSave = async () => {
//     const res = await fetch(`/api/customers/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         id: customer.id,
//         name: customer.name,
//         email: customer.email,
//         phone: customer.phone,
//         address: customer.address,
//       }),
//     });

//     if (res.ok) {
//       setIsEditing(false);
//       setOriginal(customer);
//     }
//   };

//   const handleCancel = () => {
//     setCustomer(original);
//     setIsEditing(false);
//   };

//   if (!customer) return <p className="p-4">Loading customer...</p>;

//   return (
//     <div className="max-w-xl mx-auto p-6 space-y-4">
//       <Link href="/dashboard/customers" className="inline-block mb-4">
//         <Button variant="ghost" className="rounded-none">
//           <ChevronLeft /> Back to Customers
//         </Button>
//       </Link>

//       <Card className="rounded-none shadow-sm hover:shadow-md transition overflow-hidden">
//         <CardHeader className="relative bg-muted py-6">
//           <div>
//             <CardTitle className="text-2xl font-bold mb-1">
//               {isEditing ? (
//                 <Input
//                   value={customer.name}
//                   onChange={(e) =>
//                     setCustomer({ ...customer, name: e.target.value })
//                   }
//                   required
//                 />
//               ) : (
//                 customer.name
//               )}
//             </CardTitle>

//             <CardDescription className="text-base">
//               {isEditing ? (
//                 <Input
//                   value={customer.email || ""}
//                   onChange={(e) =>
//                     setCustomer({ ...customer, email: e.target.value })
//                   }
//                 />
//               ) : (
//                 customer.email || <em className="text-muted">No Email</em>
//               )}
//             </CardDescription>
//           </div>

//           {!isEditing && (
//             <Button
//               variant="outline"
//               size="sm"
//               className="absolute top-4 right-4 text-xs"
//               onClick={() => setIsEditing(true)}
//             >
//               Edit
//             </Button>
//           )}
//         </CardHeader>

//         <CardContent className="space-y-4 pt-4">
//           <DetailRow
//             label="Phone"
//             value={customer.phone}
//             isEditing={isEditing}
//             onChange={(val) => setCustomer({ ...customer, phone: val })}
//             formatter={formatPhone}
//           />

//           <DetailRow
//             label="Address"
//             value={customer.address}
//             isEditing={isEditing}
//             onChange={(val) => setCustomer({ ...customer, address: val })}
//             multiline
//           />

//           <div className="flex justify-between text-sm">
//             <span className="text-muted-foreground font-medium">Status</span>
//             <span
//               className={`font-medium ${
//                 customer.deleted ? "text-red-500" : "text-green-600"
//               }`}
//             >
//               {customer.deleted ? "Deleted" : "Active"}
//             </span>
//           </div>

//           <div className="flex justify-between text-sm">
//             <span className="text-muted-foreground font-medium">Created</span>
//             <span>{formatDate(customer.createdAt)}</span>
//           </div>

//           <div className="flex justify-between text-sm">
//             <span className="text-muted-foreground font-medium">Updated</span>
//             <span>{formatDate(customer.updatedAt)}</span>
//           </div>

//           {isEditing && (
//             <div className="flex justify-end gap-2 pt-4">
//               <Button onClick={handleSave}>Save</Button>
//               <Button variant="outline" onClick={handleCancel}>
//                 Cancel
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function DetailRow({
//   label,
//   value,
//   isEditing,
//   onChange,
//   multiline = false,
//   formatter,
// }) {
//   const displayValue = formatter ? formatter(value) : value;

//   return (
//     <div className="flex justify-between items-start text-sm gap-2">
//       <span className="text-muted-foreground font-medium">{label}</span>
//       {isEditing ? (
//         multiline ? (
//           <Textarea
//             value={value || ""}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-2/3 text-right"
//           />
//         ) : (
//           <Input
//             value={value || ""}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-2/3 text-right"
//           />
//         )
//       ) : (
//         <span className="text-right whitespace-pre-wrap w-2/3">
//           {displayValue || <em className="text-muted">N/A</em>}
//         </span>
//       )}
//     </div>
//   );
// }

// function formatPhone(phone) {
//   const digits = (phone || "").replace(/\D/g, "");
//   if (digits.length !== 10) return phone || "";
//   return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
// }

// function formatDate(date) {
//   return new Date(date).toLocaleString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "numeric",
//     minute: "2-digit",
//   });
// }

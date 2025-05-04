"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [original, setOriginal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setService(data);
        setOriginal(data);
      });
  }, [id]);

  const handleSave = async () => {
    const res = await fetch("/api/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: service.id,
        name: service.name,
        description: service.description,
        rate: service.rate,
        unit: service.unit,
      }),
    });

    if (res.ok) {
      setIsEditing(false);
      setOriginal(service);
    }
  };

  const handleCancel = () => {
    setService(original);
    setIsEditing(false);
  };

  if (!service) return <p className="p-4">Loading service...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Link href="/dashboard/services" className="inline-block mb-4">
        <Button variant="ghost" className="rounded-none">
          <ChevronLeft /> Back to Services
        </Button>
      </Link>
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
        {/* Header image / emoji */}
        <div className="relative h-36 bg-muted flex items-center justify-center text-6xl">
          <span role="img" aria-label="service">
            {service.emoji || "🥤"}
          </span>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="absolute top-3 right-3 text-xs"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            {isEditing ? (
              <Input
                value={service.name}
                onChange={(e) =>
                  setService({ ...service, name: e.target.value })
                }
                required
              />
            ) : (
              service.name
            )}
          </CardTitle>
          <CardDescription>
            {isEditing ? (
              <Input
                value={service.description || ""}
                onChange={(e) =>
                  setService({ ...service, description: e.target.value })
                }
              />
            ) : (
              service.description || (
                <em className="text-muted">No description</em>
              )
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Rate */}
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Rate</span>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={service.rate || 0}
                onChange={(e) =>
                  setService({
                    ...service,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-24 text-right"
              />
            ) : (
              <span className="text-right font-medium text-green-600">
                ${Number(service.rate).toFixed(2)}
              </span>
            )}
          </div>

          {/* Unit */}
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Unit</span>
            {isEditing ? (
              <Input
                value={service.unit}
                onChange={(e) =>
                  setService({ ...service, unit: e.target.value })
                }
                className="w-24 text-right"
              />
            ) : (
              <span className="text-right">{service.unit}</span>
            )}
          </div>

          {/* Save / Cancel */}
          {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/lib/redux/slices/customersSlice";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowBigLeft } from "lucide-react";

export default function NewCustomerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await dispatch(
      createCustomer({ name, email, phone, address })
    );

    setLoading(false);

    if (createCustomer.fulfilled.match(result)) {
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      router.push("/dashboard");
    } else {
      console.error("Customer creation failed:", result.payload);
    }
  };

  return (
    <>
      <Button onClick={handleCancel} variant="outline" className="max-w-fit">
        <ArrowBigLeft />
        Cancel
      </Button>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Add New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Create Customer"}
            </Button>
            {success && (
              <p className="text-green-600 text-sm mt-2">Customer created!</p>
            )}
          </form>
        </CardContent>
      </Card>
    </>
  );
}

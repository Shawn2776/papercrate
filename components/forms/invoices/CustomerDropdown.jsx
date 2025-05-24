"use client";

import { useState } from "react";
import CustomerModal from "./CustomerModal";

const CustomerDropdown = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const customers = [
    { id: "1", name: "Jane Doe", email: "jane@example.com" },
    { id: "2", name: "Acme Corp", email: "billing@acme.com" },
  ];

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowModal(true);
      setSelectedCustomer(""); // Reset selection
    } else {
      setSelectedCustomer(value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">Select a Customer</label>
      <select
        value={selectedCustomer}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">-- Choose Customer --</option>
        <option value="new">+ Add New Customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} ({customer.email})
          </option>
        ))}
      </select>

      {showModal && <CustomerModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default CustomerDropdown;

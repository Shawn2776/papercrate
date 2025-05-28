"use client";

import { useState } from "react";
import CustomerModal from "@/components/forms/invoices/modals/CustomerModal";
import { useSelector } from "react-redux";

const CustomerDropdown = ({ customerId, setCustomerId }) => {
  const [showModal, setShowModal] = useState(false);
  const customers = useSelector((state) => state.customers.items);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowModal(true);
      setCustomerId(null);
    } else {
      setCustomerId(value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">Select a Customer</label>
      <select
        value={customerId || ""}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="">-- Choose Customer --</option>
        <option value="new">+ Add New Customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} ({customer.email})
          </option>
        ))}
      </select>

      {showModal && (
        <CustomerModal
          onClose={() => setShowModal(false)}
          onSave={(newCustomer) => {
            setCustomerId(newCustomer.id);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CustomerDropdown;

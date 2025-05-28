import React from "react";

const ManualCustomerForm = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block font-medium">Name</label>
        <input
          className="w-full border p-2 rounded"
          placeholder="Customer Name"
        />
      </div>
      <div>
        <label className="block font-medium">Email</label>
        <input
          className="w-full border p-2 rounded"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label className="block font-medium">Phone</label>
        <input
          className="w-full border p-2 rounded"
          placeholder="(555) 555-5555"
        />
      </div>
      <div>
        <label className="block font-medium">Company</label>
        <input className="w-full border p-2 rounded" placeholder="Optional" />
      </div>
    </div>
  );
};

export default ManualCustomerForm;

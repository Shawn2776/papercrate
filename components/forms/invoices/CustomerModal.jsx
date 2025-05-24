import React from "react";

const CustomerModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Add New Customer</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Fields */}
          <input placeholder="Name" className="border p-2 rounded" />
          <input placeholder="Email" className="border p-2 rounded" />
          <input placeholder="Phone" className="border p-2 rounded" />
          <input placeholder="Company" className="border p-2 rounded" />

          {/* Billing */}
          <input
            placeholder="Billing Address Line 1"
            className="border p-2 rounded"
          />
          <input
            placeholder="Billing Address Line 2"
            className="border p-2 rounded"
          />
          <input placeholder="Billing City" className="border p-2 rounded" />
          <input placeholder="Billing State" className="border p-2 rounded" />
          <input
            placeholder="Billing Postal Code"
            className="border p-2 rounded"
          />
          <input placeholder="Billing Country" className="border p-2 rounded" />

          {/* Shipping (you can prefill with billing if needed later) */}
          <input
            placeholder="Shipping Address Line 1"
            className="border p-2 rounded"
          />
          <input
            placeholder="Shipping Address Line 2"
            className="border p-2 rounded"
          />
          <input placeholder="Shipping City" className="border p-2 rounded" />
          <input placeholder="Shipping State" className="border p-2 rounded" />
          <input
            placeholder="Shipping Postal Code"
            className="border p-2 rounded"
          />
          <input
            placeholder="Shipping Country"
            className="border p-2 rounded"
          />

          {/* Notes */}
          <textarea
            placeholder="Notes"
            className="col-span-2 border p-2 rounded"
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Submit logic here
              onClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;

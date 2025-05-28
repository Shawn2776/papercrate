"use client";

import { useState } from "react";

export default function LineItemModal({ onClose, onSave }) {
  const [type, setType] = useState("product"); // 'product' or 'service'
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("item");
  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = () => {
    const item = {
      name,
      description,
      unit,
      rate: parseFloat(rate),
      quantity: type === "product" ? quantity : 1,
      type,
    };
    onSave(item);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold mb-2">
          Add {type === "product" ? "Product" : "Service"}
        </h2>

        <div className="flex space-x-2 mb-2">
          <button
            onClick={() => setType("product")}
            className={`px-3 py-1 rounded ${
              type === "product" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Product
          </button>
          <button
            onClick={() => setType("service")}
            className={`px-3 py-1 rounded ${
              type === "service" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Service
          </button>
        </div>

        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {type === "product" && (
          <input
            className="w-full border p-2 rounded"
            placeholder="Quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        )}

        <input
          className="w-full border p-2 rounded"
          placeholder="Unit (e.g. item, hour)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Rate"
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

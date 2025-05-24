import { useState } from "react";
import LineItemModal from "./LineItemModal";

export function LineItemsSection({ items, setItems }) {
  const [showModal, setShowModal] = useState(false);

  const handleAddItem = (item) => {
    setItems([...items, item]);
    setShowModal(false);
  };

  const handleRemoveItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const productsAndServices = [
    { id: "1", name: "Website Design", rate: 500, unit: "service" },
    { id: "2", name: "Hosting", rate: 50, unit: "month" },
  ];

  return (
    <div className="space-y-2 border p-4 rounded">
      <h2 className="text-lg font-semibold">Line Items</h2>

      <div>
        <select
          onChange={(e) => {
            if (e.target.value === "new") {
              setShowModal(true);
            } else {
              const selected = productsAndServices.find(
                (p) => p.id === e.target.value
              );
              setItems([
                ...items,
                { ...selected, quantity: 1, total: selected.rate },
              ]);
            }
            e.target.value = ""; // reset
          }}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Choose Product or Service --</option>
          <option value="new">+ Add New Product or Service</option>
          {productsAndServices.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} (${item.rate}/{item.unit})
            </option>
          ))}
        </select>
      </div>

      <table className="w-full mt-4 border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Rate</th>
            <th className="p-2">Total</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">{item.unit}</td>
              <td className="p-2">${item.rate}</td>
              <td className="p-2">${item.quantity * item.rate}</td>
              <td className="p-2">
                <button onClick={() => handleRemoveItem(i)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <LineItemModal
          onClose={() => setShowModal(false)}
          onSave={handleAddItem}
        />
      )}
    </div>
  );
}

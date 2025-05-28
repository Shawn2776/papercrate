import { useState } from "react";
import { useSelector } from "react-redux";
import AddProductServiceModal from "@/components/forms/invoices/form/AddProductServiceModal";

export function LineItemsSection({ items, setItems }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);

  const products = useSelector((state) => state.products.items);
  const services = useSelector((state) => state.services.items);

  const allItems = [...products, ...services];

  const handleAddItem = (item) => {
    if (!item || !item.name || !item.unit || (!item.price && !item.rate)) {
      setError("Invalid item returned from modal.");
      return;
    }

    const fullItem = {
      name: item.name,
      unit: item.unit,
      rate: parseFloat(item.price || item.rate), // ensure number
      quantity: 1,
      total: parseFloat(item.price || item.rate),
    };
    setItems([...items, fullItem]);
    setShowAddModal(false);
    setError(null);
  };

  const handleRemoveItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  return (
    <div className="space-y-2 border p-4 rounded">
      <h2 className="text-lg font-semibold">Line Items</h2>

      <div>
        <select
          onChange={(e) => {
            if (e.target.value === "new") {
              setShowAddModal(true);
              setError(null);
            } else {
              const selected = allItems.find((p) => p.id === e.target.value);
              if (!selected) {
                setError("Item not found.");
                return;
              }
              const rate = parseFloat(selected.price || selected.rate);
              setItems([
                ...items,
                {
                  name: selected.name,
                  unit: selected.unit,
                  rate,
                  quantity: 1,
                  total: rate,
                },
              ]);
              setError(null);
            }
            e.target.value = "";
          }}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Choose Product or Service --</option>
          <option value="new">+ Add New Product or Service</option>
          {allItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} (${item.price || item.rate}/{item.unit})
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
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
              <td className="p-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i].quantity = parseInt(e.target.value);
                    setItems(updated);
                  }}
                  className="w-16 border rounded px-1 text-right"
                />
              </td>
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

      {showAddModal && (
        <AddProductServiceModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddItem}
        />
      )}
    </div>
  );
}

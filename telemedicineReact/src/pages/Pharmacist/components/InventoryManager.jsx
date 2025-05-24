// Updated React component with enhanced form validation and quantity management
import React, { useState, useEffect } from "react";
import { useInventoryData } from "../useInventoryData";
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Package,
  Calendar,
  Building2,
  DollarSign,
  Hash,
  Pill,
} from "lucide-react";

const InventoryManager = () => {
  const {
    inventoryItems,
    selectedItem,
    setSelectedItem,
    loading,
    error,
    fetchInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
    updateInventoryQuantity,
  } = useInventoryData();

  const [isAdding, setIsAdding] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    medicineName: "",
    quantity: 0,
    batchNumber: "",
    expiryDate: "",
    manufacturer: "",
    unitPrice: 0,
  });
  const [quantityEditId, setQuantityEditId] = useState(null);
  const [quantityChange, setQuantityChange] = useState(0);

  useEffect(() => {
    if (selectedItem) {
      setForm({
        medicineName: selectedItem.medicineName || "",
        quantity: selectedItem.quantity || 0,
        batchNumber: selectedItem.batchNumber || "",
        expiryDate: selectedItem.expiryDate
          ? new Date(selectedItem.expiryDate).toISOString().substring(0, 10)
          : "",
        manufacturer: selectedItem.manufacturer || "",
        unitPrice: selectedItem.unitPrice || 0,
      });
      setIsAdding(false);
      setFormErrors({});
    }
  }, [selectedItem]);

  const validateForm = () => {
    const errors = {};
    if (!form.medicineName.trim()) errors.medicineName = "Medicine name is required.";
    if (form.quantity === null || isNaN(form.quantity)) errors.quantity = "Quantity is required.";
    else if (form.quantity < 0) errors.quantity = "Quantity cannot be negative.";
    if (form.unitPrice === null || isNaN(form.unitPrice)) errors.unitPrice = "Unit price is required.";
    else if (form.unitPrice < 0) errors.unitPrice = "Price cannot be negative.";
    if (!form.expiryDate) errors.expiryDate = "Expiry date is required.";
    if (!form.manufacturer.trim()) errors.manufacturer = "Manufacturer is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "quantity" || name === "unitPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isAdding) {
      await createInventory(form);
      setIsAdding(false);
    } else if (selectedItem) {
      const payload = { ...form, inventoryId: selectedItem.inventoryId };
      await updateInventory(selectedItem.inventoryId, payload);
      setSelectedItem(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      await deleteInventory(id);
      if (selectedItem?.inventoryId === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleQuantityUpdate = async (id) => {
    if (!Number.isInteger(quantityChange)) return;
    await updateInventoryQuantity(id, quantityChange);
    setQuantityEditId(null);
    setQuantityChange(0);
  };

  const renderInput = (field, label, type = "text", step = null) => (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-700 block">{label}</label>
      <input
        name={field}
        type={type}
        step={step}
        value={form[field]}
        onChange={handleInputChange}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
          formErrors[field] ? "border-red-500" : "border-slate-300"
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {formErrors[field] && (
        <p className="text-red-600 text-xs mt-1">{formErrors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Manager</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setSelectedItem(null);
            setFormErrors({});
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl"
        >
          + Add
        </button>
      </div>

      {loading && <p>Loading inventory...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 text-left">Medicine</th>
            <th className="p-2 text-left">Quantity</th>
            <th className="p-2 text-left">Batch</th>
            <th className="p-2 text-left">Expiry</th>
            <th className="p-2 text-left">Manufacturer</th>
            <th className="p-2 text-left">Price (Rs)</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item) => (
            <tr key={item.inventoryId} className="border-b">
              <td className="p-2">{item.medicineName}</td>
              <td className="p-2">
                {quantityEditId === item.inventoryId ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={quantityChange}
                      onChange={(e) => setQuantityChange(parseInt(e.target.value))}
                      className="border px-2 py-1 w-20"
                    />
                    <button
                      onClick={() => handleQuantityUpdate(item.inventoryId)}
                      className="text-xs bg-blue-600 text-white px-2 rounded"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <span>
                    {item.quantity} {" "}
                    <button
                      onClick={() => setQuantityEditId(item.inventoryId)}
                      className="text-xs text-blue-600"
                    >
                      Change
                    </button>
                  </span>
                )}
              </td>
              <td className="p-2">{item.batchNumber}</td>
              <td className="p-2">{new Date(item.expiryDate).toLocaleDateString()}</td>
              <td className="p-2">{item.manufacturer}</td>
              <td className="p-2">Rs {item.unitPrice.toFixed(2)}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => fetchInventoryById(item.inventoryId)}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.inventoryId)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(isAdding || selectedItem) && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {isAdding ? "Add New Medicine" : "Update Medicine"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput("medicineName", "Medicine Name")}
            {renderInput("quantity", "Quantity", "number")}
            {renderInput("batchNumber", "Batch Number")}
            {renderInput("expiryDate", "Expiry Date", "date")}
            {renderInput("manufacturer", "Manufacturer")}
            {renderInput("unitPrice", "Unit Price", "number", 0.01)}
            <div className="col-span-full flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl"
              >
                {isAdding ? "Add Medicine" : "Update Medicine"}
              </button>
              <button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded-xl"
                onClick={() => {
                  setSelectedItem(null);
                  setIsAdding(false);
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
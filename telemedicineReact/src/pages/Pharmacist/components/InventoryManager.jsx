import React, { useState, useEffect } from "react";
import { useInventoryData } from "../useInventoryData";
import { 
  X, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Package, 
  Calendar, 
  Building2, 
  DollarSign,
  Hash,
  Pill
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
    deleteInventory
  } = useInventoryData();

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    medicineName: "",
    quantity: 0,
    batchNumber: "",
    expiryDate: "",
    manufacturer: "",
    unitPrice: 0,
  });

  const [search, setSearch] = useState("");
  const [filterManufacturer, setFilterManufacturer] = useState("");

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
    }
  }, [selectedItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "quantity" || name === "unitPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.medicineName || form.quantity < 0) return;

    if (isAdding) {
      await createInventory(form);
      setIsAdding(false);
    } else if (selectedItem) {
      const payload = {
        ...form,
        inventoryId: selectedItem.inventoryId,
      };
      await updateInventory(selectedItem.inventoryId, payload);
      setSelectedItem(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      await deleteInventory(id);
      if (selectedItem && selectedItem.inventoryId === id) {
        setSelectedItem(null);
      }
    }
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.medicineName.toLowerCase().includes(search.toLowerCase());
    const matchesManufacturer = filterManufacturer
      ? item.manufacturer.toLowerCase().includes(filterManufacturer.toLowerCase())
      : true;
    return matchesSearch && matchesManufacturer;
  });

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 30) return 'expiring-soon';
    return 'valid';
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= 10) return 'low-stock';
    return 'in-stock';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Inventory Management
            </h1>
          </div>
          <p className="text-slate-600 text-lg">Manage your pharmaceutical inventory with ease</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Filter by manufacturer..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                value={filterManufacturer}
                onChange={(e) => setFilterManufacturer(e.target.value)}
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                setIsAdding(true);
                setSelectedItem(null);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Medicine
            </button>
          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-emerald-600 font-medium">Loading inventory...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Medicine
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Stock
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Batch
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Expiry
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Manufacturer
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Price
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 border-b border-slate-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, index) => {
                  const expiryStatus = getExpiryStatus(item.expiryDate);
                  const stockStatus = getStockStatus(item.quantity);
                  
                  return (
                    <tr key={item.inventoryId} className={`hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.medicineName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            stockStatus === 'out-of-stock' ? 'bg-red-100 text-red-800' :
                            stockStatus === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.quantity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.batchNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            expiryStatus === 'expired' ? 'bg-red-100 text-red-800' :
                            expiryStatus === 'expiring-soon' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.manufacturer}</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">${item.unitPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                            onClick={() => fetchInventoryById(item.inventoryId)}
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            onClick={() => handleDelete(item.inventoryId)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredItems.length && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="w-12 h-12 text-slate-300" />
                        <p className="text-slate-500 font-medium">No medicines found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {(isAdding || selectedItem) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {isAdding ? "Add New Medicine" : "Edit Medicine"}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setIsAdding(false);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-150"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { field: "medicineName", icon: Pill, label: "Medicine Name", type: "text" },
                    { field: "quantity", icon: Package, label: "Quantity", type: "number" },
                    { field: "batchNumber", icon: Hash, label: "Batch Number", type: "text" },
                    { field: "expiryDate", icon: Calendar, label: "Expiry Date", type: "date" },
                    { field: "manufacturer", icon: Building2, label: "Manufacturer", type: "text" },
                    { field: "unitPrice", icon: DollarSign, label: "Unit Price", type: "number", step: 0.01 },
                  ].map(({ field, icon: Icon, label, type, step }) => (
                    <div key={field} className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Icon className="w-4 h-4" />
                        {label}
                      </label>
                      <input
                        name={field}
                        type={type}
                        step={step}
                        required
                        value={form[field]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    {isAdding ? "Add Medicine" : "Update Medicine"}
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-slate-200 text-slate-700 py-3 px-6 rounded-xl hover:bg-slate-300 transition-colors duration-200 font-medium"
                    onClick={() => {
                      setSelectedItem(null);
                      setIsAdding(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManager;
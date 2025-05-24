import { useEffect, useState } from "react";
import { apiClient } from "./usePharmacistData";// reuse your axios instance with auth headers

export const useInventoryData = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all inventory items
  const fetchAllInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await apiClient.get("/GetAllInventory", { headers });
      setInventoryItems(response.data);
    } catch (err) {
      setError("Failed to fetch inventory.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single inventory item by ID
  const fetchInventoryById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await apiClient.get(`/GetInventoryById/${id}`, { headers });
      setSelectedItem(response.data);
    } catch (err) {
      setError("Failed to fetch inventory item.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create new inventory item
  const createInventory = async (newItem) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await apiClient.post("/CreateInventory", newItem, { headers });
      await fetchAllInventory();
    } catch (err) {
      setError("Failed to create inventory item.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update existing inventory item
  const updateInventory = async (id, updatedItem) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await apiClient.put(`/UpdateInventory/${id}`, updatedItem, { headers });
      await fetchAllInventory();
    } catch (err) {
      setError("Failed to update inventory item.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete inventory item
  const deleteInventory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await apiClient.delete(`/DeleteInventory/${id}`, { headers });
      await fetchAllInventory();
    } catch (err) {
      setError("Failed to delete inventory item.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update inventory quantity (increment or decrement)
  const updateQuantity = async (id, quantityChange) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await apiClient.patch(`/UpdateQuantity/${id}/quantity`, { quantityChange }, { headers });
      await fetchAllInventory();
    } catch (err) {
      setError("Failed to update quantity.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchAllInventory();
  }, []);

  return {
    inventoryItems,
    selectedItem,
    loading,
    error,
    fetchInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
    updateQuantity,
    setSelectedItem,
  };
};
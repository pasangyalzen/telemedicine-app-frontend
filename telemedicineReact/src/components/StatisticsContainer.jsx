import { useState, useEffect } from "react";
import StatisticsSection from "./StatisticsSection";
import axios from "axios";

const API_BASE_URL = "http://localhost:5186/api";

// Configure Axios instance with default headers
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export default function StatisticsContainer() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        const response = await apiClient.get("/Admin/Account/GetDashboardCounts");
        console.log("Dashboard API response:", response); 
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
        // Set mock data for demo
        setDashboardData({
        totalDoctors: response.data.totalDoctors,
        totalPatients: response.data.totalPatients,
        totalPharmacists: response.data.totalPharmacists,
        totalAppointments: response.data.totalAppointments
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardCounts();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-teal-100 via-teal-50 to-cyan-100 py-20 px-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full border border-teal-50 shadow-lg">
            <div className="w-5 h-5 border-2 border-teal-300 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-teal-400 font-medium">Loading statistics...</span>
          </div>
        </div>
      </div>
    );
  }

  return <StatisticsSection data={dashboardData} />;
}
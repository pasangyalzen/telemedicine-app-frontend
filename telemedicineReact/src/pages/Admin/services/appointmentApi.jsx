const API_URL = "http://localhost:5186/api/admin";

// Fetch all appointments
export const fetchAppointments = async (page = 1, pageSize = 5, sortColumn = "CreatedAt", sortOrder = "ASC") => {
  try {
    console.log("📢 Fetching appointments...");

    const response = await fetch(
      `${API_URL}/appointments/GetAllAppointments?page=${page}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`, 
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ Error fetching appointments: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ API Response:", result); // LOG API RESPONSE

    return result;
  } catch (error) {
    console.error("🚨 Error fetching appointments:", error);
    throw error;
  }
};

// ✅ Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const formattedAppointmentData = {
      ...appointmentData,
      scheduledTime: appointmentData.scheduledTime ? new Date(appointmentData.scheduledTime).toISOString() : "",
    };
    const response = await fetch(`${API_URL}/appointments/CreateAppointment`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedAppointmentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error creating appointment: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Update appointment status
const updateAppointment = async (appointmentId, updatedData) => {
  const API_URL = `http://localhost:5186/api/admin/appointments/UpdateAppointment/${appointmentId}`;
  
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error updating appointment: ${errorText}`);
    }

    const result = await response.json();
    console.log("Appointment updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${API_URL}/appointments/DeleteAppointment/${appointmentId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error deleting appointment: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};
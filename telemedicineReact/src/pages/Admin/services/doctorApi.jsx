const API_URL = "http://localhost:5186/api/admin"; // Adjust as needed

// ✅ Fetch all doctors
export const fetchDoctors = async () => {
  try {
    const response = await fetch(`${API_URL}/GetDoctors`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
    });
    if (!response.ok) throw new Error(`Error fetching doctors: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

// ✅ Fetch a single doctor by ID
export const fetchDoctorById = async (doctorId) => {
  try {
    const response = await fetch(`${API_URL}/GetDoctorById/${doctorId}`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
    });
    if (!response.ok) throw new Error(`Error fetching doctor: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error;
  }
};

export const fetchUserIdByDoctorId = async (doctorId) => {
    try {
      const response = await fetch(`${API_URL}/GetUserIdByDoctorId/${doctorId}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
  
      // Log the raw response text for debugging
      const textResponse = await response.text();
      console.log("Raw Response:", textResponse);
  
      if (!response.ok) {
        throw new Error(`Error fetching userId: ${response.statusText}`);
      }
  
      // Return the text response directly, as it's a string (userId)
      return textResponse; 
  
    } catch (error) {
      console.error("Error fetching userId:", error);
      throw error;
    }
  };

  export const deleteDoctor = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/DeleteDoctor/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      // Parse the JSON response
      const responseData = await response.json();
  
      // Check if the response was successful
      if (!response.ok || !responseData.isSuccess) {
        // If there's an error message or isSuccess is false, throw the error with the message
        throw new Error(responseData.errorMessage ? responseData.errorMessage.join(', ') : "An unknown error occurred while deleting the doctor.");
      }
  
      // If the deletion is successful, return the success message
      return responseData.message || "Doctor deleted successfully.";
  
    } catch (error) {
      console.error("Error deleting doctor:", error.message);
      throw error; // Propagate the error to the caller
    }
  };
export const updateDoctor = async (doctorId, doctorData) => {
    try {
      const response = await fetch(`${API_URL}/UpdateDoctor/${doctorId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating doctor: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error updating doctor:", error);
      throw error;
    }
  };
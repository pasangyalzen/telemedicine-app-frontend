import { useNavigate } from "react-router-dom";
import { API_URL } from "../config.js";
import axios from "axios";

/**
 * Logs in the user and stores the JWT token & role.
 * @param {Object} credentials - { email, password }
 * @param {Function} redirectUser - Function to handle redirection after login
 * @param {Function} setErrorMessage - Function to set error messages in UI
 */
export const handleLogin = async (credentials, redirectUser, setErrorMessage) => {
    try {
        const response = await axios.post(`${API_URL}/admin/account/login`, credentials, {
            headers: { "Content-Type": "application/json" },
        });

        const { token, user } = response.data.data;
        const role = user.roles[0]; // Assuming a single role is assigned

        // Store JWT token and role in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("id", user.id);
        localStorage.setItem("email", credentials.email);
        localStorage.setItem("password", credentials.password);

        // Redirect based on role
        redirectUser(role);

        console.log("Login successful");
    } catch (error) {
        console.error("Login failed:", error.response?.data?.message || error.message);
        setErrorMessage(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
};

/**
 * Logs out the user, clears storage, and redirects to login.
 * @param {Function} navigate - React Router navigate function
 */
export const handleLogout = async () => {
    const navigate = useNavigate();
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found, forcing logout.");
        // Clear Local Storage Data
        localStorage.clear();
        navigate("/");
        window.location.reload();
        
    } catch (error) {
        console.error("Logout failed:", error.response?.data?.message || error.message);
    }
    
    
};
// await axios.post(`${API_URL}/admin/account/logout`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
// });
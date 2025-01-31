import { API_URL } from "../config.js";
import axios from "axios";

const login = async (credentials) => {
	try {
		const response = await axios({
			method: 'post',
			url: `${API_URL}/auth/login`,
			headers: {
				'Content-Type': 'application/json',
			},
			data: credentials,
		});
		return response.data; // Return the response data
	} catch (error) {
		console.error("Login failed:", error.response?.data || error.message); // Log detailed error info
		throw error; // Re-throw the error so the caller can handle it
	}
};

export default login;

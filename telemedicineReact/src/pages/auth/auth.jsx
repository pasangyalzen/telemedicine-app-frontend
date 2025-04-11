export const getEmailFromToken = () => {
    const token = localStorage.getItem("token");  // Make sure the token is in localStorage
    if (!token) return null;
  
    // Decode the JWT token
    const base64Url = token.split('.')[1];  // The second part is the payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Decode the base64Url format
    const decoded = JSON.parse(window.atob(base64));  // Decode the base64 and parse as JSON
  
    // Return the email from the token payload
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
  };
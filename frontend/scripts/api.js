const API_BASE_URL = "http://localhost:3000/api";

// Get JWT token
function getToken() {
  return localStorage.getItem("token");
}

// Common API request function
async function apiRequest(endpoint, method = "GET", body = null) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // Attach token if available
    const token = getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    // Add request body if provided
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      options
    );

    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;

  } catch (error) {
    console.error("API Error:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
}
// src/config/urlConfig.ts

// Define the base API URL

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Define all backend API endpoints
const API_ENDPOINTS = {
  charts: {
    getAll: `${BASE_URL}/charts`, // GET all charts
    create: `${BASE_URL}/charts`, // POST to create a new chart
    update: (id: number) => `${BASE_URL}/charts/${id}`, // PUT to update a chart
    delete: (id: number) => `${BASE_URL}/charts/${id}`, // DELETE a chart
  },
  dataSource: {
    search: `${BASE_URL}/api/fred/series/search`, // GET data source with search
    observations: `${BASE_URL}/api/fred/series/observations`, // Get observations data
  },
};

// Export the endpoints for use across the app
export default API_ENDPOINTS;

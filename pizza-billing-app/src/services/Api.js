// services/itemService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const getItems = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/items`);
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

// Function to get an item by ID
export const getItemById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/items/${id}`);
        return response.data; // Item data
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        throw error;
    }
};

/**
 * Update an existing item by ID
 * @param {string} id - ID of the item to be updated
 * @param {object} updatedItem - Updated item data
 */

export const createItem = async (itemData) => {
    try {
        const response = await axios.post(`${BASE_URL}/items`, itemData);
        return response.data;
    } catch (error) {
        console.error("Error creating item:", error);
        throw error;
    }
};

export const updateItem = async (id, updatedItem) => {
    try {
        const response = await fetch(`${BASE_URL}/items/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedItem),
        });

        // Logging the entire response for better debugging
        console.log("Response Status:", response.status);
        
        // Attempt to parse the response, handling both success and failure cases
        const responseData = await response.json().catch(() => {
            throw new Error("Invalid JSON response from the server");
        });

        if (!response.ok) {
            console.error("Error Response Data:", responseData);
            throw new Error(responseData.error || "Failed to update item");
        }

        console.log("Update successful:", responseData);
        return responseData;
    } catch (error) {
        console.error("Error updating item:", error.message);
        alert(`Error updating item: ${error.message}`);
        throw error;
    }
};

// Delete an item
export const deleteItem = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/items/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
    }
};

// Invoice Services 


// Create a new invoice
export const createInvoice = async (invoiceData) => {
    try {
        const response = await axios.post(`${BASE_URL}/invoices`, invoiceData);
        return response.data;
    } catch (error) {
        console.error("Error creating invoice:", error);
        throw error.response ? error.response.data : error.message;
    }
};

// Get all invoices for retrieve customer names
export const getInvoices = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/invoices`);
        const data = response.data; // Axios provides parsed JSON here

        // Map over the data to extract customer names
        const customerNames = data
            .map((invoice) => invoice.customer_name) // Extract `customer_name`
            .filter((name) => typeof name === "string" && name.trim() !== ""); // Ensure it's valid

        return customerNames;
    } catch (error) {
        console.error("Error fetching invoices:", error);
        throw error.response ? error.response.data : error.message;
    }
};

// Fetch invoice by ID
export const getInvoiceByID = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  };


  export const getAllInvoices = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/invoices`);
        return response.data; // Axios provides parsed JSON here

        
    } catch (error) {
        console.error("Error fetching invoices:", error);
        throw error.response ? error.response.data : error.message;
    }
};

// Function to delete an invoice by ID
export const deleteInvoice = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/invoices/${id}`);
        return response.data; // Return success message
    } catch (error) {
        console.error('Error deleting invoice:', error);
        throw error.response ? error.response.data : error.message;
    }
};
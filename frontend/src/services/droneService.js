const API_BASE_URL = 'http://localhost:5050/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Helper function to make authenticated API calls
const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        console.log(`Making API call to: ${API_BASE_URL}${endpoint}`, config);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

// Drone API functions
export const droneService = {
    // Get all drones
    getAllDrones: async () => {
        return apiCall('/drones');
    },

    // Get available drones for mission assignment
    getAvailableDrones: async () => {
        return apiCall('/drones/available/list');
    },

    // Get single drone by ID
    getDroneById: async (id) => {
        return apiCall(`/drones/${id}`);
    },

    // Create new drone
    createDrone: async (droneData) => {
        console.log('Creating drone with data:', droneData);
        return apiCall('/drones', {
            method: 'POST',
            body: JSON.stringify(droneData),
        });
    },

    // Update drone
    updateDrone: async (id, droneData) => {
        console.log('Updating drone with data:', droneData);
        return apiCall(`/drones/${id}`, {
            method: 'PUT',
            body: JSON.stringify(droneData),
        });
    },

    // Update drone battery level
    updateDroneBattery: async (id, batteryLevel) => {
        return apiCall(`/drones/${id}/battery`, {
            method: 'PATCH',
            body: JSON.stringify({ batteryLevel }),
        });
    },

    // Delete drone
    deleteDrone: async (id) => {
        return apiCall(`/drones/${id}`, {
            method: 'DELETE',
        });
    },
};

export default droneService; 
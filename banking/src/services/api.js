import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const api = {
    getBalance: async (userId) => {
        const response = await axios.get(`${API_URL}/balance`, { params: { user_id: userId } });
        return response.data;
    },

    getTransactions: async (userId) => {
        const response = await axios.get(`${API_URL}/transactions`, { params: { user_id: userId } });
        return response.data;
    },

    sendMoney: async (amount, recipient, userId) => {
        // We use the /pay endpoint. Currently backend expects amount and other data.
        const payload = {
            amount: parseFloat(amount),
            recipient: recipient,
            sender_id: userId, // Changed from username to sender_id
            // Add dummy data for PQC signing if needed, but backend mostly needs amount/recipient for now
            message: "Project Payment",
            device_id: "dev_web_frontend"
        };
        const response = await axios.post(`${API_URL}/pay`, payload);
        return response.data;
    }
};

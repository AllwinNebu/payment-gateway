import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const api = {
    getBalance: async (username) => {
        const response = await axios.get(`${API_URL}/balance`, { params: { username } });
        return response.data;
    },

    getTransactions: async (username) => {
        const response = await axios.get(`${API_URL}/transactions`, { params: { username } });
        return response.data;
    },

    sendMoney: async (amount, recipient, username) => {
        // We use the /pay endpoint. Currently backend expects amount and other data.
        const payload = {
            amount: parseFloat(amount),
            recipient: recipient,
            username: username, // Who is sending
            // Add dummy data for PQC signing if needed, but backend mostly needs amount/recipient for now
            message: "Project Payment",
            device_id: "dev_web_frontend"
        };
        const response = await axios.post(`${API_URL}/pay`, payload);
        return response.data;
    }
};

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchSystemLogs = async () => {
    try {
        const response = await api.get('/logs');
        return response.data;
    } catch (error) {
        console.error('Error fetching system logs:', error);
        return [];
    }
};

export const fetchLatestSensorData = async (sensorId) => {
    try {
        const response = await api.get(`/latest/${sensorId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for sensor ${sensorId}:`, error);
        return null;
    }
};

export const ingestSensorData = async (data) => {
    try {
        const response = await api.post('/ingest', data);
        return response.data;
    } catch (error) {
        console.error('Error ingesting sensor data:', error);
        throw error;
    }
};

export default api;

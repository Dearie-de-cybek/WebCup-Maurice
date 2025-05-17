import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pages/store';

export const storePage = async (data: any, token: string) => {
    try {
        const response = await axios.post(API_URL, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error storing page:', error);
        throw error;
    }
};
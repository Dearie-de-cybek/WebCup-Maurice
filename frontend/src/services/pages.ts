import axios from 'axios';

// const API_URL = 'http://localhost:8080/api/pages';
const API_URL = 'https://digitalnomads.maurice.webcup.hodi.host/api/pages';

// Store a page
export const storePage = async (data: any, token: string) => {
    try {
        const response = await axios.post(`${API_URL}/store`, data, {
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

// Get all pages for authenticated user
export const getUserPages = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting user pages:', error);
        throw error;
    }
};

// Get specific page by ID
export const getPageById = async (id: string, token: string) => {
    try {
        const response = await axios.get(`${API_URL}/show/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting page by ID:', error);
        throw error;
    }
};

// Update a page (with file upload support)
export const updatePage = async (id: string, data: FormData, token: string) => {
    try {
        const response = await axios.patch(`${API_URL}/update/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating page:', error);
        throw error;
    }
};

// Delete a page
export const deletePage = async (id: string, token: string) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting page:', error);
        throw error;
    }
};

// Get page by slug (public route, no authentication)
export const getPageBySlug = async (slug: string) => {
    try {
        const response = await axios.get(`${API_URL}/public/${slug}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting page by slug:', error);
        throw error;
    }
};

// Add vote to page
export const addVoteToPage = async (pageId: string, token: string) => {
    try {
        const response = await axios.post(`${API_URL}/${pageId}/vote`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding vote to page:', error);
        throw error;
    }
};

// Remove vote from page
export const removeVoteFromPage = async (pageId: string, token: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${pageId}/vote`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error removing vote from page:', error);
        throw error;
    }
};

// Get all votes for a page
export const getAllVotes = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/votes/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting votes for page:', error);
        throw error;
    }
};
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${baseUrl}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const shortenUrl = async (originalUrl) => {
  const response = await api.post('/urls', { originalUrl });
  return response.data;
};

export const getUrlStats = async (shortCode) => {
  const response = await api.get(`/urls/${shortCode}/stats`);
  return response.data;
};

export const createPlaylist = async (name, urls) => {
  const response = await api.post('/playlists', { name, urls });
  return response.data;
};

export const getPlaylist = async (playlistCode) => {
  const response = await api.get(`/playlists/${playlistCode}`);
  return response.data;
};

export default api;

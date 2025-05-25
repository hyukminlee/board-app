import axios from 'axios';

// API 서버 설정
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 요청 보낼 때 토큰 자동 삽입
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

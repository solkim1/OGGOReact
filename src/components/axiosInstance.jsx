
// axiosInstance.js
import axios from 'axios';

// 기본 URL 설정
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8090/plan/api/events',
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${yourToken}` // 필요 시 인증 헤더 추가
  }
});


export default axiosInstance;
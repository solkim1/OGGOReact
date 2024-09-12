// axiosInstance.js

import axios from "axios";

/**
 * Axios 인스턴스를 생성하여 기본 설정을 적용합니다.
 * - baseURL: API의 기본 URL 설정
 * - headers: 요청 시 사용될 기본 헤더 설정 (JSON 형식)
 */
const axiosInstance = axios.create({
  baseURL: "https://www.planmaker.me/plan/api/events",
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': `Bearer ${yourToken}` // 필요 시 인증 헤더 추가
  },
});

export default axiosInstance;

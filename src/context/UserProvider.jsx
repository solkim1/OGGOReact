// UserProvider 라는 부모 컴포넌트
import React, { createContext, useState, useEffect } from "react";

// UserContext 생성
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 사용자 정보를 담을 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 인증 상태

  // 컴포넌트가 마운트될 때 세션에서 사용자 정보를 불러옴
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // 로그인 함수
  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData)); // 사용자 정보를 세션에 저장
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("user"); // 세션에서 사용자 정보를 제거
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

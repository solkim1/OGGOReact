import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

/**
 * 사용자 인증 및 상태 관리를 위한 Context.
 */
export const UserContext = createContext();

// Google OAuth 클라이언트 ID와 리디렉션 URI
const CLIENT_ID = "774245247226-mb4dm5idh0esrgea29g9kb0qr6ch0j84.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:3000/oauth2/callback";

/**
 * UserProvider 컴포넌트.
 * 사용자 인증과 Google OAuth를 관리하며, 이를 하위 컴포넌트에 제공하는 Context Provider입니다.
 *
 * @param {Object} props - 컴포넌트의 props.
 * @param {React.ReactNode} props.children - 자식 컴포넌트들.
 * @return {JSX.Element} UserProvider 컴포넌트를 반환합니다.
 */
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem("user");
  });

  const [googleToken, setGoogleToken] = useState(() => {
    return sessionStorage.getItem("googleToken");
  });

  /**
   * Google Identity Services 스크립트를 로드하고 초기화하는 useEffect.
   */
  useEffect(() => {
    const loadGisScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Identity Services 스크립트가 성공적으로 로드되었습니다.");
        initializeGoogleIdentityServices();
      };
      document.body.appendChild(script);
    };

    loadGisScript();
  }, []);

  /**
   * Google Identity Services를 초기화하는 함수.
   */
  const initializeGoogleIdentityServices = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
      });
    } else {
      console.error("Google Identity Services 라이브러리가 로드되지 않았습니다.");
    }
  };

  /**
   * Google 로그인 응답을 처리하는 함수.
   *
   * @param {Object} response - Google ID 토큰 응답 객체.
   */
  const handleCredentialResponse = (response) => {
    const idToken = response.credential;
    console.log("ID Token:", idToken);
    // 백엔드 인증이나 사용자 정보 가져올 때 이 토큰을 사용할 수 있음
  };

  /**
   * Google OAuth2를 사용하여 액세스 토큰을 가져오는 함수.
   *
   * @return {Promise<string>} Google 액세스 토큰을 반환.
   */
  const getGoogleToken = async () => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: "https://www.googleapis.com/auth/calendar.readonly profile email",
        access_type: "offline",
        redirect_uri: REDIRECT_URI,
      });

      const response = await new Promise((resolve, reject) => {
        tokenClient.callback = (response) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response);
          }
        };
        tokenClient.requestAccessToken({ prompt: "consent" });
      });

      setGoogleToken(response.access_token);
      sessionStorage.setItem("googleToken", response.access_token);

      return response.access_token;
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  /**
   * Google 로그인 후 사용자 정보를 가져오고, 서버와 인증하는 함수.
   *
   * @param {string} googleToken - Google 액세스 토큰.
   */
  const loginWithGoogle = async (googleToken) => {
    try {
      const { data } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${googleToken}`,
        },
      });

      console.log(data);

      const response = await axios.post("http://localhost:8090/plan/user/googleLogin", {
        userId: data.id,
        userNick: data.name,
        userEmail: data.email,
      });

      login({
        userId: response.data.userId,
        userNick: response.data.userNick,
        userEmail: response.data.userEmail,
        image: data.picture,
        isGoogle: response.data.isGoogle,
      });
    } catch (error) {
      console.error("Google 로그인 중 오류 발생:", error);
    }
  };

  /**
   * 사용자 정보를 설정하고, 세션에 저장하는 함수.
   *
   * @param {Object} userData - 사용자 데이터 객체.
   */
  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  /**
   * 로그아웃하여 사용자 세션을 초기화하는 함수.
   */
  const logout = () => {
    setUser(null);
    setGoogleToken(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("googleToken");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        googleToken,
        setGoogleToken,
        login,
        logout,
        getGoogleToken,
        loginWithGoogle,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

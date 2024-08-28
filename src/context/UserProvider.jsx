import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

const CLIENT_ID = '774245247226-mb4dm5idh0esrgea29g9kb0qr6ch0j84.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000/oauth2/callback';

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

  useEffect(() => {
    const loadGisScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleIdentityServices;
      document.body.appendChild(script);
    };

    loadGisScript();
  }, []);

  const initializeGoogleIdentityServices = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
      });
    } else {
      console.error('Google Identity Services 라이브러리가 로드되지 않았습니다.');
    }
  };

  const handleCredentialResponse = (response) => {
    const idToken = response.credential;
    console.log('ID Token:', idToken);
    // 백엔드 인증이나 사용자 정보 가져올 때 이 토큰을 사용할 수 있음
  };

  const loginWithGoogle = async () => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.readonly profile email',
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
        tokenClient.requestAccessToken();
      });

      setGoogleToken(response.access_token);
      sessionStorage.setItem("googleToken", response.access_token);

      const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${response.access_token}`,
        },
      });

      axios({
        url: 'http://localhost:8090/plan/user/googleLogin',
        method: 'POST',
        data: {
          userId: data.id,
          userNick: data.name,
          userEmail: data.email
        }
      }).then((res)=>{
        login({
          userId: res.data.userId,
          userNick: res.data.userNick,
          userEmail: res.data.userEmail,
          image: data.picture
        });
      })
      
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setGoogleToken(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("googleToken");
  };

  return (
    <UserContext.Provider value={{ user,setUser, googleToken, setGoogleToken, login, logout, loginWithGoogle, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

const CLIENT_ID = '492030565512-v26kv67d7eq37mqsbt9vtlmub48ourim.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000/oauth2/callback';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem("user");
  });

  const [accessToken, setAccessToken] = useState(() => {
    return sessionStorage.getItem("accessToken");
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
      console.error('Google Identity Services library not loaded.');
    }
  };

  const handleCredentialResponse = (response) => {
    const idToken = response.credential;
    console.log('ID Token:', idToken);
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

      setAccessToken(response.access_token);
      sessionStorage.setItem("accessToken", response.access_token);

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
      }).then((res) => {
        login({
          userId: res.data.userId,
          userNick: res.data.userNick,
          userEmail: res.data.userEmail,
          image: data.picture
        });
      });

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
  };

  return (
    <UserContext.Provider value={{ user, accessToken, setAccessToken, login, logout, loginWithGoogle, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

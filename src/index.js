import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/Routes";
import reportWebVitals from "./reportWebVitals";
import UserProvider from "./context/UserProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));

/**
 * UserProvider로 애플리케이션을 감싸서 하위 컴포넌트에서 사용자 컨텍스트를 사용할 수 있도록 설정합니다.
 */
root.render(
  <UserProvider>
    <AppRoutes />
  </UserProvider>
);

/**
 * 웹 성능 측정을 위한 함수 호출입니다.
 */
reportWebVitals();

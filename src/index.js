import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from './routes/Routes';
import reportWebVitals from './reportWebVitals';
import UserProvider from './context/UserProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 이렇게 UserProvider 로 감싸놓게 되면 그 하위 컴포넌트에서 useContext를 이용해
  // UserProvider 안의 모든 함수들과 state 들을 바로바로 꺼내 사용할 수 있음
  <UserProvider>
    <AppRoutes />
  </UserProvider>
);
reportWebVitals();

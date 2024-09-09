import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JoinPage from "../pages/JoinPage";
import TravelerMainPage from "../pages/TravelerMainPage";
import ScheduleMapPage from "../pages/ScheduleMapPage";
import LoginPage from "../pages/LoginPage";
import MyPage from "../pages/MyPage";
import MySchedulesPage from "../pages/MySchedulesPage";
import BusinessMainPage from "../pages/BusinessMainPage";
import { UserContext } from "../context/UserProvider";
import { HeaderColorProvider } from "../context/HeaderColorContext"; // 추가
import styles from "../styles/AppRoutes.module.css";

const AppRoutes = () => {
  const { isAuthenticated } = useContext(UserContext);

  const PublicRoutes = () => (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrap}>
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* 로그인 페이지가 시작 화면 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="*" element={<Navigate to="/login" />} /> {/* 로그인 페이지로 리다이렉트 */}
        </Routes>
      </div>
    </div>
  );

  const PrivateRoutes = () => {
    const location = useLocation();
    return (
      <div className={styles.pageContainer}>
        {location.pathname !== "/schedulemap" && <Header />}
        <div className={styles.contentWrap}>
          <Routes>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/traveler" element={<TravelerMainPage />} />
            <Route path="/business" element={<BusinessMainPage />} />
            <Route path="/myschedules" element={<MySchedulesPage />} />
            <Route path="/schedulemap" element={<ScheduleMapPage />} />
            <Route path="*" element={<Navigate to="/traveler" />} />
          </Routes>
        </div>
        {location.pathname !== "/schedulemap" && <Footer />}
      </div>
    );
  };

  return (
    <Router>
      <HeaderColorProvider>
        {/* HeaderColorProvider로 감싸줍니다 */}
        {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
      </HeaderColorProvider>
    </Router>
  );
};

export default AppRoutes;

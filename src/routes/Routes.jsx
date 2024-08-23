import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import JoinPage from "../pages/JoinPage";
import TravelerMainPage from "../pages/TravelerMainPage";
import ScheduleMapPage from "../pages/ScheduleMapPage";
import LoginPage from "../pages/LoginPage";
import LandingPage from "../pages/LandingPage";
import MyPage from "../pages/MyPage";
import MySchedulesPage from "../pages/MySchedulesPage";
import BusinessMainPage from "../pages/BusinessMainPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/join" element={<JoinPage />} /> {/* 회원 가입 */}
        <Route path="/landing" element={<LandingPage />} /> {/* 시작 페이지 */}
        <Route path="/login" element={<LoginPage />} /> {/* 로그인 */}
        <Route path="/mypage" element={<MyPage />} /> {/* 마이페이지 */}
        <Route path="/traveler" element={<TravelerMainPage />} /> {/* 메인페이지 여행자모드 */}
        <Route path="/business" element={<BusinessMainPage />} /> {/* 메인페이지 출장자모드 */}
        <Route path="/myschedules" element={<MySchedulesPage />} /> {/* 나의 일정 */}
        <Route path="/schedulemap" element={<ScheduleMapPage />} />
        <Route path="/" element={<LandingPage />} /> {/* 기본 경로를 LandingPage로 설정 */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;

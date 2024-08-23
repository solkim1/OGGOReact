import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

import JoinPage from "../pages/JoinPage";
import TravelerMainPage from "../pages/TravelerMainPage";
import ScheduleMapPage from "../pages/ScheduleMapPage";
import LoginPage from "../pages/LoginPage";
import LandingPage from "../pages/LandingPage";
import MyPage from "../pages/MyPage";
import MySchedulesPage from "../pages/MySchedulesPage";
import BusinessMainPage from "../pages/BusinessMainPage";
import { UserContext } from "../context/UserProvider"; // UserContext 가져오기

const AppRoutes = () => {
  // UserProvider 에서 인증 상태 가져오기
  const { isAuthenticated } = useContext(UserContext);

  // 로그인 전 라우트
  const PublicRoutes = () => (
    <Routes>
      <Route path="/join" element={<JoinPage />} /> {/* 회원 가입 */}
      <Route path="/login" element={<LoginPage />} /> {/* 로그인 */}
      <Route path="/" element={<LandingPage />} /> {/* 기본 경로를 LandingPage로 설정 */}
      <Route path="*" element={<Navigate to="/" />} /> {/* 모든 다른 경로는 LandingPage로 리다이렉트 */}
    </Routes>
  );

  // 로그인 후 라우트
  const PrivateRoutes = () => (
    <>
      <Header />

      <Routes>
        <Route path="/mypage" element={<MyPage />} /> {/* 마이페이지 */}
        <Route path="/traveler" element={<TravelerMainPage />} /> {/* 메인페이지 여행자모드 */}s
        <Route path="/business" element={<BusinessMainPage />} /> {/* 메인페이지 출장자모드 */}
        <Route path="/myschedules" element={<MySchedulesPage />} /> {/* 나의 일정 */}
        <Route path="/schedulemap" element={<ScheduleMapPage />} />
        <Route path="*" element={<Navigate to="/traveler" />} /> {/* 모든 다른 경로는 TravelerMainPage로 리다이렉트 */}
      </Routes>

      <Footer />
    </>
  );

  return (
    /*
      isAuthenticated 값에 따라서 보여줄 라우트 들을 결정함 

      이렇게하면 로그인 전 사용자 데이터가 없는 경우에는 
      Header, Footer가 포함되지 않은 PublicRoutes안의
      LandingPage, LoginPage, JoinPage 라우트만 보여지고

      로그인 후 사용자 데이터가 있는 경우에는 PrivateRoutes 안의
      Header, Footer가 포함된 TravelerMainPage.. 등등의 라우트가 보여진다

      굳이 TravelerMainPage 같은 컴포넌트 안에 Header들을 끌어오지 않아도 
      전부 적용시킬 수 있음

      만약 전의 방식으로 TravelerMainPage 같은 컴포넌트들 안에 
      다른 컴포넌트 [ex)Header] 들을 끌어올 경우,
      라우트 이동 시 마다 그 안의 Header 컴포넌트들의 렌더링이 계속 일어난다.

      이렇게 될 경우 Header 안에 useEffect같은 함수들이 있다면 
      라우트 이동 시 마다 필요없이 계속 실행될것임
    */
   
    <Router>
      {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
    </Router>
  );
};

export default AppRoutes;

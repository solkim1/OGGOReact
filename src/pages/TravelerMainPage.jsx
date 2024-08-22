//메인페이지(여행자모드)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Calendar from "../components/Calendar";
import RecommendationsTheme from "../components/RecommendationsTheme";
import Footer from "../components/Footer";
import logoImage from "../images/logo.png";
import styles from "../styles/TravelerMainPage.module.css";

const TravelerMainPage = () => {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleScheduleButtonClick = () => {
    navigate("/schedulemap");
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.logoContainer}>
          <img src={logoImage} alt="플랜메이커 로고" className={styles.logo} />
        </div>
        <div className={styles.filterSection}>
          <div className={styles.filterItem}>
            <button className={styles.filterLabel}>일정 선택</button>
            <input type="date" className={styles.filterInput} placeholder="연도-월-일" />
            <span className={styles.dateSeparator}>~</span>
            <input type="date" className={styles.filterInput} placeholder="연도-월-일" />
          </div>
          <div className={styles.filterItem}>
            <button className={styles.filterLabel}>연령대</button>
            <select className={styles.filterSelect}>
              <option>10대~20대</option>
              <option>30대</option>
              <option>40~50대</option>
              <option>60대 이상</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <button className={styles.filterLabel}>성별</button>
            <select className={styles.filterSelect}>
              <option>남성</option>
              <option>여성</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <button className={styles.filterLabel}>인원</button>
            <select className={styles.filterSelect}>
              <option>개인</option>
              <option>단체</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <button className={styles.filterLabel}>테마</button>
            <select className={styles.filterSelect}>
              <option>레포츠</option>
              <option>문화 체험</option>
              <option>쇼핑</option>
              <option>맛집 탐방</option>
            </select>
          </div>
          <button className={styles.resetButton}>초기화</button>
          <button className={styles.scheduleButton} onClick={handleScheduleButtonClick}>
            일정 생성
          </button>
        </div>
        <button onClick={toggleCalendar} className={styles.calendarToggle}>
          캘린더 펼치기
        </button>
        {isCalendarOpen && <Calendar />}
        <h2 className={styles.recommendationsTitle}>테마별 여행지 추천</h2>
        <RecommendationsTheme />
      </main>
      <Footer />
    </div>
  );
};

export default TravelerMainPage;

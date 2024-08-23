import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RecommendationsTheme from "../components/RecommendationsTheme";
import Footer from "../components/Footer";
import styles from "../styles/TravelerMainPage.module.css";

const TravelerMainPage = () => {
  const navigate = useNavigate();

  const handleScheduleButtonClick = () => {
    navigate("/schedulemap");
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
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
          <h2 className={styles.recommendationsTitle}>테마별 여행지 추천</h2>
          <RecommendationsTheme />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TravelerMainPage;
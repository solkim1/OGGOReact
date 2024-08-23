import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecommendationsExhibition from "../components/RecommendationsExhibition";
import styles from "../styles/BusinessMainPage.module.css";

const BusinessMainPage = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleScheduleButtonClick = () => {
    navigate("/schedulemap");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.filterSection}>
            <div className={styles.filterItem}>
              <button className={styles.filterLabel}>출장 일정</button>
              <input type="date" className={styles.filterInput} placeholder="연도-월-일" />
              <span className={styles.dateSeparator}>~</span>
              <input type="date" className={styles.filterInput} placeholder="연도-월-일" />
            </div>
            <div className={styles.filterItem}>
              <button className={styles.filterLabel}>출장 시간대</button>
              <input type="time" className={styles.filterInput} />
              <span className={styles.dateSeparator}>~</span>
              <input type="time" className={styles.filterInput} />
            </div>
            <div className={styles.filterItem}>
              <button className={styles.filterLabel}>지역</button>
              <select className={styles.filterSelect}>
                <option>서울</option>
                <option>부산</option>
                <option>대구</option>
                <option>인천</option>
                <option>광주</option>
                <option>대전</option>
                <option>울산</option>
                <option>경기</option>
                <option>강원</option>
                <option>충북</option>
                <option>충남</option>
                <option>전북</option>
                <option>전남</option>
                <option>경북</option>
                <option>경남</option>
                <option>제주</option>
              </select>
            </div>
            <div className={styles.filterItem}>
              <button className={styles.filterLabel}>포함 여부</button>
              <div className={styles.dropdownContainer}>
                <button className={styles.filterSelect} onClick={toggleDropdown}>
                  선택
                </button>
                {isDropdownOpen && (
                  <div className={styles.dropdownContent}>
                    <label>
                      <input type="checkbox" value="전시회" className={styles.checkbox} />
                      전시회
                    </label>
                    <label>
                      <input type="checkbox" value="맛집" className={styles.checkbox} />
                      맛집
                    </label>
                    <label>
                      <input type="checkbox" value="카페" className={styles.checkbox} />
                      카페
                    </label>
                    <label>
                      <input type="checkbox" value="여행지" className={styles.checkbox} />
                      여행지
                    </label>
                    <label>
                      <input type="checkbox" value="숙소" className={styles.checkbox} />
                      숙소
                    </label>
                  </div>
                )}
              </div>
            </div>
            <button className={styles.resetButton}>초기화</button>
            <button className={styles.scheduleButton} onClick={handleScheduleButtonClick}>
              일정 생성
            </button>
          </div>
          <h2 className={styles.recommendationsTitle}>전시회 추천</h2>
          <RecommendationsExhibition />
        </div>
      </main>
    </div>
  );
};

export default BusinessMainPage;

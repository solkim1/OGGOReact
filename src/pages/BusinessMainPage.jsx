import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/BusinessMainPage.module.css";
import RecommendationsExhibition from "../components/RecommendationsExhibition";

const BusinessMainPage = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [region, setRegion] = useState("서울");
  const [includeOptions, setIncludeOptions] = useState({
    전시회: false,
    맛집: false,
    카페: false,
    여행지: false,
    숙소: false
  });

  const handleScheduleButtonClick = () => {
    const selectedOptions = Object.entries(includeOptions)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    navigate("/schedulemap", {
      state: {
        startDate,
        endDate,
        startTime,
        endTime,
        region,
        includeOptions: selectedOptions,
        isBusiness: true
      }
    });
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.filterSection}>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>출장 일정</label>
              <input
                type="date"
                className={styles.filterInput}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className={styles.dateSeparator}>~</span>
              <input
                type="date"
                className={styles.filterInput}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>출장 시간대</label>
              <input
                type="time"
                className={styles.filterInput}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <span className={styles.dateSeparator}>~</span>
              <input
                type="time"
                className={styles.filterInput}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>지역</label>
              <select
                className={styles.filterSelect}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="서울">서울</option>
                {/* 다른 지역 옵션 추가 */}
              </select>
            </div>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>포함 여부</label>
              <div className={styles.checkboxGroup}>
                {Object.entries(includeOptions).map(([option, checked]) => (
                  <label key={option} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name={option}
                      checked={checked}
                      onChange={(e) => setIncludeOptions(prev => ({ ...prev, [option]: e.target.checked }))}
                      className={styles.checkbox}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <button
              className={styles.scheduleButton}
              onClick={handleScheduleButtonClick}
            >
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
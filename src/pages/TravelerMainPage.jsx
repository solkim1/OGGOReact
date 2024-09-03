import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationsTheme from "../components/RecommendationsTheme";
import styles from "../styles/TravelerMainPage.module.css";
import { UserContext } from "../context/UserProvider";

const TravelerMainPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ageGroup, setAgeGroup] = useState("10대~20대");
  const [gender, setGender] = useState("남성");
  const [groupSize, setGroupSize] = useState("개인");
  const [theme, setTheme] = useState("레포츠");

  const handleScheduleButtonClick = async () => {
    try {
      if (!user) {
        throw new Error("로그인 정보 에러. 다시 로그인해주세요");
      }

      if (!startDate || !endDate) {
        throw new Error("시작 날짜와 종료 날짜를 설정하세요.");
      }

      const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

      // 테마 이름을 URL 인코딩하여 백엔드에 전달
      const encodedTheme = encodeURIComponent(theme);

      const response = await fetch(
        `/plan/api/schedules/travel/generate?userId=${user.userId}&days=${days}&ageGroup=${ageGroup}&gender=${gender}&groupSize=${groupSize}&theme=${encodedTheme}&startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error("일정 생성 중 오류 발생");
      }

      const data = await response.json();
      localStorage.setItem("generatedSchedule", JSON.stringify(data));
      navigate("/schedulemap", {
        state: {
          userId: user.userId,
          days: days,
          ageGroup: ageGroup,
          gender: gender,
          groupSize: groupSize,
          theme: theme,
          startDate: startDate,
          endDate: endDate,
        },
      });
    } catch (error) {
      console.error("일정 생성 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.filterSection}>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>일정 선택</label>
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
              <label className={styles.filterLabel}>연령대</label>
              <select className={styles.filterSelect} value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                <option value="10대~20대">10대~20대</option>
                <option value="30대">30대</option>
                <option value="40~50대">40~50대</option>
                <option value="60대 이상">60대 이상</option>
              </select>
            </div>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>성별</label>
              <select className={styles.filterSelect} value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </div>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>인원</label>
              <select className={styles.filterSelect} value={groupSize} onChange={(e) => setGroupSize(e.target.value)}>
                <option value="개인">개인</option>
                <option value="단체">단체</option>
              </select>
            </div>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>테마</label>
              <select className={styles.filterSelect} value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="레포츠">레포츠</option>
                <option value="문화 체험">문화 체험</option>
                <option value="쇼핑">쇼핑</option>
                <option value="맛집 탐방">맛집 탐방</option>
              </select>
            </div>
            <button className={styles.scheduleButton} onClick={handleScheduleButtonClick}>
              일정 생성
            </button>
          </div>
          <h2 className={styles.recommendationsTitle}>테마별 여행지 추천</h2>
          <RecommendationsTheme />
        </div>
      </main>
    </div>
  );
};

export default TravelerMainPage;

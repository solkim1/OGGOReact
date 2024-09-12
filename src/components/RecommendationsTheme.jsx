import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/RecommendationsTheme.module.css";

/**
 * RecommendationsTheme 컴포넌트.
 * 추천 테마를 선택하고 출발일을 설정하여 여정을 시작하는 기능을 제공합니다.
 *
 * @return {JSX.Element} RecommendationsTheme 컴포넌트를 반환합니다.
 */
const RecommendationsTheme = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(null); // 선택된 테마 상태
  const [startDate, setStartDate] = useState(""); // 출발일 상태

  /**
   * 테마를 클릭했을 때 호출되는 함수.
   * @param {string} themeName - 선택된 테마의 이름.
   */
  const handleThemeClick = (themeName) => {
    setSelectedTheme(themeName);
  };

  /**
   * 출발일 변경 시 호출되는 함수.
   * @param {Object} e - 이벤트 객체.
   */
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  /**
   * 여정을 시작할 때 호출되는 함수.
   * 선택된 테마의 데이터를 가져와 일정 생성 페이지로 이동합니다.
   */
  const handleStartJourney = async () => {
    try {
      // 선택된 테마에 대한 데이터를 서버에서 가져옵니다.
      const response = await fetch(`https://www.planmaker.me/plan/api/schedules/themes/${selectedTheme}`);
      if (!response.ok) {
        throw new Error("테마 데이터를 불러오는 데 실패했습니다.");
      }
      const themeData = await response.json();

      // 가져온 데이터를 사용하여 일정 생성 페이지로 이동
      navigate("/schedulemap", { state: { themeData, themeName: selectedTheme, startDate } });
    } catch (error) {
      console.error("Error loading theme data:", error);
      alert("테마 데이터 로딩 실패: " + error.message);
    }
  };

  return (
    <div className={styles.themesContainer}>
      {/* 테마가 선택되지 않은 경우 */}
      {!selectedTheme ? (
        <>
          {/* 테마 아이템 목록 */}
          <div className={styles.themeItem} onClick={() => handleThemeClick("sungsoo")}>
            <img src={require("../images/sungsoo.png")} alt="성수 거꾸로하우스" />
            <div className={styles.themeTitle}>HOT 성수 거꾸로하우스</div>
          </div>
          <div className={styles.themeItem} onClick={() => handleThemeClick("beach")}>
            <img src={require("../images/beach.png")} alt="파도와 함께하는 바다" />
            <div className={styles.themeTitle}>파도와 함께하는 바다</div>
          </div>
          <div className={styles.themeItem} onClick={() => handleThemeClick("history")}>
            <img src={require("../images/history.png")} alt="역사 체험하기" />
            <div className={styles.themeTitle}>역사 체험하기</div>
          </div>
          <div className={styles.themeItem} onClick={() => handleThemeClick("country")}>
            <img src={require("../images/country.png")} alt="레트로 촌캉스 여행" />
            <div className={styles.themeTitle}>레트로 촌캉스 여행</div>
          </div>
          <div className={styles.themeItem} onClick={() => handleThemeClick("slowtravel")}>
            <img src={require("../images/slowtravel.jpg")} alt="슬로우 트래블" />
            <div className={styles.themeTitle}>한 걸음 늦게 슬로우 트래블</div>
          </div>
          <div className={styles.themeItem} onClick={() => handleThemeClick("camping")}>
            <img src={require("../images/camping.jpg")} alt="일상을 벗어나, 캠핑 여행" />
            <div className={styles.themeTitle}>일상을 벗어나, 캠핑 여행</div>
          </div>
        </>
      ) : (
        // 테마가 선택된 경우, 날짜 선택 UI 표시
        <div className={styles.dateSelector}>
          <h3>출발일을 선택하세요</h3>
          <input type="date" value={startDate} onChange={handleStartDateChange} />
          <button className={styles.startJourneyButton} onClick={handleStartJourney} disabled={!startDate}>
            여행 시작
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsTheme;

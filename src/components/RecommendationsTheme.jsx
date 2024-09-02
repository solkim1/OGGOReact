import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RecommendationsTheme.module.css';

const RecommendationsTheme = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [startDate, setStartDate] = useState('');

  const handleThemeClick = (themeName) => {
    setSelectedTheme(themeName);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleStartJourney = async () => {
    try {
      // 백엔드 서버로 요청을 보냄
      const response = await fetch(`http://localhost:8090/plan/api/schedules/themes/${selectedTheme}`);
      if (!response.ok) {
        throw new Error('테마 데이터를 불러오는 데 실패했습니다.');
      }
      const themeData = await response.json();
      navigate('/schedulemap', { state: { themeData, themeName: selectedTheme, startDate } });
    } catch (error) {
      console.error('Error loading theme data:', error);
      alert('테마 데이터 로딩 실패: ' + error.message);
    }
  };

  return (
    <div className={styles.themesContainer}>
      {!selectedTheme ? (
        <>
          <div className={styles.themeItem} onClick={() => handleThemeClick('sungsoo')}>
            <img src={require('../images/sungsoo.png')} alt="성수 거꾸로하우스" />
            <div className={styles.themeTitle}>HOT 성수 거꾸로하우스</div>
          </div>
          <div className={styles.themeItem} onClick={() => handleThemeClick('beach')}>
            <img src={require('../images/beach.png')} alt="파도와 함께하는 바다" />
            <div className={styles.themeTitle}>파도와 함께하는 바다</div>
          </div>
          <div className={styles.themeItem} onClick={() => handleThemeClick('history')}>
            <img src={require('../images/history.png')} alt="역사 체험하기" />
            <div className={styles.themeTitle}>역사 체험하기</div>
          </div>
          <div className={styles.themeItem} onClick={() => handleThemeClick('country')}>
            <img src={require('../images/country.png')} alt="레트로 촌캉스 여행" />
            <div className={styles.themeTitle}>레트로 촌캉스 여행</div>
          </div>
          <div className={styles.themeItem} onClick={() => handleThemeClick('slowtravel')}>
            <img src={require('../images/slowtravel.jpg')} alt="슬로우 트래블" />
            <div className={styles.themeTitle}>한 걸음 늦게 슬로우 트래블</div>
          </div>
          <div className={styles.themeItem} onClick={() => handleThemeClick('camping')}>
            <img src={require('../images/camping.jpg')} alt="일상을 벗어나, 캠핑 여행" />
            <div className={styles.themeTitle}>일상을 벗어나, 캠핑 여행</div>
          </div>
        </>
      ) : (
        <div className={styles.dateSelector}>
          <h3>출발일을 선택하세요</h3>
          <input type="date" value={startDate} onChange={handleStartDateChange} />
          <button
            className={styles.startJourneyButton}
            onClick={handleStartJourney}
            disabled={!startDate}
          >
            여행 시작
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsTheme;

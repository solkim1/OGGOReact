import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RecommendationsExhibition.module.css';

const RecommendationsExhibition = () => {
  const navigate = useNavigate();
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [startDate, setStartDate] = useState('');

  const handleExhibitionClick = (exhibitionName) => {
    setSelectedExhibition(exhibitionName);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleStartJourney = async () => {
    try {
      const response = await fetch(`http://localhost:8090/plan/api/schedules/exhibitions/${selectedExhibition}`);
      if (!response.ok) {
        throw new Error('전시회 데이터를 불러오는 데 실패했습니다.');
      }
      const exhibitionData = await response.json();
      // endDate를 startDate와 동일하게 설정
      navigate('/schedulemap', { state: { exhibitionData, exhibitionName: selectedExhibition, startDate, endDate: startDate } });
    } catch (error) {
      console.error('Error loading exhibition data:', error);
      alert('전시회 데이터 로딩 실패: ' + error.message);
    }
  };

  return (
    <div className={styles.exhibitionsContainer}>
      {!selectedExhibition ? (
        <>
          <div className={styles.exhibitionItem} onClick={() => handleExhibitionClick('DANIELARSHAM')}>
            <img src={require('../images/DANIEL ARSHAM.jpg')} alt="DANIELARSHAM" />
            <div className={styles.exhibitionTitle}>다니엘 아샴 : 서울 3024</div>
          </div>
          <div className={styles.exhibitionItem} onClick={() => handleExhibitionClick('kimjihee')}>
            <img src={require('../images/kimjihee.jpg')} alt="kimjihee" />
            <div className={styles.exhibitionTitle}>김지희 개인전 - DIVINITY</div>
          </div>
          <div className={styles.exhibitionItem} onClick={() => handleExhibitionClick('utopia')}>
            <img src={require('../images/utopia.jpg')} alt="utopia" />
            <div className={styles.exhibitionTitle}>유토피아: Nowhere, Now Here</div>
          </div>
          <div className={styles.exhibitionItem} onClick={() => handleExhibitionClick('james')}>
            <img src={require('../images/james.jpg')} alt="James" />
            <div className={styles.exhibitionTitle}>제임스 로젠퀴스트 : Universe</div>
          </div>
          <div className={styles.exhibitionItem} onClick={() => handleExhibitionClick('koreanArt')}>
            <img src={require('../images/kiaf.jpeg')} alt="koreanArt" />
            <div className={styles.exhibitionTitle}>시간을 초월한 표현 : 한국 미술</div>
          </div>
          <div className={styles.exhibitionItem} onClick={() => handleExhibitionClick('Layered Life')}>
            <img src={require('../images/Layered Life.png')} alt="Layered Life" />
            <div className={styles.exhibitionTitle}>정직성 : Layered Life</div>
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
            일정 생성
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsExhibition;

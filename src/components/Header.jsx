import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
import { UserContext } from '../context/UserProvider';
import WeatherWidget from './WeatherWidget';
import Calendar from './Calendar';
import logoImage from '../images/icons/logo.png';
import travelerIcon from '../images/icons/traveler-icon.png';
import businessIcon from '../images/icons/business-icon.png';
import { HeaderColorContext } from '../context/HeaderColorContext';
import styles from '../styles/Header.module.css';
import LocalCache from '../components/LocalCache';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // location 추가
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { logout } = useContext(UserContext);
  const { headerColor } = useContext(HeaderColorContext);

  // 컴포넌트가 마운트될 때, 캐시된 모드를 불러오거나 히스토리 상태에서 복원
  useEffect(() => {
    const fetchInitialMode = async () => {
      const cachedMode = await LocalCache.readFromCache('userMode');
      if (location.state?.mode) {
        setIsBusinessMode(location.state.mode === 'business');
      } else if (cachedMode) {
        setIsBusinessMode(cachedMode === 'business');
      }
    };
    fetchInitialMode();
  }, [location.state?.mode]);

  const toggleMode = async () => {
    const newMode = !isBusinessMode;
    setIsBusinessMode(newMode);
    const modeToSave = newMode ? 'business' : 'traveler';
    await LocalCache.writeToCache('userMode', modeToSave);

    // navigate 할 때 state로 모드 정보를 함께 전달
    navigate(newMode ? '/business' : '/traveler', { state: { mode: newMode ? 'business' : 'traveler' } });
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === styles.calendarOverlay) {
      closeCalendar();
    }
  };

  const logoutBtn = () => {
    logout();
    alert('로그아웃 되었습니다');
  };

  const goToHomePage = () => {
    if (isBusinessMode) {
      navigate('/business', { state: { mode: 'business' } });
    } else {
      navigate('/traveler', { state: { mode: 'traveler' } });
    }
  };

  return (
    <div>
      <header className={styles.header} style={{ backgroundColor: headerColor }}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <img src={logoImage} alt="플랜메이커 로고" className={styles.logo} onClick={goToHomePage} />
          </div>
          <div className={styles.rightContent}>
            <WeatherWidget />
            <div className={styles.headerButtons}>
              <div className={`${styles.toggleSwitch} ${isBusinessMode ? styles.active : ''}`} onClick={toggleMode}>
                <div className={styles.toggleCircle}>
                  <img
                    src={isBusinessMode ? businessIcon : travelerIcon}
                    alt={isBusinessMode ? '출장자 모드 아이콘' : '여행자 모드 아이콘'}
                    className={styles.modeIcon}
                  />
                </div>
                <span className={`${styles.toggleText} ${isBusinessMode ? styles.rightText : styles.leftText}`}>
                  {isBusinessMode ? '출장자 모드' : '여행자 모드'}
                </span>
              </div>
              <button className={styles.navButton} onClick={toggleCalendar}>
                여행캘린더
              </button>
              <button className={styles.navButton} onClick={() => navigate('/myschedules')}>
                나의일정
              </button>
              <button className={styles.navButton} onClick={() => navigate('/mypage')}>
                마이페이지
              </button>
              <button className={styles.navButton} onClick={logoutBtn}>
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>
      {showCalendar && (
        <div className={styles.calendarOverlay} onClick={handleOutsideClick}>
          <div className={styles.calendarContainer}>
            <button className={styles.closeButton} onClick={closeCalendar}>
              X
            </button>
            <Calendar />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import WeatherWidget from "./WeatherWidget";
import Calendar from "./Calendar";
import logoImage from "../images/icons/logo.png";
import travelerIcon from "../images/icons/traveler-icon.png";
import businessIcon from "../images/icons/business-icon.png";
import { HeaderColorContext } from "../context/HeaderColorContext";
import styles from "../styles/Header.module.css";
import LocalCache from "../components/LocalCache";

/**
 * Header 컴포넌트.
 * 사이트의 헤더를 렌더링하며, 사용자 모드 전환 및 로그아웃, 캘린더 열기 등의 기능을 제공합니다.
 *
 * @return {JSX.Element} Header 컴포넌트를 반환합니다.
 */
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { logout } = useContext(UserContext);
  const { headerColor } = useContext(HeaderColorContext);

  /**
   * 컴포넌트가 마운트될 때, 캐시된 모드를 불러오거나 히스토리 상태에서 복원합니다.
   */
  useEffect(() => {
    const fetchInitialMode = async () => {
      const cachedMode = await LocalCache.readFromCache("userMode");
      if (location.state?.mode) {
        setIsBusinessMode(location.state.mode === "business");
      } else if (cachedMode) {
        setIsBusinessMode(cachedMode === "business");
      }
    };
    fetchInitialMode();
  }, [location.state?.mode]);

  /**
   * 모드를 전환하는 함수.
   * 전환된 모드는 로컬 캐시에 저장되고, URL에 상태로 전달됩니다.
   */
  const toggleMode = async () => {
    const newMode = !isBusinessMode;
    setIsBusinessMode(newMode);
    const modeToSave = newMode ? "business" : "traveler";
    await LocalCache.writeToCache("userMode", modeToSave);

    navigate(newMode ? "/business" : "/traveler", { state: { mode: newMode ? "business" : "traveler" } });
  };

  /**
   * 캘린더를 토글하는 함수.
   * @return {void}
   */
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  /**
   * 캘린더를 닫는 함수.
   * @return {void}
   */
  const closeCalendar = () => {
    setShowCalendar(false);
  };

  /**
   * 캘린더 외부 클릭 시 캘린더를 닫는 함수.
   * @param {Event} e - 클릭 이벤트 객체.
   */
  const handleOutsideClick = (e) => {
    if (e.target.className === styles.calendarOverlay) {
      closeCalendar();
    }
  };

  /**
   * 로그아웃 버튼 클릭 시 호출되는 함수.
   * 사용자 로그아웃을 수행하고 알림을 표시합니다.
   */
  const logoutBtn = () => {
    logout();
    alert("로그아웃 되었습니다");
  };

  /**
   * 로고 클릭 시 홈 페이지로 이동하는 함수.
   * 현재 모드에 따라 적절한 홈 페이지로 이동합니다.
   */
  const goToHomePage = () => {
    if (isBusinessMode) {
      navigate("/business", { state: { mode: "business" } });
    } else {
      navigate("/traveler", { state: { mode: "traveler" } });
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
            <div className={`${styles.toggleSwitch} ${isBusinessMode ? styles.active : ""}`} onClick={toggleMode}>
              <div className={styles.toggleCircle}>
                <img
                  src={isBusinessMode ? businessIcon : travelerIcon}
                  alt={isBusinessMode ? "출장자 모드 아이콘" : "여행자 모드 아이콘"}
                  className={styles.modeIcon}
                />
              </div>
              <span className={`${styles.toggleText} ${isBusinessMode ? styles.rightText : styles.leftText}`}>
                {isBusinessMode ? "출장자 모드" : "여행자 모드"}
              </span>
            </div>
            <div className={styles.headerButtons}>
              <button className={styles.navButton} onClick={toggleCalendar}>
                여행캘린더
              </button>
              <button className={styles.navButton} onClick={() => navigate("/myschedules")}>
                나의일정
              </button>
              <button className={styles.navButton} onClick={() => navigate("/mypage")}>
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

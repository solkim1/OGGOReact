import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import WeatherWidget from "./WeatherWidget";
import Calendar from "./Calendar";
import logoImage from "../images/logo.png";
import calendarIcon from "../images/calendar.png";
import scheduleIcon from "../images/schedule.png";
import mypageIcon from "../images/mypage.png";
import logoutIcon from "../images/logout.png";

import travelerIcon from "../images/traveler-icon.png";
import businessIcon from "../images/business-icon.png";

import styles from "../styles/Header.module.css";
import LocalCache from "../components/LocalCache";

const Header = () => {
  const navigate = useNavigate();
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const { logout } = useContext(UserContext);

  useEffect(() => {
    const fetchInitialMode = async () => {
      const cachedMode = await LocalCache.readFromCache("userMode");
      if (cachedMode) {
        setIsBusinessMode(cachedMode === "business");
      }
    };
    fetchInitialMode();
  }, []);

  const toggleMode = async () => {
    const newMode = !isBusinessMode;
    setIsBusinessMode(newMode);

    const modeToSave = newMode ? "business" : "traveler";
    await LocalCache.writeToCache("userMode", modeToSave);

    navigate(newMode ? "/business" : "/traveler");
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
    alert("로그아웃 되었습니다");
  };

  const goToHomePage = () => {
    if (isBusinessMode) {
      navigate("/business");
    } else {
      navigate("/traveler");
    }
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <img src={logoImage} alt="플랜메이커 로고" className={styles.logo} onClick={goToHomePage} />
          </div>
          <div className={styles.rightContent}>
            <WeatherWidget />
            <div className={styles.headerButtons}>
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

              <button className={styles.navButton} onClick={toggleCalendar}>
                <img src={calendarIcon} alt="Calendar" className={styles.buttonIcon} />
                여행 캘린더
              </button>
              <button className={styles.navButton} onClick={() => navigate("/myschedules")}>
                <img src={scheduleIcon} alt="Schedule" className={styles.buttonIcon} />
                나의 일정
              </button>
              <button className={styles.navButton} onClick={() => navigate("/mypage")}>
                <img src={mypageIcon} alt="My Page" className={styles.buttonIcon} />
                마이페이지
              </button>
              <button className={styles.navButton} onClick={logoutBtn}>
                <img src={logoutIcon} alt="Logout" className={styles.buttonIcon} />
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

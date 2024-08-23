import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

import WeatherWidget from "./WeatherWidget";
import Calendar from "./Calendar";
import logoImage from "../images/logo.png";
import calendarIcon from "../images/calendar.png";
import scheduleIcon from "../images/schedule.png";
import mypageIcon from "../images/mypage.png";
import logoutIcon from "../images/logout.png";
import styles from "../styles/Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const { logout } = useContext(UserContext);

  useEffect(() => {
    if (location.pathname === "/business") {
      setIsBusinessMode(true);
    } else {
      setIsBusinessMode(false);
    }
  }, [location.pathname]);

  const toggleMode = () => {
    if (isBusinessMode) {
      navigate("/traveler");
    } else {
      navigate("/business");
    }
    setIsBusinessMode(!isBusinessMode);
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

  const goToHomePage = () => {
    if (isBusinessMode) {
      navigate("/business");
    } else {
      navigate("/traveler");
    }
  };

  const logoutBtn = () => {
    logout();
  }

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <img
              src={logoImage}
              alt="플랜메이커 로고"
              className={styles.logo}
              onClick={goToHomePage}
            />
          </div>
          <div className={styles.rightContent}>
            <WeatherWidget />
            <div className={styles.headerButtons}>
              <div
                className={`${styles.toggleSwitch} ${isBusinessMode ? styles.active : ""}`}
                onClick={toggleMode}
              >
                <div className={styles.toggleCircle} />
                <span className={styles.toggleText}>
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
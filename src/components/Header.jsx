// 메인페이지(여행자모드),메인페이지(출장자모드),마이페이지, 나의 일정 페이지에서에 헤더 통합
import React from "react";
import WeatherWidget from "./WeatherWidget";
import styles from "../styles/Header.module.css";
const Header = () => {
  return (
    <header className={styles.header}>
      {" "}
      <div className={styles.headerContent}>
        {" "}
        <WeatherWidget />{" "}
        <div className={styles.headerButtons}>
          {" "}
          <button>여행자 모드</button> <button>나의 일정</button> <button>마이페이지</button> <button>로그아웃</button>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
};
export default Header;

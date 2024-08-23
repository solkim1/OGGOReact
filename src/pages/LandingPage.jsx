// 시작페이지
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

// 이미지 불러오기
import logo from '../images/logo.png';
import plain from '../images/plain.png';

const LandingPage = () => {


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="Plan Maker Logo" />
          <h1>Plan Maker</h1>
        </div>
        <nav className={styles.nav}>
          <a href="#">이용방법</a>
          <Link to='/join'>회원가입</Link>
          <Link to='/login'>
            <button className={styles.loginButton}>로그인</button>
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.textSection}>
          <h2>Crafting Your Journey, <br /> One Step at a Time</h2>
          <p>당신의 여행을 돕는 여행플래너 Plan Maker</p>

        </div>
        <div className={styles.imageSection}>
          <img src={plain} alt="Airplane Wing" />
        </div>
      </main>
      <button className={styles.startButton}>시작하기</button>

    </div>
  );
};


export default LandingPage;

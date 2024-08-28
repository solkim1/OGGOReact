import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';
import { UserContext } from '../context/UserProvider';

// 이미지 불러오기
import logo from '../images/logo.png';
import plain from '../images/plain.png';

const LandingPage = () => {
  // UserContext에서 인증 관련 함수와 사용자 정보 가져오기
  const { setIsAuthenticated, user, logout } = useContext(UserContext);
  const nav = useNavigate();

  // 시작 버튼 클릭 시 실행될 함수
  const start = () => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      nav('/login'); // 로그인 페이지로 리다이렉트
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="Plan Maker Logo" />
          </Link>
        </div>
        <nav className={styles.nav}>
          <a href="#">이용방법</a>
          {!user ? (
            <>
              <Link to="/join">회원가입</Link>
              <Link to="/login">
                <button className={styles.loginButton}>로그인</button>
              </Link>
            </>
          ) : (
            <div>
              <b>{user.userNick}님 환영합니다 </b>
              <button className={styles.loginButton} onClick={logout}>로그아웃</button>
            </div>
          )}
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
      
      <button className={styles.startButton} onClick={start}>시작하기</button>
    </div>
  );
};

export default LandingPage;

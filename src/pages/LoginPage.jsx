import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserProvider';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/LoginJoin.module.css';

// 이미지 파일 불러오기
import planeImage from '../images/plain2.png';
import logoImage from '../images/logo.png';
import closeEyeIcon from '../images/icon-close-eye.png';
import eyeIcon from '../images/icon-eye.png';
import googleIcon from '../images/googleIcon.png';

const LoginPage = () => {
  const { login } = useContext(UserContext);
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    userPw: ''
  });

  const [pwVisible, setPwVisible] = useState(false);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = initializeGoogleLogin;
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const initializeGoogleLogin = () => {
    window.google.accounts.id.initialize({
      client_id: '774245247226-mb4dm5idh0esrgea29g9kb0qr6ch0j84.apps.googleusercontent.com',
      callback: handleGoogleLoginCallback,
      ux_mode: 'popup',
      auto_select: false,
      context: 'use'
    });
  
    window.google.accounts.id.renderButton(
      document.getElementById('googleLoginButton'),
      { theme: 'outline', size: 'large', type: 'standard' }
    );
  };

  const handleGoogleLoginCallback = async (response) => {
    try {
      const res = await axios.post('http://localhost:8090/plan/user/google-login', {
        token: response.credential
      });

      login({
        userId: res.data.userId,
        userEmail: res.data.userEmail
      });

      nav('/');
    } catch (error) {
      console.error('Google login failed', error);
      alert('Google 로그인에 실패했습니다.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePwVisibility = () => {
    setPwVisible(prev => !prev);
  };

  const loginBtn = async () => {
    if (!formData.userId || !formData.userPw) {
      alert("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8090/plan/user/login',
        formData
      );

      login({
        userId: response.data.userId,
        userEmail: response.data.userEmail
      });

      nav('/');
    } catch (e) {
      if (e.response) {
        console.error(e.response.data);
        if (e.response.status === 401) {
          alert("잘못된 사용자 ID 또는 비밀번호입니다.");
        } else {
          alert("서버와 통신이 원활하지 않습니다");
        }
      } else {
        console.error(e);
        alert("서버와 통신이 원활하지 않습니다");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={planeImage} alt="Airplane" />
      </div>

      <div className={styles.formContainer}>
        <h1 className={styles.title}>
          <Link to="/">
            <img src={logoImage} alt="Plan Maker Logo" />
          </Link>
        </h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>아이디</label>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            className={styles.inputField}
            name="userId"
            value={formData.userId}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>패스워드</label>
          <div className={styles.passwordContainer}>
            <input
              type={pwVisible ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              className={styles.inputField}
              name="userPw"
              value={formData.userPw}
              onChange={handleChange}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={togglePwVisibility}
            >
              <img
                className={styles.eyeImg}
                src={pwVisible ? closeEyeIcon : eyeIcon}
                alt="Toggle visibility"
              />
            </button>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={loginBtn}>로그인</button>
          <p>계정이 없다면? <Link to="/join">회원가입</Link></p>
        </div>

        <div id="googleLoginButton"></div>
      </div>
    </div>
  );
};

export default LoginPage;
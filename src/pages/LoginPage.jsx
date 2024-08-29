import React, { useState, useContext } from 'react';
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
import userImg from '../images/dummyUserImg.png';

const LoginPage = () => {
  const nav = useNavigate();
  const { login, getGoogleToken ,loginWithGoogle , googleToken} = useContext(UserContext);

  const [formData, setFormData] = useState({
    userId: '',
    userPw: ''
  });
  const [pwVisible, setPwVisible] = useState(false);

  const togglePwVisibility = () => {
    setPwVisible(prev => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const loginBtn = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지

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
        userNick: response.data.userNick,
        userEmail: response.data.userEmail,
        image: userImg
      });

      nav('/traveler');
    } catch (e) {
      if (e.response) {
        console.error(e.response.data);
        if (e.response.status === 401) {
          alert("잘못된 사용자 ID 또는 비밀번호입니다.");
        } else {
          alert("서버와 통신이 원활하지 않습니다.");
        }
      } else {
        console.error(e);
        alert("서버와 통신이 원활하지 않습니다.");
      }
    }
  };

  const googleLoginBtn = async () => {
    try {
      const token = await getGoogleToken();  // getGoogleToken 함수에서 직접 토큰을 반환받음
      await loginWithGoogle(token);  // 받은 토큰을 사용하여 로그인
      nav('/');  // 성공적으로 로그인 시 메인 페이지로 리디렉션
    } catch (error) {
      console.error('로그인 실패:', error);
      alert("Google 로그인에 실패했습니다. 다시 시도해 주세요.");
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

        <form onSubmit={loginBtn} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              className={styles.inputField}
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              autoComplete="username" // 사용자 이름 자동 완성
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
                required
                autoComplete="current-password" // 현재 비밀번호 자동 완성
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
            <button type="submit" className={styles.button}>로그인</button>
            <p>계정이 없다면? <Link to="/join">회원가입</Link></p>
          </div>
        </form>

        <div className={styles.googleSignIn} onClick={googleLoginBtn}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google 계정으로 로그인</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
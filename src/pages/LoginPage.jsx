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

const LoginPage = () => {
  // UserContext에서 login 함수와 기타 필요한 정보 가져오기
  const { login } = useContext(UserContext);
  const nav = useNavigate();

  // 로그인 데이터 상태
  const [formData, setFormData] = useState({
    userId: '',
    userPw: ''
  });

  // 비밀번호 가시성 상태
  const [pwVisible, setPwVisible] = useState(false);

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 비밀번호 보이기/숨기기 토글
  const togglePwVisibility = () => {
    setPwVisible(prev => !prev);
  };

  // 로그인 버튼 클릭 처리
  const loginBtn = async () => {
    // 입력 값 유효성 검사
    if (!formData.userId || !formData.userPw) {
      alert("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8090/plan/user/login',
        formData
      );

      // 로그인 성공 시 UserContext에 로그인 정보 설정
      login({
        userId: response.data.userId,
        userEmail: response.data.userEmail
      });

      // 로그인 후 홈 페이지로 이동
      nav('/');

    } catch (e) {
      // 에러 처리
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

        <div className={styles.googleSignIn}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google 계정으로 가입하기</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

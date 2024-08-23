import React, { useState, useContext } from 'react';

import { UserContext } from '../context/UserProvider';
import styles from '../styles/LoginJoin.module.css';

// 이미지 파일 불러오기
import planeImage from '../images/plain2.png';
import logoImage from '../images/logo.png';
import closeEyeIcon from '../images/icon-close-eye.png';
import eyeIcon from '../images/icon-eye.png';
import googleIcon from '../images/googleIcon.png';

const LoginPage = () => {
  // UserContext에서 login과 logout을 가져옵니다.
  const { login, logout } = useContext(UserContext); 

  // 백으로 보낼 로그인 데이터
  const [formData, setFormData] = useState({
    userId: '',
    userEmail: '',
    userPw: '',
    pwCheck: ''
  });

  // 비밀번호 보이고 안보이고 상태 관리 state
  const [pwVisible, setPwVisible] = useState(false);

  // 사용자가 입력하는 도중에도 동적으로 바뀌는 값들이 있어야 함
  const handleChange = (e) => {
    const { name, value } = e.target; // e.target에서 name과 value 추출
    setFormData({
      ...formData, // 현재까지 변경된 formData 먼저 세팅
      [name]: value // 추출한 name value 값 업데이트
    });
  };

  // 눈 버튼 눌렀을 때 실행될 함수
  const togglePwVisibility = () => {
    setPwVisible(!pwVisible);
  };

  const test = () => {
    login({
      userId: "test",
      userEmail: "test@naver.com"
    });
  };

  return (
    <div className={styles.container}>

      <div className={styles.imageContainer}>
        <img src={planeImage} alt="Airplane" />
      </div>

      <div className={styles.formContainer}>

        <h1 className={styles.title}>
          <img src={logoImage} alt="Plan Maker Logo" /> Plan Maker
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
              <img className={styles.eyeImg}
                src={pwVisible ? closeEyeIcon : eyeIcon}
                alt="Toggle visibility" />
            </button>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.button}>로그인</button>
          <p>계정이 없다면? <a href="/join">Join</a></p>
        </div>

        <div className={styles.googleSignIn}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google 계정으로 가입하기</span>
        </div>

        <div>
          <button onClick={test}>테스트 로그인</button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

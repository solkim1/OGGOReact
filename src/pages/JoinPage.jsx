import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';
import styles from '../styles/LoginJoin.module.css';

// 이미지 파일 불러오기
import planeImage from '../images/plain2.png';
import logoImage from '../images/logo.png';
import closeEyeIcon from '../images/icon-close-eye.png';
import eyeIcon from '../images/icon-eye.png';
import googleIcon from '../images/googleIcon.png';

const JoinPage = () => {
  const nav = useNavigate();

  // 백으로 보낼 회원가입 데이터
  const [formData, setFormData] = useState({
    userId: '',
    userEmail: '',
    userPw: '',
    pwCheck: ''
  });

  // 비밀번호 보이기/숨기기 상태
  const [pwVisible, setPwVisible] = useState(false);

  // 비밀번호 확인과 비밀번호 일치 상태
  const [pwMatch, setPwMatch] = useState(true);

  // 이메일 형식 유효성 검사 상태
  const [emailValid, setEmailValid] = useState(true);

  // 아이디 중복 검사 상태
  const [userIdValid, setUserIdValid] = useState(true);

  // 이메일 중복 검사 상태
  const [emailDuplicate, setEmailDuplicate] = useState(true);

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));

    // 비밀번호 일치 여부 확인
    if (name === 'userPw' || name === 'pwCheck') {
      setPwMatch(formData.userPw === formData.pwCheck);
    }

    // 이메일 형식 유효성 검사
    if (name === 'userEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(value);
      setEmailValid(isValid);
      if (isValid) {
        debounceCheckEmail(value);
      } else {
        setEmailDuplicate(true);
      }
    }

    // 아이디 중복 검사
    if (name === 'userId') {
      debounceCheckId(value);
    }
  };

  // 디바운스를 적용한 아이디 중복 확인 함수
  const debounceCheckId = useCallback(
    debounce(async (id) => {
      if (!id) {
        setUserIdValid(true);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8090/plan/user/checkId?userId=${id}`);
        setUserIdValid(response.data.available);
      } catch (e) {
        console.error(e);
      }
    }, 250), []
  );

  // 디바운스를 적용한 이메일 중복 확인 함수
  const debounceCheckEmail = useCallback(
    debounce(async (email) => {
      if (!email) {
        setEmailDuplicate(true);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8090/plan/user/checkEmail?userEmail=${email}`);
        setEmailDuplicate(response.data.available);
      } catch (e) {
        console.error(e);
      }
    }, 250), []
  );

  // 비밀번호 보이기/숨기기 토글
  const togglePwVisibility = () => {
    setPwVisible(prev => !prev);
  };

  // 회원가입 버튼 클릭 처리
  const join = async () => {
    // 입력 유효성 검사
    if (!formData.userId || !formData.userEmail || !formData.userPw || !formData.pwCheck) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    if (!emailValid) {
      alert('유효한 이메일 주소를 입력하세요.');
      return;
    }

    if (!pwMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&^#]{8,}$/;
    if (!pwRegex.test(formData.userPw)) {
      alert('비밀번호는 최소 8자 이상이어야 하며, 대문자와 숫자를 포함해야 합니다.');
      return;
    }

    if (!userIdValid) {
      alert('아이디 중복 확인을 먼저 진행해주세요.');
      return;
    }

    if (!emailDuplicate) {
      alert('이메일 중복 확인을 먼저 진행해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8090/plan/user/join', formData);
      console.log(response.data);
      alert("회원가입 성공");
      nav('/');
    } catch (e) {
      console.error(e);
      alert("서버와 통신이 원활하지 않습니다");
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
            <img src={logoImage} alt="Logo" />
          </Link>
        </h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>아이디</label>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            className={`${styles.inputField} ${!userIdValid ? styles.error : ''}`}
            name='userId'
            value={formData.userId}
            onChange={handleChange}
          />
          {formData.userId && (
            <span className={!userIdValid ? styles.errorMessage : styles.successMessage}>
              {!userIdValid ? '이미 사용중인 아이디입니다' : '사용 가능한 아이디입니다'}
            </span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>이메일</label>
          <input
            type="text"
            placeholder="이메일을 입력하세요"
            className={`${styles.inputField} ${!emailValid ? styles.error : ''}`}
            name='userEmail'
            value={formData.userEmail}
            onChange={handleChange}
          />
          {formData.userEmail && (
            <span className={emailValid ? (emailDuplicate ? styles.successMessage : styles.errorMessage) : styles.errorMessage}>
              {!emailValid ? '유효한 이메일 주소를 입력하세요.' : !emailDuplicate ? '이미 사용중인 이메일입니다' : '사용 가능한 이메일입니다'}
            </span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>패스워드</label>
          <div className={styles.passwordContainer}>
            <input
              type={pwVisible ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              className={styles.inputField}
              name='userPw'
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

        <div className={styles.inputGroup}>
          <label className={styles.label}>패스워드 재입력</label>
          <div className={styles.passwordContainer}>
            <input
              type={pwVisible ? "text" : "password"}
              placeholder="비밀번호를 다시 입력하세요"
              className={`${styles.inputField} ${!pwMatch ? styles.error : ''}`}
              name='pwCheck'
              value={formData.pwCheck}
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
          {!pwMatch && (
            <span className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</span>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={join}>회원가입</button>
          <p>이미 계정이 있다면? <Link to="/login">로그인</Link></p>
        </div>

        <div className={styles.googleSignIn}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google 계정으로 가입하기</span>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;

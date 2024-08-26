//회원가입페이지
import React, { useState, useCallback } from 'react';
import {useNavigate,Link}from 'react-router-dom';
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

  // 비밀번호 보이고 안보이고 상태 관리 state
  const [pwVisible, setPwVisible] = useState(false);
  // 비밀번호 확인과 비밀번호가 일치하는지 관리하기 위한 state
  const [pwMatch, setPwMatch] = useState(true);
  // email형식에 맞는지 확인하기 위한 state
  const [emailValid, setEmailValid] = useState(true);
  // 아이디 중복 검사를 위한 state
  const [userIdValid, setUserIdValid] = useState(true);
  // 이메일 중복 검사를 위한 state
  const [emailDuplicate, setEmailDuplicate] = useState(true);

  // 사용자가 입력하는 도중에도 동적으로 바뀌는 값들이 있어야함
  const handleChange = (e) => {
    const { name, value } = e.target; // e.target에서 name과 value 추출
    setFormData({
      ...formData, // 현재까지 변경된 formData 먼저 세팅
      [name]: value // 추출한 name value 값 업데이트
    });

    // e.target 으로 받는 name, value 값에 따라 각각 적용될 로직

    // pw 와 pwCheck 값 같은지 확인하여 border 색상 변경
    if (name === 'userPw' || name === 'pwCheck') {
      setPwMatch(formData.userPw === value || formData.pwCheck === value);
    }

    // 이메일이 이메일 형식에 부합한지 체크
    if (name === 'userEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(value);
      setEmailValid(isValid);

      if (isValid) {
        debounceCheckEmail(value);
      } else {
        setEmailDuplicate(true); // 유효하지 않은 이메일이면 중복 체크 결과를 true로 설정
      }
    }

    // 아이디 중복체크
    if (name === 'userId') {
      debounceCheckId(value);
    }
  };

  // 디바운스를 적용한 아이디 중복 확인 함수
  // 마지막으로 아이디 value가 바뀐지 250ms 가 지났을 경우에 실행됨 
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
    }, 250), []);

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
    }, 250), []);

  // 눈버튼 눌렀을때 실행될 함수
  const togglePwVisibility = () => {
    setPwVisible(!pwVisible);
  };

  // 사용자가 회원가입버튼을 눌렀을 경우
  const join = async () => {
    // return 을 활용
    // 조건문을 순차적으로 만나면서 return 에 걸림이 없어야 백이랑 통신 진행

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
      const response = await axios.post(
        'http://localhost:8090/plan/user/join',
        formData
      );
      console.log(response.data);
      alert("회원가입 성공");
      nav('/');
    } catch (e) {
      console.error(e);
      alert("서버와 통신이 원활하지 않습니다");
    }
    // 추가해야할것 
    // 로그인 후 페이지 이동 구현
    // 현재 로그인 되어있는 회원의 정보를 session 에 저장&관리
  };

  return (
    <div className={styles.container}>

      <div className={styles.imageContainer}>
        <img src={planeImage} alt="Airplane" />
      </div>

      <div className={styles.formContainer}>

        <h1 className={styles.title}>
          <Link to="/"><img src={logoImage} alt="Logo"/></Link>
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
          {formData.userId !== '' ? (
            <span className={!userIdValid ? styles.errorMessage : styles.successMessage}>
              {!userIdValid ? '이미 사용중인 아이디입니다' : '사용 가능한 아이디입니다'}
            </span>
          ) : (
            <span></span>
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
          {formData.userEmail !== '' ? (
            !emailValid ? (
              <span className={styles.errorMessage}>유효한 이메일 주소를 입력하세요.</span>
            ) : !emailDuplicate ? (
              <span className={styles.errorMessage}>이미 사용중인 이메일입니다</span>
            ) : (
              <span className={styles.successMessage}>사용 가능한 이메일입니다</span>
            )
          ) : (
            <span></span>
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
              <img className={styles.eyeImg}
                src={pwVisible ? closeEyeIcon : eyeIcon}
                alt="Toggle visibility" />
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
              <img className={styles.eyeImg}
                src={pwVisible ? closeEyeIcon : eyeIcon}
                alt="Toggle visibility" />
            </button>
          </div>
          {!pwMatch && (
            <span className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</span>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={join}>회원가입</button>
          <p>이미 계정이 있다면?<Link to="/login">로그인</Link></p>
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
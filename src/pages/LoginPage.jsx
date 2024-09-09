import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserProvider";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/LoginJoin.module.css";

// 이미지 파일 불러오기
import logoImage from "../images/icons/logo.png";
import closeEyeIcon from "../images/icons/icon-close-eye.png";
import eyeIcon from "../images/icons/icon-eye.png";
import googleIcon from "../images/icons/googleIcon.png";
import userImg from "../images/user/dummyUserImg.png";

/**
 * 로그인 페이지 컴포넌트.
 * 사용자 로그인 양식과 Google 로그인 기능을 제공합니다.
 *
 * @return {JSX.Element} 로그인 페이지 컴포넌트.
 */
const LoginPage = () => {
  const nav = useNavigate(); // 페이지 이동을 위한 hook

  const { login, getGoogleToken, loginWithGoogle } = useContext(UserContext); // UserContext에서 함수 가져오기

  // 로그인 폼 데이터 상태
  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
  });
  const [pwVisible, setPwVisible] = useState(false); // 비밀번호 가시성 상태

  /**
   * 비밀번호 가시성을 토글하는 함수.
   */
  const togglePwVisibility = () => {
    setPwVisible((prev) => !prev);
  };

  /**
   * 입력값 변경 핸들러.
   *
   * @param {object} e - 입력 이벤트 객체.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * 로그인 버튼 클릭 시 실행되는 함수.
   *
   * @param {object} e - 클릭 이벤트 객체.
   */
  const loginBtn = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    // 아이디와 비밀번호 입력 여부 확인
    if (!formData.userId || !formData.userPw) {
      alert("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      // 서버에 로그인 요청
      const response = await axios.post("http://localhost:8090/plan/user/login", formData);

      // 로그인 성공 시 UserContext에 사용자 정보 저장
      login({
        userId: response.data.userId,
        userNick: response.data.userNick,
        userEmail: response.data.userEmail,
        image: userImg,
        isGoogle: response.data.isGoogle,
      });

      nav("/traveler"); // 로그인 후 페이지 이동
    } catch (e) {
      // 오류 처리
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

  /**
   * Google 로그인 버튼 클릭 시 실행되는 함수.
   */
  const googleLoginBtn = async () => {
    try {
      const token = await getGoogleToken(); // Google 토큰 획득
      await loginWithGoogle(token); // Google 토큰을 사용하여 로그인
      nav("/"); // 로그인 후 메인 페이지로 이동
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("Google 로그인에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>
          <Link to="/">
            <img src={logoImage} alt="Plan Maker Logo" />
          </Link>
        </h1>

        {/* 로그인 폼 */}
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
              <button type="button" className={styles.eyeButton} onClick={togglePwVisibility}>
                <img className={styles.eyeImg} src={pwVisible ? closeEyeIcon : eyeIcon} alt="Toggle visibility" />
              </button>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              로그인
            </button>
            <p>
              계정이 없다면? <Link to="/join"> 회원가입</Link>
            </p>
          </div>
        </form>

        {/* Google 로그인 버튼 */}
        <div className={styles.googleSignIn} onClick={googleLoginBtn}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google 계정으로 로그인</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

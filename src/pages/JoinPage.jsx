import React, { useState, useCallback, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserProvider";
import { useNavigate, Link } from "react-router-dom";
import debounce from "lodash/debounce";
import styles from "../styles/LoginJoin.module.css";

// 이미지 파일 불러오기
import logoImage from "../images/icons/logo.png";
import closeEyeIcon from "../images/icons/icon-close-eye.png";
import eyeIcon from "../images/icons/icon-eye.png";
import googleIcon from "../images/icons/googleIcon.png";

/**
 * JoinPage 컴포넌트.
 * 회원가입 페이지로, 사용자로부터 입력을 받고 서버에 회원가입 요청을 보냅니다.
 *
 * @return {JSX.Element} 회원가입 페이지 컴포넌트.
 */
const JoinPage = () => {
  const nav = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const { loginWithGoogle, getGoogleToken } = useContext(UserContext); // Google 로그인 함수 가져오기

  // 회원가입 데이터 상태 관리
  const [formData, setFormData] = useState({
    userId: "",
    userEmail: "",
    userNick: "",
    userPw: "",
    pwCheck: "",
  });

  // 비밀번호 보이기/숨기기 상태 관리
  const [pwVisible, setPwVisible] = useState(false);
  const [pwMatch, setPwMatch] = useState(true); // 비밀번호 확인 일치 여부
  const [emailValid, setEmailValid] = useState(true); // 이메일 형식 유효성
  const [userIdValid, setUserIdValid] = useState(true); // 아이디 중복 검사 상태
  const [emailDuplicate, setEmailDuplicate] = useState(true); // 이메일 중복 검사 상태

  /**
   * 입력값 변경 핸들러.
   * 사용자 입력에 따라 formData와 유효성 검사 상태를 업데이트합니다.
   *
   * @param {Object} e - 입력 이벤트 객체.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 비밀번호와 비밀번호 확인 일치 여부 확인
    if (name === "userPw" || name === "pwCheck") {
      setPwMatch(formData.userPw === value || formData.pwCheck === value);
    }

    // 이메일 형식 유효성 검사 및 중복 체크
    if (name === "userEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(value);
      setEmailValid(isValid);

      if (isValid) {
        debounceCheckEmail(value);
      } else {
        setEmailDuplicate(true); // 유효하지 않은 이메일이면 중복 체크 결과를 true로 설정
      }
    }

    // 아이디 중복 체크
    if (name === "userId") {
      debounceCheckId(value);
    }
  };

  /**
   * 아이디 중복 확인 (디바운스 적용).
   * 입력된 아이디가 서버에 이미 존재하는지 검사합니다.
   *
   * @param {string} id - 사용자 입력 아이디.
   */
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
    }, 250),
    []
  );

  /**
   * 이메일 중복 확인 (디바운스 적용).
   * 입력된 이메일이 서버에 이미 존재하는지 검사합니다.
   *
   * @param {string} email - 사용자 입력 이메일.
   */
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
    }, 250),
    []
  );

  /**
   * 비밀번호 가시성 토글.
   * 비밀번호 필드의 텍스트를 표시하거나 숨깁니다.
   */
  const togglePwVisibility = () => {
    setPwVisible(!pwVisible);
  };

  /**
   * 회원가입 처리.
   * 사용자가 회원가입 버튼을 눌렀을 때 호출됩니다.
   *
   * @param {Object} e - 폼 제출 이벤트 객체.
   */
  const join = async (e) => {
    e.preventDefault();

    if (!formData.userId || !formData.userEmail || !formData.userPw || !formData.pwCheck) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    if (!emailValid) {
      alert("유효한 이메일 주소를 입력하세요.");
      return;
    }

    if (!pwMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&^#]{8,}$/;
    if (!pwRegex.test(formData.userPw)) {
      alert("비밀번호는 최소 8자 이상이어야 하며, 대문자와 숫자를 포함해야 합니다.");
      return;
    }

    if (!userIdValid) {
      alert("아이디 중복 확인을 먼저 진행해주세요.");
      return;
    }

    if (!emailDuplicate) {
      alert("이메일 중복 확인을 먼저 진행해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8090/plan/user/join", formData);
      console.log(response.data);
      alert("회원가입 성공");
      nav("/");
    } catch (e) {
      console.error(e);
      alert("서버와 통신이 원활하지 않습니다");
    }
  };

  /**
   * Google 로그인 처리.
   * 사용자가 Google 로그인 버튼을 눌렀을 때 호출됩니다.
   */
  const googleLoginBtn = async () => {
    try {
      const token = await getGoogleToken();
      await loginWithGoogle(token);
      nav("/");
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
            <img src={logoImage} alt="Logo" />
          </Link>
        </h1>

        {/* 폼 요소를 <form>으로 감싸기 */}
        <form onSubmit={join}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              className={`${styles.inputField} ${!userIdValid ? styles.error : ""}`}
              name="userId"
              value={formData.userId}
              onChange={handleChange}
            />
            {formData.userId !== "" ? (
              <div className={!userIdValid ? styles.errorMessage : styles.successMessage}>
                {!userIdValid ? "이미 사용중인 아이디입니다" : "사용 가능한 아이디입니다"}
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="text"
              placeholder="이메일을 입력하세요"
              className={`${styles.inputField} ${!emailValid ? styles.error : ""}`}
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              autoComplete="new-email"
            />
            {formData.userEmail !== "" ? (
              !emailValid ? (
                <div className={styles.errorMessage}>유효한 이메일 주소를 입력하세요.</div>
              ) : !emailDuplicate ? (
                <div className={styles.errorMessage}>이미 사용중인 이메일입니다</div>
              ) : (
                <div className={styles.successMessage}>사용 가능한 이메일입니다</div>
              )
            ) : (
              <div></div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              className={styles.inputField}
              name="userNick"
              value={formData.userNick}
              onChange={handleChange}
              autoComplete="new-nickname"
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
                autoComplete="new-password"
              />
              <button type="button" className={styles.eyeButton} onClick={togglePwVisibility}>
                <img className={styles.eyeImg} src={pwVisible ? closeEyeIcon : eyeIcon} alt="Toggle visibility" />
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>패스워드 재입력</label>
            <div className={styles.passwordContainer}>
              <input
                type={pwVisible ? "text" : "password"}
                placeholder="비밀번호를 다시 입력하세요"
                className={`${styles.inputField} ${!pwMatch ? styles.error : ""}`}
                name="pwCheck"
                value={formData.pwCheck}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className={styles.eyeButton} onClick={togglePwVisibility}>
                <img className={styles.eyeImg} src={pwVisible ? closeEyeIcon : eyeIcon} alt="Toggle visibility" />
              </button>
            </div>
            {!pwMatch && <span className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</span>}
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              회원가입
            </button>
            <p>
              이미 계정이 있다면?<Link to="/login">로그인</Link>
            </p>
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

export default JoinPage;

import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import DeleteModal from "../pages/DeleteModal";
import styles from "../styles/MyPage.module.css";
import closeEyeIcon from "../images/icons/icon-close-eye.png";
import eyeIcon from "../images/icons/icon-eye.png";
import axios from "axios";
import picture from "../images/user/dummyUserImg.png";
import { HeaderColorContext } from "../context/HeaderColorContext"; // 헤더 색상 컨텍스트 추가

/**
 * 마이 페이지 컴포넌트.
 * 사용자 정보 수정 및 삭제 기능을 제공.
 *
 * @return {JSX.Element} 마이 페이지 컴포넌트.
 */
const MyPage = () => {
  const nav = useNavigate();
  const { user, googleToken, isAuthenticated, login, logout } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false); // 탈퇴 확인 모달 상태
  const [formData, setFormData] = useState({
    userId: user.userId,
    userNick: "",
    userPw: "",
    pwCheck: "",
  });

  const [pwVisible, setPwVisible] = useState(false); // 비밀번호 가시성 상태
  const [pwMatch, setPwMatch] = useState(true); // 비밀번호 일치 여부
  const { headerColor } = useContext(HeaderColorContext); // 헤더 컬러 컨텍스트 사용

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

    // 비밀번호와 비밀번호 확인 값이 일치하는지 확인
    if (name === "userPw" || name === "pwCheck") {
      setPwMatch(formData.userPw === value || formData.pwCheck === value);
    }
  };

  /**
   * 비밀번호 가시성을 토글하는 함수.
   */
  const togglePwVisibility = () => {
    setPwVisible(!pwVisible);
  };

  /**
   * 회원 탈퇴 확인 모달을 여는 함수.
   *
   * @param {object} event - 클릭 이벤트 객체.
   */
  const openDeleteModal = (event) => {
    event.stopPropagation();
    setIsModalOpen(true);
  };

  /**
   * 사용자 계정을 삭제하는 함수.
   *
   * @param {string} userId - 삭제할 사용자 ID.
   */
  const deleteId = (userId) => {
    axios
      .delete(`/plan/user/delete/${userId}`)
      .then(() => {
        console.log("계정 삭제 성공");
        setIsModalOpen(false);
        logout();
      })
      .catch((error) => console.error("계정 삭제 오류:", error));
  };

  /**
   * 사용자 정보를 수정하는 함수.
   *
   * @param {object} e - 폼 제출 이벤트 객체.
   */
  const editProfile = async (e) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    if (!pwMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&^#]{8,}$/;

    if (formData.userPw !== "") {
      if (!pwRegex.test(formData.userPw)) {
        alert("비밀번호는 최소 8자 이상이어야 하며, 대문자와 숫자를 포함해야 합니다.");
        return;
      }
    }

    // 닉네임이 없을 경우 현재 닉네임 사용
    if (formData.userNick === "") {
      formData.userNick = user.userNick;
    }

    // 서버에 사용자 정보 수정 요청
    try {
      const response = await axios.post("https://www.planmaker.me/plan/user/editProfile", formData);
      console.log("응답:", response.data);

      login({
        userId: response.data.userId,
        userNick: response.data.userNick,
        userEmail: response.data.userEmail,
        image: picture,
        isGoogle: response.data.isGoogle,
      });

      alert("정보가 수정 되었습니다");
    } catch (error) {
      console.log(error);
    }
  };

  // 컴포넌트가 마운트될 때 사용자 정보, 인증 상태, Google 토큰 출력
  useEffect(() => {
    console.log("유저정보", user);
    console.log("구글토큰", googleToken);
    console.log("인증 상태(라우터관리용)", isAuthenticated);
    console.log("유저이미지", user.image);
  }, [user, googleToken, isAuthenticated]);

  return (
    <>
      <div style={{ backgroundColor: headerColor }}>
        <div className={styles.grayContainer}>{/* <h2>{user.userNick}님 환영합니다</h2> */}</div>
      </div>
      <div className={styles.profile}>
        <img src={user.image || "../images/user/dummyUserImg.png"} alt="프로필 이미지" />
        <span>{user.userNick}</span>
        <p className={styles.label}>{user.userEmail}</p>
      </div>
      {user.isGoogle === "N" ? (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.formContainer}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>닉네임</label>
                <input
                  type="text"
                  className={styles.inputField}
                  name="userNick"
                  defaultValue={user.userNick}
                  onChange={handleChange}
                  autoComplete="new-nickname"
                  readOnly={false}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>비밀번호 변경</label>
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
                    <img
                      className={styles.eyeImg}
                      src={pwVisible ? closeEyeIcon : eyeIcon}
                      alt="비밀번호 가시성 토글"
                    />
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>비밀번호 재입력</label>
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
                    <img
                      className={styles.eyeImg}
                      src={pwVisible ? closeEyeIcon : eyeIcon}
                      alt="비밀번호 가시성 토글"
                    />
                  </button>
                </div>
                {!pwMatch && <span className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</span>}
              </div>

              <div className={styles.buttons}>
                <button className={styles.deleteButton} onClick={(event) => openDeleteModal(event)}>
                  회원 탈퇴
                </button>
                <button className={styles.saveButton} onClick={editProfile}>
                  정보수정
                </button>
              </div>
            </div>
            <DeleteModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => deleteId(user.userId)}
              header="탈퇴 확인"
              message="정말로 탈퇴 하시겠습니까?"
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default MyPage;

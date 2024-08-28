import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserProvider';
import styles from '../styles/MyPage.module.css';

import closeEyeIcon from '../images/icon-close-eye.png';
import eyeIcon from '../images/icon-eye.png';
import axios from 'axios';

const MyPage = () => {
  const nav = useNavigate();
  const { user, googleToken, isAuthenticated } = useContext(UserContext);

  // 활성화된 탭을 관리하는 상태 (info: 정보보기, edit: 정보수정)
  const [activeTab, setActiveTab] = useState('info');

  const [formData, setFormData] = useState({
    userId: user.userId,
    userEmail: user.userEmail,
    userPw: '',
    pwCheck: ''
  });

  const [pwVisible, setPwVisible] = useState(false);
  const [pwMatch, setPwMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'userPw' || name === 'pwCheck') {
      setPwMatch(formData.userPw === value || formData.pwCheck === value);
    }
  };

  const togglePwVisibility = () => {
    setPwVisible(!pwVisible);
  };

  const deleteId = () => {
    // 회원 탈퇴 로직 구현
  };

  const editProfile = async (e) => {
    e.preventDefault();

    if (!formData.userPw || !formData.pwCheck) {
      alert('바꿀 비밀번호를 입력하세요');
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

    if (formData.userNick === '') {
      formData.userNick = user.userNick;
    }

    try {
      const response = await axios.post(
        'http://localhost:8090/plan/user/editProfile',
        formData
      );
      console.log('Response:', response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("유저정보", user);
    console.log("구글토큰", googleToken);
    console.log("인증 상태(라우터관리용)", isAuthenticated);
    console.log("유저이미지", user.image);
  }, [user, googleToken, isAuthenticated]);

  // 탭에 따라 다른 컴포넌트를 렌더링
  const renderContent = () => {
    if (activeTab === 'info') {
      return (
        <div className={styles.profile}>
          <img src={user.image} alt="User Profile" />
          <span>{user.userNick}</span>
          <div className={styles.inputGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              className={styles.inputField}
              value={user.userEmail}
              readOnly
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>닉네임</label>
            <input
              type="text"
              className={styles.inputField}
              value={user.userNick}
              readOnly
            />
          </div>
        </div>
      );
    } else if (activeTab === 'edit') {
      return (
        <div className={styles.formContainer}>
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
                autoComplete="new-password"
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
                autoComplete="new-password"
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
          <div className={styles.buttons}>
            <button className={styles.deleteButton} onClick={deleteId}>회원 탈퇴</button>
            <button className={styles.saveButton} onClick={editProfile}>정보수정</button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      {/* 탭 컨테이너 */}
      <div className={styles.headerBlock}>
        <div className={styles.tabContainer}>
          <div
            className={`${styles.tabItem} ${activeTab === 'info' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('info')}
          >
            정보 보기
          </div>
          <div
            className={`${styles.tabItem} ${activeTab === 'edit' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            정보 수정
          </div>
        </div>
      </div>

      {/* 탭에 따라 다른 내용 렌더링 */}
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default MyPage;

import React from "react";
import Spinner from "../images/icons/Spinner.gif";
import styles from "../styles/Loading.css"; // CSS 모듈을 사용할 경우

/**
 * Loading 컴포넌트.
 * 데이터를 불러오는 동안 사용자에게 로딩 애니메이션을 표시합니다.
 *
 * @return {JSX.Element} 로딩 화면 컴포넌트.
 */
const Loading = () => {
  return (
    <div className="loading-container">
      <h3>잠시만 기다려 주세요.</h3>
      <img src={Spinner} alt="로딩" width="10%" />
    </div>
  );
};

export default Loading;

import React from "react";
import Spinner from "../images/Spinner.gif";
import styles from "../styles/Loading.css"; // CSS 모듈을 사용할 경우

const Loading = () => {
    
  return (
    <div className="loading-container">
      <h3>잠시만 기다려 주세요.</h3>
      <img src={Spinner} alt="로딩" width="10%" />
    </div>
  );
};

export default Loading;
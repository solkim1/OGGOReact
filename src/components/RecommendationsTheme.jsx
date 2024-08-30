
import React from "react";
import styles from "../styles/RecommendationsTheme.module.css";

const RecommendationsTheme = () => {
  return (
    <div className={styles.themesContainer}>
      <div className={styles.themeItem}>
        <img src={require("../images/sungsoo.png")} alt="성수 거꾸로하우스" />
        <div className={styles.themeTitle}>HOT 성수 거꾸로하우스</div>
      </div>
      <div className={styles.themeItem}>
        <img src={require("../images/beach.png")} alt="파도와 함께하는 바다" />
        <div className={styles.themeTitle}>파도와 함께하는 바다</div>
      </div>
      <div className={styles.themeItem}>
        <img src={require("../images/history.png")} alt="역사 체험하기" />
        <div className={styles.themeTitle}>역사 체험하기</div>
      </div>
      <div className={styles.themeItem}>
        <img src={require("../images/country.png")} alt="레트로 촌캉스 여행" />
        <div className={styles.themeTitle}>레트로 촌캉스 여행</div>
      </div>
      <div className={styles.themeItem}>
        <img src={require("../images/slowtravel.jpg")} alt="슬로우 트래블" />
        <div className={styles.themeTitle}>한 걸음 늦게 슬로우 트래블</div>
      </div>
      <div className={styles.themeItem}>
        <img src={require("../images/camping.jpg")} alt="일상을 벗어나,캠핑 여행" />
        <div className={styles.themeTitle}>일상을 벗어나, 캠핑 여행</div>
      </div>
    </div>
  );
};


export default RecommendationsTheme;
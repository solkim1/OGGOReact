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
    </div>
  );
};

export default RecommendationsTheme;
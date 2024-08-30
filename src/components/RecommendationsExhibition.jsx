
import React from "react";
import styles from "../styles/RecommendationsExhibition.module.css";

const RecommendationsExhibition = () => {
  return (
    <div className={styles.exhibitionsContainer}>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/DANIEL ARSHAM.jpg")} alt="다니엘 아샴:서울 3024" />
        <div className={styles.exhibitionTitle}>다니엘 아샴 : 서울 3024</div>
      </div>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/kimjihee.jpg")} alt="김지희 개인전<DIVINITY>" />
        <div className={styles.exhibitionTitle}>김지희 개인전 - DIVINITY</div>
      </div>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/utopia.jpg")} alt="Utopia: Nowhere, Now Here" />
        <div className={styles.exhibitionTitle}>유토피아: Nowhere, Now Here</div>
      </div>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/james.jpg")} alt="James Rosenquist: Universe" />
        <div className={styles.exhibitionTitle}>제임스 로젠퀴스트 : Universe</div>
      </div>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/kiaf.jpeg")} alt="kiaf" />
        <div className={styles.exhibitionTitle}>시간을 초월한 표현 : 한국 미술</div>
      </div>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/Layered Life.png")} alt="새벽부터 황혼까지" />
        <div className={styles.exhibitionTitle}>정직성 : Layered Life</div>
      </div>
    </div>
  );
};

export default RecommendationsExhibition;

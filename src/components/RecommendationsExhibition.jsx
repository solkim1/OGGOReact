import React from "react";
import styles from "../styles/RecommendationsExhibition.module.css";

const RecommendationsExhibition = () => {
  return (
    <div className={styles.exhibitionsContainer}>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/dawn.png")} alt="너와 나 그리고 그곳" />
        <div className={styles.exhibitionTitle}>너와 나 그리고 그곳</div>
      </div>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/dawn.png")} alt="투명하고 향기나는 천사들" />
        <div className={styles.exhibitionTitle}>투명하고 향기나는 천사들</div>
      </div>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/dawn.png")} alt="새벽부터 황혼까지" />
        <div className={styles.exhibitionTitle}>새벽부터 황혼까지</div>
      </div>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/dawn.png")} alt="너와 나 그리고 그곳" />
        <div className={styles.exhibitionTitle}>너와 나 그리고 그곳</div>
      </div>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/dawn.png")} alt="투명하고 향기나는 천사들" />
        <div className={styles.exhibitionTitle}>투명하고 향기나는 천사들</div>
      </div>
      <div className={styles.exhibitionItem}>
        <img src={require("../images/dawn.png")} alt="새벽부터 황혼까지" />
        <div className={styles.exhibitionTitle}>새벽부터 황혼까지</div>
      </div>
    </div>
  );
};

export default RecommendationsExhibition;

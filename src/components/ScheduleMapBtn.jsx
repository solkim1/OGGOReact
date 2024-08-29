import React from "react";
import leftArrow from "../images/left-arrow.png";
import rightArrow from "../images/right-arrow.png";
import styles from "../styles/ScheduleMapBtn.module.css";

const ScheduleMapBtn = ({ handleNextPage, handlePrevPage, pageIndex, totalPages, handleRegenerate, handleSaveSchedule }) => {
  return (
    <div className={styles.btnContainer}>
      <button className={styles.arrowBtn} onClick={handlePrevPage} disabled={pageIndex === 0}>
        <img src={leftArrow} alt="Previous" className={styles.arrowIcon} />
      </button>
      <div className={styles.actionButtons}>
        <button className={styles.actionBtn} onClick={handleRegenerate}>다시 생성</button>
        <button className={styles.actionBtn} onClick={handleSaveSchedule}>일정 저장</button>
      </div>
      <button className={styles.arrowBtn} onClick={handleNextPage} disabled={pageIndex >= totalPages - 1}>
        <img src={rightArrow} alt="Next" className={styles.arrowIcon} />
      </button>
    </div>
  );
};

export default ScheduleMapBtn;

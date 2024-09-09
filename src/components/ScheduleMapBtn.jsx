import React from "react";
import leftArrow from "../images/icons/leftArrow.png";
import rightArrow from "../images/icons/rightArrow.png";
import styles from "../styles/ScheduleMapBtn.module.css";

/**
 * ScheduleMapBtn 컴포넌트.
 * 일정 지도 페이지에서 페이지 전환 및 일정 저장/재생성 버튼을 제공합니다.
 *
 * @param {Object} props - 컴포넌트의 props.
 * @param {Function} props.handleNextPage - 다음 페이지로 이동하는 함수.
 * @param {Function} props.handlePrevPage - 이전 페이지로 이동하는 함수.
 * @param {number} props.pageIndex - 현재 페이지 인덱스.
 * @param {number} props.totalPages - 총 페이지 수.
 * @param {Function} props.handleRegenerate - 일정 재생성 함수.
 * @param {Function} props.handleSaveSchedule - 일정을 저장하는 함수.
 * @return {JSX.Element} ScheduleMapBtn 컴포넌트를 반환합니다.
 */
const ScheduleMapBtn = ({
  handleNextPage,
  handlePrevPage,
  pageIndex,
  totalPages,
  handleRegenerate,
  handleSaveSchedule,
}) => {
  return (
    <div className={styles.btnContainer}>
      {/* 이전 페이지로 이동하는 버튼 */}
      <button className={styles.arrowBtn} onClick={handlePrevPage} disabled={pageIndex === 0}>
        <img src={leftArrow} alt="Previous" className={styles.arrowIcon} />
      </button>

      {/* 일정 재생성 및 저장 버튼 */}
      <div className={styles.actionButtons}>
        <button className={styles.actionBtn} onClick={handleRegenerate}>
          다시 생성
        </button>
        <button className={styles.actionBtn} onClick={handleSaveSchedule}>
          일정 저장
        </button>
      </div>

      {/* 다음 페이지로 이동하는 버튼 */}
      <button className={styles.arrowBtn} onClick={handleNextPage} disabled={pageIndex >= totalPages - 1}>
        <img src={rightArrow} alt="Next" className={styles.arrowIcon} />
      </button>
    </div>
  );
};

export default ScheduleMapBtn;

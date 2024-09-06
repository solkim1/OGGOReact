import React from "react";
import styles from "../styles/DateModal.module.css"; // 스타일 파일 추가

const DateModal = ({ isOpen, onClose, onConfirm, startDate, endDate, onStartDateChange, onEndDateChange }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>여행 날짜를 선택하세요</div>
        <div className={styles.modalMessage}>
          <div>
            <label htmlFor="startDate">출발일: </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={onStartDateChange}
              className={styles.dateInput}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label htmlFor="endDate">도착일: </label>
            <input type="date" id="endDate" value={endDate} onChange={onEndDateChange} className={styles.dateInput} />
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            className={`${styles.modalButton} ${styles.confirmButton}`}
            onClick={onConfirm}
            disabled={!startDate || !endDate}
          >
            확인
          </button>
          <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateModal;

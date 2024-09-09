import React from "react";
import styles from "../styles/DateModal.module.css"; // 스타일 파일 추가

/**
 * DateModal 컴포넌트.
 * 여행 날짜를 선택하는 모달 창을 렌더링합니다.
 *
 * @param {Object} props - 컴포넌트의 props.
 * @param {boolean} props.isOpen - 모달이 열려 있는지 여부.
 * @param {function} props.onClose - 모달을 닫는 함수.
 * @param {function} props.onConfirm - 확인 버튼 클릭 시 호출되는 함수.
 * @param {string} props.startDate - 선택된 시작 날짜.
 * @param {function} props.onStartDateChange - 날짜 변경 시 호출되는 함수.
 * @return {JSX.Element|null} 모달이 열려 있는 경우, 모달 컴포넌트를 반환합니다. 그렇지 않으면 null을 반환합니다.
 */
const DateModal = ({ isOpen, onClose, onConfirm, startDate, onStartDateChange }) => {
  // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* 모달 헤더 */}
        <div className={styles.modalHeader}>여행 날짜를 선택하세요</div>

        {/* 모달 메시지 - 날짜 입력 필드 */}
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
        </div>

        {/* 모달 하단의 액션 버튼들 */}
        <div className={styles.modalActions}>
          <button
            className={`${styles.modalButton} ${styles.confirmButton}`}
            onClick={onConfirm}
            disabled={!startDate} // 날짜가 선택되지 않은 경우 버튼 비활성화
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

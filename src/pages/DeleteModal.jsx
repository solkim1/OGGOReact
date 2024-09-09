import React from "react";
import styles from "../styles/DeleteModal.module.css"; // 필요한 경우 스타일 추가

/**
 * DeleteModal 컴포넌트.
 * 항목 삭제 시 사용자에게 확인을 요청하는 모달 창을 표시합니다.
 *
 * @param {Object} props - 컴포넌트의 props.
 * @param {boolean} props.isOpen - 모달이 열려 있는지 여부.
 * @param {Function} props.onClose - 모달을 닫는 함수.
 * @param {Function} props.onConfirm - 확인 버튼 클릭 시 호출되는 함수.
 * @param {string} props.header - 모달 헤더 텍스트.
 * @param {string} props.message - 모달 메시지 텍스트.
 * @return {JSX.Element|null} 모달이 열려 있는 경우, DeleteModal 컴포넌트를 반환합니다. 그렇지 않으면 null을 반환합니다.
 */
const DeleteModal = ({ isOpen, onClose, onConfirm, header, message }) => {
  // 모달이 열려 있지 않은 경우 null을 반환하여 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* 모달 헤더 */}
        <div className={styles.modalHeader}>{header}</div>
        {/* 모달 메시지 */}
        <div className={styles.modalMessage}>{message}</div>
        {/* 모달 버튼들 */}
        <div className={styles.modalActions}>
          <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={onConfirm}>
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

export default DeleteModal;

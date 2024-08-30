
import React from 'react';
import styles from '../styles/DeleteModal.module.css'; // 필요한 경우 스타일 추가

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>삭제 확인</div>
        <div className={styles.modalMessage}>정말로 이 일정을 삭제하시겠습니까?</div>
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


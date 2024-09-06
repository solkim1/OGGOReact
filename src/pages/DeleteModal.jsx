import React from 'react';
import styles from '../styles/DeleteModal.module.css'; // 필요한 경우 스타일 추가

const DeleteModal = ({ isOpen, onClose, onConfirm, header, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>{header}</div>
        <div className={styles.modalMessage}>{message}</div>
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

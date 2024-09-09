import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/MySchedulesPage.module.css';
import filledStar from '../images/icons/filled_star.png';
import emptyStar from '../images/icons/empty_star.png';
import deleteIcon from '../images/icons/delete.png';
import editIcon from '../images/icons/write.png';
import saveIcon from '../images/icons/save.png';
import axios from 'axios';
import DeleteModal from '../pages/DeleteModal';
import LocalCache from './LocalCache';

const ScheduleList = ({ schedules, fetchSchedules }) => {
  const [loading, setLoading] = useState(true);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [localSchedules, setLocalSchedules] = useState(schedules || []);

  const nav = useNavigate();

  useEffect(() => {
    if (schedules) {
      setLocalSchedules(schedules);
      setLoading(false);
    }
  }, [schedules]);

  const handleDelete = (scheduleNum) => {
    axios
      .delete(`/plan/api/schedules/delete/${scheduleNum}`)
      .then(() => {
        fetchSchedules(); // 삭제 후 전체 목록 다시 가져오기
        setIsModalOpen(false);
      })
      .catch((error) => console.error('Error deleting schedule:', error));
  };

  const toggleImportance = (scheduleNum, event) => {
    event.stopPropagation();

    // 낙관적 업데이트: UI를 먼저 변경
    const updatedSchedules = localSchedules.map((schedule) =>
      schedule.scheNum === scheduleNum
        ? { ...schedule, isImportance: schedule.isImportance === 'Y' ? 'N' : 'Y' }
        : schedule
    );
    setLocalSchedules(updatedSchedules); // UI 갱신

    // 실제 서버 요청
    axios
      .put(`/plan/api/schedules/toggleImportance/${scheduleNum}`)
      .then(() => {
        fetchSchedules();
      }) // 서버와 다시 동기화
      .catch((error) => {
        console.error('Error updating importance:', error);
        // 에러 발생 시, 원래 상태로 복원
        fetchSchedules();
      });
  };

  const startEditing = (schedule, event) => {
    event.stopPropagation();
    setEditingScheduleId(schedule.scheNum);
    setEditedTitle(schedule.scheTitle);
    setEditedDesc(schedule.scheDesc);
  };

  const saveChanges = (event) => {
    event.stopPropagation();
    const params = new URLSearchParams();
    params.append('scheNum', editingScheduleId);
    params.append('scheTitle', editedTitle);
    params.append('scheDesc', editedDesc);

    axios
      .put(`/plan/api/schedules/update`, params)
      .then(() => {
        setEditingScheduleId(null);
        fetchSchedules(); // 수정 후 전체 목록 다시 가져오기
      })
      .catch((error) => console.error('Error updating schedule:', error));
  };

  const openDeleteModal = (scheduleNum, event) => {
    event.stopPropagation();
    setScheduleToDelete(scheduleNum);
    setIsModalOpen(true);
  };

  const navigateToMap = (schedule) => {
    LocalCache.writeToCache('userMode', schedule.isBusiness === 'Y' ? 'business' : 'traveler');
    nav('/schedulemap', { state: { schedule } });
  };

  if (loading) {
    return <div>일정을 불러오는 중...</div>;
  }

  return (
    <div className={styles.scheduleList}>
      {localSchedules && localSchedules.length > 0 ? (
        localSchedules.map((schedule) => (
          <div
            key={schedule.scheNum}
            className={styles.scheduleItem}
            onClick={() => {
              if (editingScheduleId !== schedule.scheNum) {
                navigateToMap(schedule);
              }
            }}
          >
            <div className={styles.scheduleLeftIcons}>
              <div className={styles.icon}>
                <img
                  src={schedule.isImportance === 'Y' ? filledStar : emptyStar}
                  alt="Importance"
                  className={styles.star}
                  onClick={(event) => toggleImportance(schedule.scheNum, event)}
                />
              </div>
            </div>
            <div className={styles.scheduleContent}>
              <div className={styles.scheduleHeader}>
                <div className={styles.scheduleItemTitle}>
                  {editingScheduleId === schedule.scheNum ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className={styles.editInput}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          saveChanges(event);
                        }
                      }}
                    />
                  ) : (
                    schedule.scheTitle
                  )}
                </div>
                <div className={styles.scheduleDate}>
                  {schedule.scheStDt} ~ {schedule.scheEdDt}
                </div>
              </div>
              <div className={styles.scheduleItemDescription}>
                {editingScheduleId === schedule.scheNum ? (
                  <input
                    type="text"
                    value={editedDesc}
                    onChange={(e) => setEditedDesc(e.target.value)}
                    className={styles.editInput}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        saveChanges(event);
                      }
                    }}
                  />
                ) : (
                  schedule.scheDesc
                )}
              </div>
            </div>
            <div className={styles.scheduleRightIcons}>
              <img
                src={editingScheduleId === schedule.scheNum ? saveIcon : editIcon}
                alt="Edit"
                className={styles.icon}
                onClick={
                  editingScheduleId === schedule.scheNum ? saveChanges : (event) => startEditing(schedule, event)
                }
              />
              <img
                src={deleteIcon}
                alt="Delete"
                className={styles.icon}
                onClick={(event) => openDeleteModal(schedule.scheNum, event)}
              />
            </div>
          </div>
        ))
      ) : (
        <p>사용 가능한 일정이 없습니다.</p>
      )}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleDelete(scheduleToDelete)}
        header="삭제 확인"
        message="정말로 이 일정을 삭제하시겠습니까?"
      />
    </div>
  );
};

export default ScheduleList;

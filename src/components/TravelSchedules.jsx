import React, { useEffect, useState } from 'react';
import styles from '../styles/MySchedulesPage.module.css';
import filledStar from '../images/filled_star.png';
import emptyStar from '../images/empty_star.png';
import deleteIcon from '../images/delete.png';
import editIcon from '../images/write.png';
import saveIcon from '../images/save.png';
import travelerIcon from '../images/traveler-icon.png';
import axios from 'axios';
import DeleteModal from '../pages/DeleteModal';

const TravelSchedules = ({ schedules, fetchSchedules }) => {
  const [loading, setLoading] = useState(true);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, [schedules]);

  const handleDelete = (scheduleNum) => {
    axios.delete(`/plan/api/schedules/delete/${scheduleNum}`)
      .then(() => {
        fetchSchedules();
        setIsModalOpen(false);
      })
      .catch(error => console.error('Error deleting schedule:', error));
  };

  const toggleImportance = (scheduleNum) => {
    axios.put(`/plan/api/schedules/toggleImportance/${scheduleNum}`)
      .then(() => fetchSchedules())
      .catch(error => console.error('Error updating importance:', error));
  };

  const startEditing = (schedule) => {
    setEditingScheduleId(schedule.scheNum);
    setEditedTitle(schedule.scheTitle);
    setEditedDesc(schedule.scheDesc);
  };

  const saveChanges = () => {
    const params = new URLSearchParams();
    params.append('scheNum', editingScheduleId);
    params.append('scheTitle', editedTitle);
    params.append('scheDesc', editedDesc);

    axios.put(`/plan/api/schedules/update`, params)
      .then(() => {
        setEditingScheduleId(null);
        fetchSchedules();
      })
      .catch(error => {
        console.error('Error updating schedule:', error.response ? error.response.data : error);
      });
  };

  const openDeleteModal = (scheduleNum) => {
    setScheduleToDelete(scheduleNum);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div>일정을 불러오는 중...</div>;
  }

  return (
    <div className={styles.scheduleList}>
      {schedules && schedules.length > 0 ? schedules.map(schedule => (
        <div key={`${schedule.scheNum}-${schedule.scheTitle}`} className={styles.scheduleItem}>
          <div className={styles.scheduleLeftIcons}>
            <div className={styles.icon}>
              <img
                src={schedule.isImportance === 'Y' ? filledStar : emptyStar}
                alt="Importance"
                className={styles.star}
                onClick={() => toggleImportance(schedule.scheNum)}
              />
            </div>
            <div className={styles.icon}>
              <img
                src={travelerIcon}
                alt="Travel"
                className={styles.scheduleIcon}
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
                  />
                ) : (
                  schedule.scheTitle
                )}
              </div>
              <div className={styles.scheduleDate}>{schedule.scheStDt} ~ {schedule.scheEdDt}</div>
            </div>
            <div className={styles.scheduleItemDescription}>
              {editingScheduleId === schedule.scheNum ? (
                <input
                  type="text"
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  className={styles.editInput}
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
              onClick={editingScheduleId === schedule.scheNum ? saveChanges : () => startEditing(schedule)}
            />
            <img
              src={deleteIcon}
              alt="Delete"
              className={styles.icon}
              onClick={() => openDeleteModal(schedule.scheNum)}
            />
          </div>
        </div>
      )) : <p>사용 가능한 일정이 없습니다.</p>}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleDelete(scheduleToDelete)}
        message="정말로 이 일정을 삭제하시겠습니까?"
      />
    </div>
  );
};

export default TravelSchedules;
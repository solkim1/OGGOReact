import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  const nav = useNavigate();

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

  const toggleImportance = (scheduleNum, event) => {
    event.stopPropagation();  // 클릭 이벤트가 부모 요소로 전달되지 않도록 방지
    axios.put(`/plan/api/schedules/toggleImportance/${scheduleNum}`)
      .then(() => fetchSchedules())
      .catch(error => console.error('Error updating importance:', error));
  };

  const startEditing = (schedule, event) => {
    event.stopPropagation();  // 클릭 이벤트가 부모 요소로 전달되지 않도록 방지
    setEditingScheduleId(schedule.scheNum);
    setEditedTitle(schedule.scheTitle);
    setEditedDesc(schedule.scheDesc);
  };

  const saveChanges = (event) => {
    event.stopPropagation();  // 클릭 이벤트가 부모 요소로 전달되지 않도록 방지
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

  const openDeleteModal = (scheduleNum, event) => {
    event.stopPropagation();  // 클릭 이벤트가 부모 요소로 전달되지 않도록 방지
    setScheduleToDelete(scheduleNum);
    setIsModalOpen(true);
  };

  const testCheck = (num) => {
    nav("/schedulemap", { state: { scheNum: num } });
  }

  if (loading) {
    return <div>일정을 불러오는 중...</div>;
  }

  return (
    <div className={styles.scheduleList}>
      {schedules && schedules.length > 0 ? schedules.map(schedule => (
        <div key={`${schedule.scheNum}-${schedule.scheTitle}`} className={styles.scheduleItem} onClick={() => testCheck(schedule.scheNum)}>
          <div className={styles.scheduleLeftIcons}>
            <div className={styles.icon}>
              <img
                src={schedule.isImportance === 'Y' ? filledStar : emptyStar}
                alt="Importance"
                className={styles.star}
                onClick={(event) => toggleImportance(schedule.scheNum, event)}
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
                    onClick={(event) => event.stopPropagation()} // 입력 필드 클릭 시 이벤트 전파 방지
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
                  onClick={(event) => event.stopPropagation()} // 입력 필드 클릭 시 이벤트 전파 방지
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
              onClick={(event) => editingScheduleId === schedule.scheNum ? saveChanges(event) : startEditing(schedule, event)}
            />
            <img
              src={deleteIcon}
              alt="Delete"
              className={styles.icon}
              onClick={(event) => openDeleteModal(schedule.scheNum, event)}
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


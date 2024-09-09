import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MySchedulesPage.module.css";
import filledStar from "../images/icons/filled_star.png";
import emptyStar from "../images/icons/empty_star.png";
import deleteIcon from "../images/icons/delete.png";
import editIcon from "../images/icons/write.png";
import saveIcon from "../images/icons/save.png";
import axios from "axios";
import DeleteModal from "../pages/DeleteModal";
import LocalCache from "./LocalCache";

/**
 * ScheduleList 컴포넌트.
 * 사용자의 일정을 목록 형태로 보여주고, 일정의 편집, 중요도 토글, 삭제 기능을 제공합니다.
 *
 * @param {Object} props - 컴포넌트의 props.
 * @param {Array} props.schedules - 사용자의 일정 목록.
 * @param {Function} props.fetchSchedules - 최신 일정 목록을 가져오는 함수.
 * @return {JSX.Element} ScheduleList 컴포넌트를 반환합니다.
 */
const ScheduleList = ({ schedules, fetchSchedules }) => {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [editingScheduleId, setEditingScheduleId] = useState(null); // 현재 편집 중인 일정 ID
  const [editedTitle, setEditedTitle] = useState(""); // 편집된 일정 제목
  const [editedDesc, setEditedDesc] = useState(""); // 편집된 일정 설명
  const [isModalOpen, setIsModalOpen] = useState(false); // 삭제 확인 모달 상태
  const [scheduleToDelete, setScheduleToDelete] = useState(null); // 삭제할 일정 ID
  const [localSchedules, setLocalSchedules] = useState(schedules || []);

  const nav = useNavigate();

  /**
   * 컴포넌트가 마운트되거나 일정이 변경될 때 로딩 상태를 업데이트합니다.
   */
  useEffect(() => {
    if (schedules) {
      setLocalSchedules(schedules);
      setLoading(false);
    }
  }, [schedules]);

  /**
   * 일정을 삭제하는 함수.
   * @param {number} scheduleNum - 삭제할 일정의 ID.
   */
  const handleDelete = (scheduleNum) => {
    axios
      .delete(`/plan/api/schedules/delete/${scheduleNum}`)
      .then(() => {
        fetchSchedules();
        setIsModalOpen(false);
      })
      .catch((error) => console.error("Error deleting schedule:", error));
  };

  /**
   * 일정의 중요도를 토글하는 함수.
   * @param {number} scheduleNum - 중요도를 변경할 일정의 ID.
   * @param {Event} event - 클릭 이벤트 객체.
   */
  const toggleImportance = (scheduleNum, event) => {
    event.stopPropagation();
    const updatedSchedules = localSchedules.map((schedule) =>
      schedule.scheNum === scheduleNum
        ? { ...schedule, isImportance: schedule.isImportance === "Y" ? "N" : "Y" }
        : schedule
    );
    setLocalSchedules(updatedSchedules);
    axios
      .put(`/plan/api/schedules/toggleImportance/${scheduleNum}`)
      .then(() => fetchSchedules())
      .catch((error) => {
        console.error("Error updating importance:", error);
        fetchSchedules();
      });
  };

  /**
   * 일정 편집 모드를 시작하는 함수.
   * @param {Object} schedule - 편집할 일정 객체.
   * @param {Event} event - 클릭 이벤트 객체.
   */
  const startEditing = (schedule, event) => {
    event.stopPropagation();
    setEditingScheduleId(schedule.scheNum);
    setEditedTitle(schedule.scheTitle);
    setEditedDesc(schedule.scheDesc);
  };

  /**
   * 변경된 일정을 저장하는 함수.
   * @param {Event} event - 클릭 이벤트 객체.
   */
  const saveChanges = (event) => {
    event.stopPropagation();
    const params = new URLSearchParams();
    params.append("scheNum", editingScheduleId);
    params.append("scheTitle", editedTitle);
    params.append("scheDesc", editedDesc);

    axios
      .put(`/plan/api/schedules/update`, params)
      .then(() => {
        setEditingScheduleId(null);
        fetchSchedules();
      })
      .catch((error) => console.error("Error updating schedule:", error));
  };

  /**
   * 삭제 확인 모달을 여는 함수.
   * @param {number} scheduleNum - 삭제할 일정의 ID.
   * @param {Event} event - 클릭 이벤트 객체.
   */
  const openDeleteModal = (scheduleNum, event) => {
    event.stopPropagation();
    setScheduleToDelete(scheduleNum);
    setIsModalOpen(true);
  };

  /**
   * 선택한 일정의 상세 페이지로 이동하는 함수.
   * @param {Object} schedule - 이동할 일정 객체.
   */
  const navigateToMap = (schedule) => {
    LocalCache.writeToCache("userMode", schedule.isBusiness === "Y" ? "business" : "traveler");
    nav("/schedulemap", { state: { schedule } });
  };

  if (loading) {
    return <div>일정을 불러오는 중...</div>;
  }

  return (
    <div className={styles.scheduleList}>
      {schedules && schedules.length > 0 ? (
        schedules.map((schedule) => (
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
                  src={schedule.isImportance === "Y" ? filledStar : emptyStar}
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
                        if (event.key === "Enter") {
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
                      if (event.key === "Enter") {
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

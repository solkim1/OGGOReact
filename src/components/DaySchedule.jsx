import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LocalCache from "./LocalCache";
import style from "../styles/DaySchedule.module.css";

// DaySchedule 컴포넌트: 각 날짜별로 스케줄을 표시하고, 드래그 앤 드롭으로 스케줄 순서를 변경할 수 있는 기능을 제공
const DaySchedule = ({ selectedDay = "day1", setSelectedDay, locationData = {}, setLocationData }) => {
  // 일정 데이터를 관리하기 위한 상태 변수
  const [scheduleData, setScheduleData] = useState({});

  // locationData가 변경될 때마다 scheduleData를 업데이트
  useEffect(() => {
    setScheduleData(
      // locationData를 기반으로 scheduleData를 생성
      Object.keys(locationData).reduce((acc, day) => {
        acc[day] = locationData[day].map((item, index) => ({
          // 기존의 locationData 아이템에 draggableId를 추가하여 드래그 기능을 지원
          ...item,
          draggableId: `${day}-${index}`,
        }));
        return acc;
      }, {})
    );
  }, [locationData]);

  // 드래그 앤 드롭이 끝났을 때 호출되는 함수
  const onDragEnd = (result) => {
    // 드래그가 올바른 위치로 끝나지 않았을 경우 (destination이 없을 경우) 함수를 종료
    if (!result.destination) return;

    const { source, destination } = result;

    // 같은 리스트 내에서 순서를 변경한 경우
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(scheduleData[source.droppableId]); // 현재 드래그 중인 리스트의 아이템들을 배열로 복사
      const [reorderedItem] = items.splice(source.index, 1); // 드래그된 아이템을 원래 위치에서 제거
      items.splice(destination.index, 0, reorderedItem); // 드래그된 아이템을 새로운 위치에 삽입

      // 드래그 후 순서가 변경된 아이템들에 대해 출발 및 도착 시간을 유지하며 업데이트
      const updatedItems = items.map((item, index) => ({
        ...item,
        departTime: locationData[source.droppableId][index].departTime,
        arriveTime: locationData[source.droppableId][index].arriveTime,
      }));

      // 업데이트된 스케줄 데이터를 상태에 반영
      setScheduleData((prev) => ({
        ...prev,
        [source.droppableId]: updatedItems,
      }));

      // locationData를 업데이트하고, 변경된 데이터를 로컬 캐시에 저장
      setLocationData((prev) => {
        const newLocationData = {
          ...prev,
          [source.droppableId]: updatedItems,
        };

        LocalCache.writeToCache("travel_data_all", newLocationData); // 로컬 캐시에 데이터 저장

        return newLocationData;
      });
    }
  };

  // 스케줄에서 특정 항목을 제외하거나 다시 포함시키는 함수
  const handleExcludeSchedule = (day, index) => {
    setLocationData((prev) => {
      const newLocationData = {
        ...prev,
        [day]: prev[day].map((item, i) => 
          i === index ? { ...item, excluded: !item.excluded } : item // 해당 아이템의 excluded 상태를 토글
        ),
      };

      LocalCache.writeToCache("travel_data_all", newLocationData); // 변경된 데이터를 로컬 캐시에 저장

      return newLocationData;
    });
  };

  // 주어진 날짜의 스케줄을 렌더링하는 함수
  const renderSchedule = (day) => {
    const daySchedule = scheduleData[day]; // 해당 날짜의 스케줄 데이터를 가져옴
    const result = [];

    if (!daySchedule) return result; // 스케줄 데이터가 없으면 빈 배열 반환

    for (let i = 0; i < daySchedule.length; i++) {
      const item = daySchedule[i];
      const key = item.draggableId; // 드래그를 위한 고유 ID 생성

      result.push(
        <Draggable key={key} draggableId={key} index={i}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${style.scheduleItem} ${snapshot.isDragging ? style.dragging : ""} ${item.excluded ? style.excluded : ""}`}
            >
              <div className={style.scheduleItemIcon}></div>
              <div>
                <h3 className={style.scheduleItemTitle}>{item.name}</h3>
                <p className={style.scheduleItemDescription}>{item.description}</p>
                <div className={style.scheduleItemTime}>
                  {item.departTime} - {item.arriveTime}
                </div>
              </div>
              <button 
                className={style.excludeButton} 
                onClick={() => handleExcludeSchedule(day, i)}
              >
                {item.excluded ? '+' : '-'} {/* 제외 상태에 따라 버튼 텍스트 변경 */}
              </button>
            </div>
          )}
        </Draggable>
      );
    }

    return result; // 생성된 스케줄 항목들을 반환
  };

  const currentDays = Object.keys(scheduleData); // 현재 스케줄 데이터에 있는 모든 날들의 리스트를 가져옴

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={style.scheduleContainer}>
        <div className={style.scheduleListContainer}>
          {currentDays.map((day) => (
            <div key={day} className={`${style.scheduleListBackground} ${selectedDay === day ? style.selected : ""}`}>
              <button
                className={`${style.scheduleDaySelectButton} ${selectedDay === day ? style.selected : ""}`}
                onClick={() => setSelectedDay(day)} // 버튼 클릭 시 해당 날짜로 스케줄을 변경
              >
                {day} {/* 날짜 표시 */}
              </button>

              <Droppable droppableId={day} key={day}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={style.scheduleDroppable}>
                    {renderSchedule(day)} {/* 해당 날짜의 스케줄을 렌더링 */}
                    {provided.placeholder} {/* 드래그 앤 드롭 시 요소를 위한 공간을 유지 */}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default DaySchedule;

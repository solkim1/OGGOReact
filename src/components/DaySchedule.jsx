import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LocalCache from "./LocalCache";
import style from "../styles/DaySchedule.module.css";
import leftArrow from "../images/icons/leftArrow.png";
import rightArrow from "../images/icons/rightArrow.png";
import cafeIcon from "../images/icons/cafe.png";
import lodgingIcon from "../images/icons/lodging.png";
import restaurantIcon from "../images/icons/restaurant.png";
import defaultIcon from "../images/icons/default.png";
import exhibitionIcon from "../images/icons/exhibition.png";
import shoppingIcon from "../images/icons/shopping.png";
import businessIcon from "../images/icons/business.png";
import leportsIcon from "../images/icons/leports.png";
import tourSpotIcon2 from "../images/icons/tourspot2.png";

/**
 * 아이템 타입에 따라 해당 아이콘을 반환하는 함수.
 * @param {string} type - 아이템의 타입.
 * @return {string} - 아이템 타입에 따른 아이콘 이미지 경로.
 */
const getIcon = (type) => {
  switch (type) {
    case "관광지":
    case "여행지":
    case "관광":
      return tourSpotIcon2;
    case "식당":
    case "맛집":
      return restaurantIcon;
    case "카페":
      return cafeIcon;
    case "숙박":
    case "숙소":
      return lodgingIcon;
    case "전시회":
      return exhibitionIcon;
    case "레포츠":
      return leportsIcon;
    case "체험":
      return defaultIcon;
    case "쇼핑":
      return shoppingIcon;
    case "비즈니스":
      return businessIcon;
    default:
      return defaultIcon;
  }
};

/**
 * DaySchedule 컴포넌트.
 * 사용자가 선택한 날짜별 스케줄을 드래그 앤 드롭으로 관리하고 렌더링합니다.
 *
 * @param {Object} props - 컴포넌트의 props.
 * @param {string} props.selectedDay - 현재 선택된 날짜.
 * @param {function} props.setSelectedDay - 선택된 날짜를 설정하는 함수.
 * @param {Object} props.locationData - 위치 데이터 객체.
 * @param {function} props.setLocationData - 위치 데이터를 설정하는 함수.
 * @param {function} props.handleNextPage - 다음 페이지로 이동하는 함수.
 * @param {function} props.handlePrevPage - 이전 페이지로 이동하는 함수.
 * @param {number} props.pageIndex - 현재 페이지 인덱스.
 * @param {number} props.totalPages - 총 페이지 수.
 * @return {JSX.Element} DaySchedule 컴포넌트를 반환합니다.
 */
const DaySchedule = ({
  selectedDay = "day1",
  setSelectedDay,
  locationData = {},
  setLocationData,
  handleNextPage,
  handlePrevPage,
  pageIndex,
  totalPages,
}) => {
  const [scheduleData, setScheduleData] = useState({});

  /**
   * locationData가 변경될 때마다 scheduleData를 업데이트합니다.
   */
  useEffect(() => {
    setScheduleData(
      Object.keys(locationData).reduce((acc, day) => {
        if (Array.isArray(locationData[day])) {
          acc[day] = locationData[day].map((item, index) => ({
            ...item,
            draggableId: `${day}-${index}`,
          }));
        } else {
          console.error(`Invalid data for day: ${day}`, locationData[day]);
          acc[day] = []; // 빈 배열로 초기화하여 오류를 방지
        }
        return acc;
      }, {})
    );
  }, [locationData]);

  /**
   * 드래그 앤 드롭이 끝났을 때 호출되는 함수.
   * @param {Object} result - 드래그 앤 드롭 결과 객체.
   */
  const onDragEnd = (result) => {
    if (!result.destination) return; // 드래그가 올바른 위치로 끝나지 않았을 경우 종료

    const { source, destination } = result;

    // 같은 리스트 내에서 순서를 변경한 경우
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(scheduleData[source.droppableId]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedItems = items.map((item, index) => ({
        ...item,
        departTime: locationData[source.droppableId][index].departTime,
        arriveTime: locationData[source.droppableId][index].arriveTime,
      }));

      setScheduleData((prev) => ({
        ...prev,
        [source.droppableId]: updatedItems,
      }));

      setLocationData((prev) => {
        const newLocationData = {
          ...prev,
          [source.droppableId]: updatedItems,
        };

        LocalCache.writeToCache("travel_data_all", newLocationData);
        return newLocationData;
      });
    }
  };

  /**
   * 스케줄에서 특정 항목을 제외하거나 다시 포함시키는 함수.
   * @param {string} day - 변경할 스케줄이 속한 날짜.
   * @param {number} index - 변경할 스케줄의 인덱스.
   */
  const handleExcludeSchedule = (day, index) => {
    setLocationData((prev) => {
      const newLocationData = {
        ...prev,
        [day]: prev[day].map((item, i) => (i === index ? { ...item, excluded: !item.excluded } : item)),
      };

      LocalCache.writeToCache("travel_data_all", newLocationData);
      return newLocationData;
    });
  };

  /**
   * 주어진 날짜의 스케줄을 렌더링하는 함수.
   * @param {string} day - 스케줄을 렌더링할 날짜.
   * @return {Array<JSX.Element>} 렌더링된 스케줄 항목들.
   */
  const renderSchedule = (day) => {
    const daySchedule = scheduleData[day];
    const result = [];

    if (!daySchedule) return result;

    for (let i = 0; i < daySchedule.length; i++) {
      const item = daySchedule[i];
      const key = item.draggableId;
      const iconSrc = getIcon(item.type);
      result.push(
        <Draggable key={key} draggableId={key} index={i}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${style.scheduleItem} ${snapshot.isDragging ? style.dragging : ""} ${
                item.excluded ? style.excluded : ""
              }`}
            >
              <button className={style.excludeButton} onClick={() => handleExcludeSchedule(day, i)}>
                {item.excluded ? "+" : "-"}
              </button>

              <div className={style.scheduleItemTop}>
                <h3 className={style.scheduleItemTitle}>{item.name}</h3>
              </div>

              <div className={style.scheduleItemContent}>
                <img src={iconSrc} alt={item.type} className={style.scheduleItemIcon} />
                <div className={style.scheduleItemDetails}>
                  <p className={style.scheduleItemDescription}>{item.description}</p>
                  <div className={style.scheduleItemTime}>
                    {item.departTime} - {item.arriveTime}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      );
    }

    return result;
  };

  const currentDays = Object.keys(scheduleData);

  return (
    <div className={style.scheduleContainer}>
      <button className={style.arrowBtn} onClick={handlePrevPage} disabled={pageIndex === 0}>
        <img src={leftArrow} alt="Previous" className={style.arrowIcon} />
      </button>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={style.scheduleListContainer}>
          {currentDays.map((day) => (
            <div key={day} className={`${style.scheduleListBackground} ${selectedDay === day ? style.selected : ""}`}>
              <button
                className={`${style.scheduleDaySelectButton} ${selectedDay === day ? style.selected : ""}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
              <Droppable droppableId={day} key={day}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={style.scheduleDroppable}>
                    {renderSchedule(day)}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <button className={style.arrowBtn} onClick={handleNextPage} disabled={pageIndex >= totalPages - 1}>
        <img src={rightArrow} alt="Next" className={style.arrowIcon} />
      </button>
    </div>
  );
};

export default DaySchedule;

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LocalCache from "./LocalCache";
import style from "../styles/DaySchedule.module.css";
import leftArrow from "../images/left-arrow.png";
import rightArrow from "../images/right-arrow.png";
import cafeIcon from "../images/cafe.png";
import lodgingIcon from "../images/lodging.png";
import restaurantIcon from "../images/restaurant.png";
import tourSpotIcon from "../images/tourspot.png";
import defaultIcon from "../images/plain2.png";
import shoppingIcon from "../images/shopping.png";

const getIcon = (type) => {
  switch (type) {
    case "카페":
      return cafeIcon;
    case "숙박":
      return lodgingIcon;
    case "숙소":
      return lodgingIcon;
    case "식당":
      return restaurantIcon;
    case "맛집":
      return restaurantIcon;
    case "관광지":
      return tourSpotIcon;
    case "관광":
      return tourSpotIcon;
    case "쇼핑":
      return shoppingIcon;
    default:
      return defaultIcon;
  }
};

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

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

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
              {/* 우측 상단에 버튼 배치 */}
              <button className={style.excludeButton} onClick={() => handleExcludeSchedule(day, i)}>
                {item.excluded ? "+" : "-"}
              </button>

              {/* 상단에 제목을 배치 */}
              <div className={style.scheduleItemTop}>
                <h3 className={style.scheduleItemTitle}>{item.name}</h3>
              </div>

              {/* 아이콘과 설명 및 시간을 같은 줄에 배치 */}
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

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LocalCache from './LocalCache';
import style from '../styles/DaySchedule.module.css';
import leftArrow from '../images/icons/leftArrow.png';
import rightArrow from '../images/icons/rightArrow.png';
import cafeIcon from '../images/icons/cafe.png';
import lodgingIcon from '../images/icons/lodging.png';
import restaurantIcon from '../images/icons/restaurant.png';
import defaultIcon from '../images/plain2.png';
import shoppingIcon from '../images/icons/shopping.png';
import businessIcon from '../images/icons/business.png';
import reportsIcon from '../images/icons/reports.png';
import tourSpotIcon2 from '../images/icons/tourspot2.png';

const getIcon = (type) => {
  switch (type) {
    case '비즈니스':
      return businessIcon;
    case '카페':
      return cafeIcon;
    case '숙박':
      return lodgingIcon;
    case '숙소':
      return lodgingIcon;
    case '식당':
      return restaurantIcon;
    case '맛집':
      return restaurantIcon;
    case '관광지':
      return tourSpotIcon2;
    case '여행지':
      return tourSpotIcon2;
    case '관광':
      return tourSpotIcon2;
    case '쇼핑':
      return shoppingIcon;
    case '레포츠':
      return reportsIcon;
    default:
      return defaultIcon;
  }
};

const DaySchedule = ({
  selectedDay = 'day1',
  setSelectedDay,
  locationData = {},
  setLocationData,
  handleNextPage,
  handlePrevPage,
  pageIndex,
  totalPages,
}) => {
  const [scheduleData, setScheduleData] = useState({});

  // locationData가 변경될 때마다 scheduleData를 업데이트
  useEffect(() => {
    setScheduleData(
      // locationData를 기반으로 scheduleData를 생성
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

        LocalCache.writeToCache('travel_data_all', newLocationData); // 로컬 캐시에 데이터 저장

        return newLocationData;
      });
    }
  };

  // 스케줄에서 특정 항목을 제외하거나 다시 포함시키는 함수
  const handleExcludeSchedule = (day, index) => {
    setLocationData((prev) => {
      const newLocationData = {
        ...prev,
        [day]: prev[day].map((item, i) => (i === index ? { ...item, excluded: !item.excluded } : item)),
      };

      LocalCache.writeToCache('travel_data_all', newLocationData); // 변경된 데이터를 로컬 캐시에 저장

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
      const key = item.draggableId;
      const iconSrc = getIcon(item.type);
      result.push(
        <Draggable key={key} draggableId={key} index={i}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${style.scheduleItem} ${snapshot.isDragging ? style.dragging : ''} ${
                item.excluded ? style.excluded : ''
              }`}
            >
              {/* 우측 상단에 버튼 배치 */}
              <button className={style.excludeButton} onClick={() => handleExcludeSchedule(day, i)}>
                {item.excluded ? '+' : '-'}
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

    return result; // 생성된 스케줄 항목들을 반환
  };

  const currentDays = Object.keys(scheduleData); // 현재 스케줄 데이터에 있는 모든 날들의 리스트를 가져옴

  return (
    <div className={style.scheduleContainer}>
      <button className={style.arrowBtn} onClick={handlePrevPage} disabled={pageIndex === 0}>
        <img src={leftArrow} alt="Previous" className={style.arrowIcon} />
      </button>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={style.scheduleListContainer}>
          {currentDays.map((day) => (
            <div key={day} className={`${style.scheduleListBackground} ${selectedDay === day ? style.selected : ''}`}>
              <button
                className={`${style.scheduleDaySelectButton} ${selectedDay === day ? style.selected : ''}`}
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
      </DragDropContext>

      <button className={style.arrowBtn} onClick={handleNextPage} disabled={pageIndex >= totalPages - 1}>
        <img src={rightArrow} alt="Next" className={style.arrowIcon} />
      </button>
    </div>
  );
};

export default DaySchedule;

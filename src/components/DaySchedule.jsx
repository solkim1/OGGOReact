
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LocalCache from "./LocalCache";
import style from "../styles/DaySchedule.module.css";

const DaySchedule = ({ selectedDay = "day1", setSelectedDay, locationData = {}, setLocationData }) => {
  const [scheduleData, setScheduleData] = useState({});

  useEffect(() => {
    setScheduleData(
      Object.keys(locationData).reduce((acc, day) => {
        acc[day] = locationData[day].map((item, index) => ({
          ...item,
          draggableId: `${day}-${index}`,
        }));
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
        [day]: prev[day].map((item, i) => 
          i === index ? { ...item, excluded: !item.excluded } : item
        ),
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
                {item.excluded ? '+' : '-'}
              </button>
            </div>
          )}
        </Draggable>
      );
    }

    return result;
  };

  const currentDays = Object.keys(scheduleData);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={style.scheduleContainer}>
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
      </div>
    </DragDropContext>
  );
};

export default DaySchedule;



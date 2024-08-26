// src/components/DaySchedule.jsx

import React, { useEffect, useRef } from "react";
import PlainDraggable from "plain-draggable";

const DaySchedule = ({ selectedDay, setSelectedDay, locationData }) => {
  const containerRefs = useRef([]);

  useEffect(() => {
    containerRefs.current.forEach((container, containerIndex) => {
      if (container) {
        const poiElements = container.querySelectorAll("[name='scheduleListPOI']");
        poiElements.forEach((poiElement, index) => {
          new PlainDraggable(poiElement, {
            containment: container, // scheduleListBackground 내부로만 이동 제한
            handle: poiElement,
            onDrag: function (newPosition) {
              const poiArray = Array.from(poiElements);
              poiArray.sort((a, b) => {
                return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
              });

              // 화면적으로 위치를 업데이트
              poiArray.forEach((el) => {
                container.appendChild(el);
              });
            },
          });
        });
      }
    });
  }, [locationData]);

  return (
    <div style={{ display: "flex", flex: 1, marginLeft: "10px", marginRight: "10px" }}>
      {Object.keys(locationData).map((day, dayIndex) => (
        <div
          name={"scheduleListBackground"}
          key={dayIndex}
          ref={(el) => (containerRefs.current[dayIndex] = el)}
          style={{
            flex: 1,
            marginRight: "10px",
            padding: "10px",
            backgroundColor: selectedDay === day ? "#ff0000" : "#00ff00", // 날짜별로 배경색 구분
            borderRadius: "8px",
          }}
        >
          <button
            name={"scheduleDaySelectButton"}
            onClick={() => setSelectedDay(day)}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: selectedDay === day ? "#003499" : "#f0f0f0",
              color: selectedDay === day ? "#ffffff" : "#000000",
              border: "none",
              borderRadius: "5px",
              width: "100%",
            }}
          >
            {day}
          </button>
          {locationData[day]?.map((location, index) => (
            <div
              name={"scheduleListPOI"}
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#ffffff",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>{location.name}</h3>
              <p style={{ margin: "0" }}>{location.description}</p>
              <p style={{ margin: "0 0 5px 0" }}>
                {location.departTime}-{location.arriveTime}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DaySchedule;

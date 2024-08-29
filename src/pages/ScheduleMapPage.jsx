import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ScheduleMapBtn from "../components/ScheduleMapBtn";
import Map from "../components/Map";
import DaySchedule from "../components/DaySchedule";
import logo from "../images/logo.png";
import styles from "../styles/ScheduleMapPage.module.css";
import LocalCache from "../components/LocalCache";

const ScheduleMapPage = () => {
  const location = useLocation();
  const { userId, days, ageGroup, gender, groupSize, theme, startDate, endDate } = location.state || {};

  const [locationData, setLocationData] = useState({});
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState("day1");
  const [mapCenter, setMapCenter] = useState({ lat: 37.5666103, lng: 126.9783882 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 3;

  // 데이터 캐시에서 읽어오는 함수
  const fetchSchedule = useCallback(
    async (start, end) => {
      const cacheKey = "scheduleData"; // 캐시 키 설정
      try {
        // 캐시에서 데이터 읽기
        const cachedData = await LocalCache.readFromCache(cacheKey);
        if (cachedData) {
          console.log("Cached data found:", cachedData);
          setLocationData(cachedData);

          const firstLocation = cachedData[selectedDay]?.[0];
          if (firstLocation) {
            setMapCenter({ lat: parseFloat(firstLocation.lat), lng: parseFloat(firstLocation.lng) });
          }

          setScheduleTitle(cachedData.title || "여행 일정");
          setLoading(false);
          return; // 캐시 데이터가 있을 경우, API 호출 생략
        }

        // 캐시가 없을 경우 API 호출
        const response = await fetch(
          `/plan/api/schedules/generate?userId=${userId}&days=${days}&ageGroup=${ageGroup}&gender=${gender}&groupSize=${groupSize}&theme=${theme}&startDate=${startDate}&endDate=${endDate}&pageStart=${start}&pageEnd=${end}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch schedule");
        }

        const data = await response.json();
        console.log("Received data:", data);

        // 데이터 저장 및 캐시에 쓰기
        setLocationData(data);
        LocalCache.writeToCache(cacheKey, data); // 캐시에 저장

        const firstLocation = data[selectedDay]?.[0];
        if (firstLocation) {
          setMapCenter({ lat: parseFloat(firstLocation.lat), lng: parseFloat(firstLocation.lng) });
        }
        setScheduleTitle(data.title || "여행 일정");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("데이터를 불러오는 데 실패했습니다: " + error.message);
      } finally {
        setLoading(false);
      }
    },
    [userId, days, ageGroup, gender, groupSize, theme, startDate, endDate, selectedDay]
  );

  useEffect(() => {
    fetchSchedule(1, itemsPerPage); // 초기 데이터 가져오기
  }, [fetchSchedule]);

  useEffect(() => {
    if (locationData[selectedDay] && locationData[selectedDay].length > 0) {
      const firstLocation = locationData[selectedDay][0];
      setMapCenter({ lat: parseFloat(firstLocation.lat), lng: parseFloat(firstLocation.lng) });
    }
  }, [selectedDay, locationData]);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/plan/api/schedules/regenerate", {
        method: "POST",
        body: JSON.stringify({ selectedDay, locationData: locationData[selectedDay] }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to regenerate schedule");
      }
      const data = await response.json();
      setLocationData((prevData) => ({ ...prevData, [selectedDay]: data[selectedDay] }));
    } catch (err) {
      setError("일정 재생성에 실패했습니다: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      const response = await fetch("/plan/api/schedules/save", {
        method: "POST",
        body: JSON.stringify({ userId, locationData, startDate, endDate }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        alert("일정이 성공적으로 저장되었습니다!");
      } else {
        throw new Error("Failed to save schedule");
      }
    } catch (err) {
      alert("일정 저장 중 오류가 발생했습니다: " + err.message);
    }
  };

  const handleNextPage = () => {
    const nextPageIndex = pageIndex + 1;
    setPageIndex(nextPageIndex);
    if (!locationData[`day${nextPageIndex * itemsPerPage + 1}`]) {
      fetchSchedule(nextPageIndex * itemsPerPage + 1, (nextPageIndex + 1) * itemsPerPage);
    }
  };

  const handlePrevPage = () => {
    setPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const totalPages = useMemo(() => Math.ceil(days / itemsPerPage), [days]);
  const displayedDays = useMemo(
    () =>
      Array.from({ length: itemsPerPage }, (_, i) => `day${pageIndex * itemsPerPage + i + 1}`).filter(
        (day) => locationData[day]
      ),
    [locationData, pageIndex, itemsPerPage]
  );

  if (loading && Object.keys(locationData).length === 0) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (Object.keys(locationData).length === 0) {
    return <p>데이터가 없습니다.</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <img src={logo} alt="Plan Maker" className={styles.logo} />
        <h2>{scheduleTitle}</h2>
        <h3>
          {startDate} - {endDate}
        </h3>
        <ScheduleMapBtn
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          pageIndex={pageIndex}
          totalPages={totalPages}
          handleRegenerate={handleRegenerate}
          handleSaveSchedule={handleSaveSchedule}
        />
        <DaySchedule
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          locationData={displayedDays.reduce((acc, day) => {
            acc[day] = locationData[day];
            return acc;
          }, {})}
          setLocationData={setLocationData}
        />
      </div>
      <Map locations={locationData[selectedDay] || []} center={mapCenter} />
    </div>
  );
};

export default ScheduleMapPage;

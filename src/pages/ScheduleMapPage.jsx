import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScheduleMapBtn from "../components/ScheduleMapBtn";
import Map from "../components/Map";
import DaySchedule from "../components/DaySchedule";
import logo from "../images/logo.png";
import styles from "../styles/ScheduleMapPage.module.css";
import LocalCache from "../components/LocalCache";
import { UserContext } from "../context/UserProvider";
import { v4 as uuidv4 } from "uuid";

const ScheduleMapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const { userId, days, ageGroup, gender, groupSize, theme, startDate, endDate } = location.state || {};

  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [locationData, setLocationData] = useState({});
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState("day1");
  const [mapCenter, setMapCenter] = useState({ lat: 37.5666103, lng: 126.9783882 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchInitialMode = async () => {
      const cachedMode = await LocalCache.readFromCache("userMode");
      if (cachedMode) {
        setIsBusinessMode(cachedMode === "business");
      }
    };
    fetchInitialMode();
  }, []);

  const fetchSchedule = useCallback(
    async (start, end) => {
      const cacheKey = "scheduleData";
      setLoading(true);
      try {
        const cachedData = await LocalCache.readFromCache(cacheKey);
        if (cachedData) {
          console.log("Cached data found:", cachedData);
          setLocationData(cachedData);
          setScheduleTitle(cachedData.title || "여행 일정");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/plan/api/schedules/generate?userId=${userId}&days=${days}&ageGroup=${ageGroup}&gender=${gender}&groupSize=${groupSize}&theme=${theme}&startDate=${startDate}&endDate=${endDate}&pageStart=${start}&pageEnd=${end}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch schedule");
        }

        const data = await response.json();
        console.log("Received data:", data);

        setLocationData(data);
        LocalCache.writeToCache(cacheKey, data);

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
    fetchSchedule(1, itemsPerPage);
  }, [fetchSchedule, itemsPerPage]);

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
      const scheNum = uuidv4();
      const baseDate = new Date(startDate);

      const scheduleDataArray = Object.entries(locationData).flatMap(([day, locations]) => {
        const dayIndex = parseInt(day.replace("day", "")) - 1;
        const currentStartDate = new Date(baseDate);
        currentStartDate.setDate(baseDate.getDate() + dayIndex);
        const formattedStartDate = currentStartDate.toISOString().split("T")[0];

        return locations.map((loc) => ({
          scheduleDesc: "일정을 입력하세요",
          userId: user?.userId,
          title: scheduleTitle,
          scheNum: scheNum,
          startDate: formattedStartDate,
          endDate: formattedStartDate,
          isBusiness: isBusinessMode ? "Y" : "N",
          name: loc.name,
          description: loc.description,
          departTime: loc.departTime,
          arriveTime: loc.arriveTime,
          lat: loc.lat,
          lng: loc.lng,
          type: loc.type,
        }));
      });

      console.log("Sending data:", scheduleDataArray);

      const response = await fetch("/plan/api/schedules/save", {
        method: "POST",
        body: JSON.stringify(scheduleDataArray),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`일정 저장 실패: ${errorData}`);
      }

      const result = await response.text();
      console.log("저장 결과:", result);

      alert("모든 일정이 성공적으로 저장되었습니다.");
    } catch (err) {
      alert(`일정 저장 중 오류가 발생했습니다: ${err.message}`);
      console.error("일정 저장 중 오류 발생:", err);
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

  const goToHomePage = () => {
    if (isBusinessMode) {
      navigate("/business");
    } else {
      navigate("/traveler");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <img src={logo} alt="Plan Maker" className={styles.logo} onClick={goToHomePage} />
        <h2 className={styles.scheduleTitleContainer}>
          <span className={styles.scheduleTitle}>{scheduleTitle}</span>
          <span className={styles.scheduleDate}>
            {startDate} - {endDate}
          </span>
        </h2>
        <div className={styles.buttonAndScheduleContainer}>
          <div className={styles.navigationButtons}>
            <ScheduleMapBtn
              handleRegenerate={handleRegenerate}
              handleSaveSchedule={handleSaveSchedule}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              pageIndex={pageIndex}
              totalPages={totalPages}
            />
          </div>
          <DaySchedule
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            pageIndex={pageIndex}
            totalPages={totalPages}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            locationData={displayedDays.reduce((acc, day) => {
              acc[day] = locationData[day];
              return acc;
            }, {})}
            setLocationData={setLocationData}
          />
        </div>
      </div>
      <Map locations={locationData[selectedDay] || []} center={mapCenter} />
    </div>
  );
};

export default ScheduleMapPage;

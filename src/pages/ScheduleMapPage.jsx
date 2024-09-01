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

  const {
    userId = user?.userId,
    days = 3,
    ageGroup = "10대~20대",
    gender = "남성",
    groupSize = "개인",
    theme = "레포츠",
    startDate,
    endDate,
    exhibitionData,
    exhibitionName,
    isBusiness = false,
    region = "서울",
    includeOptions = ["전시회", "식당", "카페"],
    startTime = "09:00",
    endTime = "18:00",
  } = location.state || {};

  const [isBusinessMode, setIsBusinessMode] = useState(isBusiness);
  const [locationData, setLocationData] = useState({});
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState("day1");
  const [mapCenter, setMapCenter] = useState({ lat: 37.5666103, lng: 126.9783882 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isThemeSchedule, setIsThemeSchedule] = useState(false);
  const [isExhibitionSchedule, setIsExhibitionSchedule] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let fetchUrl = "";
        if (location.state?.themeData) {
          setLocationData(location.state.themeData);
          setIsThemeSchedule(true);
          setScheduleTitle(`${location.state.themeName} 테마 여행`);
          setLoading(false);
        } else if (location.state?.exhibitionData) {
          const exhibitionSchedule = Array.isArray(location.state.exhibitionData)
            ? { day1: location.state.exhibitionData }
            : location.state.exhibitionData;
          setLocationData(exhibitionSchedule);
          setIsExhibitionSchedule(true);
          setScheduleTitle(`${location.state.exhibitionName} 전시회 일정`);
          setLoading(false);
        } else {
          if (isBusinessMode) {
            fetchUrl = await generateBusinessPrompt();
          } else {
            fetchUrl = await generateTravelPrompt();
          }

          console.log("Fetch URL:", fetchUrl);

          const response = await fetch(fetchUrl);
          if (!response.ok) {
            throw new Error("Failed to fetch schedule");
          }

          const data = await response.json();
          console.log("Fetched data:", data);

          if (!data || typeof data !== "object") {
            throw new Error("Invalid data format");
          }

          setLocationData(data);

          const firstDay = Object.keys(data)[0];
          const firstLocation = data[firstDay]?.[0];
          if (firstLocation) {
            setMapCenter({ lat: parseFloat(firstLocation.lat), lng: parseFloat(firstLocation.lng) });
          }
          setScheduleTitle(data.title || (isBusinessMode ? "출장 일정" : "여행 일정"));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("일정을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.state, isBusinessMode]);

  useEffect(() => {
    if (locationData[selectedDay] && locationData[selectedDay].length > 0) {
      const firstLocation = locationData[selectedDay][0];
      setMapCenter({ lat: parseFloat(firstLocation.lat), lng: parseFloat(firstLocation.lng) });
    }
  }, [selectedDay, locationData]);

  const generateBusinessPrompt = async () => {
    return `/plan/api/schedules/business/generate?userId=${userId}&days=${days}&region=${region}&includeOptions=${includeOptions.join(
      ","
    )}&startTime=${startTime}&endTime=${endTime}&startDate=${startDate}&endDate=${endDate}`;
  };

  const generateTravelPrompt = async () => {
    return `/plan/api/schedules/travel/generate?userId=${userId}&days=${days}&ageGroup=${ageGroup}&gender=${gender}&groupSize=${groupSize}&theme=${theme}&startDate=${startDate}&endDate=${endDate}`;
  };

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

      const cachedData = await LocalCache.readFromCache("scheduleData");
      const currentLocationData = cachedData || locationData;

      const scheduleDataArray = Object.entries(currentLocationData).flatMap(([day, locations]) => {
        const dayIndex = parseInt(day.replace("day", "")) - 1;
        const currentStartDate = new Date(baseDate);
        currentStartDate.setDate(baseDate.getDate() + dayIndex);
        const formattedStartDate = currentStartDate.toISOString().split("T")[0];

        return locations.map((loc) => {
          let departTime = loc.departTime;
          let arriveTime = loc.arriveTime;

          if (loc.type === "숙박") {
            departTime = loc.checkInTime || "15:00";
            arriveTime = loc.checkOutTime || "11:00";
          }

          if (!departTime) departTime = "09:00";
          if (!arriveTime) arriveTime = "18:00";

          return {
            scheduleDesc: "일정을 입력하세요",
            userId: user?.userId,
            title: scheduleTitle,
            scheNum: scheNum,
            startDate: formattedStartDate,
            endDate: formattedStartDate,
            isBusiness: isBusinessMode ? "Y" : "N",
            name: loc.name,
            description: loc.description,
            departTime: departTime,
            arriveTime: arriveTime,
            lat: loc.lat,
            lng: loc.lng,
            type: loc.type,
            sche_st_tm: departTime,
            sche_ed_tm: arriveTime,
          };
        });
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
  };

  const handlePrevPage = () => {
    setPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const totalPages = useMemo(() => Math.ceil(days / itemsPerPage), [days, itemsPerPage]);
  const displayedDays = useMemo(
    () =>
      Array.from({ length: itemsPerPage }, (_, i) => `day${pageIndex * itemsPerPage + i + 1}`).filter(
        (day) => locationData[day]
      ),
    [locationData, pageIndex, itemsPerPage]
  );

  const calculateEndDate = (startDate, days) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + days - 1);
    return date.toISOString().split("T")[0];
  };

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
            {isExhibitionSchedule
              ? startDate
              : isThemeSchedule
              ? `${startDate} - ${calculateEndDate(startDate, Object.keys(locationData).length)}`
              : `${startDate} - ${endDate}`}
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
              acc[day] = locationData[day] || [];
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
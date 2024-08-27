import React, { useState, useEffect, useCallback } from "react";
import LocalCache from "../components/LocalCache";
import ScheduleMapBtn from "../components/ScheduleMapBtn";
import Map from "../components/Map";
import DaySchedule from "../components/DaySchedule";
import logo from "../images/logo.png"; // Assuming the path is correct
import styles from "../styles/ScheduleMapPage.module.css";

const ScheduleMapPage = () => {
  const [locationData, setLocationData] = useState(null);
  const [selectedDay, setSelectedDay] = useState("day1");
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 127.009 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);

  const itemsPerPage = 3;

  const fetchLocationData = useCallback(async () => {
    const cacheKey = "travel_data_all";
    let data = await LocalCache.readFromCache(cacheKey);

    if (!data) {
      try {
        const response = await fetch("http://localhost:8090/plan/map/mapdata");
        data = await response.json();
        await LocalCache.writeToCache(cacheKey, data);
      } catch (err) {
        setError("데이터를 가져오는 중에 오류가 발생했습니다.");
        setLoading(false);
        return;
      }
    }

    const transformedData = transformDataWithIds(data);

    setLocationData(transformedData);
    setLoading(false);
  }, []);

  const transformDataWithIds = (data) => {
    return Object.keys(data).reduce((acc, day) => {
      acc[day] = data[day].map((item, index) => ({
        ...item,
        draggableId: `${day}-${index}`,
      }));
      return acc;
    }, {});
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const totalPages = locationData ? Math.ceil(Object.keys(locationData).length / itemsPerPage) : 0;

  useEffect(() => {
    const loadLocationData = async () => {
      await fetchLocationData();
      if (locationData) {
        const firstLocation = locationData[selectedDay][0];
        setMapCenter({ lat: parseFloat(firstLocation.lat), lng: parseFloat(firstLocation.lng) });
      }
    };

    if (!locationData) {
      loadLocationData();
    }
  }, [fetchLocationData, selectedDay, locationData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!locationData || !locationData[selectedDay]) {
    return <p>데이터가 없습니다.</p>;
  }

  const displayedDays = locationData
    ? Object.keys(locationData).slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage)
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <img src={logo} alt="Plan Maker" className={styles.logo} />
        <h2>서울</h2>
        <h3>2024.08.21(수)-08.23(금)</h3>
        <ScheduleMapBtn
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          pageIndex={pageIndex}
          totalPages={totalPages}
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
      <Map locations={locationData[selectedDay]} center={mapCenter} />
    </div>
  );
};

export default ScheduleMapPage;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "../styles/MySchedulesPage.module.css";
import ScheduleList from "../components/ScheduleList";
import { UserContext } from "../context/UserProvider";
import { HeaderColorContext } from "../context/HeaderColorContext"; // 헤더 컬러 컨텍스트 추가

const MySchedulesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [allSchedules, setAllSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ all: 0, travel: 0, business: 0, important: 0 });
  const { user } = useContext(UserContext);

  const { headerColor } = useContext(HeaderColorContext); // 헤더 컬러 컨텍스트 사용

  useEffect(() => {
    if (user) {
      fetchSchedules();
    }
  }, [user]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const url = `/plan/api/schedules/all?userId=${user.userId}`; // 모든 일정 데이터를 가져옴
      const response = await axios.get(url);
      const schedules = response.data;

      setAllSchedules(schedules);

      // 탭별 일정 개수를 계산하여 업데이트
      setCounts({
        all: schedules.length,
        travel: schedules.filter((schedule) => schedule.isBusiness === "N").length,
        business: schedules.filter((schedule) => schedule.isBusiness === "Y").length,
        important: schedules.filter((schedule) => schedule.isImportance === "Y").length,
      });
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
    setLoading(false);
  };

  const getFilteredSchedules = () => {
    switch (activeTab) {
      case "travel":
        return allSchedules.filter((schedule) => schedule.isBusiness === "N");
      case "business":
        return allSchedules.filter((schedule) => schedule.isBusiness === "Y");
      case "important":
        return allSchedules.filter((schedule) => schedule.isImportance === "Y");
      default:
        return allSchedules;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 헤더 영역의 배경색을 headerColor로 동적으로 설정 */}
      <div style={{ backgroundColor: headerColor }}>
        <div className={styles.headerBlock}>
          <div className={styles.tabContainer}>
            {[
              { key: "all", label: "전체 일정" },
              { key: "travel", label: "여행 일정" },
              { key: "business", label: "출장 일정" },
              { key: "important", label: "주요 일정" },
            ].map((tab) => (
              <div
                key={tab.key}
                className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <div className={styles.tabContent}>
                  <div className={styles.tabCount}>{counts[tab.key]}</div>
                  <div className={styles.tabLabel}>{tab.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.container}>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <ScheduleList
            schedules={getFilteredSchedules()} // 필터링된 데이터를 ScheduleList에 전달
            fetchSchedules={fetchSchedules}
          />
        )}
      </div>
    </div>
  );
};

export default MySchedulesPage;

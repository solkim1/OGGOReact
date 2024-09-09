import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "../styles/MySchedulesPage.module.css";
import ScheduleList from "../components/ScheduleList";
import { UserContext } from "../context/UserProvider";
import { HeaderColorContext } from "../context/HeaderColorContext"; // 헤더 컬러 컨텍스트 추가

/**
 * 마이 스케줄 페이지 컴포넌트.
 * 사용자 일정 목록을 필터링하고 표시하는 기능을 제공.
 *
 * @return {JSX.Element} 마이 스케줄 페이지 컴포넌트.
 */
const MySchedulesPage = () => {
  const [activeTab, setActiveTab] = useState("all"); // 현재 활성화된 탭
  const [allSchedules, setAllSchedules] = useState([]); // 모든 일정 데이터
  const [counts, setCounts] = useState({ all: 0, travel: 0, business: 0, important: 0 }); // 각 탭의 일정 개수
  const { user } = useContext(UserContext);
  const { headerColor } = useContext(HeaderColorContext); // 헤더 컬러 컨텍스트 사용

  // 사용자 정보를 기반으로 일정을 가져옴
  useEffect(() => {
    if (user) {
      fetchSchedules();
    }
  }, [user]);

  /**
   * 모든 일정 데이터를 서버에서 가져오는 함수.
   */
  const fetchSchedules = async () => {
    try {
      const url = `/plan/api/schedules/all?userId=${user.userId}`; // 모든 일정 데이터를 가져오는 API URL
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
  };

  /**
   * 현재 활성화된 탭에 따라 일정 목록을 필터링하는 함수.
   *
   * @return {Array} 필터링된 일정 목록.
   */
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
        <ScheduleList schedules={getFilteredSchedules()} fetchSchedules={fetchSchedules} />
      </div>
    </div>
  );
};

export default MySchedulesPage;

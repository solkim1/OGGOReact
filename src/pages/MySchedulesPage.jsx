import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "../styles/MySchedulesPage.module.css";
import AllSchedules from "../components/AllSchedules";
import TravelSchedules from "../components/TravelSchedules";
import BusinessSchedules from "../components/BusinessSchedules";
import ImportantSchedules from "../components/ImportantSchedules";
import { UserContext } from "../context/UserProvider";
import { HeaderColorContext } from "../context/HeaderColorContext"; // 추가

const MySchedulesPage = () => {
  // 활성화된 탭 상태를 저장합니다.
  const [activeTab, setActiveTab] = useState("all");

  // 일정 목록과 각 탭에 대한 일정 수를 저장합니다.
  const [schedules, setSchedules] = useState([]);
  const [counts, setCounts] = useState({ all: 0, travel: 0, business: 0, important: 0 });

  // 사용자 정보를 UserContext에서 가져옵니다.
  const { user } = useContext(UserContext);

  const { headerColor } = useContext(HeaderColorContext); // 헤더 컬러 컨텍스트 사용

  useEffect(() => {
    // 사용자가 로그인된 경우 일정 수와 일정을 가져옵니다.
    if (user) {
      fetchCounts();
      fetchSchedules();
    }
  }, [user, activeTab]); // user 또는 activeTab이 변경될 때마다 호출됩니다.

  // 각 탭에 대한 일정 수를 가져옵니다.
  const fetchCounts = async () => {
    try {
      // 사용자 ID를 포함한 API 요청 URL을 정의합니다.
      const allUrl = `/plan/api/schedules/all?userId=${user.userId}`;
      const travelUrl = `/plan/api/schedules/travel?userId=${user.userId}`;
      const businessUrl = `/plan/api/schedules/business?userId=${user.userId}`;
      const importantUrl = `/plan/api/schedules/important?userId=${user.userId}`;

      // 병렬로 API 요청을 보내고 응답을 받습니다.
      const [allResponse, travelResponse, businessResponse, importantResponse] = await Promise.all([
        axios.get(allUrl),
        axios.get(travelUrl),
        axios.get(businessUrl),
        axios.get(importantUrl),
      ]);

      // 각 탭에 대한 일정 수를 업데이트합니다.
      setCounts({
        all: allResponse.data.length,
        travel: travelResponse.data.length,
        business: businessResponse.data.length,
        important: importantResponse.data.length,
      });
    } catch (error) {
      // 에러 발생 시 콘솔에 오류 메시지를 출력합니다.
      console.error("Error fetching schedule counts:", error);
    }
  };

  // 현재 활성화된 탭에 대한 일정을 가져옵니다.
  const fetchSchedules = async () => {
    try {
      // 활성화된 탭에 맞는 API 요청 URL을 정의합니다.
      const url = `/plan/api/schedules/${activeTab}?userId=${user.userId}`;
      const response = await axios.get(url);

      // 일정 데이터를 상태에 저장합니다.
      setSchedules(response.data);
    } catch (error) {
      // 에러 발생 시 콘솔에 오류 메시지를 출력합니다.
      console.error("Error fetching schedules:", error);
    }
  };

  // 일정 삭제 및 업데이트 후 일정을 다시 가져오고 일정 수를 갱신합니다.
  const handleActionComplete = () => {
    fetchSchedules();
    fetchCounts();
  };

  // 현재 활성화된 탭에 맞는 일정 컴포넌트를 렌더링합니다.
  const renderSchedules = () => {
    const props = {
      schedules,
      fetchSchedules: handleActionComplete, // 일정 클릭 및 삭제 후 동적으로 탭 개수 갱신
    };

    switch (activeTab) {
      case "all":
        return <AllSchedules {...props} />;
      case "travel":
        return <TravelSchedules {...props} />;
      case "business":
        return <BusinessSchedules {...props} />;
      case "important":
        return <ImportantSchedules {...props} />;
      default:
        return <AllSchedules {...props} />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 탭 헤더 영역 */}
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
      {/* 일정 목록 영역 */}
      <div className={styles.container}>{renderSchedules()}</div>
    </div>
  );
};

export default MySchedulesPage;

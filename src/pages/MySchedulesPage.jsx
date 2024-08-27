import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from '../styles/MySchedulesPage.module.css';
import AllSchedules from '../components/AllSchedules';
import TravelSchedules from '../components/TravelSchedules';
import BusinessSchedules from '../components/BusinessSchedules';
import ImportantSchedules from '../components/ImportantSchedules';
import { UserContext } from '../context/UserProvider';

const MySchedulesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [schedules, setSchedules] = useState([]);
  const [counts, setCounts] = useState({ all: 0, travel: 0, business: 0, important: 0 });
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchCounts();
      fetchSchedules();
    }
  }, [user, activeTab]);

  const fetchCounts = async () => {
    try {
      const allUrl = `/plan/api/schedules/all?userId=${user.userId}`;
      const travelUrl = `/plan/api/schedules/travel?userId=${user.userId}`;
      const businessUrl = `/plan/api/schedules/business?userId=${user.userId}`;
      const importantUrl = `/plan/api/schedules/important?userId=${user.userId}`;

      const [allResponse, travelResponse, businessResponse, importantResponse] = await Promise.all([
        axios.get(allUrl),
        axios.get(travelUrl),
        axios.get(businessUrl),
        axios.get(importantUrl),
      ]);

      setCounts({
        all: allResponse.data.length,
        travel: travelResponse.data.length,
        business: businessResponse.data.length,
        important: importantResponse.data.length,
      });
    } catch (error) {
      console.error('Error fetching schedule counts:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const url = `/plan/api/schedules/${activeTab}?userId=${user.userId}`;
      const response = await axios.get(url);
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleActionComplete = () => {
    fetchSchedules();
    fetchCounts();
  };

  const renderSchedules = () => {
    const props = {
      schedules,
      fetchSchedules: handleActionComplete // 별표 클릭 및 삭제 후 동적으로 탭 개수 갱신
    };

    switch (activeTab) {
      case 'all': return <AllSchedules {...props} />;
      case 'travel': return <TravelSchedules {...props} />;
      case 'business': return <BusinessSchedules {...props} />;
      case 'important': return <ImportantSchedules {...props} />;
      default: return <AllSchedules {...props} />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBlock}>
        <div className={styles.tabContainer}>
          {[
            { key: 'all', label: '전체 일정' },
            { key: 'travel', label: '여행 일정' },
            { key: 'business', label: '출장 일정' },
            { key: 'important', label: '주요 일정' }
          ].map((tab) => (
            <div
              key={tab.key}
              className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
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
      <div className={styles.container}>
        {renderSchedules()}
      </div>
    </div>
  );
};

export default MySchedulesPage;

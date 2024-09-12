import React, { useEffect, useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { UserContext } from "../context/UserProvider";
import "../styles/Calendar.css";
import logo from "../images/icons/logo.png";
import googleIcon from "../images/icons/googleIcon.png";
import styles from "../styles/LoginJoin.module.css";

/**
 * Calendar 컴포넌트.
 * 사용자의 Google 및 DB 일정을 통합하여 FullCalendar에 표시합니다.
 * @return {JSX.Element} Calendar 컴포넌트를 반환합니다.
 */
const Calendar = () => {
  const { isAuthenticated, googleToken, getGoogleToken, user } = useContext(UserContext);

  // State 관리
  const [events, setEvents] = useState([]); // 모든 이벤트
  const [dbEvents, setDbEvents] = useState([]); // DB에서 가져온 일정 저장
  const [holidayEvents, setHolidayEvents] = useState([]); // 공휴일 저장
  const [googleEvents, setGoogleEvents] = useState([]); // 구글 캘린더 일정 저장
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 창 상태

  // 색상 리스트 설정
  const colorList = ["#E07A5F", "#A3D9A5", "#8FAAD7", "#F4A3C6", "#F4A261", "#B3D9DA", "#A586D7"];

  /**
   * 사용자가 인증되었을 때 DB에서 이벤트를 가져오고 공휴일을 가져옵니다.
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchEventsFromDB(); // 기본 로그인 시 DB 일정 가져오기
      fetchHolidays(); // 공휴일 가져오기
    }
  }, [isAuthenticated]);

  /**
   * 사용자가 Google 토큰을 제공했을 때 Google 캘린더 이벤트를 가져옵니다.
   */
  useEffect(() => {
    if (googleToken) {
      fetchEventsFromGoogle(googleToken);
    }
  }, [googleToken]);

  /**
   * DB, 공휴일, Google의 이벤트를 결합하여 전체 이벤트 목록을 설정합니다.
   */
  useEffect(() => {
    setEvents([...dbEvents, ...holidayEvents, ...googleEvents]);
  }, [dbEvents, holidayEvents, googleEvents]);

  /**
   * DB로부터 사용자의 이벤트를 가져오는 함수입니다.
   * @async
   */
  const fetchEventsFromDB = async () => {
    try {
      const response = await axios.get("https://www.planmaker.me/plan/api/schedules/all", {
        params: { userId: user.userId },
      });

      const dbEvents = Array.isArray(response.data)
        ? response.data.map((event, index) => ({
            id: event.scheNum,
            title: event.scheTitle,
            start: event.scheStDt + "T09:00:00+09:00",
            end: event.scheEdDt + "T22:15:00+09:00",
            description: event.scheDesc || "",
            location: event.location || "",
            backgroundColor: event.scheColor || colorList[index % colorList.length],
            borderColor: event.scheColor || colorList[index % colorList.length],
          }))
        : [];
      setDbEvents(dbEvents);
    } catch (error) {
      console.error("DB 일정 가져오기 실패 : ", error);
    }
  };

  /**
   * 공휴일을 가져오는 함수입니다.
   * @async
   */
  const fetchHolidays = async () => {
    try {
      const holidays = await fetchHolidaysFromGoogle(googleToken);
      setHolidayEvents(holidays);
    } catch (error) {
      console.error("공휴일 가져오기 실패 : ", error);
    }
  };

  /**
   * Google에서 사용자의 이벤트를 가져오는 함수입니다.
   * @param {string} token - 사용자의 Google 인증 토큰.
   * @async
   */
  const fetchEventsFromGoogle = async (token) => {
    try {
      const userEvents = await fetchUserEventsFromGoogle(token);
      setGoogleEvents(userEvents);
    } catch (error) {
      console.error("구글 일정 가져오기 실패 : ", error);
    }
  };

  /**
   * 지난 1년과 다음 1년 동안의 시간 범위를 계산합니다.
   * @return {Object} 시작 및 종료 시간을 포함하는 객체.
   */
  const getSixMonthsRange = () => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    const oneYearLater = new Date(today);

    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearLater.setFullYear(today.getFullYear() + 1);

    return {
      start: oneYearAgo.toISOString(),
      end: oneYearLater.toISOString(),
    };
  };

  /**
   * Google에서 공휴일 데이터를 가져오는 함수입니다.
   * @param {string} token - 사용자의 Google 인증 토큰.
   * @return {Promise<Array>} 공휴일 이벤트 배열.
   * @async
   */
  const fetchHolidaysFromGoogle = async (token) => {
    const { start, end } = getSixMonthsRange();
    try {
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/ko.south_korea%23holiday@group.v.calendar.google.com/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            timeMin: start,
            timeMax: end,
            singleEvents: true,
            orderBy: "startTime",
          },
        }
      );

      const holidays = Array.isArray(response.data.items)
        ? response.data.items.map((event) => ({
            id: event.id,
            title: event.summary,
            start: event.start.date,
            end: event.end.date,
            description: "공휴일",
            backgroundColor: "#FF8080",
            borderColor: "#FF8080",
            className: ["holiday-event"],
          }))
        : [];

      return holidays;
    } catch (error) {
      console.error("공휴일 가져오기 실패 : ", error);
      return [];
    }
  };

  /**
   * Google에서 사용자의 개인 이벤트를 가져오는 함수입니다.
   * @param {string} token - 사용자의 Google 인증 토큰.
   * @return {Promise<Array>} 사용자 이벤트 배열.
   * @async
   */
  const fetchUserEventsFromGoogle = async (token) => {
    const { start, end } = getSixMonthsRange();
    try {
      const response = await axios.get("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          timeMin: start,
          timeMax: end,
          singleEvents: true,
          orderBy: "startTime",
        },
      });

      return Array.isArray(response.data.items)
        ? response.data.items.map((event) => ({
            id: event.id,
            title: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            description: event.description || "",
            location: event.location || "",
            backgroundColor: "#FF5733",
            borderColor: "#FF5733",
          }))
        : [];
    } catch (error) {
      console.error("사용자 일정 가져오기 실패 : ", error);
      return [];
    }
  };

  /**
   * Google 계정 연동 버튼 클릭 시 호출되는 함수입니다.
   */
  const handleGoogleLogin = () => {
    getGoogleToken();
  };

  /**
   * 이벤트 클릭 시 호출되는 함수입니다.
   * @param {Object} eventInfo - 클릭된 이벤트의 정보.
   */
  const handleEventClick = (eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setModalIsOpen(true);
  };

  /**
   * 모달 창을 닫는 함수입니다.
   */
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className={styles.calendarContainer}>
      <div className="titleContainer">
        <img src={logo} alt="plan maker logo" style={{ width: "200px", height: "40px" }} />
        {!googleToken && (
          <div className="googleSignIn" onClick={handleGoogleLogin}>
            <img src={googleIcon} alt="Google logo" width="20" />
            <span>Google 계정 연동하기</span>
          </div>
        )}
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        eventContent={(eventInfo) => (
          <div>
            <i>{eventInfo.event.title}</i>
          </div>
        )}
        dayMaxEvents={2}
        eventLimitClick="popover"
      />

      {modalIsOpen && selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedEvent.title}</h2>
            <p>
              <strong>시작:</strong> {new Date(selectedEvent.start).toLocaleString()}
            </p>
            <p>
              <strong>끝:</strong> {new Date(selectedEvent.end).toLocaleString()}
            </p>
            {selectedEvent.description && (
              <p>
                <strong>설명:</strong> {selectedEvent.description}
              </p>
            )}
            {selectedEvent.location && (
              <p>
                <strong>위치:</strong> {selectedEvent.location}
              </p>
            )}
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

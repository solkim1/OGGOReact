import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { UserContext } from '../context/UserProvider';
import '../styles/Calendar.css';
import googleIcon from '../images/googleIcon.png';
import styles from '../styles/LoginJoin.module.css';

const Calendar = () => {

  const { isAuthenticated, googleToken, getGoogleToken, user } = useContext(UserContext);

  const [events, setEvents] = useState([]);
  const [dbEvents, setDbEvents] = useState([]); // DB에서 가져온 일정 저장
  const [holidayEvents, setHolidayEvents] = useState([]); // 공휴일 저장
  const [googleEvents, setGoogleEvents] = useState([]); // 구글 캘린더 일정 저장
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const colorList = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8333', '#33FFEC', '#8333FF'];

  useEffect(() => {
    if (isAuthenticated) {
      fetchEventsFromDB(); // 기본 로그인 시 DB 일정 가져오기
      fetchHolidays(); // 공휴일 가져오기
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (googleToken) {
      fetchEventsFromGoogle(googleToken); // 구글 연동 시 구글 캘린더 일정 가져오기
    }
  }, [googleToken]);

  useEffect(() => {
    // 모든 이벤트를 결합하여 설정
    setEvents([...dbEvents, ...holidayEvents, ...googleEvents]);
  }, [dbEvents, holidayEvents, googleEvents]);

  useEffect(()=>{
    console.log('현재일정목록',events);
  },[events])

  const fetchEventsFromDB = async () => {
    try {
      const response = await axios.get('http://localhost:8090/plan/api/schedules/all', {
        params: { userId: user.userId } // 쿼리 매개변수로 userId 전달
      });
      console.log('DB데이터',response);

      const dbEvents = Array.isArray(response.data) ? response.data.map((event, index) => ({
        id: event.scheNum,
        title: event.scheTitle,
        start: event.scheStDt + "T09:00:00+09:00",
        end: event.scheEdDt + "T22:15:00+09:00",
        description: event.scheDesc || '',
        location: event.location || '',
        backgroundColor: event.scheColor || colorList[index % colorList.length],
        borderColor: event.scheColor || colorList[index % colorList.length]
      })) : [];
      setDbEvents(dbEvents);
    } catch (error) {
      console.error("DB 일정 가져오기 실패 : ", error);
    }
  };

  const fetchHolidays = async () => {
    try {
      const holidays = await fetchHolidaysFromGoogle(googleToken);
      setHolidayEvents(holidays);
      // 공휴일 데이터 로깅
    } catch (error) {
      console.error("공휴일 가져오기 실패 : ", error);
    }
  };

  const fetchEventsFromGoogle = async (token) => {

    try {
      const userEvents = await fetchUserEventsFromGoogle(token);
      setGoogleEvents(userEvents); // 구글 이벤트만 따로 저장
    } catch (error) {
      console.error("구글 일정 가져오기 실패 : ", error);
    }
  };

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

  const fetchHolidaysFromGoogle = async (token) => {
    const { start, end } = getSixMonthsRange();
    try {
      const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/ko.south_korea%23holiday@group.v.calendar.google.com/events', {
        headers: {
          Authorization: `Bearer ${token}`  // 인증 토큰 추가
        },
        params: {
          timeMin: start,
          timeMax: end,
          singleEvents: true,
          orderBy: 'startTime'
        }
      });

      const holidays = Array.isArray(response.data.items) ? response.data.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.date,
        end: event.end.date,
        description: '공휴일',
        backgroundColor: '#FF8080',
        borderColor: '#FF8080',
        className: ['holiday-event'],
      })) : [];



      return holidays;
    } catch (error) {
      console.error("공휴일 가져오기 실패 : ", error);
      return [];
    }
  };

  const fetchUserEventsFromGoogle = async (token) => {
    const { start, end } = getSixMonthsRange();
    try {
      const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          timeMin: start,
          timeMax: end,
          singleEvents: true,
          orderBy: 'startTime'
        }
      });

      return Array.isArray(response.data.items) ? response.data.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description || '',
        location: event.location || '',
        backgroundColor: '#FF5733',
        borderColor: '#FF5733'
      })) : [];
    } catch (error) {
      console.error("사용자 일정 가져오기 실패 : ", error);
      return [];

    }
  };

  const handleGoogleLogin = () => {
    getGoogleToken(); // Google 로그인 함수 호출

  };

  const handleEventClick = (eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);

  };



  return (
    <div className={styles.calendarContainer}>
      <h1>Plan Maker Calendar</h1>

      {!googleToken && ( // Google 로그인되지 않은 경우에만 연동하기 버튼 표시

        <div className={styles.googleSignIn} onClick={handleGoogleLogin}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google 계정 연동하기</span>
        </div>


      )}
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
        eventLimitClick="popover" // 'n more' 클릭 시 팝오버 형식으로 표시
      />

      {modalIsOpen && selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedEvent.title}</h2>
            <p><strong>시작:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
            <p><strong>끝:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
            {selectedEvent.description && (
              <p><strong>설명:</strong> {selectedEvent.description}</p>
            )}
            {selectedEvent.location && (
              <p><strong>위치:</strong> {selectedEvent.location}</p>
            )}
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}


    </div>
  );
};


export default Calendar;


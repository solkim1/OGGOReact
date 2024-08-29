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
  const { isAuthenticated, googleToken, getGoogleToken } = useContext(UserContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (isAuthenticated && googleToken) {
      fetchEventsFromGoogle(googleToken); // Google 토큰이 있는 경우에만 이벤트를 가져옵니다.
    }
  }, [googleToken, isAuthenticated]);

  const fetchEventsFromGoogle = async (token) => {
    try {
      const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          timeMin: (new Date()).toISOString(),
          singleEvents: true,
          orderBy: 'startTime'
        },
      });

      const events = response.data.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description || '',
        location: event.location || ''
      }));
      setEvents(events);
    } catch (error) {
      console.error('Google Calendar 이벤트 불러오기 오류:', error);
    }
  };

  const handleGoogleLogin = () => {
    getGoogleToken(); // Google 로그인 함수 호출
  };

  return (
    <div className={styles.calendarContainer}>
      <h1>Plan Maker Calendar</h1>
      {isAuthenticated && !googleToken ? ( // 일반 로그인은 되어 있지만 Google 로그인은 안된 상태
        <div className={styles.googleSignIn} onClick={handleGoogleLogin}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google 계정으로 로그인</span>
        </div>
      ) : null}
      {googleToken ? ( // Google 로그인이 완료된 상태에서만 캘린더를 보여줍니다.
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={(eventInfo) => (
            <div>
              <b>
                {new Date(eventInfo.event.start).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
                {' - '}
                {new Date(eventInfo.event.end).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </b>
              <br />
              <i>{eventInfo.event.title}</i>
            </div>
          )}
        />
      ) : null}
    </div>
  );
};

export default Calendar;
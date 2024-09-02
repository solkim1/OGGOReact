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
  const [events2, setEvents2] = useState([]);

  useEffect(() => {
    if (isAuthenticated && googleToken) {
      fetchEventsFromGoogle(googleToken); // Google 토큰이 있는 경우에만 이벤트를 가져옵니다.
    }
  }, [googleToken, isAuthenticated]);


  useEffect(() => {
    const fetchEventsFromDB = async () => {
      try {
        // GET 요청 시 쿼리 매개변수를 URL에 포함
        const response = await axios.get(`http://localhost:8090/plan/api/schedules/all`, {
          params: { userId: user.userId } // 쿼리 매개변수로 userId 전달
        });
        
        console.log("DB의 일정",response.data);
  
        // response.data가 예상된 구조를 가지는지 확인
        if (response.data && Array.isArray(response.data)) {
          const dbEvents = response.data.map(event => ({
            id: event.scheNum,
            title: event.scheTitle,
            start: event.scheStDt + "T09:00:00+09:00",
            end: event.scheEdDt + "T22:15:00+09:00",
            description: event.scheDesc || '',
            location: event.location || ''
          }));
  
          setEvents(prevEvents => [...prevEvents, ...dbEvents]);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("DB 일정 가져오기 실패 : ", error);
      }
    };

    fetchEventsFromDB();
  }, []);

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

      const googleEvents = response.data.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description || '',

        location: event.location || ''
      }));
      setEvents2(googleEvents);
      console.log("Google의 일정",googleEvents);
    } catch (error) {

      console.error('Google Calendar 이벤트 불러오기 오류:', error);
    }
  };

  const handleGoogleLogin = () => {
    getGoogleToken(); // Google 로그인 함수 호출

  };

  const dataCheck = ()=>{
    console.log([...events, ...events2]);
  }

  return (
    <div className={styles.calendarContainer}>
      <h1>Plan Maker Calendar<button onClick={dataCheck}>데이터확인</button></h1> 
      {!googleToken ? ( // 일반 로그인은 되어 있지만 Google 로그인은 안된 상태
        <div className={styles.googleSignIn} onClick={handleGoogleLogin}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google 계정 연동하기</span>
        </div>
      ) : null}
       {/* Google 로그인이 완료된 상태에서만 캘린더를 보여줍니다. */}
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={[...events, ...events2]}
          eventContent={(eventInfo) => (
            <div>

              {/* <b>

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

              <br /> */}

              <i>{eventInfo.event.title}</i>
            </div>
          )}
        />
      
    </div>
  );
};


export default Calendar;


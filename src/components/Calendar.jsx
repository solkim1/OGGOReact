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
  const { isAuthenticated, googleToken, loginWithGoogle } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && googleToken) {
      fetchEventsFromGoogle(googleToken);
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
    loginWithGoogle();
  };

  const handleEventClick = (info) => {
    const clickedEvent = events.find(event => event.id === info.event.id);
    setSelectedEvent(clickedEvent);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className={styles.calendarContainer}>
      <h1>Plan Maker Calendar</h1>
      {isAuthenticated && !googleToken ? (
        <div className={styles.googleSignIn} onClick={handleGoogleLogin}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google 계정으로 로그인</span>
        </div>
      ) : null}
      {googleToken ? (
        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            dayMaxEventRows={2} // 셀당 최대 2개의 이벤트만 표시하고 나머지는 "+ more"로 표시
            heightAuto={true} // 셀의 높이를 자동으로 조절
            moreLinkClick="popover" // "more" 클릭 시 팝업으로 추가 이벤트 표시
            eventContent={(eventInfo) => (
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
        </>
      ) : null}
    </div>
  );
};

export default Calendar;

/* global google */
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserProvider';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import '../styles/Calendar.css';
import googleIcon from '../images/googleIcon.png';
import styles from '../styles/LoginJoin.module.css';

const CLIENT_ID = '492030565512-v26kv67d7eq37mqsbt9vtlmub48ourim.apps.googleusercontent.com';
const API_URL = 'http://localhost:8090/plan/api/events';

const Calendar = () => {
  const { accessToken, setAccessToken } = useContext(UserContext);
  const [isSignedIn, setIsSignedIn] = useState(!!accessToken);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // 초기 렌더링 시 sessionStorage에서 accessToken 확인
    const storedToken = sessionStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsSignedIn(true);
    }
    
    // Google Identity Services 스크립트 로드
    const loadGisScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGis;
      document.body.appendChild(script);
    };

    loadGisScript();
  }, [setAccessToken]);

  // Google Identity Services 초기화
  const initializeGis = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
      });
    } else {
      console.error('Google Identity Services 라이브러리가 로드되지 않았습니다.');
    }
  };

  // Google 로그인 후 응답 처리
  const handleCredentialResponse = (response) => {
    if (window.google && response.credential) {
      const idToken = response.credential;
      console.log('ID 토큰:', idToken);
      setAccessToken(idToken);
      sessionStorage.setItem('accessToken', idToken);
      setIsSignedIn(true);
      fetchEventsFromGoogle(idToken); // 로그인 후 이벤트 가져오기
    } else {
      console.error('Google Identity Services가 초기화되지 않았거나 응답 자격 증명이 없습니다.');
    }
  };

  // Google Calendar에서 이벤트 가져오기
  const fetchEventsFromGoogle = async (token) => {
    if (!token) {
      console.error("Access token이 없습니다.");
      return;
    }

    try {
      const startTime = new Date();
      const endTime = new Date();
      endTime.setMonth(endTime.getMonth() + 1); // 한 달 후까지

      const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        },
      });

      console.log('Google Calendar 이벤트:', response.data); // API 응답 확인

      const events = response.data.items || []; // 기본 빈 배열로 설정
      const formattedEvents = events.map(event => ({
        id: event.id,
        title: event.summary || '제목 없음',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description || '',
        location: event.location || ''
      }));

      setEvents(formattedEvents);
      syncEventsWithBackend(formattedEvents); // 백엔드와 이벤트 동기화
    } catch (error) {
      console.error('Google Calendar에서 이벤트 가져오기 오류:', error.response ? error.response.data : error.message);
    }
  };

  // 백엔드와 이벤트 동기화
  const syncEventsWithBackend = async (events) => {
    if (!accessToken) {
      console.error("Access token이 없습니다.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/sync-db`, {
        accessToken,
        events
      });
      console.log('이벤트가 성공적으로 동기화되었습니다:', response.data);
    } catch (error) {
      console.error('백엔드와 이벤트 동기화 오류:', error.response ? error.response.data : error.message);
    }
  };

  // Google 로그인 처리
  const handleLogin = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: (response) => {
        if (response.error) {
          console.error('로그인 실패:', response.error);
          return;
        }
        setAccessToken(response.access_token);
        sessionStorage.setItem('accessToken', response.access_token);
        setIsSignedIn(true);
        fetchEventsFromGoogle(response.access_token); // 로그인 후 이벤트 가져오기
      },
    });

    tokenClient.requestAccessToken();
  };

  // 로그아웃 처리
  const handleLogout = () => {
    window.google.accounts.id.disableAutoSelect();
    setIsSignedIn(false);
    setAccessToken(null);
    sessionStorage.removeItem('accessToken');
  };

  useEffect(() => {
    if (accessToken) {
      console.log('Access Token 업데이트됨:', accessToken);
      fetchEventsFromGoogle(accessToken); // accessToken 변경 시 이벤트 가져오기
    }
  }, [accessToken]);

  // 이벤트 클릭 시 처리
  const handleEventClick = (info) => {
    console.log('클릭한 이벤트:', info.event);
    const clickedEvent = events.find(event => event.id === info.event.id);
    setSelectedEvent(clickedEvent);
    setModalIsOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="Calendar">
      <h1>Plan Maker Calendar</h1>
      {!isSignedIn ? (
        <div className={styles.googleSignIn} onClick={handleLogin}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google Login</span>
        </div>
      ) : (
        <>
        <div className={styles.googleSignIn} onClick={handleLogout}>
          <img src={googleIcon} alt="Google logo" width="20" />
          <span>Google Logout</span>
        </div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            }}
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
            eventClick={handleEventClick}
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
      )}
    </div>
  );
};

export default Calendar;

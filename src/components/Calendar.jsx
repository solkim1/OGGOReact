/* global google */
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import '../styles/Calendar.css';

// Google Client ID와 백엔드 API URL을 설정
const CLIENT_ID = '492030565512-v26kv67d7eq37mqsbt9vtlmub48ourim.apps.googleusercontent.com';
const API_URL = 'http://localhost:8090/plan/api/events';

const Calendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false); // 로그인 상태
  const [events, setEvents] = useState([]); // 캘린더 이벤트
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [accessToken, setAccessToken] = useState(null); // 액세스 토큰 상태

  // 컴포넌트가 마운트될 때 Google Identity Services 스크립트 로드
  useEffect(() => {
    const loadGisScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGis; // 스크립트 로드 후 초기화 함수 호출
      document.body.appendChild(script);
    };

    loadGisScript();
  }, []);

  // Google Identity Services 초기화 함수
  const initializeGis = () => {
    if (window.google && window.google.accounts) {
      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
      });
    } else {
      console.error('Google Identity Services library not loaded.');
    }
  };

  // Google 로그인 후 자격 증명 처리
  const handleCredentialResponse = (response) => {
    const idToken = response.credential;
    console.log('ID Token:', idToken);
    // ID 토큰을 사용하여 추가적인 사용자 정보를 가져올 수 있습니다.
  };

  // Google Calendar에서 이벤트를 가져오는 함수
  const fetchEventsFromGoogle = async (token) => {
    if (!token) {
      console.error("Access token is missing.");
      return;
    }

    try {
      // Google Calendar API 요청
      const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 가져온 이벤트를 형식화하여 저장
      const events = response.data.items;
      const formattedEvents = events.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description || '',
        location: event.location || ''
      }));

      setEvents(formattedEvents); // 이벤트 상태 업데이트
      syncEventsWithBackend(formattedEvents); // 백엔드와 이벤트 동기화
    } catch (error) {
      console.error('Error fetching events from Google Calendar:', error.response ? error.response.data : error.message);
    }
  };

  // 가져온 이벤트를 백엔드와 동기화하는 함수
  const syncEventsWithBackend = async (events) => {
    if (!accessToken) {
      console.error("Access token is missing.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/sync-db`, {
        accessToken, // 액세스 토큰과 이벤트 전송
        events
      });
      console.log('Events synced successfully:', response.data);
    } catch (error) {
      console.error('Error syncing events with backend:', error.response ? error.response.data : error.message);
    }
  };

  // Google 로그인을 처리하는 함수
  const handleLogin = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: (response) => {
        if (response.error) {
          console.error('Login failed:', response.error);
          return;
        }
        setIsSignedIn(true); // 로그인 상태 업데이트
        setAccessToken(response.access_token); // 액세스 토큰 저장
      },
    });

    tokenClient.requestAccessToken(); // 액세스 토큰 요청
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    window.google.accounts.id.disableAutoSelect();
    setIsSignedIn(false);
    setAccessToken(null); // 로그아웃 시 액세스 토큰 제거
  };

  // 액세스 토큰이 업데이트되면 Google Calendar 이벤트를 가져옴
  useEffect(() => {
    if (accessToken) {
      console.log('Access Token Updated:', accessToken);
      fetchEventsFromGoogle(accessToken);
    }
  }, [accessToken]);

  // 이벤트 클릭 시 호출되는 함수
  const handleEventClick = (info) => {
    const clickedEvent = events.find(event => event.id === info.event.id);
    setSelectedEvent(clickedEvent);
    setModalIsOpen(true); // 모달 열기
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null); // 선택된 이벤트 초기화
  };

  return (
    <div className="Calendar">
      <h1>Plan Maker Calendar</h1>
      {!isSignedIn ? (
        <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events} // 불러온 이벤트들을 FullCalendar에 전달
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            }}
            eventContent={(eventInfo) => (
              <div>
                <b>
                  {new Date(eventInfo.event.start).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                  {' - '}
                  {new Date(eventInfo.event.end).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </b>
                <br />
                <i>{eventInfo.event.title}</i>
              </div>
            )}
            eventClick={handleEventClick} // 이벤트 클릭 처리
          />
          {modalIsOpen && selectedEvent && (
            <div className="modal">
              <div className="modal-content">
                <h2>{selectedEvent.title}</h2>
                <p><strong>Start:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                {selectedEvent.description && (
                  <p><strong>Description:</strong> {selectedEvent.description}</p>
                )}
                {selectedEvent.location && (
                  <p><strong>Location:</strong> {selectedEvent.location}</p>
                )}
                <button onClick={closeModal}>Close</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Calendar;

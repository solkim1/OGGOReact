/* global google */
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserProvider';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

const CLIENT_ID = '774245247226-mb4dm5idh0esrgea29g9kb0qr6ch0j84.apps.googleusercontent.com';
const API_URL = 'http://localhost:8090/plan/api/events';

const Calendar = () => {
  const { googleToken, setGoogleToken } = useContext(UserContext);
  const [isSignedIn, setIsSignedIn] = useState(!!googleToken || !!sessionStorage.getItem('googleToken')); // sessionStorage에서 토큰 복원
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const loadGisScript = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGis;
        document.body.appendChild(script);
      } else {
        initializeGis();
      }
    };

    loadGisScript();

    const storedToken = sessionStorage.getItem('googleToken');
    if (storedToken && !googleToken) {
      setGoogleToken(storedToken);
    }
    if (storedToken) {
      fetchEventsFromGoogle(storedToken);
    }
  }, [googleToken]);

  const initializeGis = () => {
    if (window.google && window.google.accounts) {
      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
      });
    } else {
      console.error('Google Identity Services 라이브러리가 로드되지 않았습니다.');
    }
  };

  const handleCredentialResponse = (response) => {
    const idToken = response.credential;
    console.log('ID Token:', idToken);

    setGoogleToken(idToken);
    sessionStorage.setItem('googleToken', idToken); // sessionStorage에 토큰 저장
  };

  const fetchEventsFromGoogle = async (accessToken) => {
    try {
      const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const events = response.data.items;
      const formattedEvents = events.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description || '',
        location: event.location || '',
      }));

      setEvents(formattedEvents);
      syncEventsWithBackend(formattedEvents);
    } catch (error) {
      console.error('Error fetching events from Google Calendar:', error);
    }
  };

  const syncEventsWithBackend = async (events) => {
    try {
      await axios.post(API_URL, events); // 백엔드에 이벤트 저장
    } catch (error) {
      console.error('Error syncing events with backend:', error);
    }
  };

  const handleLogin = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: (response) => {
        if (response.error) {
          console.error('Login failed:', response.error);
          return;
        }
        setIsSignedIn(true);
        setGoogleToken(response.access_token);
        sessionStorage.setItem('googleToken', response.access_token); // sessionStorage에 토큰 저장
        fetchEventsFromGoogle(response.access_token);
      },
    });

    tokenClient.requestAccessToken();
  };

  const handleLogout = () => {
    window.google.accounts.id.disableAutoSelect();
    setIsSignedIn(false);
    setGoogleToken(null);
    sessionStorage.removeItem('googleToken'); // sessionStorage에서 토큰 제거
    setEvents([]);
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
    <div className="Calendar">
      <h1>Plan Maker Calendar</h1>
      {!isSignedIn ? (
        <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
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
            eventClick={handleEventClick}
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

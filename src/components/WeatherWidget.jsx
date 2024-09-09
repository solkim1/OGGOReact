import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/WeatherWidget.module.css";

/**
 * WeatherWidget 컴포넌트.
 * 서울의 5일간의 일기예보 데이터를 표시합니다.
 *
 * @return {JSX.Element} WeatherWidget 컴포넌트를 반환합니다.
 */
const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState([]); // 날씨 데이터 상태

  /**
   * 요일을 텍스트로 변환하는 함수.
   *
   * @param {Date} date - 날짜 객체.
   * @return {string} 요일 문자열 (일, 월, 화, 수, 목, 금, 토).
   */
  const getDayOfWeek = (date) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    return daysOfWeek[date.getDay()];
  };

  /**
   * 컴포넌트가 마운트될 때 날씨 데이터를 가져오는 함수.
   */
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "b2449b2a3c39d5675789e558167bffbd"; // OpenWeatherMap API 키
        const city = "Seoul"; // 날씨 정보를 가져올 도시 이름
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );

        // 12시 정오의 날씨 데이터만 필터링
        const noonWeatherData = response.data.list.filter((data) => {
          const date = new Date(data.dt * 1000);
          return date.getHours() === 12;
        });

        setWeatherData(noonWeatherData); // 상태에 날씨 데이터 설정
      } catch (error) {
        console.error("Error fetching weather data:", error); // 에러 발생 시 콘솔에 로그
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className={styles.weatherWidget}>
      {weatherData.map((data, index) => {
        const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`; // 날씨 아이콘 URL
        const date = new Date(data.dt * 1000); // UNIX 타임스탬프를 Date 객체로 변환
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}(${getDayOfWeek(date)})`; // 날짜와 요일 포맷팅

        return (
          <div key={index} className={styles.weatherItem}>
            <img src={weatherIcon} alt="weather icon" className={styles.icon} /> {/* 날씨 아이콘 */}
            <span>{Math.round(data.main.temp)}°C</span> {/* 온도 */}
            <div className={styles.date}>{formattedDate}</div> {/* 날짜 및 요일 표시 */}
          </div>
        );
      })}
    </div>
  );
};

export default WeatherWidget;

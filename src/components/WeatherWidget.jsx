import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/WeatherWidget.module.css";

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState([]);

  // 요일을 텍스트로 변환하는 함수
  const getDayOfWeek = (date) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    return daysOfWeek[date.getDay()];
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "b2449b2a3c39d5675789e558167bffbd";
        const city = "Seoul";
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );

        const noonWeatherData = response.data.list.filter((data) => {
          const date = new Date(data.dt * 1000);
          return date.getHours() === 12;
        });

        setWeatherData(noonWeatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className={styles.weatherWidget}>
      {weatherData.map((data, index) => {
        const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        const date = new Date(data.dt * 1000);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}(${getDayOfWeek(date)})`;

        return (
          <div key={index} className={styles.weatherItem}>
            <img src={weatherIcon} alt="weather icon" className={styles.icon} />
            <span>{Math.round(data.main.temp)}°C</span>
            <div className={styles.date}>{formattedDate}</div> {/* 날짜 및 요일 표시 추가 */}
          </div>
        );
      })}
    </div>
  );
};

export default WeatherWidget;

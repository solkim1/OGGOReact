import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/WeatherWidget.module.css';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = 'b2449b2a3c39d5675789e558167bffbd'; // 여기에 API 키를 입력하세요.
        const city = 'Seoul'; // 도시명을 변경할 수 있습니다.
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=4&appid=${apiKey}`
        );
        setWeatherData(response.data.list);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className={styles.weatherWidget}>
      {weatherData.map((data, index) => {
        const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        return (
          <div key={index} className={styles.weatherItem}>
            <img src={weatherIcon} alt="weather icon" className={styles.icon} />
            <span>{Math.round(data.main.temp)}°C</span>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherWidget;

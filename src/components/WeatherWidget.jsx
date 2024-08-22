import React from 'react'; 
import styles from '../styles/WeatherWidget.module.css'; 
 const WeatherWidget = () => {   // 여기에 날씨 정보를 가져오는 로직을 추가할 수 있습니다.   
    return (     <div className={styles.weatherWidget}>     
      <div className={styles.weatherIcon}>🌤️</div>       
      <div className={styles.weatherInfo}>서울 22°C</div>     </div> 
        );
       }; 
    
     export default WeatherWidget;
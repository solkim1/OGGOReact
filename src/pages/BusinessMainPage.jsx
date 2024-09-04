//프론트 수정한거
import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import styles from "../styles/BusinessMainPage.css";
import { UserContext } from "../context/UserProvider";
import { HeaderColorContext } from "../context/HeaderColorContext"; // 추가

const BusinessMainPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { setHeaderColor } = useContext(HeaderColorContext); // 헤더 색상 변경을 위한 함수 가져오기

  const [backgroundColor, setBackgroundColor] = useState("#c1e6da");
  const [isPlaying, setIsPlaying] = useState(true);

  // 두 개의 Swiper에 대한 ref
  const swiperRefLeft = useRef(null);
  const swiperRefRight = useRef(null);

  const slideColors = ["#E4DFDB", "#FEBE7A", "#FFBEC1", "#CC6155"];

  const handleSlideChange = (swiper) => {
    const activeIndex = swiper.realIndex % slideColors.length;
    const newColor = slideColors[activeIndex];
    setBackgroundColor(newColor);
    setHeaderColor(newColor); // 헤더 색상도 함께 변경
  };

  const toggleAutoplay = () => {
    if (isPlaying) {
      swiperRefLeft.current.swiper.autoplay.stop();
      swiperRefRight.current.swiper.autoplay.stop();
    } else {
      swiperRefLeft.current.swiper.autoplay.start();
      swiperRefRight.current.swiper.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ backgroundColor: backgroundColor }}>
      <div id="mainContainerPC" style={{ visibility: 'visible', position: 'static', left: '-9999px' }}>
        <div className="main_showcase active" id="mainTab">
          <div className="cont">
            <Swiper
              ref={swiperRefLeft} // 좌측 슬라이드 ref 연결
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              loop={true}
              onSlideChange={handleSlideChange}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{ type: 'fraction', el: '.swiper-pagination' }}
              autoplay={{ delay: 5000 }}
              className="swiper-container gallery-thumbs"
            >
              {/* 슬라이드 컨텐츠 */}
              <SwiperSlide className="slide1" data-color="#c1e6da">
                <div className="tit_wrap">
                  <em>발굴된 미래🕰️</em>
                  <strong style={{ color: '#3d3d3d' }}>다니엘 아샴<br />서울 3024</strong>
                  <a href="#" tabIndex={-1}>자세히 보기</a>
                </div>
              </SwiperSlide>
              <SwiperSlide className="slide2" data-color="#e6ffd9">
                <div className="tit_wrap">
                  <em>아득한 공간🌌</em>
                  <strong style={{ color: '#3d3d3d' }}>유토피아<br />Nowhere, Now Here</strong>
                  <a href="#" tabIndex={-1}>자세히 보기</a>
                </div>
              </SwiperSlide>
              <SwiperSlide className="slide3" data-color="#ffede0">
                <div className="tit_wrap">
                  <em>우주의 미스터리🌠</em>
                  <strong style={{ color: '#3d3d3d' }}>제임스 로젠퀴스트<br />Universe</strong>
                  <a href="#" tabIndex={-1}>자세히 보기</a>
                </div>
              </SwiperSlide>
              <SwiperSlide className="slide4" data-color="#ffe3f8">
                <div className="tit_wrap">
                  <em>삶에 대한 고찰🤔</em>
                  <strong style={{ color: '#3d3d3d' }}>정직성<br />Layered Life</strong>
                  <a href="#" tabIndex={-1}>자세히 보기</a>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="img_wrap">
            <Swiper
              ref={swiperRefRight} // 우측 슬라이드 ref 연결
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              loop={true}
              onSlideChange={handleSlideChange}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{ type: 'fraction', el: '.swiper-pagination' }}
              autoplay={{ delay: 5000 }}
              className="swiper-container gallery-top"
            >
              {/* 이미지 슬라이드 */}
              <SwiperSlide className="slide1" data-swiper-slide-index={0} style={{ marginRight: '30px' }}>
                <a href="#">
                  <img src="./DANIELARSHAM.png" alt="sungsoo" />
                </a>
              </SwiperSlide>
              <SwiperSlide className="slide2" data-swiper-slide-index={1} style={{ marginRight: '30px' }}>
                <a href="#">
                  <img src="./utopia.png" alt="beach" />
                </a>
              </SwiperSlide>
              <SwiperSlide className="slide3" data-swiper-slide-index={2} style={{ marginRight: '30px' }}>
                <a href="#">
                  <img src="./universe.png" alt="history" />
                </a>
              </SwiperSlide>
              <SwiperSlide className="slide4" data-swiper-slide-index={3} style={{ marginRight: '30px' }}>
                <a href="#">
                  <img src="./LayeredLife.png" alt="스틸아트 천국,<br> 포항 1박 2일 여행" />
                </a>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="page_box">
            <div className="page">
              <div className="swiper-progress-bar active">
                <span className="slide_progress-bar"><span className="fill" /></span>
              </div>
              <div className="swiper-pagination swiper-pagination-fraction"><span className="swiper-pagination-current">04</span> / <span className="swiper-pagination-total">04</span></div>
              <div className="btn">
                <div className="swiper-button-prev" tabIndex={0} role="button" aria-label="Previous slide">이전</div>
                <div className="swiper-button-next" tabIndex={0} role="button" aria-label="Next slide">다음</div>
                <div className="btn_auto">
                  <button 
                    className={`btn_autoStop ${isPlaying ? '' : 'playing'}`} 
                    onClick={toggleAutoplay}
                  >
             
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessMainPage;



//프론트 수정전
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "../styles/BusinessMainPage.module.css";
// import RecommendationsExhibition from "../components/RecommendationsExhibition";

// const BusinessMainPage = () => {
//   const navigate = useNavigate();

//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [region, setRegion] = useState("서울");
//   const [includeOptions, setIncludeOptions] = useState({
//     전시회: false,
//     맛집: false,
//     카페: false,
//     여행지: false,
//     숙소: false
//   });

//   const handleScheduleButtonClick = () => {
//     const selectedOptions = Object.entries(includeOptions)
//       .filter(([_, value]) => value)
//       .map(([key, _]) => key);

//     navigate("/schedulemap", {
//       state: {
//         startDate,
//         endDate,
//         startTime,
//         endTime,
//         region,
//         includeOptions: selectedOptions,
//         isBusiness: true
//       }
//     });
//   };

//   return (
//     <div className={styles.pageContainer}>
//       <main className={styles.mainContent}>
//         <div className={styles.contentWrapper}>
//           <div className={styles.filterSection}>
//             <div className={styles.filterItem}>
//               <label className={styles.filterLabel}>출장 일정</label>
//               <input
//                 type="date"
//                 className={styles.filterInput}
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//               <span className={styles.dateSeparator}>~</span>
//               <input
//                 type="date"
//                 className={styles.filterInput}
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </div>
//             <div className={styles.filterItem}>
//               <label className={styles.filterLabel}>출장 시간대</label>
//               <input
//                 type="time"
//                 className={styles.filterInput}
//                 value={startTime}
//                 onChange={(e) => setStartTime(e.target.value)}
//               />
//               <span className={styles.dateSeparator}>~</span>
//               <input
//                 type="time"
//                 className={styles.filterInput}
//                 value={endTime}
//                 onChange={(e) => setEndTime(e.target.value)}
//               />
//             </div>
//             <div className={styles.filterItem}>
//               <label className={styles.filterLabel}>지역</label>
//               <select
//                 className={styles.filterSelect}
//                 value={region}
//                 onChange={(e) => setRegion(e.target.value)}
//               >
//                 <option value="서울">서울</option>
//                 {/* 다른 지역 옵션 추가 */}
//               </select>
//             </div>
//             <div className={styles.filterItem}>
//               <label className={styles.filterLabel}>포함 여부</label>
//               <div className={styles.checkboxGroup}>
//                 {Object.entries(includeOptions).map(([option, checked]) => (
//                   <label key={option} className={styles.checkboxLabel}>
//                     <input
//                       type="checkbox"
//                       name={option}
//                       checked={checked}
//                       onChange={(e) => setIncludeOptions(prev => ({ ...prev, [option]: e.target.checked }))}
//                       className={styles.checkbox}
//                     />
//                     {option}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <button
//               className={styles.scheduleButton}
//               onClick={handleScheduleButtonClick}
//             >
//               일정 생성
//             </button>
//           </div>
//           <h2 className={styles.recommendationsTitle}>전시회 추천</h2>
//           <RecommendationsExhibition />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BusinessMainPage;

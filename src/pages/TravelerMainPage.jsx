// 프론트 수정한거
import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

import styles from "../styles/TravelerMainPage.css";
import { UserContext } from "../context/UserProvider";
import { HeaderColorContext } from "../context/HeaderColorContext";

import Travelbytheme from "../components/Travelbytheme";

const TravelerMainPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { setHeaderColor } = useContext(HeaderColorContext);

  const [backgroundColor, setBackgroundColor] = useState("#c1e6da");
  const [isPlaying, setIsPlaying] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ageGroup, setAgeGroup] = useState("10대~20대");
  const [gender, setGender] = useState("남성");
  const [groupSize, setGroupSize] = useState("개인");
  const [theme, setTheme] = useState("레포츠");

  const swiperRefLeft = useRef(null);
  const swiperRefRight = useRef(null);

  const slideColors = ["#FFF3BC", "#AADBFF", "#ffede0", "#EFE4B0"];

  const handleSlideChange = (swiper) => {
    const activeIndex = swiper.realIndex % slideColors.length;
    const newColor = slideColors[activeIndex];
    setBackgroundColor(newColor);
    setHeaderColor(newColor);
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

  const handleScheduleButtonClick = async () => {
    try {
      if (!user) {
        throw new Error("로그인 정보 에러. 다시 로그인해주세요");
      }

      if (!startDate || !endDate) {
        throw new Error("시작 날짜와 종료 날짜를 설정하세요.");
      }
      const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

      navigate("/schedulemap", {
        state: {
          userId: user.userId,
          days: days,
          ageGroup: ageGroup,
          gender: gender,
          groupSize: groupSize,
          theme: theme,
          startDate: startDate,
          endDate: endDate,
        },
      });
    } catch (error) {
      console.error("일정 생성 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: backgroundColor }}>
        <div id="mainContainerPC" style={{ visibility: "visible", position: "static", left: "-9999px" }}>
          <div className="main_showcase active" id="mainTab">
            <div className="cont">
              <Swiper
                ref={swiperRefLeft}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                loop={true}
                onSlideChange={handleSlideChange}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                pagination={{ type: "fraction", el: ".swiper-pagination" }}
                autoplay={{ delay: 5000 }}
                className="swiper-container gallery-thumbs"
              >
                <SwiperSlide className="slide1" data-color="#c1e6da">
                  <div className="tit_wrap" style={{ marginTop: "60px" }}>
                    <em>모든게 다 거꾸로🙃</em>
                    <strong style={{ color: "#3d3d3d", marginTop: "30px", marginBottom: "20px" }}>
                      성수동
                      <br />
                      거꾸로 하우스
                    </strong>
                    <a href="#" tabIndex={-1}>
                      자세히 보기
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="slide2" data-color="#e6ffd9">
                  <div className="tit_wrap" style={{ marginTop: "60px" }}>
                    <em>여름하면 바다🌊</em>
                    <strong style={{ color: "#3d3d3d", marginTop: "10px", marginBottom: "20px" }}>
                      경포대~속초
                      <br />
                      파도와 함께 하는 바다
                    </strong>
                    <a href="#" tabIndex={-1}>
                      자세히 보기
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="slide3" data-color="#ffede0">
                  <div className="tit_wrap" style={{ marginTop: "60px" }}>
                    <em>문화 속으로🎎</em>
                    <strong style={{ color: "#3d3d3d", marginTop: "30px", marginBottom: "20px" }}>
                      경주
                      <br />
                      역사 체험하기
                    </strong>
                    <a href="#" tabIndex={-1}>
                      자세히 보기
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="slide4" data-color="#ffe3f8">
                  <div className="tit_wrap" style={{ marginTop: "60px" }}>
                    <em>시골 감성 가득💕</em>
                    <strong style={{ color: "#3d3d3d", marginTop: "30px", marginBottom: "20px" }}>
                      구례
                      <br />
                      촌캉스 여행
                    </strong>
                    <a href="#" tabIndex={-1}>
                      자세히 보기
                    </a>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>

            <div className="img_wrap">
              <Swiper
                ref={swiperRefRight}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                loop={true}
                onSlideChange={handleSlideChange}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                pagination={{ type: "fraction", el: ".swiper-pagination" }}
                autoplay={{ delay: 5000 }}
                className="swiper-container gallery-top"
                allowTouchMove={false}
              >
                {/* 여기에 이미지들 추가 */}
                <SwiperSlide className="slide1" data-swiper-slide-index={0} style={{ marginRight: "30px" }}>
                  <a href="#">
                    <img src="./sungsoo.png" alt="sungsoo" />
                  </a>
                </SwiperSlide>
                <SwiperSlide className="slide2" data-swiper-slide-index={1} style={{ marginRight: "30px" }}>
                  <a href="#">
                    <img src="./beach.png" alt="beach" />
                  </a>
                </SwiperSlide>
                <SwiperSlide className="slide3" data-swiper-slide-index={2} style={{ marginRight: "30px" }}>
                  <a href="#">
                    <img src="./ae3aebd0-36ae-4cb6-9865-aaafee317090.raw.png" alt="history" />
                  </a>
                </SwiperSlide>
                <SwiperSlide className="slide4" data-swiper-slide-index={3} style={{ marginRight: "30px" }}>
                  <a href="#">
                    <img src="./country.png" alt="스틸아트 천국, 포항 1박 2일 여행" />
                  </a>
                </SwiperSlide>
              </Swiper>
            </div>

            <div className="page_box">
              <div className="page">
                <div className="swiper-progress-bar active">
                  <span className="slide_progress-bar">
                    <span className="fill" />
                  </span>
                </div>
                <div className="swiper-pagination swiper-pagination-fraction">
                  <span className="swiper-pagination-current">04</span> /{" "}
                  <span className="swiper-pagination-total">04</span>
                </div>
                <div className="btn">
                  <div className="swiper-button-prev" tabIndex={0} role="button" aria-label="Previous slide">
                    이전
                  </div>
                  <div className="swiper-button-next" tabIndex={0} role="button" aria-label="Next slide">
                    다음
                  </div>
                  <div className="btn_auto">
                    <button className={`btn_autoStop ${isPlaying ? "" : "playing"}`} onClick={toggleAutoplay}></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI 필터 섹션 */}
          <div style={{ backgroundColor: "white", padding: "20px 5px" }}>
            <div className="titleSection">
              <img src={require("../images/aiai.png")} alt="aiai title" className="titleImage" />
            </div>

            <div className="filterContainer">
              <div className="filterSection">
                <div className="filterItem">
                  <label className="filterLabel">일정 선택</label>
                  <div className="dateInputContainer">
                    <input
                      type="date"
                      className="filterInput dateInput"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span>~</span>
                    <input
                      type="date"
                      className="filterInput dateInput"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="filterItem">
                  <label className="filterLabel">연령대</label>
                  <select className="filterSelect" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                    <option value="10대~20대">10대~20대</option>
                    <option value="30대">30대</option>
                    <option value="40~50대">40~50대</option>
                    <option value="60대 이상">60대 이상</option>
                  </select>
                </div>
                <div className="filterItem">
                  <label className="filterLabel">성별</label>
                  <select className="filterSelect" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </div>
                <div className="filterItem">
                  <label className="filterLabel">인원</label>
                  <select className="filterSelect" value={groupSize} onChange={(e) => setGroupSize(e.target.value)}>
                    <option value="개인">개인</option>
                    <option value="단체">단체</option>
                  </select>
                </div>
                <div className="filterItem">
                  <label className="filterLabel">테마</label>
                  <select className="filterSelect" value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="레포츠">레포츠</option>
                    <option value="문화 체험">문화 체험</option>
                    <option value="쇼핑">쇼핑</option>
                    <option value="맛집 탐방">맛집 탐방</option>
                  </select>
                </div>
              </div>
              <button className="scheduleButton" onClick={handleScheduleButtonClick}>
                일정 생성
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "white" }}>
        <Travelbytheme />
      </div>
    </div>
  );
};

export default TravelerMainPage;

// 프론트 수정전
// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import RecommendationsTheme from "../components/RecommendationsTheme";
// import styles from "../styles/TravelerMainPage.module.css";
// import { UserContext } from "../context/UserProvider";

// const TravelerMainPage = () => {
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);

//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [ageGroup, setAgeGroup] = useState("10대~20대");
//   const [gender, setGender] = useState("남성");
//   const [groupSize, setGroupSize] = useState("개인");
//   const [theme, setTheme] = useState("레포츠");

//   const handleScheduleButtonClick = async () => {
//     try {
//       if (!user) {
//         throw new Error("로그인 정보 에러. 다시 로그인해주세요");
//       }

//       if (!startDate || !endDate) {
//         throw new Error("시작 날짜와 종료 날짜를 설정하세요.");
//       }
//       const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

//       navigate("/schedulemap", {
//         state: {
//           userId: user.userId,
//           days: days,
//           ageGroup: ageGroup,
//           gender: gender,
//           groupSize: groupSize,
//           theme: theme,
//           startDate: startDate,
//           endDate: endDate,
//         },
//       });
//     } catch (error) {
//       console.error("일정 생성 중 오류 발생:", error);
//     }
//   };

//   return (
//     <div className={styles.pageContainer}>
//       <main className={styles.mainContent}>
//         <div className={styles.contentWrapper}>
//           <div className={styles.filterSection}>
//             <div className={styles.filterItem}>
//               <label className={styles.filterLabel}>일정 선택</label>
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
//               <label className={styles.filterLabel}>연령대</label>
//               <select className={styles.filterSelect} value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
//                 <option value="10대~20대">10대~20대</option>
//                 <option value="30대">30대</option>
//                 <option value="40~50대">40~50대</option>
//                 <option value="60대 이상">60대 이상</option>
//               </select>
//             </div>
//             <div className={styles.filterItem}>
//               <label className={styles.filterLabel}>성별</label>
//               <select className={styles.filterSelect} value={gender} onChange={(e) => setGender(e.target.value)}>
//                 <option value="남성">남성</option>
//                 <option value="여성">여성</option>
//               </select>
//             </div>
//             <div className={styles.filterItem}>
//               <label className={styles.filterLabel}>인원</label>
//               <select className={styles.filterSelect} value={groupSize} onChange={(e) => setGroupSize(e.target.value)}>
//                 <option value="개인">개인</option>
//                 <option value="단체">단체</option>
//               </select>
//             </div>
//             <div className={styles.filterItem}>
//               <label className={styles.filterLabel}>테마</label>
//               <select className={styles.filterSelect} value={theme} onChange={(e) => setTheme(e.target.value)}>
//                 <option value="레포츠">레포츠</option>
//                 <option value="문화 체험">문화 체험</option>
//                 <option value="쇼핑">쇼핑</option>
//                 <option value="맛집 탐방">맛집 탐방</option>
//               </select>
//             </div>
//             <button
//               className={styles.scheduleButton}
//               onClick={handleScheduleButtonClick}
//             >
//               일정 생성
//             </button>
//           </div>
//           <h2 className={styles.recommendationsTitle}>테마별 여행지 추천</h2>
//           <RecommendationsTheme />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default TravelerMainPage;

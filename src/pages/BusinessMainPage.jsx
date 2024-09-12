import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import "../styles/DropdownCheckbox.css";

import downArrow from "../images/icons/downArrow.png";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import TravelbyExhibition from "../components/TravelbyExhibition";
import { UserContext } from "../context/UserProvider";
import { HeaderColorContext } from "../context/HeaderColorContext";
import DateModal from "../components/DateModal";

/**
 * 비즈니스 관련 메인 페이지를 렌더링하는 컴포넌트입니다.
 * @return {JSX.Element} 비즈니스 메인 페이지 컴포넌트.
 */
const BusinessMainPage = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const { setHeaderColor } = useContext(HeaderColorContext);

  const [backgroundColor, setBackgroundColor] = useState("#c1e6da");
  const [isPlaying, setIsPlaying] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [region, setRegion] = useState("서울");
  const [includeOptions, setIncludeOptions] = useState({
    전시회: false,
    맛집: false,
    카페: false,
    여행지: false,
    숙소: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const swiperRefLeft = useRef(null);
  const swiperRefRight = useRef(null);

  const slideColors = ["#E4DFDB", "#FEBE7A", "#FFBEC1", "#CC6155"];

  /**
   * 드롭다운 메뉴의 열림 상태를 토글합니다.
   */
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  /**
   * 체크박스 상태를 업데이트합니다.
   * @param {string} option 토글할 옵션의 이름입니다.
   */
  const handleCheckboxChange = (option) => {
    setIncludeOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  /**
   * 선택된 필터 옵션의 텍스트를 생성합니다.
   * @return {string} 선택된 옵션을 콤마로 구분한 문자열입니다.
   */
  const selectedOptionsText =
    Object.entries(includeOptions)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
      .join(", ") || "필터 옵션 선택";

  /**
   * 슬라이드 변경 시 배경색과 헤더 색상을 업데이트합니다.
   * @param {Object} swiper Swiper 인스턴스입니다.
   */
  const handleSlideChange = (swiper) => {
    const activeIndex = swiper.realIndex % slideColors.length;
    const newColor = slideColors[activeIndex];
    setBackgroundColor(newColor);
    setHeaderColor(newColor);
  };

  /**
   * 자동 재생 기능을 토글합니다.
   */
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

  /**
   * 일정 생성 버튼 클릭 시 입력을 검증하고 페이지를 이동합니다.
   */
  const handleScheduleButtonClick = () => {
    if (!startDate || !endDate || !startTime || !endTime || !region) {
      alert("모든 필수 정보를 입력하세요.");
      return;
    }

    const selectedOptions = Object.entries(includeOptions)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    navigate("/schedulemap", {
      state: {
        startDate,
        endDate,
        startTime,
        endTime,
        region,
        includeOptions: selectedOptions,
        isBusiness: true,
      },
    });
  };

  /**
   * 전시회 클릭 시 호출되는 함수로, 모달을 열고 선택된 전시회를 저장합니다.
   * @param {string} exhibitionName 선택된 전시회의 이름입니다.
   */
  const handleExhibitionClick = (exhibitionName) => {
    setSelectedExhibition(exhibitionName);
    setIsModalOpen(true);
  };

  /**
   * 여정을 시작하는 함수로, 선택된 전시회에 대한 데이터를 서버에서 가져와 일정 생성 페이지로 이동합니다.
   * @async
   */
  const handleStartJourney = async () => {
    try {
      const response = await fetch(`https://www.planmaker.me/plan/api/schedules/exhibitions/${selectedExhibition}`);
      if (!response.ok) {
        throw new Error("전시회 데이터를 불러오는 데 실패했습니다.");
      }
      const exhibitionData = await response.json();
      navigate("/schedulemap", {
        state: { exhibitionData, exhibitionName: selectedExhibition, startDate, endDate },
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error loading exhibition data:", error);
      alert("전시회 데이터 로딩 실패: " + error.message);
    }
  };

  return (
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
              allowTouchMove={false}
            >
              <SwiperSlide className="slide1" data-color="#c1e6da">
                <div className="tit_wrap" style={{ marginTop: "60px" }}>
                  <em>발굴된 미래🕰️</em>
                  <strong style={{ color: "#3d3d3d", marginTop: "30px", marginBottom: "20px" }}>
                    다니엘 아샴
                    <br />
                    서울 3024
                  </strong>
                  <a href="#" onClick={() => handleExhibitionClick("DANIELARSHAM")} tabIndex={-1}>
                    자세히 보기
                  </a>
                </div>
              </SwiperSlide>
              <SwiperSlide className="slide2" data-color="#e6ffd9">
                <div className="tit_wrap" style={{ marginTop: "60px" }}>
                  <em>아득한 공간🌌</em>
                  <strong style={{ color: "#3d3d3d", marginTop: "30px", marginBottom: "20px" }}>
                    유토피아
                    <br />
                    Nowhere, Now Here
                  </strong>
                  <a href="#" onClick={() => handleExhibitionClick("utopia")} tabIndex={-1}>
                    자세히 보기
                  </a>
                </div>
              </SwiperSlide>
              <SwiperSlide className="slide3" data-color="#ffede0">
                <div className="tit_wrap" style={{ marginTop: "60px" }}>
                  <em>우주의 미스터리🌠</em>
                  <strong style={{ color: "#3d3d3d", marginTop: "30px", marginBottom: "20px" }}>
                    제임스 로젠퀴스트
                    <br />
                    Universe
                  </strong>
                  <a href="#" onClick={() => handleExhibitionClick("james")} tabIndex={-1}>
                    자세히 보기
                  </a>
                </div>
              </SwiperSlide>
              <SwiperSlide className="slide4" data-color="#ffe3f8">
                <div className="tit_wrap" style={{ marginTop: "60px" }}>
                  <em>삶에 대한 고찰🤔</em>
                  <strong style={{ color: "#3d3d3d", marginTop: "30px", marginBottom: "20px" }}>
                    정직성
                    <br />
                    Layered Life
                  </strong>
                  <a href="#" onClick={() => handleExhibitionClick("Layered Life")} tabIndex={-1}>
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
            >
              <SwiperSlide className="slide1" data-swiper-slide-index={0} style={{ marginRight: "30px" }}>
                <a href="#">
                  <img src="./DANIELARSHAM.png" alt="sungsoo" />
                </a>
              </SwiperSlide>
              <SwiperSlide className="slide2" data-swiper-slide-index={1} style={{ marginRight: "30px" }}>
                <a href="#">
                  <img src="./utopia.png" alt="beach" />
                </a>
              </SwiperSlide>
              <SwiperSlide className="slide3" data-swiper-slide-index={2} style={{ marginRight: "30px" }}>
                <a href="#">
                  <img src="./universe.png" alt="history" />
                </a>
              </SwiperSlide>
              <SwiperSlide className="slide4" data-swiper-slide-index={3} style={{ marginRight: "30px" }}>
                <a href="#">
                  <img src="./LayeredLife.png" alt="스틸아트 천국,<br> 포항 1박 2일 여행" />
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
      </div>

      <div style={{ backgroundColor: "white", padding: "20px 5px" }}>
        <div className="titleSection">
          <img src={require("../images/aiai.png")} alt="aiai title" className="titleImage" />
        </div>
        <div className="filterContainer">
          <div className="filterSection">
            <div className="filterItem" id="date">
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

            <div className="filterItem" id="time">
              <label className="filterLabel">출장 시간대</label>
              <div className="dateInputContainer">
                <input
                  type="time"
                  className="filterInput dateInput"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <span>~</span>
                <input
                  type="time"
                  className="filterInput dateInput"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="filterItem">
              <label className="filterLabel">지역</label>
              <select className="filterSelect" value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="서울">서울</option>
              </select>
            </div>
            <div className="filterItem">
              <label className="filterLabel">포함 여부</label>
              <div
                className="filterSelect"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={toggleDropdown}
              >
                <p
                  className="dropdown-button"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {selectedOptionsText}
                </p>
                {isOpen && (
                  <div className="dropdown-content" onClick={(e) => e.stopPropagation()}>
                    {Object.entries(includeOptions).map(([option, checked]) => (
                      <label key={option} className="dropdown-checkbox">
                        <input
                          type="checkbox"
                          name={option}
                          checked={checked}
                          onChange={() => handleCheckboxChange(option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
                <img
                  src={downArrow}
                  style={{
                    width: "16px",
                    height: "17px",
                    marginTop: "3px",
                    marginRight: "-10px",
                  }}
                />
              </div>
            </div>

            <button className="scheduleButton" onClick={handleScheduleButtonClick}>
              일정 생성
            </button>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "white" }}>
        <TravelbyExhibition />
      </div>
      <DateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStartJourney}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(e) => setStartDate(e.target.value)}
        onEndDateChange={(e) => setEndDate(e.target.value)}
      />
    </div>
  );
};

export default BusinessMainPage;

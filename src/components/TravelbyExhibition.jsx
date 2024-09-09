import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DateModal from "../components/DateModal";

/**
 * 전시회 슬라이드 데이터 목록.
 */
const customSlides1 = [
  {
    id: 1,
    imgSrc: `${require("../images/business/DANIEL ARSHAM.jpg")}`,
    title: "다니엘 아샴 : 서울 3024",
    apiName: "DANIELARSHAM",
  },
  {
    id: 2,
    imgSrc: `${require("../images/business/james.jpg")}`,
    title: "제임스 로젠퀴스트 : Universe",
    apiName: "james",
  },
  {
    id: 3,
    imgSrc: `${require("../images/business/kimjihee.jpg")}`,
    title: "김지희 개인전 - DIVINITY",
    apiName: "kimjihee",
  },
  {
    id: 4,
    imgSrc: `${require("../images/business/Layered Life.png")}`,
    title: "정직성 : Layered Life",
    apiName: "Layered Life",
  },
];

const customSlides2 = [
  {
    id: 1,
    imgSrc: `${require("../images/business/utopia.jpg")}`,
    title: "유토피아: Nowhere, Now Here",
    apiName: "utopia",
  },
  {
    id: 2,
    imgSrc: `${require("../images/business/younme.png")}`,
    title: "너와 나 그리고 그곳에",
    apiName: "YOUNME",
  },
  {
    id: 3,
    imgSrc: `${require("../images/business/dawn.png")}`,
    title: "새벽부터 황혼까지",
    apiName: "DAWN",
  },
  {
    id: 4,
    imgSrc: `${require("../images/business/angel.png")}`,
    title: "투명하고 향기나는 천사의 날개 빛깔처럼",
    apiName: "ANGEL",
  },
];

/**
 * API 이름과 전시회 제목을 매핑하는 객체.
 */
const exhibitionNameMap = {
  DANIELARSHAM: "다니엘 아샴 : 서울 3024",
  james: "제임스 로젠퀴스트 : Universe",
  kimjihee: "김지희 개인전 - DIVINITY",
  "Layered Life": "정직성 : Layered Life",
  utopia: "유토피아: Nowhere, Now Here",
  YOUNME: "너와 나 그리고 그곳에",
  DAWN: "새벽부터 황혼까지",
  ANGEL: "투명하고 향기나는 천사의 날개 빛깔처럼",
};

/**
 * 슬라이드 행을 표시하는 컴포넌트.
 *
 * @param {Object} props - 컴포넌트의 props.
 * @param {Array} props.slides - 표시할 슬라이드 데이터.
 * @param {string} props.title - 슬라이드 행의 제목.
 * @param {Function} props.onExhibitionClick - 전시회를 클릭할 때 호출되는 함수.
 * @return {JSX.Element} SlideRow 컴포넌트를 반환합니다.
 */
const SlideRow = ({ slides, title, onExhibitionClick }) => {
  const [startIndex, setStartIndex] = useState(0); // 현재 슬라이드 시작 인덱스

  /**
   * 다음 슬라이드를 표시하는 함수.
   */
  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  /**
   * 이전 슬라이드를 표시하는 함수.
   */
  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <h4 style={{ textAlign: "left", marginBottom: "20px", marginLeft: "20px" }}>{title}</h4>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <button
          onClick={handlePrev}
          className="custom-slide-prev"
          style={{
            cursor: "pointer",
            background: `url(${process.env.PUBLIC_URL}/btn_slide02.png) no-repeat center`,
            width: "40px",
            height: "40px",
            border: "none",
            backgroundSize: "contain",
            flex: "0 0 40px",
          }}
        />
        <div
          className="custom-slide-wrapper"
          style={{ overflow: "visible", display: "flex", width: "calc(100% - 100px)", margin: "0 10px" }}
        >
          {[...Array(4)].map((_, index) => {
            const slideIndex = (startIndex + index) % slides.length;
            const slide = slides[slideIndex];
            return (
              <div
                key={slide.id}
                className="custom-slide"
                style={{
                  minWidth: "25%",
                  flex: "0 0 25%",
                  padding: "10px 5px",
                  transition: "transform 0.3s ease-in-out",
                }}
                onClick={() => onExhibitionClick(slide.apiName)}
              >
                <a
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: "all 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="img" style={{ textAlign: "center" }}>
                    <img
                      src={slide.imgSrc}
                      alt={slide.title}
                      style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                    />
                  </div>
                  <strong
                    style={{
                      marginTop: "10px",
                      fontSize: "14px",
                      textAlign: "center",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {slide.title}
                  </strong>
                </a>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleNext}
          className="custom-slide-next"
          style={{
            cursor: "pointer",
            background: `url(${process.env.PUBLIC_URL}/btn_slide03.png) no-repeat center`,
            width: "40px",
            height: "40px",
            border: "none",
            backgroundSize: "contain",
            flex: "0 0 40px",
          }}
        />
      </div>
    </div>
  );
};

/**
 * TravelbyExhibition 컴포넌트.
 * 사용자에게 다양한 전시회를 보여주고, 선택된 전시회에 대한 여행 일정을 생성할 수 있도록 합니다.
 *
 * @return {JSX.Element} TravelbyExhibition 컴포넌트를 반환합니다.
 */
const TravelbyExhibition = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // 날짜 선택 모달 상태
  const [startDate, setStartDate] = useState(""); // 여행 시작 날짜
  const [endDate, setEndDate] = useState(""); // 여행 종료 날짜
  const [selectedExhibition, setSelectedExhibition] = useState(null); // 선택된 전시회 이름

  /**
   * 전시회 클릭 시 호출되는 함수.
   * 모달을 열고 선택된 전시회를 저장합니다.
   *
   * @param {string} exhibitionName - 선택된 전시회의 API 이름.
   */
  const handleExhibitionClick = (exhibitionName) => {
    setSelectedExhibition(exhibitionName);
    setIsModalOpen(true); // 전시회 클릭 시 모달 열기
  };

  /**
   * 여행 시작 날짜를 변경하는 함수.
   * @param {Object} e - 이벤트 객체.
   */
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  /**
   * 여행 종료 날짜를 변경하는 함수.
   * @param {Object} e - 이벤트 객체.
   */
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  /**
   * 모달을 닫는 함수.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExhibition(null);
  };

  /**
   * 여정을 시작하는 함수.
   * 선택된 전시회에 대한 데이터를 서버에서 가져와 일정 생성 페이지로 이동합니다.
   */
  const handleStartJourney = async () => {
    try {
      const response = await fetch(`http://localhost:8090/plan/api/schedules/exhibitions/${selectedExhibition}`);
      if (!response.ok) {
        throw new Error("전시회 데이터를 불러오는 데 실패했습니다.");
      }
      const exhibitionData = await response.json();
      navigate("/schedulemap", {
        state: {
          exhibitionData,
          exhibitionName: exhibitionNameMap[selectedExhibition] || selectedExhibition, // 매핑된 전시회 이름 사용
          startDate,
          endDate,
        },
      });
      handleCloseModal();
    } catch (error) {
      console.error("Error loading exhibition data:", error);
      alert("전시회 데이터 로딩 실패: " + error.message);
    }
  };

  return (
    <div className="custom-slide-section" style={{ padding: "20px 0", backgroundColor: "transparent" }}>
      <div className="inr" style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <h3 className="tit_atc" style={{ textAlign: "left", marginBottom: "20px", marginLeft: "20px" }}>
          🖼️ 최근 떠오르는 전시회 🖼️
        </h3>
        <SlideRow slides={customSlides1} onExhibitionClick={handleExhibitionClick} />
        <h3 className="tit_atc" style={{ textAlign: "left", marginBottom: "20px", marginLeft: "20px" }}>
          🎨 가볍게 보기 좋은 전시회 🎨
        </h3>
        <SlideRow slides={customSlides2} onExhibitionClick={handleExhibitionClick} />
      </div>

      {/* 모달 컴포넌트 렌더링 */}
      <DateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleStartJourney}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />
    </div>
  );
};

export default TravelbyExhibition;

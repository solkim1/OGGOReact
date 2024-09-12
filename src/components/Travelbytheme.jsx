import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DateModal from "./DateModal";

/**
 * 첫 번째 슬라이드 데이터 목록.
 */
const customSlides1 = [
  {
    id: 1,
    imgSrc: `${process.env.PUBLIC_URL}/6cda1d02-657c-41fd-bd38-1984a5ea5088.png`,
    title: (
      <>
        레트로 감성 가득한 <br />
        서울 익선동 데이트 코스
      </>
    ),
    apiName: "ickson",
  },
  {
    id: 2,
    imgSrc: `${process.env.PUBLIC_URL}/c8221535-d5d6-49fd-96dd-8cfbf57bbe99.png`,
    title: (
      <>
        액티비티부터 별 관측까지! <br />
        영월 1박 2일 코스 추천
      </>
    ),
    apiName: "yeongwol",
  },
  {
    id: 3,
    imgSrc: `${process.env.PUBLIC_URL}/cc8efbc4-e1e7-47b9-bd0d-cb43c872b661.png`,
    title: (
      <>
        청량한 여행의 순간🌊 <br />
        포항 해안 도로 드라이브 코스
      </>
    ),
    apiName: "pohang",
  },
  {
    id: 4,
    imgSrc: `${process.env.PUBLIC_URL}/a7f03f16-474f-4e99-8c18-852666efa9d3.png`,
    title: (
      <>
        상상에 상상을 더해서! <br />
        정크아트의 도시 충주 여행
      </>
    ),
    apiName: "chungju",
  },
];

/**
 * 두 번째 슬라이드 데이터 목록.
 */
const customSlides2 = [
  {
    id: 1,
    imgSrc: `${process.env.PUBLIC_URL}/sungsoo1.png`,
    title: (
      <>
        모든게 다 거꾸로🙃 <br />
        성수동 거꾸로 하우스
      </>
    ),
    apiName: "sungsoo",
  },
  {
    id: 2,
    imgSrc: `${process.env.PUBLIC_URL}/beach1.png`,
    title: (
      <>
        여름하면 바다🌊 <br />
        경포대~속초 파도와 함께 하는 바다
      </>
    ),
    apiName: "beach",
  },
  {
    id: 3,
    imgSrc: `${process.env.PUBLIC_URL}/history1.png`,
    title: (
      <>
        문화 속으로🎎 <br />
        경주 역사 체험하기
      </>
    ),
    apiName: "history",
  },
  {
    id: 4,
    imgSrc: `${process.env.PUBLIC_URL}/country1.png`,
    title: (
      <>
        시골 감성 가득💕 <br />
        구례 촌캉스 여행
      </>
    ),
    apiName: "country",
  },
];

/**
 * 슬라이드 행을 표시하는 컴포넌트.
 *
 * @param {Object} props - 컴포넌트의 props.
 * @param {Array} props.slides - 표시할 슬라이드 데이터.
 * @param {string} props.title - 슬라이드 행의 제목.
 * @param {Function} props.onThemeClick - 테마 클릭 시 호출되는 함수.
 * @return {JSX.Element} SlideRow 컴포넌트를 반환합니다.
 */
const SlideRow = ({ slides, title, onThemeClick }) => {
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
                onClick={() => onThemeClick(slide.apiName)}
              >
                <a
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    display: "block",
                    transition: "all 0.3s ease-in-out",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    borderRadius: "10px",
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
                  <strong style={{ display: "block", marginTop: "10px", fontSize: "14px", textAlign: "center" }}>
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
 * Travelbytheme 컴포넌트.
 * 사용자에게 다양한 테마 여행을 제안하고, 선택된 테마에 따라 일정을 생성할 수 있도록 합니다.
 *
 * @return {JSX.Element} Travelbytheme 컴포넌트를 반환합니다.
 */
const Travelbytheme = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(null); // 선택된 테마
  const [startDate, setStartDate] = useState(""); // 여행 시작 날짜
  const [isModalOpen, setIsModalOpen] = useState(false); // 날짜 선택 모달 상태

  /**
   * 테마 이름과 테마 설명을 매핑하는 객체.
   */
  const themeNameMap = {
    ickson: "익선동 데이트 코스",
    yeongwol: "영월 1박 2일 코스",
    pohang: "포항 해안 도로 드라이브 코스",
    chungju: "정크아트의 도시 충주",
    sungsoo: "성수동 거꾸로 하우스",
    beach: "경포대~속초 바다",
    history: "경주 역사 체험",
    country: "구례 촌캉스",
  };

  /**
   * 테마 클릭 시 호출되는 함수.
   * 모달을 열고 선택된 테마를 저장합니다.
   *
   * @param {string} themeName - 선택된 테마의 API 이름.
   */
  const handleThemeClick = (themeName) => {
    setSelectedTheme(themeName);
    setIsModalOpen(true);
  };

  /**
   * 여행 시작 날짜를 변경하는 함수.
   * @param {Object} e - 이벤트 객체.
   */
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  /**
   * 모달을 닫는 함수.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTheme(null);
  };

  /**
   * 여정을 시작하는 함수.
   * 선택된 테마의 데이터를 서버에서 가져와 일정 생성 페이지로 이동합니다.
   */
  const handleStartJourney = async () => {
    try {
      const response = await fetch(`https://www.planmaker.me/plan/api/schedules/themes/${selectedTheme}`);
      if (!response.ok) {
        throw new Error("테마 데이터를 불러오는 데 실패했습니다.");
      }
      const themeData = await response.json();
      navigate("/schedulemap", {
        state: { themeData, themeName: themeNameMap[selectedTheme] || selectedTheme, startDate },
      });
      handleCloseModal();
    } catch (error) {
      console.error("Error loading theme data:", error);
      alert("테마 데이터 로딩 실패: " + error.message);
    }
  };

  return (
    <div className="custom-slide-section" style={{ padding: "20px 0", backgroundColor: "transparent" }}>
      <div className="inr" style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <h3 className="tit_atc" style={{ textAlign: "left", marginBottom: "20px", marginLeft: "20px" }}>
          ❤️ 함께 떠나는 데이트 코스 여행 ❤️
        </h3>
        <SlideRow slides={customSlides1} onThemeClick={handleThemeClick} />
        <h3 className="tit_atc" style={{ textAlign: "left", marginBottom: "20px", marginLeft: "20px" }}>
          👍 추천 여행지 👍
        </h3>
        <SlideRow slides={customSlides2} onThemeClick={handleThemeClick} />
      </div>

      {/* 날짜 선택 모달 */}
      <DateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleStartJourney}
        startDate={startDate}
        onStartDateChange={handleStartDateChange}
      />
    </div>
  );
};

export default Travelbytheme;

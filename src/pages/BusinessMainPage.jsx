import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import '../styles/DropdownCheckbox.css';

import downArrow from '../images/icons/downArrow.png';

import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import TravelbyExhibition from '../components/TravelbyExhibition';
import { UserContext } from '../context/UserProvider';
import { HeaderColorContext } from '../context/HeaderColorContext'; // 추가

const BusinessMainPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { setHeaderColor } = useContext(HeaderColorContext); // 헤더 색상 변경을 위한 함수 가져오기

  const [backgroundColor, setBackgroundColor] = useState('#c1e6da');
  const [isPlaying, setIsPlaying] = useState(true);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [region, setRegion] = useState('서울');
  const [includeOptions, setIncludeOptions] = useState({
    전시회: false,
    맛집: false,
    카페: false,
    여행지: false,
    숙소: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (option) => {
    setIncludeOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  // 필터 옵션에 따라 표시할 텍스트 생성
  const selectedOptionsText =
    Object.entries(includeOptions)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
      .join(', ') || '필터 옵션 선택';

  // 두 개의 Swiper에 대한 ref
  const swiperRefLeft = useRef(null);
  const swiperRefRight = useRef(null);

  const slideColors = ['#E4DFDB', '#FEBE7A', '#FFBEC1', '#CC6155'];

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

  const handleScheduleButtonClick = () => {
    if (!startDate || !endDate || !startTime || !endTime || !region) {
      alert('모든 필수 정보를 입력하세요.');
      return;
    }

    const selectedOptions = Object.entries(includeOptions)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    console.log('일정 생성:', {
      startDate,
      endDate,
      startTime,
      endTime,
      region,
      includeOptions: selectedOptions,
    });

    navigate('/schedulemap', {
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

  const handleExhibitionClick = async (exhibitionName) => {
    try {
      const response = await fetch(`http://localhost:8090/plan/api/schedules/exhibitions/${exhibitionName}`);
      if (!response.ok) {
        throw new Error('전시회 데이터를 불러오는 데 실패했습니다.');
      }
      const exhibitionData = await response.json();
      navigate('/schedulemap', {
        state: { exhibitionData, exhibitionName },
      });
    } catch (error) {
      console.error('Error loading exhibition data:', error);
      alert('전시회 데이터 로딩 실패: ' + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: backgroundColor }}>
      <div id="mainContainerPC" style={{ visibility: 'visible', position: 'static', left: '-9999px' }}>
        <div className="main_showcase active" id="mainTab">
          <div className="cont">
            <Swiper
              ref={swiperRefLeft}
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
              allowTouchMove={false}
            >
              {/* 슬라이드 컨텐츠 */}
              <SwiperSlide className="slide1" data-color="#c1e6da">
                <div className="tit_wrap" style={{ marginTop: '60px' }}>
                  <em>발굴된 미래🕰️</em>
                  <strong style={{ color: '#3d3d3d', marginTop: '30px', marginBottom: '20px' }}>
                    다니엘 아샴
                    <br />
                    서울 3024
                  </strong>
                  <a href="#" onClick={() => handleExhibitionClick('DANIELARSHAM')} tabIndex={-1}>
                    자세히 보기
                  </a>
                </div>
              </SwiperSlide>
              <SwiperSlide className="slide2" data-color="#e6ffd9">
                <div className="tit_wrap" style={{ marginTop: '60px' }}>
                  <em>아득한 공간🌌</em>
                  <strong style={{ color: '#3d3d3d', marginTop: '30px', marginBottom: '20px' }}>
                    유토피아
                    <br />
                    Nowhere, Now Here
                  </strong>
                  <a href="#" onClick={() => handleExhibitionClick('utopia')} tabIndex={-1}>
                    자세히 보기
                  </a>
                </div>
              </SwiperSlide>
              <SwiperSlide className="slide3" data-color="#ffede0">
                <div className="tit_wrap" style={{ marginTop: '60px' }}>
                  <em>우주의 미스터리🌠</em>
                  <strong style={{ color: '#3d3d3d', marginTop: '30px', marginBottom: '20px' }}>
                    제임스 로젠퀴스트
                    <br />
                    Universe
                  </strong>
                  <a href="#" onClick={() => handleExhibitionClick('james')} tabIndex={-1}>
                    자세히 보기
                  </a>
                </div>
              </SwiperSlide>
              <SwiperSlide className="slide4" data-color="#ffe3f8">
                <div className="tit_wrap" style={{ marginTop: '60px' }}>
                  <em>삶에 대한 고찰🤔</em>
                  <strong style={{ color: '#3d3d3d', marginTop: '30px', marginBottom: '20px' }}>
                    정직성
                    <br />
                    Layered Life
                  </strong>
                  <a href="#" onClick={() => handleExhibitionClick('Layered Life')} tabIndex={-1}>
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
                <span className="slide_progress-bar">
                  <span className="fill" />
                </span>
              </div>
              <div className="swiper-pagination swiper-pagination-fraction">
                <span className="swiper-pagination-current">04</span> /{' '}
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
                  <button className={`btn_autoStop ${isPlaying ? '' : 'playing'}`} onClick={toggleAutoplay}></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI 필터 섹션 */}
      <div style={{ backgroundColor: 'white', padding: '20px 5px' }}>
        <div className="titleSection">
          <img src={require('../images/aiai.png')} alt="aiai title" className="titleImage" />
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
                {/* 다른 지역 옵션 추가 */}
              </select>
            </div>
            <div className="filterItem">
              <label className="filterLabel">포함 여부</label>
              <div
                className="filterSelect"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
                onClick={toggleDropdown}
              >
                {/* 필터 옵션 텍스트 */}
                <p
                  className="dropdown-button"
                  style={{
                    whiteSpace: 'nowrap' /* 텍스트를 한 줄로 표시 */,
                    overflow: 'hidden' /* 넘치는 텍스트를 숨김 */,
                    textOverflow: 'ellipsis' /* 넘치는 텍스트에 '...'을 표시 */,
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
                    width: '16px',
                    height: '17px',
                    marginTop: '3px',
                    marginRight: '-10px',
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

      {/* 추가하고 싶은 TravelbyExhibition 컴포넌트 */}
      <div style={{ backgroundColor: 'white' }}>
        <TravelbyExhibition />
      </div>
    </div>
  );
};

export default BusinessMainPage;

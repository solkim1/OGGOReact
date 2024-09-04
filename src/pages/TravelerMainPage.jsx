import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import styles from "../styles/TravelerMainPage.css";
import { UserContext } from "../context/UserProvider";
import { HeaderColorContext } from "../context/HeaderColorContext";

import Travelbytheme from '../components/Travelbytheme';

const TravelerMainPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { setHeaderColor } = useContext(HeaderColorContext);

  const [backgroundColor, setBackgroundColor] = useState("#c1e6da");
  const [isPlaying, setIsPlaying] = useState(true);

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

  return (
    <div>
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
              >
                <SwiperSlide className="slide1" data-color="#c1e6da">
                  <div className="tit_wrap">
                    <em>모든게 다 거꾸로🙃</em>
                    <strong style={{ color: '#3d3d3d' }}>성수동<br />거꾸로 하우스</strong>
                    <a href="#" tabIndex={-1}>자세히 보기</a>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="slide2" data-color="#e6ffd9">
                  <div className="tit_wrap">
                    <em>여름하면 바다🌊</em>
                    <strong style={{ color: '#3d3d3d' }}>경포대~속초<br />파도와 함께 하는 바다</strong>
                    <a href="#" tabIndex={-1}>자세히 보기</a>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="slide3" data-color="#ffede0">
                  <div className="tit_wrap">
                    <em>문화 속으로🪭</em>
                    <strong style={{ color: '#3d3d3d' }}>경주<br />역사 체험하기</strong>
                    <a href="#" tabIndex={-1}>자세히 보기</a>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="slide4" data-color="#ffe3f8">
                  <div className="tit_wrap">
                    <em>시골 감성 가득💕</em>
                    <strong style={{ color: '#3d3d3d' }}>구례<br />촌캉스 여행</strong>
                    <a href="#" tabIndex={-1}>자세히 보기</a>
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
                <SwiperSlide className="slide1" data-swiper-slide-index={0} style={{ marginRight: '30px' }}>
                  <a href="#">
                    <img src="./sungsoo.png" alt="sungsoo" />
                  </a>
                </SwiperSlide>
                <SwiperSlide className="slide2" data-swiper-slide-index={1} style={{ marginRight: '30px' }}>
                  <a href="#">
                    <img src="./beach.png" alt="beach" />
                  </a>
                </SwiperSlide>
                <SwiperSlide className="slide3" data-swiper-slide-index={2} style={{ marginRight: '30px' }}>
                  <a href="#">
                    <img src="./ae3aebd0-36ae-4cb6-9865-aaafee317090.raw.png" alt="history" />
                  </a>
                </SwiperSlide>
                <SwiperSlide className="slide4" data-swiper-slide-index={3} style={{ marginRight: '30px' }}>
                  <a href="#">
                    <img src="./country.png" alt="스틸아트 천국,<br> 포항 1박 2일 여행" />
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
      <div style={{ backgroundColor: 'white' }}>
        <Travelbytheme />
      </div>
    </div>
  );
};

export default TravelerMainPage;
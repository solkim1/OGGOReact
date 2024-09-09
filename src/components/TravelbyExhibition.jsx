import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const customSlides1 = [
  {
    id: 1,
    imgSrc: `${require('../images/business/DANIEL ARSHAM.jpg')}`,
    title: '다니엘 아샴 : 서울 3024',
    apiName: 'DANIELARSHAM',
  },
  {
    id: 2,
    imgSrc: `${require('../images/business/james.jpg')}`,
    title: '제임스 로젠퀴스트 : Universe',
    apiName: 'james',
  },
  {
    id: 3,
    imgSrc: `${require('../images/business/kimjihee.jpg')}`,
    title: '김지희 개인전 - DIVINITY',
    apiName: 'kimjihee',
  },
  {
    id: 4,
    imgSrc: `${require('../images/business/Layered Life.png')}`,
    title: '정직성 : Layered Life',
    apiName: 'Layered Life',
  },
];

const customSlides2 = [
  {
    id: 1,
    imgSrc: `${require('../images/business/utopia.jpg')}`,
    title: '유토피아: Nowhere, Now Here',
    apiName: 'utopia',
  },
  {
    id: 2,
    imgSrc: `${require('../images/business/younme.png')}`,
    title: '너와 나 그리고 그곳에',
    apiName: 'YOUNME',
  },
  {
    id: 3,
    imgSrc: `${require('../images/business/dawn.png')}`,
    title: '새벽부터 황혼까지',
    apiName: 'DAWN',
  },
  {
    id: 4,
    imgSrc: `${require('../images/business/angel.png')}`,
    title: '투명하고 향기나는 천사의 날개 빛깔처럼',
    apiName: 'ANGEL',
  },
];

const SlideRow = ({ slides, title, onExhibitionClick }) => {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <h4 style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '20px' }}>{title}</h4>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <button
          onClick={handlePrev}
          className="custom-slide-prev"
          style={{
            cursor: 'pointer',
            background: `url(${process.env.PUBLIC_URL}/btn_slide02.png) no-repeat center`,
            width: '40px',
            height: '40px',
            border: 'none',
            backgroundSize: 'contain',
            flex: '0 0 40px',
          }}
        />
        <div
          className="custom-slide-wrapper"
          style={{ overflow: 'visible', display: 'flex', width: 'calc(100% - 100px)', margin: '0 10px' }}
        >
          {[...Array(4)].map((_, index) => {
            const slideIndex = (startIndex + index) % slides.length;
            const slide = slides[slideIndex];
            return (
              <div
                key={slide.id}
                className="custom-slide"
                style={{
                  minWidth: '25%',
                  flex: '0 0 25%',
                  padding: '10px 5px',
                  transition: 'transform 0.3s ease-in-out',
                  borderRadius: '50px',
                }}
                onClick={() => onExhibitionClick(slide.apiName)}
              >
                <a
                  style={{
                    textDecoration: 'none',
                    color: '#333',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, // 두 줄로 제한
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.3s ease-in-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="img" style={{ textAlign: 'center' }}>
                    <img
                      src={slide.imgSrc}
                      alt={slide.title}
                      style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                    />
                  </div>
                  <strong
                    style={{
                      marginTop: '10px',
                      fontSize: '14px',
                      textAlign: 'center',
                      display: '-webkit-box', // 2줄로 표시
                      WebkitLineClamp: 2, // 2줄까지 제한
                      WebkitBoxOrient: 'vertical', // 수직 박스 모드 설정
                      overflow: 'hidden', // 넘치는 텍스트 숨김
                      textOverflow: 'ellipsis', // 말줄임표 처리
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
            cursor: 'pointer',
            background: `url(${process.env.PUBLIC_URL}/btn_slide03.png) no-repeat center`,
            width: '40px',
            height: '40px',
            border: 'none',
            backgroundSize: 'contain',
            flex: '0 0 40px',
          }}
        />
      </div>
    </div>
  );
};

const TravelbyExhibition = () => {
  const navigate = useNavigate();

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
    <div className="custom-slide-section" style={{ padding: '20px 0', backgroundColor: 'transparent' }}>
      <div className="inr" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <h3 className="tit_atc" style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '20px' }}>
          🖼️ 최근 떠오르는 전시회 🖼️
        </h3>
        <SlideRow slides={customSlides1} onExhibitionClick={handleExhibitionClick} />
        <h3 className="tit_atc" style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '20px' }}>
          🎨 가볍게 보기 좋은 전시회 🎨
        </h3>
        <SlideRow slides={customSlides2} onExhibitionClick={handleExhibitionClick} />
      </div>
    </div>
  );
};

export default TravelbyExhibition;

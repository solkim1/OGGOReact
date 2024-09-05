import React, { useState } from 'react';

const customSlides1 = [
  {
    id: 1,
    imgSrc: `${require('../images/business/DANIEL ARSHAM.jpg')}`,
    title: '다니엘 아샴 : 서울 3024',
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=716581a4-c31b-444e-be78-22128edba831',
  },
  {
    id: 2,
    imgSrc: `${require('../images/business/james.jpg')}`,
    title: '제임스 로젠퀴스트 : Universe',
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=3d6451d9-3df7-4d25-ab92-3cc4e106d0dd',
  },
  {
    id: 3,
    imgSrc: `${require('../images/business/kimjihee.jpg')}`,
    title: '김지희 개인전 - DIVINITY',
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=fcc9aeba-ba70-4e3f-bf97-e4ff7cff3120',
  },
  {
    id: 4,
    imgSrc: `${require('../images/business/Layered Life.png')}`,
    title: '정직성 : Layered Life',
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=fcc9aeba-ba70-4e3f-bf97-e4ff7cff3120',
  },
];

const customSlides2 = [
  {
    id: 1,
    imgSrc: `${require('../images/business/utopia.jpg')}`,
    title: '유토피아\n: Nowhere, Now Here',
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=3d6451d9-3df7-4d25-ab92-3cc4e106d0dd',
  },
  {
    id: 2,
    imgSrc: `${require('../images/business/younme.png')}`,
    title: '너와 나 그리고 그곳에',
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=fcc9aeba-ba70-4e3f-bf97-e4ff7cff3120',
  },
  {
    id: 3,
    imgSrc: `${require('../images/business/dawn.png')}`,
    title: '새벽부터 황혼까지',
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=fcc9aeba-ba70-4e3f-bf97-e4ff7cff3120',
  },
  {
    id: 4,
    imgSrc: `${require('../images/business/angel.png')}`,
    title: `투명하고 향기나는 \n 천사의 날개 빛깔처럼`,
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=716581a4-c31b-444e-be78-22128edba831',
  },
];

const SlideRow = ({ slides, title }) => {
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
                }}
              >
                <a
                  href={slide.link}
                  style={{
                    textDecoration: 'none',
                    color: '#333',
                    display: 'block',
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
                  <strong style={{ display: 'block', marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>
                    {slide.title.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
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
  return (
    <div className="custom-slide-section" style={{ padding: '20px 0', backgroundColor: 'transparent' }}>
      <div className="inr" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <h3 className="tit_atc" style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '20px' }}>
          🖼️ 최근 떠오르는 전시회 🖼️
        </h3>
        <SlideRow slides={customSlides1} />
        <h3 className="tit_atc" style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '20px' }}>
          🎨 가볍게 보기 좋은 전시회 🎨
        </h3>
        <SlideRow slides={customSlides2} />
      </div>
    </div>
  );
};

export default TravelbyExhibition;

import React, { useState } from 'react';

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

    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=716581a4-c31b-444e-be78-22128edba831',
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
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=3d6451d9-3df7-4d25-ab92-3cc4e106d0dd',
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
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=fcc9aeba-ba70-4e3f-bf97-e4ff7cff3120',
  },
  {
    id: 4,
    imgSrc: `${process.env.PUBLIC_URL}/a7f03f16-474f-4e99-8c18-852666efa9d3.png`,
    title: (
      <>
        상상에 상상을 더해서!
        <br />
        정크아트의 도시 충주 여행
      </>
    ),
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=716581a4-c31b-444e-be78-22128edba831',
  },
];

const customSlides2 = [
  {
    id: 1,
    imgSrc: `${process.env.PUBLIC_URL}/sungsoo1.png`,
    title: (
      <>
        모든게 다 거꾸로🙃
        <br />
        성수동 거꾸로 하우스
      </>
    ),
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=3d6451d9-3df7-4d25-ab92-3cc4e106d0dd',
  },
  {
    id: 2,
    imgSrc: `${process.env.PUBLIC_URL}/beach1.png`,
    title: (
      <>
        여름하면 바다🌊
        <br />
        경포대~속초 파도와 함께 하는 바다
      </>
    ),
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=fcc9aeba-ba70-4e3f-bf97-e4ff7cff3120',
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
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=fcc9aeba-ba70-4e3f-bf97-e4ff7cff3120',
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
    link: 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=fcc9aeba-ba70-4e3f-bf97-e4ff7cff3120',
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

const Travelbytheme = () => {
  return (
    <div className="custom-slide-section" style={{ padding: '20px 0', backgroundColor: 'transparent' }}>
      <div className="inr" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <h3 className="tit_atc" style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '20px' }}>
          ❤️ 함께 떠나는 데이트 코스 여행 ❤️
        </h3>
        <SlideRow slides={customSlides1} />
        <h3 className="tit_atc" style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '20px' }}>
          👍 추천 여행지 👍
        </h3>
        <SlideRow slides={customSlides2} />
      </div>
    </div>
  );
};

export default Travelbytheme;

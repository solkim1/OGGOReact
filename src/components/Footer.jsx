import React, { useContext } from "react";
import styles from "../styles/Footer.module.css";
import { HeaderColorContext } from "../context/HeaderColorContext"; // Context 가져오기

import facebookIcon from "../images/icons/logo-facebook.png";
import instaIcon from "../images/icons/logo-instagram.png";
import linkedinIcon from "../images/icons/logo-linkedin.png";
import twitterIcon from "../images/icons/logo-twitter.png";

/**
 * Footer 컴포넌트.
 * 페이지 하단에 표시되는 푸터 영역을 렌더링합니다.
 * 사이트 정보, 소셜 미디어 링크, 지원 서비스 정보를 포함합니다.
 *
 * @return {JSX.Element} Footer 컴포넌트를 반환합니다.
 */
const Footer = () => {
  const { footerColor } = useContext(HeaderColorContext); // HeaderColorContext에서 푸터 색상 가져오기

  return (
    <footer className={styles.footer} style={{ backgroundColor: footerColor }}>
      <div className={styles.footerContent}>
        {/* 첫 번째 섹션: 회사 정보 및 소셜 미디어 링크 */}
        <div className={styles.footerSection}>
          <h1>Plan Maker</h1>
          <p>Crafting Your Journey, One Step at a Time</p>
          <p>당신의 여행을 함께 만들어가는 Plan Maker</p>
          <div className={styles.imageContainer}>
            <img src={facebookIcon} alt="facebook" />
            <img src={instaIcon} alt="instagram" />
            <img src={linkedinIcon} alt="linkedin" />
            <img src={twitterIcon} alt="twitter" />
          </div>
        </div>

        {/* 두 번째 섹션: 사업자 정보 */}
        <div className={styles.footerSection}>
          <h3>사업자 정보</h3>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>News</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* 세 번째 섹션: 마케팅 지원 서비스 */}
        <div className={styles.footerSection}>
          <h3>마케팅 지원</h3>
          <ul>
            <li>Market Research</li>
            <li>Market Analysis</li>
            <li>SEO Consultancy</li>
            <li>Page Ranking</li>
            <li>SMM</li>
          </ul>
        </div>

        {/* 네 번째 섹션: 고객 지원 서비스 */}
        <div className={styles.footerSection}>
          <h3>고객 지원</h3>
          <ul>
            <li>Brand Strategy</li>
            <li>Audience Analytics</li>
            <li>Copywriting</li>
            <li>Team Training</li>
            <li>Email Marketing</li>
          </ul>
        </div>
      </div>

      {/* 저작권 정보 섹션 */}
      <div className={styles.copyrightSection}>
        <p>Copyright © 2024 Plan Maker</p>
      </div>
    </footer>
  );
};

export default Footer;

// 메인페이지(여행자모드),메인페이지(출장자모드),마이페이지, 나의 일정 페이지에서에 푸터 통합

import React from "react";
import styles from "../styles/Footer.module.css";

import facebookIcon from "../images/logo-facebook.png";
import instaIcon from "../images/logo-instagram.png";
import linkedinIcon from "../images/logo-linkedin.png";
import twitterIcon from "../images/logo-twitter.png";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
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
      <div className={styles.copyrightSection}>
        <p>Copyright © 2024 Plan Maker</p>
      </div>
    </footer>
  );
};

export default Footer;

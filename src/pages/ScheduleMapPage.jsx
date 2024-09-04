import React, { useState, useEffect, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // REST API 요청을 처리하기 위한 axios 라이브러리
import ScheduleMapBtn from "../components/ScheduleMapBtn"; // 일정 페이지의 버튼을 관리하는 컴포넌트
import Map from "../components/Map"; // 지도를 표시하는 컴포넌트
import DaySchedule from "../components/DaySchedule"; // 하루 일정을 표시하는 컴포넌트
import logo from "../images/logo.png"; // 로고 이미지
import styles from "../styles/ScheduleMapPage.module.css"; // 페이지의 스타일링
import LocalCache from "../components/LocalCache"; // 로컬 캐시를 다루는 컴포넌트
import { UserContext } from "../context/UserProvider"; // 사용자 정보를 관리하는 Context
import { v4 as uuidv4 } from "uuid"; // 고유한 ID를 생성하기 위한 라이브러리

const ScheduleMapPage = () => {
  // React Router의 훅을 사용하여 현재 위치 및 탐색 함수 가져오기
  const location = useLocation();
  const navigate = useNavigate();

  // UserContext에서 사용자 정보 가져오기
  const { user } = useContext(UserContext);

  // location.state에서 전달된 일정 관련 데이터 추출, 기본값 설정
  const {
    userId = user?.userId, // 사용자 ID, 전달된 것이 없으면 현재 로그인된 사용자의 ID 사용
    days = 3, // 일정 기간(일수)
    ageGroup = "10대~20대", // 연령대
    gender = "남성", // 성별
    groupSize = "개인", // 그룹 크기
    theme = "레포츠", // 여행 테마
    startDate, // 여행 시작일
    endDate, // 여행 종료일
    isBusiness = false, // 출장 여부
    region = "서울", // 지역
    includeOptions = ["전시회", "식당", "카페"], // 포함할 옵션 (활동)
    startTime = "09:00", // 일정 시작 시간
    endTime = "18:00", // 일정 종료 시간
  } = location.state || {};

  const { schedule } = location.state;

  // 상태 관리 훅 설정
  const [isBusinessMode, setIsBusinessMode] = useState(isBusiness); // 비즈니스 모드인지 여부
  const [locationData, setLocationData] = useState({}); // 일정을 저장할 데이터 객체
  const [scheduleTitle, setScheduleTitle] = useState(""); // 일정 제목
  const [selectedDay, setSelectedDay] = useState("day1"); // 현재 선택된 날짜 (day1, day2, ...)
  const [mapCenter, setMapCenter] = useState({ lat: 37.5666103, lng: 126.9783882 }); // 지도의 중심 좌표 (기본값은 서울)
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  // 반응형 페이지 인덱스 관리
  const [responsivePageIndex, setResponsivePageIndex] = useState(0); // 반응형 모드에서의 페이지 인덱스
  const [standardPageIndex, setStandardPageIndex] = useState(0); // 기본 모드에서의 페이지 인덱스
  const [isResponsive, setIsResponsive] = useState(window.innerWidth <= 1024); // 반응형 모드인지 여부

  // 반응형에 따라 한 페이지에 표시할 일정 수 설정
  const [scheduleItemsPerPage, setScheduleItemsPerPage] = useState(isResponsive ? 1 : 3);

  // 일정이 테마인지 전시회인지 여부를 관리
  const [isThemeSchedule, setIsThemeSchedule] = useState(false);
  const [isExhibitionSchedule, setIsExhibitionSchedule] = useState(false);

  // 창 크기에 따라 반응형 모드 여부를 업데이트하는 useEffect 훅
  useEffect(() => {
    const handleResize = () => {
      const isResponsiveMode = window.innerWidth <= 1024;

      if (isResponsiveMode !== isResponsive) {
        setIsResponsive(isResponsiveMode);

        if (isResponsiveMode) {
          setResponsivePageIndex(0);
        } else {
          setStandardPageIndex(0);
        }
      }

      setScheduleItemsPerPage(isResponsiveMode ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isResponsive]);

  // 로컬 캐시에서 비즈니스 모드를 가져오는 useEffect 훅
  useEffect(() => {
    const fetchInitialMode = async () => {
      const cachedMode = await LocalCache.readFromCache("userMode");
      if (cachedMode) {
        setIsBusinessMode(cachedMode === "business");
      }
    };
    fetchInitialMode();
  }, []);

  // 일정을 가져오는 useEffect 훅
  useEffect(() => {
    // 비동기 데이터를 가져오는 함수
    const fetchData = async () => {
      setLoading(true); // 데이터를 로딩 중임을 표시

      try {
        let fetchUrl = ""; // 데이터를 가져올 URL 변수

        // location.state에 themeData가 있는 경우 (테마 여행 일정)
        if (location.state?.themeData) {
          // 테마 데이터를 상태에 저장
          setLocationData(location.state.themeData);
          setIsThemeSchedule(true); // 테마 일정임을 표시
          setScheduleTitle(`${location.state.themeName} 테마 여행`); // 일정 제목 설정
          setLoading(false); // 로딩 완료 표시

          // location.state에 exhibitionData가 있는 경우 (전시회 일정)
        } else if (location.state?.exhibitionData) {
          // 전시회 데이터를 상태에 저장 (배열일 경우 첫 번째 날짜로 설정)
          const exhibitionSchedule = Array.isArray(location.state.exhibitionData)
            ? { day1: location.state.exhibitionData }
            : location.state.exhibitionData;
          setLocationData(exhibitionSchedule);
          setIsExhibitionSchedule(true); // 전시회 일정임을 표시
          setScheduleTitle(`${location.state.exhibitionName} 전시회 일정`); // 일정 제목 설정
          setLoading(false); // 로딩 완료 표시

        } else {
          // 기존 일정이 없는 경우 새로 일정을 생성
          if (!schedule) {
            // 비즈니스 모드 여부에 따라 다른 URL을 생성
            if (isBusinessMode) {
              fetchUrl = await generateBusinessPrompt(); // 출장 일정을 생성하는 URL
            } else {
              fetchUrl = await generateTravelPrompt(); // 여행 일정을 생성하는 URL
            }

          } else {
            // 기존 일정이 있는 경우 일정 수정 URL 생성
            fetchUrl = await patchschedule(); // 일정 수정 URL
          }

          console.log("Fetch URL:", fetchUrl); // 디버깅을 위한 URL 출력

          // 일정 데이터를 서버에서 가져오기
          const response = await fetch(fetchUrl);
          if (!response.ok) {
            // 서버 응답이 실패한 경우 예외 발생
            throw new Error("Failed to fetch schedule");
          }

          const data = await response.json(); // 서버에서 응답 받은 데이터를 JSON으로 변환
          console.log("Fetched data:", data); // 디버깅을 위한 데이터 출력

          // 데이터가 올바르지 않은 형식일 경우 예외 발생
          if (!data || typeof data !== "object") {
            throw new Error("Invalid data format");
          }

          // 가져온 일정 데이터를 상태에 저장
          setLocationData(data);

          // 일정의 첫 번째 위치를 중심으로 지도의 초기 위치 설정
          const firstDay = Object.keys(data)[0]; // 첫 번째 날의 키(day1 등)를 가져옴
          const firstLocation = data[firstDay]?.[0]; // 첫 번째 위치를 가져옴
          if (firstLocation) {
            setMapCenter({ lat: parseFloat(firstLocation.lat), lng: parseFloat(firstLocation.lng) }); // 지도 중심 좌표 설정
          }

          // 일정 제목 설정, 일정 제목이 없을 경우 기본 제목 사용
          if (schedule) {
            setScheduleTitle(schedule.scheTitle);
          } else {
            setScheduleTitle((isBusinessMode ? "출장 일정" : "여행 일정"));
          }
        }

      } catch (error) {
        // 오류 발생 시 에러 메시지를 출력하고 사용자에게 알림
        console.error("Error fetching data:", error);
        setError("일정을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    // fetchData 함수 실행 (컴포넌트가 마운트되거나 의존성 배열의 값이 변경될 때 실행)
    fetchData();

    console.log(locationData); // 현재 locationData 상태를 콘솔에 출력 (디버깅 용도)

  }, [location.state, isBusinessMode]); // location.state와 isBusinessMode가 변경될 때마다 useEffect가 재실행됨


  // 선택된 날이 변경될 때마다 지도의 중심 좌표를 업데이트하는 useEffect 훅
  useEffect(() => {
    if (locationData[selectedDay] && locationData[selectedDay].length > 0) {
      const firstLocation = locationData[selectedDay][0];
      setMapCenter({ lat: parseFloat(firstLocation.lat), lng: parseFloat(firstLocation.lng) });
    }
  }, [selectedDay, locationData]);

  // 비즈니스 일정을 생성하기 위한 URL을 반환하는 함수
  const generateBusinessPrompt = async () => {
    return `/plan/api/schedules/business/generate?userId=${userId}&days=${days}&region=${region}&includeOptions=${includeOptions.join(
      ","
    )}&startTime=${startTime}&endTime=${endTime}&startDate=${startDate}&endDate=${endDate}`;
  };

  // 여행 일정을 생성하기 위한 URL을 반환하는 함수
  const generateTravelPrompt = async () => {
    return `/plan/api/schedules/travel/generate?userId=${userId}&days=${days}&ageGroup=${ageGroup}&gender=${gender}&groupSize=${groupSize}&theme=${theme}&startDate=${startDate}&endDate=${endDate}`;
  };

  // 기존 일정을 수정하기 위한 URL을 반환하는 함수
  const patchschedule = async () => {
    return `/plan/api/schedules/patchschedule?scheNum=${schedule.scheNum}`;
  }

  // 일정을 재생성하는 함수
  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const excludedItems = {};
      Object.entries(locationData).forEach(([day, locations]) => {
        const excluded = locations.filter((item) => item.excluded);
        if (excluded.length > 0) {
          excludedItems[day] = excluded.map((item) => ({
            name: item.name,
            type: item.type,
            lat: item.lat,
            lng: item.lng,
            departTime: item.departTime,
            arriveTime: item.arriveTime,
          }));
        }
      });

      if (Object.keys(excludedItems).length === 0) {
        alert("재생성할 일정을 체크해주세요.");
        setLoading(false);
        return;
      }

      const response = await fetch("/plan/api/schedules/recall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(excludedItems),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate schedule");
      }

      const data = await response.json();
      console.log("Received data from server:", data);

      if (Object.keys(data).length === 0) {
        alert("재생성된 일정 데이터가 없습니다. 다시 시도해 주세요.");
        setLoading(false);
        return;
      }

      setLocationData((prevData) => {
        const updatedData = { ...prevData };

        Object.entries(data).forEach(([day, newItems]) => {
          updatedData[day] = updatedData[day].map((item) => {
            const newItem = newItems.find((newItem) => item.excluded && newItem.departTime === item.departTime);
            return newItem ? newItem : item;
          });
        });

        LocalCache.writeToCache("scheduleData", updatedData);

        return updatedData;
      });
    } catch (err) {
      setError("일정 재생성에 실패했습니다: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 일정을 저장하는 함수
  const handleSaveSchedule = async () => {
    try {
      let num;
      let baseDate;
      // 이미 일정(schedule)이 존재하면 그 일정의 번호(scheNum)를 사용, 없으면 새로 UUID를 생성
      if (schedule) {
        num = schedule.scheNum;
        baseDate = new Date(schedule.scheStDt);
      } else {
        num = uuidv4(); // UUID를 이용하여 새로운 일정 번호를 생성
        baseDate = new Date(startDate); // 사용자가 지정한 시작 날짜를 기준으로 baseDate 설정
      }

      // 캐시에서 저장된 데이터 불러오기 (만약 캐시에 데이터가 없다면 현재 위치 데이터를 사용)
      const cachedData = await LocalCache.readFromCache("scheduleData");
      const currentLocationData = cachedData || locationData;

      // 일정 데이터를 변환하여 배열로 저장
      // currentLocationData는 각 일자(day)별 위치 정보가 담겨 있고 이를 순회하여 일정 데이터를 생성
      const scheduleDataArray = Object.entries(currentLocationData).flatMap(([day, locations]) => {
        // 'day1', 'day2' 등으로 된 키 값에서 숫자만 추출하여 dayIndex를 계산
        const dayIndex = parseInt(day.replace("day", "")) - 1;

        // baseDate를 기준으로 dayIndex를 더한 날짜를 계산하여 해당 일자의 시작 날짜를 구함
        const currentStartDate = new Date(baseDate);
        currentStartDate.setDate(currentStartDate.getDate() + dayIndex);
        const formattedStartDate = currentStartDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환


        // 해당 일자의 각 위치(loc) 정보를 일정 데이터 형식으로 변환
        return locations.map((loc) => {
          let departTime = loc.departTime; // 출발 시간
          let arriveTime = loc.arriveTime; // 도착 시간

          // 위치의 타입이 '숙박'일 경우 체크인/체크아웃 시간을 각각 출발/도착 시간으로 설정
          if (loc.type === "숙박") {
            departTime = loc.checkInTime || "15:00"; // 기본 체크인 시간은 15:00
            arriveTime = loc.checkOutTime || "11:00"; // 기본 체크아웃 시간은 11:00
          }

          // 출발 및 도착 시간이 없다면 기본 시간 설정 (출발: 09:00, 도착: 18:00)
          if (!departTime) departTime = "09:00";
          if (!arriveTime) arriveTime = "18:00";

          // 일정 데이터를 객체로 반환
          return {
            scheduleDesc: schedule?.scheDesc || "일정을 입력하세요", // 일정 설명 기본값
            userId: user?.userId, // 사용자 ID
            title: scheduleTitle, // 일정 제목
            scheNum: num, // 일정 번호
            startDate: formattedStartDate, // 해당 일자의 시작 날짜
            endDate: formattedStartDate, // 해당 일자의 종료 날짜 (시작 날짜와 동일)
            isBusiness: isBusinessMode ? "Y" : "N", // 비즈니스 모드 여부
            name: loc.name, // 위치 이름
            description: loc.description, // 위치 설명
            departTime: departTime, // 출발 시간
            arriveTime: arriveTime, // 도착 시간
            lat: loc.lat, // 위치의 위도
            lng: loc.lng, // 위치의 경도
            type: loc.type, // 위치의 타입 (예: 숙박, 관광 등)
            sche_st_tm: departTime, // 일정 시작 시간
            sche_ed_tm: arriveTime, // 일정 종료 시간
          };
        });
      });

      // 서버로 전송할 데이터를 콘솔에 출력 (디버깅 용도)
      console.log("Sending data:", scheduleDataArray);

      // 서버에 일정 데이터를 저장하기 위한 API 요청 (POST 방식)
      const response = await fetch("/plan/api/schedules/save", {
        method: "POST", // 데이터 전송 방식
        body: JSON.stringify(scheduleDataArray), // 일정 데이터를 JSON 형태로 변환하여 전송
        headers: { "Content-Type": "application/json" }, // JSON 데이터임을 명시
      });

      // 서버 응답이 성공적이지 않을 경우 오류 처리
      if (!response.ok) {
        const errorData = await response.text(); // 오류 메시지 읽기
        throw new Error(`일정 저장 실패: ${errorData}`); // 오류 메시지를 포함한 예외 발생
      }

      // 서버 응답 결과를 텍스트로 받아옴
      const result = await response.text();
      console.log("저장 결과:", result); // 저장 결과를 콘솔에 출력

      // 일정 저장 성공 알림
      alert("모든 일정이 성공적으로 저장되었습니다.");

      // 사용자 모드에 따라 다른 페이지로 이동 (비즈니스 모드인 경우 비즈니스 페이지로, 아닌 경우 여행자 페이지로)
      const userMode = await LocalCache.readFromCache("userMode");

      if (schedule) {
        navigate("/myschedules");
      } else {
        if (userMode === "business") {
          navigate("/business");
        } else {
          navigate("/traveler");
        }
      }
      console.log("Sending data:", scheduleDataArray);
    } catch (err) {
      // 오류 발생 시 사용자에게 경고 메시지 표시 및 오류 로그 출력
      alert(`일정 저장 중 오류가 발생했습니다: ${err.message}`);
      console.error("일정 저장 중 오류 발생:", err);
    }
  };


  // 다음 페이지로 이동하는 함수
  const handleNextPage = () => {
    if (isResponsive) {
      setResponsivePageIndex((prev) => Math.min(prev + 1, totalSchedulePages - 1));
    } else {
      setStandardPageIndex((prev) => Math.min(prev + 1, totalSchedulePages - 1));
    }
  };

  // 이전 페이지로 이동하는 함수
  const handlePrevPage = () => {
    if (isResponsive) {
      setResponsivePageIndex((prev) => Math.max(prev - 1, 0));
    } else {
      setStandardPageIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // 페이지 수 계산
  const totalSchedulePages = Math.ceil(Object.keys(locationData).length / scheduleItemsPerPage);

  // 현재 페이지에 표시할 일정을 계산
  const displayedScheduleDays = useMemo(
    () =>
      Array.from(
        { length: scheduleItemsPerPage },
        (_, i) => `day${(isResponsive ? responsivePageIndex : standardPageIndex) * scheduleItemsPerPage + i + 1}`
      ).filter((day) => locationData[day]),
    [locationData, scheduleItemsPerPage, isResponsive, responsivePageIndex, standardPageIndex]
  );

  // 일정 종료일 계산 함수
  const calculateEndDate = (startDate, days) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + days - 1);
    return date.toISOString().split("T")[0];
  };

  // 데이터 로딩 중일 때 표시할 내용
  if (loading && Object.keys(locationData).length === 0) {
    return <p>Loading...</p>;
  }

  // 오류 발생 시 표시할 내용
  if (error) {
    return <p>{error}</p>;
  }

  // 데이터가 없을 때 표시할 내용
  if (Object.keys(locationData).length === 0) {
    return <p>데이터가 없습니다.</p>;
  }

  // 홈 페이지로 이동하는 함수
  const goToHomePage = () => {
    if (isBusinessMode) {
      navigate("/business");
    } else {
      navigate("/traveler");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <img src={logo} alt="Plan Maker" className={styles.logo} onClick={goToHomePage} />
        <h2 className={styles.scheduleTitleContainer}>
          <span className={styles.scheduleTitle}>{scheduleTitle} </span>



          <span className={styles.scheduleDate}>
            {isExhibitionSchedule ? (
              startDate
            ) : isThemeSchedule ? (
              `${(schedule?.scheStDt || startDate)} - ${calculateEndDate(schedule?.scheStDt || startDate, Object.keys(locationData).length)}`
            ) : (
              `${(schedule?.scheStDt || startDate)} - ${(schedule?.scheEdDt || endDate)}`
            )}
          </span>



        </h2>
        <div className={styles.buttonAndScheduleContainer}>
          <div className={styles.navigationButtons}>
            <ScheduleMapBtn
              handleRegenerate={handleRegenerate}
              handleSaveSchedule={handleSaveSchedule}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              pageIndex={isResponsive ? responsivePageIndex : standardPageIndex}
              totalPages={totalSchedulePages}
              setSelectedDay={setSelectedDay}
            />
          </div>
          <DaySchedule
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            pageIndex={isResponsive ? responsivePageIndex : standardPageIndex}
            totalPages={totalSchedulePages}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            locationData={displayedScheduleDays.reduce((acc, day) => {
              acc[day] = locationData[day] || [];
              return acc;
            }, {})}
            setLocationData={setLocationData}
          />
        </div>
      </div>
      <Map locations={locationData[selectedDay] || []} center={mapCenter} />
    </div>
  );
};

export default ScheduleMapPage;

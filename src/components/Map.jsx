import React, { useEffect, useCallback } from "react";
import LocalCache from "../components/LocalCache";
import spPinsSpotV3 from "../images/icons/sp_pins_spot_v3.png";
import spPinsSpotV3Over from "../images/icons/sp_pins_spot_v3_over.png";
import styles from "../styles/Map.module.css";

/**
 * Map 컴포넌트.
 * Naver Maps를 사용하여 경로 및 위치를 렌더링합니다.
 *
 * @param {Object} props - 컴포넌트의 props.
 * @param {Array} props.locations - 표시할 위치 목록.
 * @param {Object} props.center - 지도의 중심 좌표.
 * @return {JSX.Element} Map 컴포넌트를 반환합니다.
 */
const Map = ({ locations, center }) => {
  /**
   * 지도 초기화 함수.
   * 네이버 지도를 초기화하고 마커와 경로를 그립니다.
   */
  const initializeMap = useCallback(() => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom: 14,
    };

    const map = new window.naver.maps.Map("map", mapOptions);

    // 선의 색상을 정의합니다.
    const lineColors = [
      "#003499",
      "#37b42d",
      "#fe5d10",
      "#00a2d1",
      "#8b50a4",
      "#c55a11",
      "#54640d",
      "#f51361",
      "#aa9872",
    ];

    /**
     * 네이버 지도에 마커를 그리는 함수.
     *
     * @param {number} lat - 마커의 위도.
     * @param {number} lng - 마커의 경도.
     * @param {number} index - 마커의 인덱스.
     * @return {Object} 생성된 마커 객체.
     */
    const drawNaverMarker = (lat, lng, index) => {
      const icon = {
        url: spPinsSpotV3,
        size: new window.naver.maps.Size(24, 37),
        anchor: new window.naver.maps.Point(12, 37),
        origin: new window.naver.maps.Point(index * 29, 0),
      };

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map: map,
        icon: icon,
      });

      marker.set("seq", index);

      // 마커 마우스오버 이벤트
      marker.addListener("mouseover", () => {
        marker.setIcon({
          url: spPinsSpotV3Over,
          size: new window.naver.maps.Size(24, 37),
          anchor: new window.naver.maps.Point(12, 37),
          origin: new window.naver.maps.Point(index * 29, 50),
        });
      });

      // 마커 마우스아웃 이벤트
      marker.addListener("mouseout", () => {
        marker.setIcon({
          url: spPinsSpotV3,
          size: new window.naver.maps.Size(24, 37),
          anchor: new window.naver.maps.Point(12, 37),
          origin: new window.naver.maps.Point(index * 29, 0),
        });
      });

      return marker;
    };

    /**
     * 공공 교통 경로를 검색하는 함수.
     *
     * @param {number} sx - 시작 지점의 경도.
     * @param {number} sy - 시작 지점의 위도.
     * @param {number} ex - 종료 지점의 경도.
     * @param {number} ey - 종료 지점의 위도.
     * @param {number} index - 경로 인덱스.
     */
    const searchPubTransPathAJAX = async (sx, sy, ex, ey, index) => {
      const cacheKey = `path_${sx}_${sy}_${ex}_${ey}`;
      const cachedData = await LocalCache.readFromCache(cacheKey);

      if (cachedData && cachedData.result && cachedData.result.path && cachedData.result.path.length > 0) {
        const data = cachedData;
        const mapObj = data.result.path[0].info.mapObj;
        callMapObjApiAJAX(mapObj, sx, sy, ex, ey, index, true);
      } else {
        const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}&apiKey=2r2QB8AHuKaddIjuRbbjOA`;

        try {
          await new Promise((resolve) => setTimeout(resolve, 500)); // API 호출 지연

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch path data: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();

          console.log("ODsay API response:", data);

          if (data.error) {
            console.error(`Error from ODsay API: ${data.error.message}`);
            drawDirectLine(sy, sx, ey, ex, map, index);
            return;
          }

          LocalCache.writeToCache(cacheKey, data);

          if (data.result && data.result.path && data.result.path.length > 0) {
            const mapObj = data.result.path[0].info.mapObj;
            callMapObjApiAJAX(mapObj, sx, sy, ex, ey, index, false);
          } else {
            drawDirectLine(sy, sx, ey, ex, map, index);
          }
        } catch (error) {
          console.error("Error fetching public transport path:", error);
          drawDirectLine(sy, sx, ey, ex, map, index);
        }
      }
    };

    /**
     * ODsay API의 지도 객체 데이터를 호출하는 함수.
     *
     * @param {string} mapObj - 지도 객체 식별자.
     * @param {number} sx - 시작 지점의 경도.
     * @param {number} sy - 시작 지점의 위도.
     * @param {number} ex - 종료 지점의 경도.
     * @param {number} ey - 종료 지점의 위도.
     * @param {number} index - 경로 인덱스.
     * @param {boolean} isCached - 데이터가 캐시된 상태인지 여부.
     */
    const callMapObjApiAJAX = async (mapObj, sx, sy, ex, ey, index, isCached) => {
      const cacheKey = `mapObj_${mapObj}`;
      const cachedData = await LocalCache.readFromCache(cacheKey);

      let data;

      if (cachedData && isCached) {
        data = cachedData;
      } else {
        const url = `https://api.odsay.com/v1/api/loadLane?mapObject=0:0@${mapObj}&apiKey=2r2QB8AHuKaddIjuRbbjOA`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch lane data: ${response.status} ${response.statusText}`);
          }

          data = await response.json();
          LocalCache.writeToCache(cacheKey, data);
        } catch (error) {
          console.error("Error fetching lane data:", error);
          return;
        }
      }

      console.log("ODsay loadLane API response:", data);

      if (data && data.result && data.result.lane && data.result.lane.length > 0) {
        const firstSection = data.result.lane[0].section;
        const lastSection = data.result.lane[data.result.lane.length - 1].section;

        if (firstSection && firstSection.length > 0 && lastSection && lastSection.length > 0) {
          drawNaverMarker(sy, sx, index);
          drawNaverMarker(ey, ex, index + 1);
          drawNaverPolyLine(data, map, index);

          drawDashedLine(sy, sx, firstSection[0].graphPos[0].y, firstSection[0].graphPos[0].x, map);

          drawDashedLine(
            lastSection[lastSection.length - 1].graphPos.slice(-1)[0].y,
            lastSection[lastSection.length - 1].graphPos.slice(-1)[0].x,
            ey,
            ex,
            map
          );
        } else {
          console.error("Data sections are invalid:", data);
        }
      } else {
        console.error("Invalid data structure from ODsay API:", data);
      }
    };

    /**
     * 네이버 지도에 폴리라인을 그리는 함수.
     *
     * @param {Object} data - API로부터 받은 데이터.
     * @param {Object} map - 네이버 지도 객체.
     * @param {number} index - 경로 인덱스.
     */
    const drawNaverPolyLine = (data, map, index) => {
      const polylineOptions = {
        map: map,
        strokeWeight: 5,
        strokeColor: lineColors[index % lineColors.length],
        startIcon: window.naver.maps.PointingIcon.CIRCLE,
        startIconSize: 6,
        endIcon: window.naver.maps.PointingIcon.BLOCK_ARROW,
        endIconSize: 12,
        icons: [
          {
            icon: {
              path: "M 0,0 L 10,-5 L 10,5 Z",
              strokeColor: lineColors[index % lineColors.length],
              fillOpacity: 1,
              fillColor: lineColors[index % lineColors.length],
              scale: 1.5,
              rotation: calculateRotation(
                data.result.lane[0].section[0].graphPos[0].y,
                data.result.lane[0].section[0].graphPos[0].x,
                data.result.lane[0].section.slice(-1)[0].graphPos.slice(-1)[0].y,
                data.result.lane[0].section.slice(-1)[0].graphPos.slice(-1)[0].x
              ),
            },
            offset: "100%",
          },
        ],
      };

      for (let i = 0; i < data.result.lane.length; i++) {
        for (let j = 0; j < data.result.lane[i].section.length; j++) {
          const lineArray = data.result.lane[i].section[j].graphPos.map(
            (pos) => new window.naver.maps.LatLng(pos.y, pos.x)
          );

          new window.naver.maps.Polyline({
            ...polylineOptions,
            path: lineArray,
          });
        }
      }
    };

    /**
     * 두 지점 사이의 각도를 계산하는 함수.
     *
     * @param {number} y1 - 첫 번째 지점의 위도.
     * @param {number} x1 - 첫 번째 지점의 경도.
     * @param {number} y2 - 두 번째 지점의 위도.
     * @param {number} x2 - 두 번째 지점의 경도.
     * @return {number} 각도(도 단위).
     */
    const calculateRotation = (y1, x1, y2, x2) => {
      const dy = y2 - y1;
      const dx = x2 - x1;
      const theta = Math.atan2(dy, dx);
      const angle = (theta * 180) / Math.PI;
      return angle;
    };

    /**
     * 두 지점 사이에 점선 라인을 그리는 함수.
     *
     * @param {number} y1 - 시작 지점의 위도.
     * @param {number} x1 - 시작 지점의 경도.
     * @param {number} y2 - 종료 지점의 위도.
     * @param {number} x2 - 종료 지점의 경도.
     * @param {Object} map - 네이버 지도 객체.
     */
    const drawDashedLine = (y1, x1, y2, x2, map) => {
      new window.naver.maps.Polyline({
        map: map,
        path: [new window.naver.maps.LatLng(y1, x1), new window.naver.maps.LatLng(y2, x2)],
        strokeColor: "#808080",
        strokeStyle: "shortdash",
        strokeWeight: 2,
      });
    };

    /**
     * 두 지점 사이에 직선을 그리는 함수.
     *
     * @param {number} y1 - 시작 지점의 위도.
     * @param {number} x1 - 시작 지점의 경도.
     * @param {number} y2 - 종료 지점의 위도.
     * @param {number} x2 - 종료 지점의 경도.
     * @param {Object} map - 네이버 지도 객체.
     * @param {number} index - 경로 인덱스.
     */
    const drawDirectLine = (y1, x1, y2, x2, map, index) => {
      new window.naver.maps.Polyline({
        map: map,
        path: [new window.naver.maps.LatLng(y1, x1), new window.naver.maps.LatLng(y2, x2)],
        strokeColor: lineColors[index % lineColors.length],
        strokeWeight: 3,
        icons: [
          {
            icon: {
              path: "M 0,0 L 10,-5 L 10,5 Z",
              strokeColor: lineColors[index % lineColors.length],
              fillOpacity: 1,
              fillColor: lineColors[index % lineColors.length],
              scale: 1.5,
              rotation: calculateRotation(y1, x1, y2, x2),
            },
            offset: "100%",
          },
        ],
      });
    };

    // 위치에 따라 마커와 경로를 그립니다.
    for (let i = 0; i < locations.length; i++) {
      const { lat, lng } = locations[i];
      drawNaverMarker(lat, lng, i);

      if (i < locations.length - 1) {
        const sx = locations[i].lng;
        const sy = locations[i].lat;
        const ex = locations[i + 1].lng;
        const ey = locations[i + 1].lat;
        searchPubTransPathAJAX(sx, sy, ex, ey, i);
      }
    }
  }, [locations, center]);

  /**
   * 컴포넌트가 마운트될 때, Naver Maps 스크립트를 로드합니다.
   * 스크립트가 로드된 후 지도를 초기화합니다.
   */
  useEffect(() => {
    const script = document.createElement("script");

    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=h7fnyo8jb3`;
    script.async = true;

    script.onload = () => {
      if (window.naver && window.naver.maps) {
        initializeMap();
      } else {
        console.error("Naver Maps library could not be loaded.");
      }
    };

    script.onerror = () => {
      console.error("Failed to load Naver Maps script.");
    };

    document.head.appendChild(script);

    // 컴포넌트가 언마운트될 때 스크립트를 제거합니다.
    return () => {
      document.head.removeChild(script);
    };
  }, [initializeMap, center]);

  return <div id="map" className={styles.mapContainer} />;
};

export default Map;

import React, { useEffect, useCallback } from 'react';
import LocalCache from '../components/LocalCache';
import spPinsSpotV3 from '../images/icons/sp_pins_spot_v3.png';
import spPinsSpotV3Over from '../images/icons/sp_pins_spot_v3_over.png';
import styles from '../styles/Map.module.css';

const Map = ({ locations, center }) => {
  const initializeMap = useCallback(() => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom: 14,
    };

    const map = new window.naver.maps.Map('map', mapOptions);

    const lineColors = [
      '#003499',
      '#37b42d',
      '#fe5d10',
      '#00a2d1',
      '#8b50a4',
      '#c55a11',
      '#54640d',
      '#f51361',
      '#aa9872',
    ];

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

      marker.set('seq', index);

      marker.addListener('mouseover', () => {
        marker.setIcon({
          url: spPinsSpotV3Over,
          size: new window.naver.maps.Size(24, 37),
          anchor: new window.naver.maps.Point(12, 37),
          origin: new window.naver.maps.Point(index * 29, 50),
        });
      });

      marker.addListener('mouseout', () => {
        marker.setIcon({
          url: spPinsSpotV3,
          size: new window.naver.maps.Size(24, 37),
          anchor: new window.naver.maps.Point(12, 37),
          origin: new window.naver.maps.Point(index * 29, 0),
        });
      });

      return marker;
    };

    const searchPubTransPathAJAX = async (sx, sy, ex, ey, index) => {
      const cacheKey = `path_${sx}_${sy}_${ex}_${ey}`;
      const cachedData = await LocalCache.readFromCache(cacheKey);

      if (cachedData && cachedData.result && cachedData.result.path && cachedData.result.path.length > 0) {
        const data = cachedData;
        const mapObj = data.result.path[0].info.mapObj;
        callMapObjApiAJAX(mapObj, sx, sy, ex, ey, index, true);
      } else {
        const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}&apiKey=2r2QB8AHuKaddIjuRbbjOAAAA,,,,,,,`;

        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch path data: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();

          // 응답 데이터 전체를 콘솔에 출력하여 문제를 파악
          console.log('ODsay API response:', data);

          // 응답 데이터 구조를 검사
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
          console.error('Error fetching public transport path:', error);
          drawDirectLine(sy, sx, ey, ex, map, index);
        }
      }
    };

    const callMapObjApiAJAX = async (mapObj, sx, sy, ex, ey, index, isCached) => {
      const cacheKey = `mapObj_${mapObj}`;
      const cachedData = await LocalCache.readFromCache(cacheKey);

      let data;

      if (cachedData && isCached) {
        data = cachedData;
      } else {
        const url = `https://api.odsay.com/v1/api/loadLane?mapObject=0:0@${mapObj}&apiKey=2r2QB8AHuKaddIjuRbbjOAAAA,,,,,,,`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch lane data: ${response.status} ${response.statusText}`);
          }

          data = await response.json();
          LocalCache.writeToCache(cacheKey, data);
        } catch (error) {
          console.error('Error fetching lane data:', error);
          return;
        }
      }

      // 응답 데이터를 콘솔에 출력하여 구조 확인
      console.log('ODsay loadLane API response:', data);

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
          console.error('Data sections are invalid:', data);
        }
      } else {
        console.error('Invalid data structure from ODsay API:', data);
      }
    };

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
              path: 'M 0,0 L 10,-5 L 10,5 Z',
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
            offset: '100%',
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

    const calculateRotation = (y1, x1, y2, x2) => {
      const dy = y2 - y1;
      const dx = x2 - x1;
      const theta = Math.atan2(dy, dx);
      const angle = (theta * 180) / Math.PI;
      return angle;
    };

    const drawDashedLine = (y1, x1, y2, x2, map) => {
      new window.naver.maps.Polyline({
        map: map,
        path: [new window.naver.maps.LatLng(y1, x1), new window.naver.maps.LatLng(y2, x2)],
        strokeColor: '#808080',
        strokeStyle: 'shortdash',
        strokeWeight: 2,
      });
    };

    const drawDirectLine = (y1, x1, y2, x2, map, index) => {
      new window.naver.maps.Polyline({
        map: map,
        path: [new window.naver.maps.LatLng(y1, x1), new window.naver.maps.LatLng(y2, x2)],
        strokeColor: lineColors[index % lineColors.length],
        strokeWeight: 3,
        icons: [
          {
            icon: {
              path: 'M 0,0 L 10,-5 L 10,5 Z',
              strokeColor: lineColors[index % lineColors.length],
              fillOpacity: 1,
              fillColor: lineColors[index % lineColors.length],
              scale: 1.5,
              rotation: calculateRotation(y1, x1, y2, x2),
            },
            offset: '100%',
          },
        ],
      });
    };

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

  useEffect(() => {
    const script = document.createElement('script');

    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=h7fnyo8jb3A,,,,,,,`;

    script.async = true;

    script.onload = () => {
      if (window.naver && window.naver.maps) {
        initializeMap(); // Naver Maps 객체가 정상적으로 로드되었는지 확인
      } else {
        console.error('Naver Maps library could not be loaded.');
      }
    };

    script.onerror = () => {
      console.error('Failed to load Naver Maps script.');
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // 컴포넌트가 언마운트될 때 스크립트를 제거
    };
  }, [initializeMap, center]);

  return <div id="map" className={styles.mapContainer} />;
};

export default Map;

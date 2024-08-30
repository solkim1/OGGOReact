import React, { useEffect, useCallback } from "react";
import LocalCache from "../components/LocalCache";
import spPinsSpotV3 from "../images/sp_pins_spot_v3.png";
import spPinsSpotV3Over from "../images/sp_pins_spot_v3_over.png";
import styles from "../styles/Map.module.css";

const Map = ({ locations, center }) => {
  const initializeMap = useCallback(() => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom: 14,
    };

    const map = new window.naver.maps.Map("map", mapOptions);

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

      marker.addListener("mouseover", () => {
        marker.setIcon({
          url: spPinsSpotV3Over,
          size: new window.naver.maps.Size(24, 37),
          anchor: new window.naver.maps.Point(12, 37),
          origin: new window.naver.maps.Point(index * 29, 50),
        });
      });

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

    const searchPubTransPathAJAX = async (sx, sy, ex, ey, index) => {
      const cacheKey = `path_${sx}_${sy}_${ex}_${ey}`;
      const cachedData = await LocalCache.readFromCache(cacheKey);

      if (cachedData && cachedData.length > 0) {
        const data = cachedData;
        if (data.result && data.result.path && data.result.path.length > 0) {
          const mapObj = data.result.path[0].info.mapObj;
          callMapObjApiAJAX(mapObj, sx, sy, ex, ey, index, true);
        } else {
          drawDirectLine(sy, sx, ey, ex, map, index);
        }
      } else {
        const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}&apiKey=2r2QB8AHuKaddIjuRbbjO`;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            LocalCache.writeToCache(cacheKey, data);
            if (data.result && data.result.path && data.result.path.length > 0) {
              const mapObj = data.result.path[0].info.mapObj;
              callMapObjApiAJAX(mapObj, sx, sy, ex, ey, index, false);
            } else {
              drawDirectLine(sy, sx, ey, ex, map, index);
            }
          })
          .catch((error) => {
            drawDirectLine(sy, sx, ey, ex, map, index);
          });
      }
    };

    const callMapObjApiAJAX = async (mapObj, sx, sy, ex, ey, index, isCached) => {
      const cacheKey = `mapObj_${mapObj}`;
      const cachedData = await LocalCache.readFromCache(cacheKey);

      let data;

      if (cachedData && isCached) {
        data = cachedData;
      } else {
        const url = `https://api.odsay.com/v1/api/loadLane?mapObject=0:0@${mapObj}&apiKey=2r2QB8AHuKaddIjuRbbjO`;

        const response = await fetch(url);
        data = await response.json();
        LocalCache.writeToCache(cacheKey, data);
      }

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
        console.error("Invalid data structure:", data);
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
        strokeColor: "#808080",
        strokeStyle: "shortdash",
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
    const script = document.createElement("script");

    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=h7fnyo8jb3`;

    script.async = true;
    script.onload = () => {
      if (window.naver) {
        initializeMap();
      } else {
        console.error("Naver Maps library could not be loaded.");
      }
    };
    document.head.appendChild(script);
  }, [initializeMap, center]);

  return <div id="map" className={styles.mapContainer} />;
};

export default Map;

window.onload = async () => {
  const mapContainer = document.getElementById("map");
  const mapOption = {
    center: new kakao.maps.LatLng(36.37330253783127, 127.33228771955332),
    level: 8,
  };

  const map = new kakao.maps.Map(mapContainer, mapOption);
  const polygons = []; // 폴리곤
  const evMarkers = []; // 전기차 충전소 위치 마커를 저장할 배열입니다.
  const bicycleMarkers = []; // 타슈위치 마커를 저장할 배열입니다.

  let population = [];

  // 유성구 인구수
  try {
    const response = await axios.get(
      "https://api.odcloud.kr/api/3069789/v1/uddi:e092527e-2958-40fc-8742-b1abe167012b?page=1&perPage=70&serviceKey=RHjqYzORuWFudxeb2dba17FfujMT6pRCZKntfbFUTcufgq6HSko2lAl2%2FngpKWotFen5h%2FFYglTZq04y7%2B7qSA%3D%3D"
    );
    population = response.data.data;
  } catch (error) {
    console.log("에러 발생 : ", error);
  }

  const response = await fetch("daejeon.json"); //대전유성구폴리곤json
  const obj = await response.json();

  obj.features.forEach((feature) => {
    const coordinates = feature.geometry.coordinates[0]; // 폴리곤 좌표
    const dong = feature.properties.EMD_NM; //폴리곤 법정동data
    const paths = coordinates.map(
      (point) => new kakao.maps.LatLng(point[1], point[0])
    );

    const polygon = new kakao.maps.Polygon({
      path: paths,
      strokeWeight: 1.3,
      strokeColor: "#004c80",
      strokeOpacity: 0.8,
      fillColor: "#fff",
      fillOpacity: 0.5,
    });

    polygons.push(polygon);
    polygon.setMap(map);

    kakao.maps.event.addListener(polygon, "mouseover", () => {
      polygon.setOptions({ fillColor: "#D7E5F1", fillOpacity: 0.7 });
    });

    kakao.maps.event.addListener(polygon, "mouseout", () => {
      polygon.setOptions({ fillColor: "#fff", fillOpacity: 0.4 });
    });

    kakao.maps.event.addListener(polygon, "click", (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      map.panTo(latlng);

      // 일치하는 법정동 찾기
      const matchedDong = population.find(
        (item) => item.법정동명.replaceAll(" ", "") === dong
      );

      // 일치하는 법정동이 있는 경우, 인구수 정보를 표시
      if (matchedDong) {
        document.getElementById(
          "result"
        ).innerText = `${dong}, 인구수: ${matchedDong.인구수}`;
      }
    });
  });

  // 전기차충전소 위치
  const responseEV = await fetch(
    "https://api.odcloud.kr/api/15108928/v1/uddi:09f75564-8a56-4175-bf45-a7d826a65cd1?page=1&perPage=100&serviceKey=RHjqYzORuWFudxeb2dba17FfujMT6pRCZKntfbFUTcufgq6HSko2lAl2%2FngpKWotFen5h%2FFYglTZq04y7%2B7qSA%3D%3D"
  );
  if (responseEV.status === 200) {
    const data = await responseEV.json();
    const geocoder = new kakao.maps.services.Geocoder();

    data.data.forEach((ev) => {
      geocoder.addressSearch(ev.주소, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          const imageSrc = "/images/icon_ev.png";
          const imageSize = new kakao.maps.Size(40, 55);
          const imageOption = { offset: new kakao.maps.Point(18, 64) };
          // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
          const markerImage = new kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imageOption
          );
          const marker = new kakao.maps.Marker({
            map: map,
            position: coords,
            image: markerImage,
          });

          evMarkers.push(marker);
          marker.setVisible(false); // 초기 상태에서 마커를 숨깁니다.

          const infowindow = new kakao.maps.InfoWindow({
            content:
              '<div style="width:150px;text-align:center;padding:6px 0;">' +
              ev.주소 +
              "</div>",
          });

          kakao.maps.event.addListener(marker, "mouseover", () => {
            infowindow.open(map, marker);
          });

          kakao.maps.event.addListener(marker, "mouseout", () => {
            infowindow.close();
          });
        }
      });
    });
  } else {
    throw new Error("데이터를 가져오는 데 실패했습니다.");
  }

  // 타슈위치
  const responseTasyu = await fetch(
    "https://api.odcloud.kr/api/15062798/v1/uddi:cd8c82d9-b88c-42b0-bedd-a8b4b919732b?page=1&perPage=70&serviceKey=RHjqYzORuWFudxeb2dba17FfujMT6pRCZKntfbFUTcufgq6HSko2lAl2%2FngpKWotFen5h%2FFYglTZq04y7%2B7qSA%3D%3D"
  );
  if (responseTasyu.status === 200) {
    const data = await responseTasyu.json();
    const geocoder = new kakao.maps.services.Geocoder();

    data.data.forEach((tasyu) => {
      geocoder.addressSearch(tasyu.위치, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          const imageSrc = "/images/icon_bicycle.png";
          const imageSize = new kakao.maps.Size(34, 50);
          const imageOption = { offset: new kakao.maps.Point(18, 64) };
          const markerImage = new kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imageOption
          );
          const marker = new kakao.maps.Marker({
            map: map,
            position: coords,
            image: markerImage,
          });

          bicycleMarkers.push(marker);
          marker.setVisible(false);

          const infowindow = new kakao.maps.InfoWindow({
            content:
              '<div style="width:150px;text-align:center;padding:6px 0;">' +
              tasyu.위치 +
              "</div>",
          });

          kakao.maps.event.addListener(marker, "mouseover", () => {
            infowindow.open(map, marker);
          });

          kakao.maps.event.addListener(marker, "mouseout", () => {
            infowindow.close();
          });
        }
      });
    });
  } else {
    throw new Error("데이터를 가져오는 데 실패했습니다.");
  }

  // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  const makeOverListener = (map, marker, infowindow) => {
    return infowindow.open(map, marker);
  };

  // 인포윈도우를 닫는 클로저를 만드는 함수입니다
  const makeOutListener = (infowindow) => {
    return infowindow.close();
  };

  document
    .getElementById("YUSEONG_POPULATION")
    .addEventListener("click", () => {
      // 마커들을 숨기고 폴리곤을 보여줍니다.
      bicycleMarkers.forEach((marker) => marker.setVisible(false));
      evMarkers.forEach((marker) => marker.setVisible(false));
      polygons.forEach((polygon) => polygon.setMap(map));
    });

  document.getElementById("bicycle").addEventListener("click", () => {
    document.getElementById("result").innerText = "";
    // 폴리곤을 숨기고 타슈위치마커를 보여줍니다.
    polygons.forEach((polygon) => polygon.setMap(null));
    evMarkers.forEach((marker) => marker.setVisible(false));
    bicycleMarkers.forEach((marker) => marker.setVisible(true));
    document.getElementById("result");
  });

  document.getElementById("ev").addEventListener("click", () => {
    document.getElementById("result").innerText = "";
    // 폴리곤과 타슈위치마커를 숨기고 전기차 충전소 마커를 보여줍니다.
    polygons.forEach((polygon) => polygon.setMap(null));
    bicycleMarkers.forEach((marker) => marker.setVisible(false));
    evMarkers.forEach((marker) => {
      marker.setMap(map);
      marker.setVisible(true);
    });
  });
};

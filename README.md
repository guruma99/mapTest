# mapTest
#### 라미랩 지도api테스트
![mapTest - Chrome 2023-11-22 01-45-10](https://github.com/guruma99/mapTest/assets/121204952/baf5f460-ef5c-4c32-848f-369cd18da43e)

  1. 국가공간정보포털 오픈마켓에서 법정동(읍면동단위) 경계도면_대전zip 파일을 다운로드
  2. SHP to GeoJSON 변환 사이트 Mapshaper 에서 유성구만 선택하여 json파일로 변환
  3. 카카오map api에서 해당 json파일 파싱하여 가져오고 폴리곤으로 구분하기
  4. 클릭시 유성구 법정동별 인구수 데이터
  5. 타슈위치
  6. 전기차충전소 위치

### 국가공간정보포털 오픈마켓
#### [법정동(읍면동단위) 경계도면_대전](http://data.nsdi.go.kr/dataset/15145)

### 공공데이터 포털 데이터
#### [대전광역시 유성구_인구통계 현황](https://www.data.go.kr/data/3069789/fileData.do)
#### [대전광역시_공영자전거(타슈) 위치 현황](https://www.data.go.kr/data/15062798/fileData.do)
#### [대전광역시 유성구_전기차 충전소 현황](https://www.data.go.kr/data/15108928/fileData.do)

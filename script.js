
/* =========================================================
   전역 변수
========================================================= */

let statsData = null;

let currentDirection = "departure";

let countryShowCount = 10;

let cityShowCount = 10;

let countryExpanded = false;

let cityExpanded = false;

let worldMap = null;

let worldLayer = null;

let worldGeoJson = null;

let worldRouteLayer = null;

let worldMarkerLayer = null;

let airportCountryMap = {
    "오스트레일리아": "Australia",
    "아랍에미레이트": "United Arab Emirates",
    "이디오피아": "Ethiopia",
    "네팔": "Nepal",
    "핀란드": "Finland",
    "헝가리": "Hungary",
    "카자흐스탄": "Kazakhstan",
    "우즈베키스탄": "Uzbekistan",
    "캄보디아": "Cambodia",
    "라오스": "Laos",
    "미얀마": "Myanmar",
    "브루나이": "Brunei",
    "방글라데시": "Bangladesh",
    "키르기스스탄": "Kyrgyzstan",
    "타지키스탄": "Tajikistan",
    "체코": "Czechia",
    "튀르키예": "Turkey",
    "터키": "Turkey",
    "괌": "Guam",
    "마카오": "Macao"
};

const INCHEON_COORDINATES = [37.4602, 126.4407];

const GEO_COUNTRY_ALIASES = {
    "United States": "United States of America",
    "United States of America": "United States of America",
    "Russia": "Russia",
    "Czech Republic": "Czechia",
    "Czechia": "Czechia",
    "South Korea": "South Korea",
    "Korea": "South Korea",
    "North Korea": "North Korea",
    "Taiwan": "Taiwan",
    "Vietnam": "Vietnam",
    "Laos": "Laos",
    "Macao": "China",
    "Hong Kong": "China"
};


/* 지도 버블과 노선의 종점은 각 국가의 수도로 고정한다. */
const CAPITAL_COORDINATES = {
    "South Korea": [37.5665, 126.9780],
    "Japan": [35.6762, 139.6503],
    "China": [39.9042, 116.4074],
    "United States": [38.9072, -77.0369],
    "United States of America": [38.9072, -77.0369],
    "Canada": [45.4215, -75.6972],
    "United Kingdom": [51.5072, -0.1276],
    "France": [48.8566, 2.3522],
    "Germany": [52.5200, 13.4050],
    "Italy": [41.9028, 12.4964],
    "Spain": [40.4168, -3.7038],
    "Australia": [-35.2809, 149.1300],
    "Vietnam": [21.0278, 105.8342],
    "Thailand": [13.7563, 100.5018],
    "Philippines": [14.5995, 120.9842],
    "Singapore": [1.3521, 103.8198],
    "Indonesia": [-6.2088, 106.8456],
    "India": [28.6139, 77.2090],
    "Mongolia": [47.8864, 106.9057],
    "Russia": [55.7558, 37.6173],
    "Malaysia": [3.1390, 101.6869],
    "Taiwan": [25.0330, 121.5654],
    "Hong Kong": [22.3193, 114.1694],
    "Macao": [22.1987, 113.5439],
    "United Arab Emirates": [24.4539, 54.3773],
    "Qatar": [25.2854, 51.5310],
    "Kazakhstan": [51.1694, 71.4491],
    "Uzbekistan": [41.2995, 69.2401],
    "Cambodia": [11.5564, 104.9282],
    "Laos": [17.9757, 102.6331],
    "Myanmar": [19.7633, 96.0785],
    "Brunei": [4.9031, 114.9398],
    "Bangladesh": [23.8103, 90.4125],
    "Kyrgyzstan": [42.8746, 74.5698],
    "Tajikistan": [38.5598, 68.7870],
    "Czechia": [50.0755, 14.4378],
    "Turkey": [39.9334, 32.8597],
    "Guam": [13.4757, 144.7504],
    "Mexico": [19.4326, -99.1332],
    "Switzerland": [46.9480, 7.4474],
    "Denmark": [55.6761, 12.5683],
    "Netherlands": [52.3676, 4.9041],
    "Poland": [52.2297, 21.0122],
    "Saudi Arabia": [24.7136, 46.6753],
    "New Zealand": [-41.2866, 174.7756],
    "Brazil": [-15.7939, -47.8828],
    "Chile": [-33.4489, -70.6693],
    "Argentina": [-34.6037, -58.3816],
    "South Africa": [-25.7479, 28.2293],
    "Egypt": [30.0444, 31.2357],
    "Israel": [31.7683, 35.2137],
    "Sweden": [59.3293, 18.0686],
    "Norway": [59.9139, 10.7522],
    "Belgium": [50.8503, 4.3517],
    "Austria": [48.2082, 16.3738],
    "Greece": [37.9838, 23.7275],
    "Portugal": [38.7223, -9.1393],
    "Nepal": [27.7172, 85.3240],
    "Ethiopia": [8.9806, 38.7578],
    "Finland": [60.1699, 24.9384],
    "Hungary": [47.4979, 19.0402]
};

const COUNTRY_CODES = {
    "South Korea": "KR", "Korea": "KR", "Japan": "JP", "China": "CN",
    "United States": "US", "United States of America": "US", "Canada": "CA",
    "United Kingdom": "GB", "France": "FR", "Germany": "DE", "Italy": "IT",
    "Spain": "ES", "Australia": "AU", "Vietnam": "VN", "Thailand": "TH",
    "Philippines": "PH", "Singapore": "SG", "Indonesia": "ID", "India": "IN",
    "Mongolia": "MN", "Russia": "RU", "Malaysia": "MY", "Taiwan": "TW",
    "Hong Kong": "HK", "Macao": "MO", "United Arab Emirates": "AE",
    "Qatar": "QA", "Kazakhstan": "KZ", "Uzbekistan": "UZ", "Cambodia": "KH",
    "Laos": "LA", "Myanmar": "MM", "Brunei": "BN", "Nepal": "NP",
    "Ethiopia": "ET", "Finland": "FI", "Hungary": "HU", "Turkey": "TR",
    "Czechia": "CZ", "Poland": "PL", "Denmark": "DK", "Mexico": "MX",
    "Switzerland": "CH", "Austria": "AT", "New Zealand": "NZ", "Guam": "GU"
};


/* =========================================================
   국가명
========================================================= */

const countryNameMap = {

    "South Korea": "대한민국",
    "Republic of Korea": "대한민국",
    "Korea": "대한민국",

    "Japan": "일본",
    "China": "중국",

    "United States": "미국",
    "United States of America": "미국",

    "Canada": "캐나다",

    "United Kingdom": "영국",

    "France": "프랑스",
    "Germany": "독일",

    "Italy": "이탈리아",
    "Spain": "스페인",

    "Australia": "호주",
    "Vietnam": "베트남",

    "Thailand": "태국",
    "Philippines": "필리핀",

    "Singapore": "싱가포르",
    "Indonesia": "인도네시아",

    "India": "인도",
    "Mongolia": "몽골",

    "Russia": "러시아",
    "Malaysia": "말레이시아",

    "Taiwan": "대만",
    "Hong Kong": "홍콩",

    "United Arab Emirates": "아랍에미리트",
    "Qatar": "카타르",

    "Saudi Arabia": "사우디아라비아",

    "New Zealand": "뉴질랜드",

    "Brazil": "브라질",
    "Mexico": "멕시코",

    "Chile": "칠레",
    "Argentina": "아르헨티나",

    "South Africa": "남아프리카공화국",

    "Egypt": "이집트",

    "Israel": "이스라엘",

    "Sweden": "스웨덴",
    "Norway": "노르웨이",

    "Denmark": "덴마크",
    "Belgium": "벨기에",

    "Netherlands": "네덜란드",
    "Switzerland": "스위스",

    "Austria": "오스트리아",
    "Poland": "폴란드",

    "Greece": "그리스",
    "Portugal": "포르투갈"

};


/* =========================================================
   DOM
========================================================= */

const departureBtn =
    document.getElementById(
        "departureBtn"
    );

const arrivalBtn =
    document.getElementById(
        "arrivalBtn"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const clearSearch =
    document.getElementById(
        "clearSearch"
    );

const sortSelect =
    document.getElementById(
        "sortSelect"
    );


/* =========================================================
   숫자
========================================================= */

function formatNumber(number) {

    return Number(number || 0)
        .toLocaleString("ko-KR");

}


/* =========================================================
   HTML 안전 처리
========================================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   데이터 불러오기
========================================================= */

async function loadStats() {

    try {

        console.log(
            "📡 stats.json 불러오는 중..."
        );


        const response =
            await fetch(
                "stats.json?t=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "stats.json을 찾을 수 없습니다."
            );

        }


        statsData =
            await response.json();


        console.log(
            "✅ stats.json 로딩 완료",
            statsData
        );


        renderAll();


    } catch (error) {

        console.error(
            "❌ 데이터 로딩 실패:",
            error
        );


        document.getElementById(
            "countryChart"
        ).innerHTML = `
            <div class="error">
                데이터를 불러오지 못했습니다.<br>
                stats.json이 index.html과 같은 폴더에 있는지 확인해주세요.
            </div>
        `;


        document.getElementById(
            "cityChart"
        ).innerHTML = `
            <div class="error">
                stats.json을 확인해주세요.
            </div>
        `;

    }

}


/* =========================================================
   현재 데이터
========================================================= */

function getCurrentData() {

    if (!statsData) {

        return null;

    }


    return statsData[
        currentDirection
    ];

}


/* =========================================================
   국가 수
========================================================= */

function getCountryCount(data) {

    return Object.keys(
        data.master_country || {}
    ).length;

}


/* =========================================================
   도시 수
========================================================= */

function getCityCount(data) {

    return Object.keys(
        data.master_city || {}
    ).length;

}


/* =========================================================
   출발 / 도착 변경
========================================================= */

function setDirection(direction) {

    currentDirection =
        direction;


    countryExpanded =
        false;

    cityExpanded =
        false;

    countryShowCount =
        10;

    cityShowCount =
        10;


    departureBtn.classList.toggle(
        "active",
        direction === "departure"
    );


    arrivalBtn.classList.toggle(
        "active",
        direction === "arrival"
    );


    renderAll();

}


/* =========================================================
   전체 렌더링
========================================================= */

function renderAll() {

    if (!statsData) {

        return;

    }


    const data =
        getCurrentData();


    if (!data) {

        return;

    }


    renderSummary(data);

    renderCountryChart(data);

    renderCityChart(data);

    updateMapLabel();

    updateWorldMap();

}


/* =========================================================
   Summary
========================================================= */

function renderSummary(data) {

    document.getElementById(
        "totalFlights"
    ).textContent =
        formatNumber(
            data.master || data.total
        );


    const countryCount =
        getCountryCount(data);


    document.getElementById(
        "countryCount"
    ).textContent =
        formatNumber(
            countryCount
        );


    document.getElementById(
        "cityCount"
    ).textContent =
        formatNumber(
            getCityCount(data)
        );


    document.getElementById(
        "dataDate"
    ).textContent =
        statsData.date || "-";


    document.getElementById(
        "updatedAt"
    ).textContent =
        statsData.updated_at || "-";


    document.getElementById(
        "countryTitle"
    ).textContent =
        currentDirection === "departure"
            ? "출발 국가"
            : "도착 국가";

}


/* =========================================================
   국가 데이터 정렬
========================================================= */

function getSortedData(data) {

    const sortType =
        sortSelect.value;


    return Object.entries(data)
        .map(
            ([name, count]) => ({
                name,
                count: Number(count)
            })
        )
        .sort(
            (a, b) => {

                if (
                    sortType === "asc"
                ) {

                    return (
                        a.count -
                        b.count
                    );

                }


                return (
                    b.count -
                    a.count
                );

            }
        );

}


/* =========================================================
   검색
========================================================= */

function filterData(items) {

    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!keyword) {

        return items;

    }


    return items.filter(
        item =>
            item.name
                .toLowerCase()
                .includes(keyword)
    );

}


/* =========================================================
   국가 그래프
========================================================= */

function renderCountryChart(data) {

    const chart =
        document.getElementById(
            "countryChart"
        );


    let items =
        getSortedData(
            data.master_country || {}
        );


    items =
        filterData(items);


    document.getElementById(
        "countryResultCount"
    ).textContent =
        `${items.length}개`;


    if (items.length === 0) {

        chart.innerHTML = `
            <div class="loading">
                검색 결과가 없습니다.
            </div>
        `;

        document.getElementById(
            "countryMoreBtn"
        ).classList.add(
            "hidden"
        );

        return;

    }


    const max =
        Math.max(
            ...items.map(
                item => item.count
            ),
            1
        );


    let visibleItems;


    if (
        countryExpanded ||
        searchInput.value.trim()
    ) {

        visibleItems =
            items;

    } else {

        visibleItems =
            items.slice(
                0,
                countryShowCount
            );

    }


    chart.innerHTML =
        visibleItems
            .map(
                item => {

                    const width =
                        Math.max(
                            2,
                            (
                                item.count /
                                max
                            ) * 100
                        );


                    return `

                        <div
                            class="chart-row"
                            data-name="${escapeHtml(item.name)}"
                        >

                            <div class="chart-label">
                                ${escapeHtml(item.name)}
                            </div>


                            <div class="bar-area">

                                <div
                                    class="bar"
                                    style="width:${width}%"
                                ></div>

                            </div>


                            <div class="chart-count">
                                ${formatNumber(item.count)}편
                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    chart
        .querySelectorAll(
            ".chart-row"
        )
        .forEach(
            row => {

                row.addEventListener(
                    "click",
                    function() {

                        showDetail(
                            this.dataset.name,
                            Number(
                                getCurrentData()
                                    .master_country[
                                        this.dataset.name
                                    ] || 0
                            )
                        );

                    }
                );

            }
        );


    const moreBtn =
        document.getElementById(
            "countryMoreBtn"
        );


    if (
        searchInput.value.trim()
    ) {

        moreBtn.classList.add(
            "hidden"
        );

    } else {

        moreBtn.classList.remove(
            "hidden"
        );


        if (
            countryExpanded
        ) {

            moreBtn.textContent =
                "접기";

        } else {

            moreBtn.textContent =
                items.length >
                countryShowCount
                    ? "더보기"
                    : "전체 표시됨";

        }

    }

}


/* =========================================================
   도시 그래프
========================================================= */

function renderCityChart(data) {

    const chart =
        document.getElementById(
            "cityChart"
        );


    let items =
        getSortedData(
            data.master_city || {}
        );


    items =
        filterData(items);


    document.getElementById(
        "cityResultCount"
    ).textContent =
        `${items.length}개`;


    if (items.length === 0) {

        chart.innerHTML = `
            <div class="loading">
                검색 결과가 없습니다.
            </div>
        `;


        document.getElementById(
            "cityMoreBtn"
        ).classList.add(
            "hidden"
        );


        return;

    }


    const max =
        Math.max(
            ...items.map(
                item => item.count
            ),
            1
        );


    let visibleItems;


    if (
        cityExpanded ||
        searchInput.value.trim()
    ) {

        visibleItems =
            items;

    } else {

        visibleItems =
            items.slice(
                0,
                cityShowCount
            );

    }


    chart.innerHTML =
        visibleItems
            .map(
                item => {

                    const width =
                        Math.max(
                            2,
                            (
                                item.count /
                                max
                            ) * 100
                        );


                    return `

                        <div
                            class="chart-row"
                            data-name="${escapeHtml(item.name)}"
                        >

                            <div class="chart-label">
                                ${escapeHtml(item.name)}
                            </div>


                            <div class="bar-area">

                                <div
                                    class="bar"
                                    style="width:${width}%"
                                ></div>

                            </div>


                            <div class="chart-count">
                                ${formatNumber(item.count)}편
                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    const moreBtn =
        document.getElementById(
            "cityMoreBtn"
        );


    if (
        searchInput.value.trim()
    ) {

        moreBtn.classList.add(
            "hidden"
        );

    } else {

        moreBtn.classList.remove(
            "hidden"
        );


        if (
            cityExpanded
        ) {

            moreBtn.textContent =
                "접기";

        } else {

            moreBtn.textContent =
                items.length >
                cityShowCount
                    ? "더보기"
                    : "전체 표시됨";

        }

    }

}


/* =========================================================
   상세 정보
========================================================= */

function showDetail(
    name,
    count
) {

    const matchedCountry = Object.entries(countryNameMap)
        .find(([, koreanName]) => koreanName === name);

    renderCountryDetail({
        koreanName: name,
        count: Number(count),
        englishName:
            airportCountryMap[name] ||
            matchedCountry?.[0] ||
            name
    });

    document.getElementById(
        "detailPanel"
    ).scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


function getCountryFlag(englishName) {

    const countryCode =
        COUNTRY_CODES[englishName] ||
        COUNTRY_CODES[GEO_COUNTRY_ALIASES[englishName]];

    if (!countryCode) {

        return "🌎";

    }

    return String.fromCodePoint(
        ...countryCode.split("").map(
            character => 127397 + character.charCodeAt(0)
        )
    );

}


function renderCountryDetail(entry) {

    const countryName = entry.koreanName;
    const departureCount = Number(
        statsData.departure.master_country[countryName] || 0
    );
    const arrivalCount = Number(
        statsData.arrival.master_country[countryName] || 0
    );
    const todayCount = Math.max(
        departureCount,
        arrivalCount,
        Number(entry.count || 0)
    );
    const cityStats =
        getCurrentData().master_country_city?.[countryName] || {};
    const cityRows = Object.entries(cityStats)
        .sort((first, second) => second[1] - first[1]);

    document.getElementById("detailIcon").textContent =
        getCountryFlag(entry.englishName);

    document.getElementById("detailCountry").textContent =
        countryName;

    document.getElementById("detailTodayCount").textContent =
        `${formatNumber(todayCount)}편`;

    document.getElementById("detailDepartureCount").textContent =
        `${formatNumber(departureCount)}편`;

    document.getElementById("detailArrivalCount").textContent =
        `${formatNumber(arrivalCount)}편`;

    document.getElementById("detailCities").innerHTML = cityRows.length
        ? cityRows.map(
            ([city, cityCount]) => `
                <div class="detail-city-row">
                    <span>${escapeHtml(city)}</span>
                    <strong>${formatNumber(cityCount)}</strong>
                </div>
            `
        ).join("")
        : '<p class="detail-empty">도시별 데이터가 없습니다.</p>';

    document.getElementById(
        "detailPanel"
    ).classList.add(
        "show"
    );

}


function showMapCountryDetail(entry) {

    renderCountryDetail(entry);

    worldMap.flyTo(entry.destination, 4, {
        animate: true,
        duration: 0.8
    });

}


/* =========================================================
   지도 방향
========================================================= */

function updateMapLabel() {

    document.getElementById(
        "mapDirection"
    ).textContent =
        currentDirection === "departure"
            ? "✈️ 출발"
            : "🛬 도착";

}


/* =========================================================
   지도 시작
========================================================= */

async function initWorldMap() {

    console.log(
        "🌎 지도 시작"
    );


    const mapElement =
        document.getElementById(
            "worldMap"
        );


    if (!mapElement) {

        console.error(
            "❌ worldMap을 찾을 수 없습니다."
        );

        return;

    }


    if (
        typeof L === "undefined"
    ) {

        console.error(
            "❌ Leaflet이 로드되지 않았습니다."
        );

        return;

    }


    worldMap =
        L.map(
            "worldMap"
        ).setView(
            [30, 110],
            2
        );


    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors &copy; CARTO"

        }
    ).addTo(
        worldMap
    );


    try {

        const response = await fetch(
            "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
        );


        if (!response.ok) {

            throw new Error(
                "GeoJSON 로딩 실패"
            );

        }


        worldGeoJson =
            await response.json();


        console.log(
            "✅ 세계지도 데이터 로딩 완료"
        );


        updateWorldMap();

    } catch (error) {

        console.error(
            "❌ 세계지도 로딩 실패:",
            error
        );

    }

}


/* =========================================================
   지도 국가 이름
========================================================= */

function getGeoCountryName(
    feature
) {

    const properties =
        feature.properties || {};


    return (
        properties.ADMIN ||
        properties.NAME ||
        properties.NAME_EN ||
        properties.name ||
        ""
    );

}


/* =========================================================
   국가 운항 횟수
========================================================= */

function getCountryMapCount(
    englishName
) {

    if (!statsData) {

        return 0;

    }


    const data =
        getCurrentData();


    if (!data) {

        return 0;

    }


    const countryStats =
        data.master_country || {};


    const koreanName =
        countryNameMap[
            englishName
        ];


    if (
        koreanName &&
        countryStats[
            koreanName
        ] !== undefined
    ) {

        return Number(
            countryStats[
                koreanName
            ]
        );

    }


    if (
        countryStats[
            englishName
        ] !== undefined
    ) {

        return Number(
            countryStats[
                englishName
            ]
        );

    }


    return 0;

}


/* =========================================================
   지도 색상
========================================================= */

function getMapColor(
    count,
    max
) {

    if (
        count <= 0
    ) {

        return "#e9edf3";

    }


    const ratio =
        count / max;


    if (
        ratio >= 0.8
    ) {

        return "#173fbd";

    }


    if (
        ratio >= 0.6
    ) {

        return "#3157d5";

    }


    if (
        ratio >= 0.4
    ) {

        return "#5576df";

    }


    if (
        ratio >= 0.2
    ) {

        return "#8299e8";

    }


    return "#b8c5f1";

}


/* =========================================================
   지도 그리기
========================================================= */

function drawLegacyWorldMap() {

    if (
        !worldMap ||
        !worldGeoJson ||
        !statsData
    ) {

        return;

    }


    if (worldLayer) {

        worldMap.removeLayer(
            worldLayer
        );

    }


    const data =
        getCurrentData();


    const countryStats =
        data.master_country || {};


    const max =
        Math.max(
            ...Object.values(
                countryStats
            ).map(Number),
            1
        );


    worldLayer =
        L.geoJSON(
            worldGeoJson,
            {

                style:
                    function(feature) {

                        const name =
                            getGeoCountryName(
                                feature
                            );


                        const count =
                            getCountryMapCount(
                                name
                            );


                        return {

                            fillColor:
                                getMapColor(
                                    count,
                                    max
                                ),

                            fillOpacity:
                                0.75,

                            color:
                                "#ffffff",

                            weight:
                                1

                        };

                    },


                onEachFeature:
                    function(
                        feature,
                        layer
                    ) {

                        const englishName =
                            getGeoCountryName(
                                feature
                            );


                        const koreanName =
                            countryNameMap[
                                englishName
                            ] ||
                            englishName;


                        const count =
                            getCountryMapCount(
                                englishName
                            );


                        layer.bindTooltip(

                            `
                            <div class="map-tooltip-content">

                                <div class="map-tooltip-country">
                                    ${escapeHtml(koreanName)}
                                </div>

                                <div class="map-tooltip-count">
                                    운항 횟수:
                                    <strong>
                                        ${formatNumber(count)}
                                    </strong>
                                    편
                                </div>

                            </div>
                            `,

                            {

                                sticky:
                                    true,

                                direction:
                                    "top",

                                opacity:
                                    1

                            }

                        );


                        layer.on(
                            "mouseover",
                            function(e) {

                                e.target.setStyle({

                                    weight:
                                        3,

                                    color:
                                        "#111827",

                                    fillOpacity:
                                        1

                                });

                                e.target.bringToFront();

                            }
                        );


                        layer.on(
                            "mouseout",
                            function(e) {

                                worldLayer.resetStyle(
                                    e.target
                                );

                            }
                        );


                        layer.on(
                            "click",
                            function() {

                                showDetail(
                                    koreanName,
                                    count
                                );

                            }
                        );

                    }

            }
        );


    worldLayer.addTo(
        worldMap
    );


    console.log(
        "✅ 세계지도 국가 레이어 완료"
    );

}


/* =========================================================
   지도 갱신
========================================================= */

function updateLegacyWorldMap() {

    if (
        worldMap &&
        worldGeoJson &&
        statsData
    ) {

        drawLegacyWorldMap();

    }

}


/* 실제 운항 국가만 지도에 표시하는 버블·노선 레이어 */
function getMapCountryEntries() {

    const countryStats =
        getCurrentData().master_country || {};

    const reverseNameMap = Object.entries(countryNameMap)
        .reduce(
            (result, [englishName, koreanName]) => {

                result[koreanName] = englishName;
                return result;

            },
            {}
        );

    return Object.entries(countryStats)
        .map(
            ([koreanName, count]) => ({
                koreanName,
                count: Number(count),
                englishName:
                    airportCountryMap[koreanName] ||
                    reverseNameMap[koreanName] ||
                    koreanName
            })
        )
        .filter(entry => entry.count > 0);

}


function getCountryFeature(entry) {

    const expectedNames = [
        entry.englishName,
        GEO_COUNTRY_ALIASES[entry.englishName]
    ].filter(Boolean);

    return worldGeoJson.features.find(
        feature => expectedNames.includes(getGeoCountryName(feature))
    );

}


function getCapitalCoordinates(entry) {

    const capital =
        CAPITAL_COORDINATES[entry.englishName] ||
        CAPITAL_COORDINATES[GEO_COUNTRY_ALIASES[entry.englishName]];

    return capital ? L.latLng(capital) : null;

}


function getBubbleRadius(count, maxCount) {

    const ratio = count / Math.max(maxCount, 1);

    return 8 + Math.sqrt(ratio) * 20;

}


function getRouteBearing(from, to) {

    const toRadians = value => value * Math.PI / 180;
    const latitude1 = toRadians(from.lat);
    const latitude2 = toRadians(to.lat);
    const longitudeDifference = toRadians(to.lng - from.lng);
    const y = Math.sin(longitudeDifference) * Math.cos(latitude2);
    const x = Math.cos(latitude1) * Math.sin(latitude2) -
        Math.sin(latitude1) * Math.cos(latitude2) *
        Math.cos(longitudeDifference);

    return Math.atan2(y, x) * 180 / Math.PI;

}


function getMapTooltip(entry) {

    return `
        <div class="map-tooltip-content">
            <div class="map-tooltip-country">
                ${escapeHtml(entry.koreanName)}
            </div>
            <div class="map-tooltip-count">
                항공편 수: <strong>${formatNumber(entry.count)}</strong>편
            </div>
        </div>
    `;

}


/* 아래 정의가 기존 색칠형 지도를 대체한다. */
function drawWorldMap() {

    if (!worldMap || !worldGeoJson || !statsData) {

        return;

    }

    [worldLayer, worldRouteLayer, worldMarkerLayer]
        .filter(Boolean)
        .forEach(layer => worldMap.removeLayer(layer));

    const entries = getMapCountryEntries()
        .map(entry => ({
            ...entry,
            feature: getCountryFeature(entry),
            destination: getCapitalCoordinates(entry)
        }))
        .filter(entry => entry.feature && entry.destination);

    const maxCount = Math.max(...entries.map(entry => entry.count), 1);

    worldLayer = L.featureGroup();
    worldRouteLayer = L.featureGroup();
    worldMarkerLayer = L.featureGroup();

    const incheonMarker = L.circleMarker(INCHEON_COORDINATES, {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: "#f97316",
        fillOpacity: 1
    }).bindTooltip("인천국제공항", { direction: "top" });

    incheonMarker.addTo(worldMarkerLayer);

    entries.forEach(
        entry => {

            const destination = entry.destination;
            const tooltip = getMapTooltip(entry);

            L.geoJSON(entry.feature, {
                style: {
                    fillColor: "#2563eb",
                    fillOpacity: 0.13,
                    color: "#60a5fa",
                    weight: 1
                },
                onEachFeature: (feature, layer) => {
                    layer.bindTooltip(tooltip, { sticky: true, opacity: 1 });
                    layer.on("click", () => showMapCountryDetail(entry));
                }
            }).addTo(worldLayer);

            if (destination.distanceTo(L.latLng(INCHEON_COORDINATES)) > 25000) {

                const routePoints = currentDirection === "departure"
                    ? [L.latLng(INCHEON_COORDINATES), destination]
                    : [destination, L.latLng(INCHEON_COORDINATES)];

                const routeMidpoint = L.latLng(
                    (routePoints[0].lat + routePoints[1].lat) / 2,
                    (routePoints[0].lng + routePoints[1].lng) / 2
                );

                L.polyline(
                    routePoints,
                    {
                        color: "#2563eb",
                        weight: 1.5 + (entry.count / maxCount) * 2.5,
                        opacity: 0.42
                    }
                ).bindTooltip(tooltip, { sticky: true }).addTo(worldRouteLayer);

                L.marker(routeMidpoint, {
                    interactive: false,
                    icon: L.divIcon({
                        className: "route-arrow",
                        html: `<span style="transform:rotate(${getRouteBearing(routePoints[0], routePoints[1]) - 90}deg)">➤</span>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    })
                }).addTo(worldRouteLayer);

            }

            L.circleMarker(destination, {
                radius: getBubbleRadius(entry.count, maxCount),
                color: "#ffffff",
                weight: 2,
                fillColor: "#2563eb",
                fillOpacity: 0.88
            }).bindTooltip(tooltip, { direction: "top", opacity: 1 })
                .on("click", () => showMapCountryDetail(entry))
                .addTo(worldMarkerLayer);

        }
    );

    worldLayer.addTo(worldMap);
    worldRouteLayer.addTo(worldMap);
    worldMarkerLayer.addTo(worldMap);

    if (entries.length) {

        const points = [INCHEON_COORDINATES].concat(
            entries.map(entry => entry.destination)
        );

        worldMap.fitBounds(L.latLngBounds(points), {
            padding: [34, 34],
            maxZoom: 3
        });

    }

}


function updateWorldMap() {

    if (worldMap && worldGeoJson && statsData) {

        drawWorldMap();

    }

}


/* =========================================================
   이벤트
========================================================= */


/* 출발 */

departureBtn.addEventListener(
    "click",
    function() {

        setDirection(
            "departure"
        );

    }
);


/* 도착 */

arrivalBtn.addEventListener(
    "click",
    function() {

        setDirection(
            "arrival"
        );

    }
);


/* 검색 */

searchInput.addEventListener(
    "input",
    function() {

        renderAll();

    }
);


/* 검색 초기화 */

clearSearch.addEventListener(
    "click",
    function() {

        searchInput.value = "";

        renderAll();

        searchInput.focus();

    }
);


/* 정렬 */

sortSelect.addEventListener(
    "change",
    function() {

        renderAll();

    }
);


/* 국가 더보기 */

document.getElementById(
    "countryMoreBtn"
).addEventListener(
    "click",
    function() {

        countryExpanded =
            !countryExpanded;


        renderAll();

    }
);


/* 도시 더보기 */

document.getElementById(
    "cityMoreBtn"
).addEventListener(
    "click",
    function() {

        cityExpanded =
            !cityExpanded;


        renderAll();

    }
);


/* 상세 닫기 */

document.getElementById(
    "detailClose"
).addEventListener(
    "click",
    function() {

        document.getElementById(
            "detailPanel"
        ).classList.remove(
            "show"
        );

    }
);


/* =========================================================
   초기 실행
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadStats();

        setTimeout(
            initWorldMap,
            500
        );

    }
);


/* =========================================================
   5분 자동 갱신
========================================================= */

setInterval(
    function() {

        console.log(
            "🔄 stats.json 자동 갱신"
        );


        loadStats();

    },
    5 * 60 * 1000
);

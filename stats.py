import sys

# Windows 콘솔 UTF-8 출력
if sys.stdout is not None:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

if sys.stderr is not None:
    try:
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass




import json
import csv
import os
from collections import Counter
from datetime import datetime


# ============================================================
# 설정
# ============================================================

AIRPORT_FILE = "airport_data.csv"

DEPARTURE_FILE = "departure_flights.json"
ARRIVAL_FILE = "arrival_flights.json"

STATS_FILE = "stats.json"


# ============================================================
# 날짜
# ============================================================

def get_today():
    return datetime.now().strftime("%Y%m%d")


# ============================================================
# JSON 읽기
# ============================================================

def load_json(filename):

    if not os.path.exists(filename):

        print(f"❌ 파일 없음: {filename}")

        return []

    try:

        with open(
            filename,
            "r",
            encoding="utf-8"
        ) as f:

            data = json.load(f)

        if not isinstance(data, list):

            print(
                f"⚠️ {filename}가 list가 아닙니다."
            )

            return []

        return data

    except Exception as e:

        print(
            f"❌ {filename} 읽기 실패:"
        )

        print(e)

        return []


# ============================================================
# 공항 CSV 읽기
# ============================================================

def load_airport_data():

    encodings = [
        "cp949",
        "euc-kr",
        "utf-8-sig",
        "utf-8"
    ]

    rows = None

    for encoding in encodings:

        try:

            with open(
                AIRPORT_FILE,
                "r",
                encoding=encoding,
                newline=""
            ) as f:

                reader = csv.DictReader(f)

                rows = list(reader)

            print(
                f"✅ 공항 데이터 읽기 성공: "
                f"{encoding}"
            )

            break

        except Exception:
            continue

    if rows is None:

        print(
            "❌ airport_data.csv를 읽을 수 없습니다."
        )

        return {}, {}

    print(
        f"🌎 공항 데이터: {len(rows)}개"
    )

    iata_to_country = {}
    iata_to_city = {}

    for row in rows:

        iata = (
            row.get("공항코드1(IATA)")
            or row.get("공항코드1")
            or row.get("IATA")
            or ""
        ).strip().upper()

        country = (
            row.get("한글국가명")
            or row.get("국가명")
            or ""
        ).strip()

        city = (
            row.get("한글도시명")
            or row.get("도시명")
            or ""
        ).strip()

        if not iata:
            continue

        if country:
            iata_to_country[iata] = country

        if city:
            iata_to_city[iata] = city

    print(
        f"🌎 IATA → 국가: "
        f"{len(iata_to_country)}개"
    )

    print(
        f"🏙️ IATA → 도시: "
        f"{len(iata_to_city)}개"
    )

    return (
        iata_to_country,
        iata_to_city
    )


# ============================================================
# 항공편 공항 코드
# ============================================================

def get_airport_code(flight):

    code = (
        flight.get("airportCode")
        or flight.get("airportcode")
        or ""
    )

    return str(code).strip().upper()


# ============================================================
# ⭐ MASTER 판별
# ============================================================

def is_master_flight(flight):

    value = flight.get(
        "codeshare",
        ""
    )

    value = str(value).strip().lower()

    # 정상적인 Master
    if value == "master":
        return True

    # 혹시 API가 다른 형태로 반환하는 경우
    if value in (
        "master flight",
        "masterflight",
        "master_flight"
    ):
        return True

    return False


# ============================================================
# ⭐ MASTER 항공편 추출
# ============================================================

def get_master_flights(flights):

    master = []

    for flight in flights:

        if is_master_flight(flight):

            master.append(flight)

    return master


# ============================================================
# codeshare 실제 값 확인
# ============================================================

def print_codeshare_values(
    flights,
    title
):

    counter = Counter()

    for flight in flights:

        value = str(
            flight.get(
                "codeshare",
                ""
            )
        ).strip()

        counter[value] += 1

    print()
    print(
        f"🔍 {title} codeshare 값"
    )

    for value, count in counter.items():

        print(
            f"   {repr(value)} : "
            f"{count}편"
        )


# ============================================================
# fid 통계
# ============================================================

def check_fid(flights):

    fids = []

    no_fid = 0

    for flight in flights:

        fid = flight.get("fid")

        if fid:

            fids.append(
                str(fid)
            )

        else:

            no_fid += 1

    counter = Counter(fids)

    duplicate_count = sum(
        1
        for count in counter.values()
        if count > 1
    )

    return {
        "total": len(flights),
        "fid_exists": len(fids),
        "fid_missing": no_fid,
        "duplicate_fid": duplicate_count
    }


# ============================================================
# 국가 통계
# ============================================================

def make_country_stats(
    flights,
    iata_to_country
):

    counter = Counter()

    unknown = []

    for flight in flights:

        code = get_airport_code(
            flight
        )

        country = iata_to_country.get(
            code
        )

        if country:

            counter[country] += 1

        elif code and code not in unknown:

            unknown.append(code)

    result = dict(
        sorted(
            counter.items(),
            key=lambda x: (-x[1], x[0])
        )
    )

    return result, unknown


# ============================================================
# 도시 통계
# ============================================================

def make_city_stats(
    flights,
    iata_to_city
):

    counter = Counter()

    unknown = []

    for flight in flights:

        code = get_airport_code(
            flight
        )

        city = iata_to_city.get(
            code
        )

        if city:

            counter[city] += 1

        elif code and code not in unknown:

            unknown.append(code)

    result = dict(
        sorted(
            counter.items(),
            key=lambda x: (-x[1], x[0])
        )
    )

    return result, unknown


# ============================================================
# 국가별 주요 도시 통계
# ============================================================

def make_country_city_stats(
    flights,
    iata_to_country,
    iata_to_city
):

    country_counters = {}

    for flight in flights:

        code = get_airport_code(flight)

        country = iata_to_country.get(code)
        city = iata_to_city.get(code)

        if country and city:

            if country not in country_counters:

                country_counters[country] = Counter()

            country_counters[country][city] += 1

    return {
        country: dict(
            sorted(
                counter.items(),
                key=lambda item: (-item[1], item[0])
            )
        )
        for country, counter in country_counters.items()
    }


# ============================================================
# 통계 생성
# ============================================================

def make_statistics(
    flights,
    iata_to_country,
    iata_to_city
):

    master_flights = get_master_flights(
        flights
    )

    country, unknown_country = (
        make_country_stats(
            flights,
            iata_to_country
        )
    )

    city, unknown_city = (
        make_city_stats(
            flights,
            iata_to_city
        )
    )

    master_country, master_unknown_country = (
        make_country_stats(
            master_flights,
            iata_to_country
        )
    )

    master_city, master_unknown_city = (
        make_city_stats(
            master_flights,
            iata_to_city
        )
    )

    master_country_city = make_country_city_stats(
        master_flights,
        iata_to_country,
        iata_to_city
    )

    return {

        "total": len(flights),

        "master": len(master_flights),

        "country": country,

        "city": city,

        "master_country":
            master_country,

        "master_city":
            master_city,

        "master_country_city":
            master_country_city,

        "unknown_country_airports":
            unknown_country,

        "unknown_city_airports":
            unknown_city,

        "master_unknown_country_airports":
            master_unknown_country,

        "master_unknown_city_airports":
            master_unknown_city,

        "fid":
            check_fid(flights)
    }


# ============================================================
# 저장
# ============================================================

def save_stats(data):

    with open(
        STATS_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            ensure_ascii=False,
            indent=4
        )


# ============================================================
# 메인
# ============================================================

def main():

    today = get_today()

    print("=" * 70)
    print("📊 인천공항 항공편 통계")
    print("=" * 70)

    print(
        f"📅 날짜: {today}"
    )

    # --------------------------------------------------------
    # 공항 데이터
    # --------------------------------------------------------

    (
        iata_to_country,
        iata_to_city
    ) = load_airport_data()

    # --------------------------------------------------------
    # 항공편
    # --------------------------------------------------------

    departure_flights = load_json(
        DEPARTURE_FILE
    )

    arrival_flights = load_json(
        ARRIVAL_FILE
    )

    print()
    print(
        f"✈️ 출발 전체: "
        f"{len(departure_flights)}편"
    )

    print(
        f"🛬 도착 전체: "
        f"{len(arrival_flights)}편"
    )

    # --------------------------------------------------------
    # ⭐ codeshare 확인
    # --------------------------------------------------------

    print_codeshare_values(
        departure_flights,
        "출발"
    )

    print_codeshare_values(
        arrival_flights,
        "도착"
    )

    # --------------------------------------------------------
    # MASTER
    # --------------------------------------------------------

    departure_master = (
        get_master_flights(
            departure_flights
        )
    )

    arrival_master = (
        get_master_flights(
            arrival_flights
        )
    )

    print()
    print("=" * 70)
    print("⭐ MASTER 항공편")
    print("=" * 70)

    print(
        f"✈️ 출발 MASTER: "
        f"{len(departure_master)}편"
    )

    print(
        f"🛬 도착 MASTER: "
        f"{len(arrival_master)}편"
    )

    # --------------------------------------------------------
    # 통계
    # --------------------------------------------------------

    departure_stats = make_statistics(
        departure_flights,
        iata_to_country,
        iata_to_city
    )

    arrival_stats = make_statistics(
        arrival_flights,
        iata_to_country,
        iata_to_city
    )

    # --------------------------------------------------------
    # 최종 데이터
    # --------------------------------------------------------

    stats = {

        "date":
            today,

        "updated_at":
            datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            ),

        "departure":
            departure_stats,

        "arrival":
            arrival_stats
    }

    save_stats(stats)

    # --------------------------------------------------------
    # 결과
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("✈️ 출발 국가별")
    print("=" * 70)

    for country, count in (
        departure_stats[
            "master_country"
        ].items()
    ):

        print(
            f"{country}: {count}편"
        )

    print()
    print("=" * 70)
    print("🛬 도착 국가별")
    print("=" * 70)

    for country, count in (
        arrival_stats[
            "master_country"
        ].items()
    ):

        print(
            f"{country}: {count}편"
        )

    print()
    print("=" * 70)
    print("🎉 통계 계산 완료")
    print("=" * 70)

    print(
        f"💾 저장: {STATS_FILE}"
    )


if __name__ == "__main__":
    main()

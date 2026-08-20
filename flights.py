import requests
import json
import time
import os
import subprocess
import sys
from datetime import datetime


# ============================================================
# 설정
# ============================================================

# GitHub Actions → Settings → Secrets and variables
# → Actions → New repository secret
# 이름: SERVICE_KEY
SERVICE_KEY = os.environ.get("SERVICE_KEY", "").strip()

DEPARTURE_URL = (
    "https://apis.data.go.kr/B551177/"
    "statusOfAllFltDeOdp/getFltDeparturesDeOdp"
)

ARRIVAL_URL = (
    "https://apis.data.go.kr/B551177/"
    "statusOfAllFltDeOdp/getFltArrivalsDeOdp"
)

PAGE_SIZE = 100

MAX_RETRIES = 3

RETRY_WAIT = 10


# ============================================================
# 오늘 날짜
# ============================================================

def get_today():
    return datetime.now().strftime("%Y%m%d")


# ============================================================
# JSON 저장
# ============================================================

def save_json(filename, data):

    with open(
        filename,
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
# 기존 JSON 읽기
# ============================================================

def load_json(filename):

    if not os.path.exists(filename):
        return None

    try:

        with open(
            filename,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    except Exception as e:

        print(f"⚠️ {filename} 읽기 실패: {e}")

        return None


# ============================================================
# API 전체 데이터 가져오기
# ============================================================

def get_all_flights(url, today, api_name):

    if not SERVICE_KEY:

        print("❌ SERVICE_KEY가 설정되지 않았습니다.")
        print("GitHub Secrets에 SERVICE_KEY를 등록하세요.")

        return None

    for retry in range(1, MAX_RETRIES + 1):

        print()
        print(
            f"📡 {api_name} 요청 "
            f"{retry}/{MAX_RETRIES}"
        )

        all_flights = []

        page = 1

        success = True

        while True:

            print(
                f"📡 {page}페이지 요청 중..."
            )

            params = {
                "serviceKey": SERVICE_KEY,
                "pageNo": page,
                "numOfRows": PAGE_SIZE,
                "searchdtCode": "E",
                "searchDate": today,
                "type": "json"
            }

            try:

                response = requests.get(
                    url,
                    params=params,
                    timeout=60
                )

            except requests.RequestException as e:

                print("❌ 네트워크 오류:")
                print(e)

                success = False
                break

            # ------------------------------------------------
            # HTTP 오류
            # ------------------------------------------------

            if response.status_code != 200:

                print(
                    f"❌ HTTP 오류: "
                    f"{response.status_code}"
                )

                print(
                    response.text[:500]
                )

                success = False
                break

            # ------------------------------------------------
            # JSON
            # ------------------------------------------------

            try:

                data = response.json()

            except ValueError:

                print("❌ JSON 변환 실패")

                success = False
                break

            # ------------------------------------------------
            # API 응답
            # ------------------------------------------------

            response_data = data.get(
                "response",
                {}
            )

            header = response_data.get(
                "header",
                {}
            )

            result_code = str(
                header.get(
                    "resultCode",
                    ""
                )
            ).strip()

            if result_code != "00":

                print("❌ API 오류")

                print(
                    header.get(
                        "resultMsg",
                        "알 수 없는 오류"
                    )
                )

                success = False
                break

            # ------------------------------------------------
            # body
            # ------------------------------------------------

            body = response_data.get(
                "body",
                {}
            )

            items = body.get(
                "items",
                []
            )

            total_count = int(
                body.get(
                    "totalCount",
                    0
                )
            )

            if isinstance(items, dict):
                items = [items]

            if not items:

                print("⚠️ 데이터가 없습니다.")
                break

            all_flights.extend(items)

            print(
                f"   이번 페이지: "
                f"{len(items)}개"
            )

            print(
                f"   현재까지: "
                f"{len(all_flights)} / "
                f"{total_count}"
            )

            # ------------------------------------------------
            # 완료
            # ------------------------------------------------

            if len(all_flights) >= total_count:

                print()
                print(
                    f"✅ {api_name} API "
                    f"수집 완료"
                )

                return all_flights

            page += 1

            time.sleep(1)

        # ----------------------------------------------------
        # 실패 재시도
        # ----------------------------------------------------

        if not success:

            if retry < MAX_RETRIES:

                print()
                print(
                    f"⚠️ {api_name} API 실패"
                )

                print(
                    f"⏱️ {RETRY_WAIT}초 후 "
                    f"재시도합니다."
                )

                time.sleep(RETRY_WAIT)

            else:

                print()
                print(
                    f"❌ {api_name} API "
                    f"최종 실패"
                )

    return None


# ============================================================
# 항공편 데이터 업데이트
# ============================================================

def update_flight_data(today):

    print()
    print("=" * 70)
    print("✈️ 인천공항 데이터 업데이트")
    print("=" * 70)

    print(f"📅 날짜: {today}")

    # ========================================================
    # 출발
    # ========================================================

    print()
    print("=" * 70)
    print("✈️ 출발 API")
    print("=" * 70)

    departure_data = get_all_flights(
        DEPARTURE_URL,
        today,
        "출발"
    )

    if departure_data is None:

        print()
        print("⚠️ 출발 API 실패")
        print("📂 기존 출발 데이터를 유지합니다.")

        departure_data = load_json(
            "departure_flights.json"
        )

        departure_success = False

    else:

        print()
        print(
            f"✈️ 출발 데이터: "
            f"{len(departure_data)}편"
        )

        save_json(
            "departure_flights.json",
            departure_data
        )

        print(
            "💾 departure_flights.json 저장 완료"
        )

        departure_success = True

    # ========================================================
    # API 간격
    # ========================================================

    print()
    print("⏱️ 출발 → 도착 API 2초 대기")

    time.sleep(2)

    # ========================================================
    # 도착
    # ========================================================

    print()
    print("=" * 70)
    print("🛬 도착 API")
    print("=" * 70)

    arrival_data = get_all_flights(
        ARRIVAL_URL,
        today,
        "도착"
    )

    if arrival_data is None:

        print()
        print("⚠️ 도착 API 실패")
        print("📂 기존 도착 데이터를 유지합니다.")

        arrival_data = load_json(
            "arrival_flights.json"
        )

        arrival_success = False

    else:

        print()
        print(
            f"🛬 도착 데이터: "
            f"{len(arrival_data)}편"
        )

        save_json(
            "arrival_flights.json",
            arrival_data
        )

        print(
            "💾 arrival_flights.json 저장 완료"
        )

        arrival_success = True

    return (
        departure_data,
        arrival_data,
        departure_success,
        arrival_success
    )


# ============================================================
# stats.py 실행
# ============================================================

def run_stats():

    print()
    print("=" * 70)
    print("📊 통계 계산 시작")
    print("=" * 70)

    if not os.path.exists("stats.py"):

        print("❌ stats.py를 찾을 수 없습니다.")

        return False

    try:

        result = subprocess.run(
            [
                sys.executable,
                "stats.py"
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace"
        )

        if result.stdout:
            print(result.stdout)

        if result.stderr:
            print("⚠️ stats.py 메시지:")
            print(result.stderr)

        if result.returncode == 0:

            print("✅ 통계 계산 완료")

            return True

        print("❌ stats.py 실행 실패")

        return False

    except Exception as e:

        print("❌ stats.py 실행 오류:")
        print(e)

        return False


# ============================================================
# 한 번 업데이트
# ============================================================

def update():

    today = get_today()

    (
        departure_data,
        arrival_data,
        departure_success,
        arrival_success
    ) = update_flight_data(today)

    stats_success = run_stats()

    print()
    print("=" * 70)
    print("🎉 전체 업데이트 완료")
    print("=" * 70)

    print(f"📅 날짜: {today}")

    if departure_data is not None:

        print(
            f"✈️ 출발: "
            f"{len(departure_data)}편"
        )

    else:

        print("✈️ 출발: 데이터 없음")

    if arrival_data is not None:

        print(
            f"🛬 도착: "
            f"{len(arrival_data)}편"
        )

    else:

        print("🛬 도착: 데이터 없음")

    print(
        f"✈️ 출발 API: "
        f"{'성공' if departure_success else '실패/기존 데이터'}"
    )

    print(
        f"🛬 도착 API: "
        f"{'성공' if arrival_success else '실패/기존 데이터'}"
    )

    print(
        f"📊 통계: "
        f"{'성공' if stats_success else '실패'}"
    )

    return (
        departure_success
        and arrival_success
        and stats_success
    )


# ============================================================
# 실행
# ============================================================

if __name__ == "__main__":

    print("=" * 70)
    print("🚀 인천공항 데이터 업데이트")
    print("=" * 70)

    success = update()

    if success:

        print()
        print("✅ 업데이트 성공")

        sys.exit(0)

    else:

        print()
        print("❌ 업데이트 실패")

        sys.exit(1)

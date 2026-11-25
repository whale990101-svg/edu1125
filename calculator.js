"use strict";

const TravelAllowance = (() => {
  const dayMs = 86400000;
  const dailyRate = 25000;
  const lodgingCaps = { seoul: 100000, metro: 80000, other: 70000 };
  const regionNames = { seoul: "서울", metro: "광역시", other: "그 밖의 지역" };

  function dateValue(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NaN;
    const value = Date.parse(date + "T00:00:00Z");
    return Number.isFinite(value) && new Date(value).toISOString().slice(0, 10) === date
      ? value
      : NaN;
  }

  function tripPeriod(start, end) {
    const first = dateValue(start);
    const last = dateValue(end);
    if (!Number.isFinite(first) || !Number.isFinite(last)) {
      throw new Error("출장일과 복귀일을 모두 입력하세요.");
    }
    if (last < first) throw new Error("복귀일은 출장일과 같거나 이후여야 합니다.");
    const days = (last - first) / dayMs + 1;
    return { first, last, days, maxNights: days - 1 };
  }

  function minutes(time) {
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      throw new Error("출발 시각과 복귀 시각을 입력하세요.");
    }
    const [hours, mins] = time.split(":").map(Number);
    return hours * 60 + mins;
  }

  function localAllowance(input, period) {
    const duration = period.maxNights * 1440 + minutes(input.endTime) - minutes(input.startTime);
    if (duration <= 0) throw new Error("복귀 시각은 출발 시각 이후여야 합니다.");
    const standard = duration >= 240 ? 20000 : 10000;
    const amount = { normal: standard, public: standard - 10000, dedicated: 0 }[input.vehicle];
    const condition = {
      normal: "",
      public: " 차량 이용 등으로 1만 원을 감액했습니다.",
      dedicated: " 전용 차량 배정자는 지급 대상에서 제외됩니다."
    }[input.vehicle];
    return {
      rows: [{ label: "근무지 내 출장 여비", amount }],
      notes: ["출장 시간 " + Math.floor(duration / 60) + "시간 " + duration % 60 + "분을 기준으로 계산했습니다." + condition]
    };
  }

  function wholeNumber(value, label, max = Number.MAX_SAFE_INTEGER) {
    if (!Number.isSafeInteger(value) || value < 0 || value > max) {
      throw new Error(label + "을(를) 허용 범위의 정수로 입력하세요.");
    }
    return value;
  }

  function standardDaily(input, period, notes) {
    const halfDays = wholeNumber(input.halfDays, "일비 감액일수", period.days);
    let amount = dailyRate * period.days - dailyRate / 2 * halfDays;
    if (input.adjustedDaily !== null) {
      notes.push("기관에서 산정한 일비를 적용했습니다.");
      return wholeNumber(input.adjustedDaily, "기관 산정 일비");
    }
    if (halfDays) notes.push("일비 50% 감액을 " + halfDays + "일에 적용했습니다.");
    if (!input.continuous) return amount;

    const arrival = dateValue(input.arrival);
    if (!(arrival >= period.first && arrival <= period.last)) {
      throw new Error("출장 기간 안의 체재지 도착일을 입력하세요.");
    }
    const stayDays = (period.last - arrival) / dayMs;
    const reducedDays = [
      Math.max(0, Math.min(stayDays, 30) - 15),
      Math.max(0, Math.min(stayDays, 60) - 30),
      Math.max(0, stayDays - 60)
    ];
    if (reducedDays.some(Boolean) && halfDays) {
      throw new Error("차량 등 일비 감액과 장기 체재 감액이 함께 적용되면 기관 산정 일비를 입력하세요.");
    }
    reducedDays.forEach((days, index) => {
      if (!days) return;
      const fraction = (index + 1) / 10;
      amount -= dailyRate * fraction * days;
      notes.push("장기 체재 일비 " + (index + 1) * 10 + "% 감액을 " + days + "일에 적용했습니다.");
    });
    return amount;
  }

  function lodgingAllowance(input, period, notes) {
    let nights = 0;
    let base = 0;
    let extra = 0;
    for (const item of input.stays) {
      const perNight = wholeNumber(item.amount, "1박 지출액");
      const count = wholeNumber(item.nights, "숙박 박수", period.maxNights);
      if (!count) throw new Error("숙박 박수는 1박 이상이어야 합니다.");
      nights += count;
      if (nights > period.maxNights) {
        throw new Error("숙박 박수 합계는 출장 기간의 " + period.maxNights + "박을 넘을 수 없습니다.");
      }
      if (item.type === "excluded") {
        notes.push("수로·항공 여행의 지급 제외 숙박 " + count + "박을 반영했습니다.");
        continue;
      }
      if (item.type === "necessary") notes.push("불가피한 육지 숙박 " + count + "박을 반영했습니다.");
      const cap = input.grade === "2" ? lodgingCaps[item.region] : Infinity;
      base += Math.min(perNight, cap) * count;
      if (perNight > cap) {
        notes.push(regionNames[item.region] + " 숙박 " + count + "박에 1박당 " + cap.toLocaleString("ko-KR") + "원 상한을 적용했습니다.");
        if (item.extra) extra += Math.min(perNight - cap, cap * 0.3) * count;
      }
    }
    return { base, extra };
  }

  function deadline(last, days) {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "UTC", year: "numeric", month: "long", day: "numeric"
    }).format(last + days * dayMs);
  }

  function outsideAllowance(input, period) {
    const notes = [];
    const excludedMeals = wholeNumber(input.noMealDays, "식비 제외일수", period.days);
    const daily = input.grade === "actual"
      ? wholeNumber(input.actualDaily, "일비 실비")
      : standardDaily(input, period, notes);
    const meals = input.grade === "actual"
      ? wholeNumber(input.actualMeal, "식비 실비")
      : dailyRate * (period.days - excludedMeals);
    if (excludedMeals) notes.push("별도 식비가 필요하지 않은 수로·항공 여행 " + excludedMeals + "일을 식비에서 제외했습니다.");
    const fares = input.fares.reduce((sum, fare) => {
      if (fare.mode === "public") return sum;
      return sum + wholeNumber(fare.amount, "인정 운임");
    }, 0);
    const lodging = lodgingAllowance(input, period, notes);
    const mileage = Math.min(
      wholeNumber(input.mileageDaily, "공적 항공마일리지 추가 일비"),
      wholeNumber(input.mileageSavings, "절약한 항공운임")
    );
    if (input.mileageDaily > input.mileageSavings) notes.push("마일리지 추가 일비를 절약한 항공운임까지 반영했습니다.");
    const rows = [
      { label: "운임", amount: fares },
      { label: "일비", amount: daily },
      { label: "숙박비", amount: lodging.base },
      { label: "식비", amount: meals }
    ];
    if (lodging.extra) {
      rows.push({ label: "숙박비 추가 정산", amount: lodging.extra });
      notes.push("숙박비 추가 정산 신청기한은 " + deadline(period.last, 7) + "입니다.");
    }
    if (mileage) rows.push({ label: "공적 항공마일리지 추가 일비", amount: mileage });
    if (fares || lodging.base) notes.push("운임·숙박비 정산 신청기한은 " + deadline(period.last, 14) + "입니다.");
    return { rows, notes };
  }

  function calculate(input) {
    const period = tripPeriod(input.start, input.end);
    const result = input.kind === "local" ? localAllowance(input, period) : outsideAllowance(input, period);
    const total = result.rows.reduce((sum, row) => sum + row.amount, 0);
    if (!Number.isSafeInteger(total)) throw new Error("합계가 계산 가능한 금액 범위를 초과했습니다.");
    return { ...result, total, period };
  }

  return { calculate, tripPeriod };
})();

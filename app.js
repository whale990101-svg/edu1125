"use strict";

const byId = (id) => document.getElementById(id);
const form = byId("trip-form");
const fares = byId("fares");
const stays = byId("stays");
const money = new Intl.NumberFormat("ko-KR");
let calculated = false;

byId("open-guide").addEventListener("click", () => byId("guide").showModal());

function show(element, visible) {
  element.hidden = !visible;
  for (const control of element.querySelectorAll("input, select")) {
    control.disabled = !visible;
  }
}

function syncFare(row) {
  const field = (key) => row.querySelector('[data-key="' + key + '"]');
  const mode = field("mode").value;
  show(field("car-field"), mode === "car");
  show(field("fare-field"), mode !== "public");
  field("fare-label").textContent = mode !== "car"
    ? "인정 운임 (원)"
    : field("car-required").checked
      ? "인정 연료비·통행료 등 (원)"
      : "해당 철도·버스 운임 (원)";
}

function syncFields() {
  const local = byId("kind").value === "local";
  show(byId("local-fields"), local);
  byId("start-time").required = local;
  byId("end-time").required = local;
  show(byId("outside-fields"), !local);
  if (local) return;

  const grade = byId("grade").value;
  const actual = grade === "actual";
  for (const id of ["half-days-field", "half-days-help", "no-meal-field", "long-stay"]) {
    show(byId(id), !actual);
  }
  show(byId("actual-fields"), actual);
  byId("actual-daily").required = actual;
  byId("actual-meal").required = actual;
  if (!actual) {
    const override = byId("daily-override").checked;
    show(byId("daily-override-field"), override);
    byId("adjusted-daily").required = override;
    byId("arrival").disabled = override;
    byId("continuous").disabled = override;
    byId("arrival").required = !override && byId("continuous").checked;
  }
  byId("fare-help").textContent = (grade === "2" ? "철도 일반실·선박 2등급" : "철도 특실·선박 1등급")
    + " 기준입니다. 할인 가능 시 할인 요금을 입력하세요. 공용 교통수단의 운임은 0원입니다.";
  byId("stay-help").textContent = grade === "2"
    ? "할인 가능 시 할인 요금을 입력하세요. 1박 상한은 서울 10만 원, 광역시 8만 원, 그 밖의 지역 7만 원입니다."
    : "할인 가능 시 할인된 숙박요금을 입력하세요. 숙박비는 실비로 계산합니다.";
  for (const row of fares.children) syncFare(row);
  for (const row of stays.children) {
    const eligible = row.querySelector('[data-key="type"]').value !== "excluded";
    show(row.querySelector('[data-key="extra-field"]'), grade === "2" && eligible);
  }
}

function updatePeriod() {
  const start = byId("start").value;
  const end = byId("end").value;
  byId("end").min = start;
  byId("arrival").min = start;
  byId("arrival").max = end;
  const period = byId("period");
  period.textContent = "출장일과 복귀일을 입력하세요.";
  if (!start || !end) return;
  try {
    const { days, maxNights } = TravelAllowance.tripPeriod(start, end);
    period.textContent = "출장 " + days + "일 · 최대 " + maxNights + "박";
  } catch (error) {
    period.textContent = error.message;
  }
}

function clearResult(changed) {
  byId("error").hidden = true;
  byId("total").textContent = "—";
  byId("result-detail").hidden = true;
  byId("result-message").hidden = false;
  byId("result-message").textContent = changed
    ? "입력 내용이 변경되었습니다. 다시 계산하세요."
    : "조건에 따라 계산된 금액이 여기에 표시됩니다.";
}

function addEntry(kind, focus = false) {
  const list = kind === "fare" ? fares : stays;
  const row = byId(kind + "-template").content.firstElementChild.cloneNode(true);
  row.querySelector(".remove").addEventListener("click", () => {
    row.remove();
    clearResult(calculated);
    byId("add-" + kind).focus();
  });
  list.append(row);
  syncFields();
  if (focus) {
    row.querySelector("select").focus();
    clearResult(calculated);
  }
}

function numberValue(control) {
  return control.disabled || control.value === "" ? 0 : control.valueAsNumber;
}

function readInput() {
  const number = (id) => numberValue(byId(id));
  const field = (row, key) => row.querySelector('[data-key="' + key + '"]');
  const override = byId("daily-override");
  return {
    start: byId("start").value,
    end: byId("end").value,
    kind: byId("kind").value,
    startTime: byId("start-time").value,
    endTime: byId("end-time").value,
    vehicle: byId("local-vehicle").value,
    grade: byId("grade").value,
    halfDays: number("half-days"),
    noMealDays: number("no-meal-days"),
    actualDaily: number("actual-daily"),
    actualMeal: number("actual-meal"),
    continuous: byId("continuous").checked && !byId("continuous").disabled,
    arrival: byId("arrival").value,
    adjustedDaily: override.checked && !override.disabled ? number("adjusted-daily") : null,
    mileageSavings: number("mileage-savings"),
    mileageDaily: number("mileage-daily"),
    fares: Array.from(fares.children, (row) => ({
      mode: field(row, "mode").value,
      amount: numberValue(field(row, "amount"))
    })),
    stays: Array.from(stays.children, (row) => ({
      region: field(row, "region").value,
      nights: numberValue(field(row, "nights")),
      amount: numberValue(field(row, "amount")),
      type: field(row, "type").value,
      extra: !field(row, "extra").disabled && field(row, "extra").checked
    }))
  };
}

function renderResult(result) {
  const breakdown = byId("breakdown");
  const notes = byId("notes");
  breakdown.replaceChildren();
  notes.replaceChildren();
  for (const { label, amount } of result.rows) {
    const term = document.createElement("dt");
    const value = document.createElement("dd");
    term.textContent = label;
    value.textContent = money.format(amount) + "원";
    breakdown.append(term, value);
  }
  for (const note of result.notes) {
    const item = document.createElement("li");
    item.textContent = note;
    notes.append(item);
  }
  notes.hidden = !result.notes.length;
  byId("result-message").hidden = true;
  byId("result-detail").hidden = false;
  byId("total").textContent = money.format(result.total) + "원";
  if (window.matchMedia("(max-width: 760px)").matches) {
    byId("total").scrollIntoView({ block: "center" });
  }
}

form.addEventListener("input", () => {
  syncFields();
  updatePeriod();
  clearResult(calculated);
});
form.addEventListener("invalid", (event) => {
  const details = event.target.closest("details");
  if (details) details.open = true;
}, true);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearResult(calculated);
  try {
    renderResult(TravelAllowance.calculate(readInput()));
    calculated = true;
  } catch (error) {
    const message = byId("error");
    message.hidden = false;
    message.textContent = error.message;
  }
});
form.addEventListener("reset", () => {
  setTimeout(() => {
    fares.replaceChildren();
    stays.replaceChildren();
    for (const details of form.querySelectorAll("details")) details.open = false;
    calculated = false;
    addEntry("fare");
    updatePeriod();
    clearResult(false);
  }, 0);
});
for (const kind of ["fare", "stay"]) {
  byId("add-" + kind).addEventListener("click", () => addEntry(kind, true));
}
addEntry("fare");
updatePeriod();

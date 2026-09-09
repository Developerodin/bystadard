export function initPricingEstimate() {
  const plan = document.querySelector("#estimate-plan");
  if (!plan) return;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const money = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const cta = $("#estimate-cta");
  const contactBase = (cta?.getAttribute("href") || "../contact/").split("?")[0];

  function estimate() {
    const months = Number($("#estimate-plan").value);
    const rate = { 1: 2500, 3: 1950, 12: 990 }[months];
    const raw = Number($("#placements").value);
    const count = Math.max(
      0,
      Math.min(100, Math.floor(Number.isFinite(raw) ? raw : 0))
    );
    let scoped = count * 495;
    let monthly = 0;
    const addons = $$("[data-addon]:checked");
    addons.forEach((a) =>
      a.dataset.cadence === "monthly"
        ? (monthly += Number(a.dataset.addon))
        : (scoped += Number(a.dataset.addon))
    );
    $("#monthly-total").textContent = money(rate);
    $("#term-total").textContent = `Membership term: ${money(rate * months)} over ${months} month${months === 1 ? "" : "s"}`;
    $("#project-total").textContent = "From " + money(scoped);
    $("#recurring-total").textContent =
      "Additional monthly services: " + money(monthly);
    if (cta) {
      cta.href =
        contactBase +
        "?" +
        new URLSearchParams({
          plan: String(months),
          addons: addons.map((a) => a.value).join(", "),
          placements: String(count),
        });
    }
  }

  $$("#estimate-plan, #placements, [data-addon]").forEach((el) =>
    el.addEventListener("input", estimate)
  );
  estimate();
}

export function initContactForm() {
  const form = document.querySelector("#consultation-form");
  if (!form) return;

  const $ = (s) => document.querySelector(s);
  const params = new URLSearchParams(window.location.search);

  const service = Number(params.get("service"));
  if (
    params.has("service") &&
    service >= 0 &&
    service < form.elements.service.options.length
  ) {
    form.elements.service.selectedIndex = service;
  }

  const now = new Date();
  form.elements.date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  form.elements.timezone.value =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fields = (root) =>
    [...root.querySelectorAll("input, select, textarea")];

  const errorSlot = (el) => {
    const id = el.getAttribute("aria-describedby");
    return id ? document.getElementById(id) : null;
  };

  const showError = (el, message) => {
    el.classList.add("is-invalid");
    el.setAttribute("aria-invalid", "true");
    const slot = errorSlot(el);
    if (slot) {
      slot.textContent = message;
      slot.hidden = false;
    }
  };

  const clearError = (el) => {
    el.classList.remove("is-invalid");
    el.removeAttribute("aria-invalid");
    const slot = errorSlot(el);
    if (slot) {
      slot.textContent = "";
      slot.hidden = true;
    }
  };

  const hasLetter = (value) => /\p{L}/u.test(value);

  const isValidEmail = (email) => {
    if (email.includes("..") || /\s/.test(email)) return false;
    const at = email.lastIndexOf("@");
    if (at < 1 || at !== email.indexOf("@")) return false;
    const local = email.slice(0, at);
    const domain = email.slice(at + 1);
    if (!local || local.length > 64) return false;
    if (local.startsWith(".") || local.endsWith(".")) return false;
    if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false;
    const labels = domain.split(".");
    if (labels.length < 2) return false;
    return labels.every((label, index) => {
      if (!label || label.length > 63) return false;
      if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)) {
        return false;
      }
      return index !== labels.length - 1 || label.length >= 2;
    });
  };

  const isValidHttpUrl = (value) => {
    try {
      const url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") return false;
      const host = url.hostname;
      if (!host || host.startsWith(".") || host.endsWith(".")) return false;
      return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(
        host
      );
    } catch {
      return false;
    }
  };

  const getError = (el) => {
    const value = String(el.value ?? "").trim();

    switch (el.name) {
      case "name":
        if (value.length < 2) {
          return "Enter your full name using letters only (at least 2 characters).";
        }
        if (value.length > 100) {
          return "Keep your name to 100 characters or fewer.";
        }
        if (!/^[\p{L} .'-]+$/u.test(value) || !hasLetter(value)) {
          return "Enter your full name using letters only (at least 2 characters).";
        }
        return null;

      case "email":
        if (!value) {
          return "Enter a valid work email like name@company.com.";
        }
        if (value.length > 254) {
          return "Keep your email to 254 characters or fewer.";
        }
        if (/\s/.test(el.value)) {
          return "Remove spaces from your email. Use a format like name@company.com.";
        }
        if (!isValidEmail(value)) {
          return "Enter a valid work email like name@company.com.";
        }
        return null;

      case "company":
        if (value.length < 2) {
          return "Enter your brand or company name (at least 2 characters).";
        }
        if (value.length > 150) {
          return "Keep your brand or company name to 150 characters or fewer.";
        }
        if (!hasLetter(value)) {
          return "Enter a brand or company name that includes letters, not only numbers or punctuation.";
        }
        return null;

      case "website":
        if (!value) return null;
        if (value.length > 300) {
          return "Keep the website URL to 300 characters or fewer.";
        }
        if (!/^https?:\/\//i.test(value) || !isValidHttpUrl(value)) {
          return "Enter a full URL starting with https:// (e.g. https://yourbrand.com).";
        }
        return null;

      case "service":
        if (!value) return "Choose an option from the list.";
        return null;

      case "message":
        if (value.length < 10) {
          return "Add a short brief — at least 10 characters.";
        }
        if (value.length > 5000) {
          return "Keep your brief to 5,000 characters or fewer.";
        }
        return null;

      case "date":
        if (!value) return null;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return "Choose today or a future date.";
        }
        if (el.min && value < el.min) {
          return "Choose today or a future date.";
        }
        return null;

      case "time":
        if (!value) return null;
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
          return "Enter a valid time as hours and minutes (HH:MM).";
        }
        return null;

      case "timezone":
        if (!value) return null;
        if (value.length < 2) {
          return "Enter a timezone name with at least 2 characters (e.g. America/New_York).";
        }
        if (value.length > 100) {
          return "Keep the timezone to 100 characters or fewer.";
        }
        return null;

      case "phone": {
        if (!value) return null;
        if (!/^\+?[\d\s().\-/]+$/.test(value)) {
          return "Enter a phone number with 7–20 digits, optionally starting with +.";
        }
        const digits = value.replace(/[\s().\-/]/g, "");
        const numbers = digits.startsWith("+") ? digits.slice(1) : digits;
        if (!/^\d{7,20}$/.test(numbers)) {
          return "Enter a phone number with 7–20 digits, optionally starting with +.";
        }
        return null;
      }

      default:
        return null;
    }
  };

  const applyValidation = (el) => {
    const message = getError(el);
    if (message) showError(el, message);
    else clearError(el);
    return !message;
  };

  const validateFields = (list) => {
    let first = null;
    for (const el of list) {
      if (!applyValidation(el) && !first) first = el;
    }
    first?.focus();
    return !first;
  };

  form.addEventListener("focusout", (event) => {
    const el = event.target;
    if (el instanceof HTMLElement && el.matches("input, select, textarea")) {
      applyValidation(el);
    }
  });

  form.addEventListener("input", (event) => {
    const el = event.target;
    if (
      el instanceof HTMLElement &&
      el.matches("input, select, textarea") &&
      el.classList.contains("is-invalid")
    ) {
      applyValidation(el);
    }
  });

  $("#brief-next").addEventListener("click", () => {
    if (!validateFields(fields($("#brief-step")))) return;
    $("#brief-step").hidden = true;
    $("#time-step").hidden = false;
    form.elements.date.focus();
  });

  $("#brief-back").addEventListener("click", () => {
    $("#brief-step").hidden = false;
    $("#time-step").hidden = true;
    form.elements.name.focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateFields(fields($("#brief-step")))) {
      $("#brief-step").hidden = false;
      $("#time-step").hidden = true;
      return;
    }
    if (!validateFields(fields($("#time-step")))) return;
    const data = new FormData(form);
    const lines = [
      "BYSTANDER PR — CONSULTATION BRIEF",
      "",
      ...Array.from(
        data,
        ([key, value]) => `${key.toUpperCase()}: ${value || "Not specified"}`
      ),
      "",
      `PLACEMENTS REQUESTED: ${params.get("placements") || "To discuss"}`,
      "",
      "Indicative USD pricing; scope and availability require a written proposal.",
      "This brief has not been sent. Preferred meeting time is not reserved.",
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "bystander-pr-consultation.txt";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    $("#brief-status").textContent =
      "Your consultation brief has been downloaded. Keep it or share it with the agency. No enquiry has been sent and no meeting has been booked.";
  });
}

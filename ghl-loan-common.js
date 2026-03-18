;(function () {
  console.log("GHL script loaded");

  // 🧠 CONFIG — update URLs as per your funnel
  const STEP_CONFIG = {
    step1: {
      key: "step1_completed",
      next: "step2",
      url: "/basic-information"
    },
    step2: {
      key: "step2_completed",
      next: "step3",
      url: "/residence-financial"
    },
    step3: {
      key: "step3_completed",
      next: "step4",
      url: "/loan-details"
    },
    step4: {
      key: "step4_completed",
      next: "step5",
      url: "/signature"
    }
  };

  // 🧭 Route mapping
  const STEP_ROUTES = {
    "/basic-information": "step1",
    "/residence-financial": "step2",
    "/loan-details": "step3",
    "/signature": "step4"
  };

  // 📍 Detect current step from URL
  function getCurrentStep() {
    const path = window.location.pathname.toLowerCase();
    return STEP_ROUTES[path] || "step1";
  }

  const CURRENT_STEP = getCurrentStep();

  // 📦 Get state
  function getState() {
    try {
      return JSON.parse(sessionStorage.getItem("loan_app_state") || "{}");
    } catch (e) {
      return {};
    }
  }

  // 💾 Save state
  function setState(newData) {
    const state = getState();
    const updated = { ...state, ...newData };
    sessionStorage.setItem("loan_app_state", JSON.stringify(updated));
  }

  // 🔁 Get previous step
  function getPreviousStep(current) {
    const keys = Object.keys(STEP_CONFIG);
    const index = keys.indexOf(current);

    if (index <= 0) return null;
    return keys[index - 1];
  }

  // 🔐 Protect step access
  function protectStep() {
    const state = getState();

    console.log("Checking access for:", CURRENT_STEP);
    console.log("Current state:", state);

    if (CURRENT_STEP === "step1") return;

    const prevStep = getPreviousStep(CURRENT_STEP);
    if (!prevStep) return;

    const requiredKey = STEP_CONFIG[prevStep].key;

    if (!state[requiredKey]) {
      console.warn("Unauthorized access → redirecting to", STEP_CONFIG[prevStep].url);
      window.location.href = STEP_CONFIG[prevStep].url;
    }
  }

  // 🎯 Bind submit button click
  function bindSubmitButton() {
    const interval = setInterval(() => {

      // more reliable selector
      const btn = document.querySelector('button[type="submit"]');

      if (!btn) return;

      clearInterval(interval);

      console.log("Submit button found");

      btn.addEventListener("click", function () {
        console.log("Submit clicked on", CURRENT_STEP);

        const stepKey = STEP_CONFIG[CURRENT_STEP]?.key;

        if (stepKey) {
          setState({
            [stepKey]: true,
            last_step: CURRENT_STEP,
            updated_at: Date.now()
          });
        }

        console.log("Updated state:", getState());

        // ⚠️ DO NOT prevent default
      });

    }, 300);
  }

  // 🚀 INIT
  function init() {
    console.log("INIT CALLED");
    console.log("CURRENT STEP:", CURRENT_STEP);

    protectStep();
    bindSubmitButton();
  }

  // ✅ FIXED INIT (works in GHL)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

;(function () {
    // 🧠 CONFIG — update URLs as per your funnel
    const STEP_CONFIG = {
      step1: {
        key: 'step1_completed',
        next: 'step2',
        url: '/basic-information',
      },
      step2: {
        key: 'step2_completed',
        next: 'step3',
        url: '/residence-financial',
      },
      step3: {
        key: 'step3_completed',
        next: 'step4',
        url: '/loan-details',
      },
      step4: {
        key: 'step3_completed',
        next: 'step4',
        url: '/loan-details',
      },
    }
    const STEP_ROUTES = {
      '/basic-information': 'step1',
      '/residence-financial': 'step2',
      '/loan-details': 'step3',
    }

    function getCurrentStep() {
      const path = window.location.pathname.toLowerCase()
      return STEP_ROUTES[path] || 'step1'
    }

    const CURRENT_STEP = getCurrentStep()

    // 📦 Get state
    function getState() {
      return JSON.parse(sessionStorage.getItem('loan_app_state') || '{}')
    }

    // 💾 Save state
    function setState(newData) {
      const state = getState()
      const updated = { ...state, ...newData }
      sessionStorage.setItem('loan_app_state', JSON.stringify(updated))
    }

    // 🔐 Protect step access
    function protectStep() {
      const state = getState()

      // skip for step1
      if (CURRENT_STEP === 'step1') return

      const prevStep = getPreviousStep(CURRENT_STEP)

      if (!prevStep) return

      const requiredKey = STEP_CONFIG[prevStep].key

      if (!state[requiredKey]) {
        console.warn('Unauthorized access → redirecting')

        window.location.href = STEP_CONFIG[prevStep].url
      }
    }

    // 🔁 Get previous step
    function getPreviousStep(current) {
      const keys = Object.keys(STEP_CONFIG)
      const index = keys.indexOf(current)

      if (index <= 0) return null
      return keys[index - 1]
    }

    // 🎯 Handle button click
    function bindSubmitButton() {
      const interval = setInterval(() => {
        const btn = document.querySelector('button.btn.btn-dark.button-element')

        if (!btn) return

        clearInterval(interval)

        btn.addEventListener('click', function () {
          console.log('Submit clicked on', CURRENT_STEP)

          // mark current step complete
          const stepKey = STEP_CONFIG[CURRENT_STEP]?.key

          if (stepKey) {
            setState({
              [stepKey]: true,
              last_step: CURRENT_STEP,
              updated_at: Date.now(),
            })
          }

          console.log('State saved:', getState())

          // ⚠️ do NOT prevent default
        })
      }, 300)
    }

    // 🚀 INIT
    function init() {
      protectStep()
      bindSubmitButton()
    }

    window.addEventListener('load', init)
  })()

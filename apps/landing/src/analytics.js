// Web Analytics is not enabled, so the insights script is not loaded and
// window.va is usually missing. Clicks still report when a queue is present.
export function trackCtaClick(location) {
  try {
    const va = window.va
    if (typeof va !== 'function') {
      return
    }
    va('event', { name: 'cta_click', data: { location } })
  } catch {
    // A broken analytics queue must not block the questionnaire link.
  }
}

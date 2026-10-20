// <Analytics/> installs window.va (a queue until /_vercel/insights/script.js
// loads). A missing or throwing queue must not block the questionnaire link.
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

import arrowUp from './icons/arrow-up.svg'
import calendar from './icons/calendar.svg'
import chevron from './icons/chevron.svg'
import inbox from './icons/inbox.svg'
import play from './icons/play.svg'
import plus from './icons/plus.svg'
import rostr from './icons/rostr.svg'
import settings from './icons/settings.svg'
import sparkles from './icons/sparkles.svg'
import statusDot from './icons/status-dot.svg'

const ICONS = {
  'arrow-up': { src: arrowUp, width: 9.84375, height: 9.84375 },
  calendar: { src: calendar, width: 12.3438, height: 13.5938 },
  chevron: { src: chevron, width: 6.875, height: 3.875 },
  inbox: { src: inbox, width: 13.5938, height: 11.0938 },
  play: { src: play, width: 20, height: 20 },
  plus: { src: plus, width: 10.5, height: 10.5 },
  rostr: { src: rostr, width: 13.5938, height: 12.3438 },
  settings: { src: settings, width: 13.5938, height: 13.5938 },
  sparkles: { src: sparkles, width: 9.61458, height: 8.53125 },
  'status-dot': { src: statusDot, width: 6, height: 6 },
}

export default function PreviewIcon({ name }) {
  const icon = ICONS[name]

  return (
    <img
      src={icon.src}
      alt=""
      width={icon.width}
      height={icon.height}
      draggable="false"
      className="block shrink-0 max-w-none"
      style={{ width: icon.width, height: icon.height }}
    />
  )
}

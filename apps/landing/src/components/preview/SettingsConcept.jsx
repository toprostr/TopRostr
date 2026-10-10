import PreviewIcon from './PreviewIcon.jsx'

const settings = [
  { label: 'Account', value: 'Coach Rivera', detail: 'coach.rivera@example.com', action: 'Edit', outlined: true },
  { label: 'Connected inbox', value: 'Gmail · connected', connected: true, action: 'Manage' },
  { label: 'Calendar', value: 'Google Calendar · connected', connected: true, action: 'Manage' },
  { label: 'Team & staff', value: '3 staff · 2 assistants, 1 GA', action: 'Invite', outlined: true },
  { label: 'AI preferences', value: 'AI drafts replies — never sends', detail: 'You review and send every message.', toggle: true },
  { label: 'Notifications', value: 'Daily digest at 7:00 am', toggle: true },
]

export default function SettingsConcept() {
  return (
    <div className="min-w-0 bg-[#f4f4f5] px-4 pt-7 pb-10 sm:px-6 @min-[1024px]:px-14">
      <p className="preview-heading mb-5 text-[28px] font-bold tracking-tight">Settings</p>
      <div className="overflow-hidden rounded-xl border border-[#d9d9dd] bg-white">
        {settings.map(setting => <div key={setting.label} className="flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#d9d9dd] px-4 py-3 last:border-b-0 sm:flex-nowrap sm:px-5">
          <p className="preview-heading w-full shrink-0 text-[15px] font-medium sm:w-[25%]">{setting.label}</p>
          <div className="min-w-0 flex-1 text-[14px]">
            <p className="flex items-center gap-1.5">{setting.connected ? <PreviewIcon name="status-dot" /> : null}{setting.value}</p>
            {setting.detail ? <p className="mt-0.5 text-xs text-[#6b6b70]">{setting.detail}</p> : null}
          </div>
          {setting.toggle ? <PreviewIcon name="toggle-on" /> : <span className={`preview-heading flex h-8 shrink-0 items-center rounded-lg px-3.5 text-[13px] ${setting.outlined ? 'border border-[#d9d9dd] font-bold' : 'text-[#5f5f64]'}`}>{setting.action}</span>}
        </div>)}
      </div>
    </div>
  )
}

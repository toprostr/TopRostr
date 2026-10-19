import PreviewIcon from './PreviewIcon.jsx'

const settings = [
  { label: 'Account', value: 'Coach Jason', detail: 'jason.wallack@toprostr.com', action: 'Edit', outlined: true },
  { label: 'Connected inbox', value: 'Gmail · connected', connected: true, action: 'Manage' },
  { label: 'Calendar', value: 'Google Calendar · connected', connected: true, action: 'Manage' },
  { label: 'AI preferences', value: 'AI drafts replies — never sends', detail: 'You review and send every message.', toggle: true },
  { label: 'Notifications', value: 'Daily digest at 7:00 am', toggle: true },
]

const usage = [
  { label: 'AI requests', value: '120 of 500', percent: 24 },
  { label: 'Video storage', value: '2.4 GB of 10 GB', percent: 24 },
]

const permissions = [
  { label: 'Read recruiting emails', detail: 'Summarize messages and attached recruiting materials.', enabled: true },
  { label: 'Read calendar events', detail: 'Find visits, camps, and available meeting times.', enabled: true },
  { label: 'Send emails', detail: 'Drafts require your review and approval before sending.', enabled: false },
  { label: 'Change calendar events', detail: 'New events and edits require your approval.', enabled: false },
]

export default function SettingsConcept() {
  return (
    <div className="settings-panel min-w-0 overflow-y-auto bg-[#f4f4f5] px-4 pt-7 pb-10 sm:px-6 @min-[1024px]:h-[844px] @min-[1024px]:px-14">
      <p className="preview-heading mb-5 text-[28px] font-bold tracking-tight">Settings</p>
      <div className="mb-6 overflow-hidden rounded-xl border border-[#d9d9dd] bg-white">
        <p className="preview-heading px-5 pt-5 pb-2 text-[18px] font-bold">Permissions</p>
        {permissions.map(permission => <div key={permission.label} className="flex items-center gap-4 border-b border-[#d9d9dd] px-5 py-3 last:border-b-0">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium">{permission.label}</p>
            <p className="mt-0.5 text-xs text-[#6b6b70]">{permission.detail}</p>
          </div>
          <span className={`shrink-0 text-xs font-medium ${permission.enabled ? 'text-[#18181b]' : 'text-[#6b6b70]'}`}>
            {permission.enabled ? <span className="flex items-center gap-1.5"><span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />Allowed</span> : 'Approval required'}
          </span>
        </div>)}
      </div>
      <div className="overflow-hidden rounded-xl border border-[#d9d9dd] bg-white">
        {settings.map(setting => <div key={setting.label} className="flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#d9d9dd] px-4 py-3 last:border-b-0 sm:flex-nowrap sm:px-5">
          <p className="preview-heading w-full shrink-0 text-[15px] font-medium sm:w-[25%]">{setting.label}</p>
          <div className="min-w-0 flex-1 text-[14px]">
            <p className="flex items-center gap-1.5">{setting.connected ? <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-gold" /> : null}{setting.value}</p>
            {setting.detail ? <p className="mt-0.5 text-xs text-[#6b6b70]">{setting.detail}</p> : null}
          </div>
          {setting.toggle ? <PreviewIcon name="toggle-on" /> : <span className={`preview-heading flex h-8 shrink-0 items-center rounded-lg px-3.5 text-[13px] ${setting.outlined ? 'border border-[#d9d9dd] font-bold' : 'text-[#5f5f64]'}`}>{setting.action}</span>}
        </div>)}
      </div>
      <div className="mt-6 rounded-xl border border-[#d9d9dd] bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="preview-heading text-[18px] font-bold">Usage</p>
          <span className="preview-heading flex h-9 items-center rounded-lg bg-gold px-3.5 text-[13px] font-bold text-charcoal">Manage plan</span>
        </div>
        <p className="mt-1 text-xs text-[#6b6b70]">Sample plan limits · Monthly usage resets November 1</p>
        <div className="mt-5 grid gap-5">
          {usage.map(item => <div key={item.label}>
            <div className="mb-2 flex justify-between gap-4 text-[13px]">
              <span>{item.label}</span><span className="text-[#6b6b70]">{item.value}</span>
            </div>
            <div role="meter" aria-label={item.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.percent} aria-valuetext={item.value} className="h-1.5 overflow-hidden rounded-full bg-[#ebebed]">
              <div className="h-full rounded-full bg-gold" style={{ width: `${item.percent}%` }} />
            </div>
          </div>)}
        </div>
      </div>
      <div className="mt-6 flex justify-end border-t border-[#d9d9dd] pt-5">
        <span className="preview-heading flex h-9 items-center rounded-lg border border-[#d9d9dd] px-3.5 text-[13px] font-medium text-[#5f5f64]">Reset account</span>
      </div>
    </div>
  )
}

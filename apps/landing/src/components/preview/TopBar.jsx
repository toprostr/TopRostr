import PreviewIcon from './PreviewIcon.jsx'

export default function TopBar({ organization, navigation }) {
  return (
    <div className="flex h-14 items-center border-b border-[#d9d9dd] bg-[#dedee1] pr-4 pl-[18px]">
      <div className="flex min-w-0 flex-1 items-center gap-[9px]">
        <span className="preview-heading flex size-[26px] shrink-0 items-center justify-center rounded-[7px] bg-[#0a0a0a] text-[15px] font-bold text-[#fafafa]">
          {organization.mark}
        </span>
        <span className="preview-heading truncate text-[16px] font-bold tracking-[-0.02em] text-[#18181b]">
          {organization.product}
        </span>
      </div>
      <div className="hidden items-center gap-0.5 md:flex">
        {navigation.map((item) => (
          <span
            key={item.id}
            className={`preview-heading flex h-8 cursor-default items-center gap-[7px] rounded-[7px] pr-3.5 pl-3 text-[14px] font-medium ${
              item.active
                ? 'border border-[#d9d9dd] bg-white text-[#18181b]'
                : 'text-[#6b6b70]'
            }`}
          >
            <PreviewIcon name={item.id} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex flex-1 justify-end">
        <span className="preview-heading flex size-[30px] items-center justify-center rounded-full border border-[#d9d9dd] bg-[#e2e2e5] text-[11px] font-bold text-[#18181b]">
          {organization.coachInitials}
        </span>
      </div>
    </div>
  )
}

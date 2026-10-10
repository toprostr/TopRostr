import PreviewIcon from './PreviewIcon.jsx'

const MARK_SRC = '/brand/svg/mark-charcoal.svg'

export default function TopBar({ organization, navigation }) {
  return (
    <div className="flex h-14 items-center border-b border-[#d9d9dd] bg-[#dedee1] pr-4 pl-[18px]">
      <div className="flex min-w-0 flex-1 items-center gap-[6px]">
        <img
          src={MARK_SRC}
          alt=""
          width={51}
          height={26}
          draggable="false"
          className="h-[26px] w-auto shrink-0"
        />
        <span className="preview-heading truncate text-[16px] font-bold tracking-[-0.02em] text-[#18181b]">
          {organization.product}
        </span>
      </div>
      <div data-preview-nav className="hidden items-center gap-0.5 md:flex">
        {navigation.map((item) => (
          <span
            key={item.id}
            className={`preview-heading flex h-8 cursor-default items-center gap-[7px] rounded-[7px] pr-3.5 pl-3 text-[14px] font-medium ${
              item.active
                ? 'border border-[#d9d9dd] bg-white text-[#18181b]'
                : 'text-[#5f5f64]'
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

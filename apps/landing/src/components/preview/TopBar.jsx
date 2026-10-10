import PreviewIcon from './PreviewIcon.jsx'

const MARK_SRC = '/brand/svg/mark-charcoal.svg'

export default function TopBar({ organization, navigation, leftAligned = false }) {
  return (
    <div className={`flex items-center border-b border-[#d9d9dd] bg-[#dedee1] ${leftAligned ? 'h-[88px] px-7' : 'h-14 pr-4 pl-[18px]'}`}>
      <div className="flex min-w-0 flex-1 items-center gap-[6px]">
        {leftAligned ? null : <img
          src={MARK_SRC}
          alt=""
          width={51}
          height={26}
          draggable="false"
          className="h-[26px] w-auto shrink-0"
        />}
        <span className={`preview-heading truncate font-bold tracking-[-0.02em] text-[#18181b] ${leftAligned ? 'text-[28px]' : 'text-[16px]'}`}>
          {organization.product}
        </span>
      </div>
      <div data-preview-nav className="hidden items-center gap-0.5 @min-[768px]:flex">
        {navigation.map((item) => (
          <span
            key={item.id}
            className={`preview-heading flex cursor-default items-center rounded-[7px] font-medium ${leftAligned ? 'h-[44px] gap-2 px-4 text-[18px]' : 'h-8 gap-[7px] pr-3.5 pl-3 text-[14px]'} ${
              item.active
                ? 'border border-[#d9d9dd] bg-white text-[#18181b]'
                : 'text-[#5f5f64]'
            }`}
          >
            <PreviewIcon name={item.id} scale={leftAligned ? 1.15 : 1} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex flex-1 justify-end">
        <span aria-label="Coach profile" className={`preview-heading flex shrink-0 items-center justify-center rounded-full border border-gold bg-gold font-bold leading-none text-[#18181b] ${leftAligned ? 'size-[52px] text-[19px]' : 'size-[30px] text-[11px]'}`}>
          {organization.coachInitials}
        </span>
      </div>
    </div>
  )
}

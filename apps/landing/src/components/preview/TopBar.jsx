import PreviewIcon from './PreviewIcon.jsx'

export default function TopBar({ organization, navigation }) {
  return (
    <div className="flex h-[88px] items-center border-b border-[#d9d9dd] bg-[#dedee1] px-7">
      <div className="flex min-w-0 flex-1 items-center gap-[6px]">
        <img
          src="/brand/svg/mark-charcoal.svg"
          alt={organization.product}
          width={194}
          height={100}
          draggable="false"
          className="h-[32px] w-auto shrink-0"
        />
      </div>
      <div data-preview-nav className="hidden items-center gap-0.5 @min-[768px]:flex">
        {navigation.map((item) => (
          <span
            key={item.id}
            className={`preview-heading flex cursor-default items-center rounded-[7px] font-medium h-[44px] gap-2 px-4 text-[18px] ${
              item.active
                ? 'border border-[#d9d9dd] bg-white text-[#18181b]'
                : 'text-[#5f5f64]'
            }`}
          >
            <PreviewIcon name={item.id} scale={1.15} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex flex-1 justify-end">
        <span aria-label="Coach profile" className="preview-heading flex size-[52px] shrink-0 items-center justify-center rounded-full border border-gold bg-gold text-[19px] font-bold leading-none text-[#18181b]">
          {organization.coachInitials}
        </span>
      </div>
    </div>
  )
}

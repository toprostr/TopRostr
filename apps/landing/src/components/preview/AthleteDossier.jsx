import PreviewIcon from './PreviewIcon.jsx'

const choiceClass = {
  quiet: 'font-medium text-[#5f5f64]',
  outline: 'border border-[#d9d9dd] font-bold text-[#3a3a3d]',
  solid: 'bg-[#0b0b0b] font-bold text-[#fafafa]',
}

export default function AthleteDossier({ recruit, decision }) {
  return (
    <div className="flex min-w-0 flex-col bg-[#f4f4f5]">
      <div
        data-preview-step="recruit-highlight"
        className="preview-step flex flex-col gap-4 px-4 pt-5 sm:gap-[22px] sm:pt-7 lg:px-9"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0">
            <p className="preview-heading text-[clamp(1.625rem,4vw,2.125rem)] font-bold tracking-[-0.03em] text-[#18181b]">
              {recruit.name}
            </p>
            <p className="mt-1 text-[14px] text-[#6b6b70]">
              <span>{recruit.position}</span>
              <span aria-hidden="true"> · </span>
              <span>{recruit.classYear}</span>
              <span aria-hidden="true"> · </span>
              <span>{recruit.club}</span>
            </p>
          </div>
          <span className="mb-1 ml-auto flex h-7 cursor-default items-center gap-[7px] rounded-full border border-[#d9d9dd] pr-2 pl-3">
            <PreviewIcon name="status-dot" />
            <span className="text-[13px] font-medium text-[#6b6b70]">{recruit.status}</span>
            <PreviewIcon name="chevron" />
          </span>
        </div>

        <ul className="flex flex-wrap items-center gap-x-4 gap-y-4 sm:gap-x-0">
          {recruit.stats.map((stat, index) => (
            <li key={stat.label} className="flex items-center">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="mx-3 hidden h-[38px] w-px bg-[#d9d9dd] sm:block"
                />
              ) : null}
              <span>
                <span className="text-[12px] text-[#6b6b70]">{stat.label}</span>
                <span className="preview-heading mt-1 block text-[24px] font-medium leading-none text-[#18181b]">
                  {stat.value}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap items-end gap-x-6 gap-y-1 border-b border-[#d9d9dd]">
          {recruit.tabs.map((tab) => (
            <li key={tab.id}>
              <span
                className={`preview-heading flex h-10 cursor-default items-center text-[15px] ${
                  tab.active
                    ? 'border-b-2 border-[#0a0a0a] font-bold text-[#18181b]'
                    : 'font-medium text-[#6b6b70]'
                }`}
              >
                {tab.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex aspect-video w-full flex-col justify-between rounded-[14px] bg-[#2e2f33] px-[18px] py-4 lg:aspect-[688/490]">
          <p className="preview-heading text-[13px] font-medium text-[#f2f2f2]">{recruit.film}</p>
          <div className="flex items-center justify-center">
            <span className="flex size-[54px] cursor-default items-center justify-center rounded-full bg-white">
              <PreviewIcon name="play" />
            </span>
          </div>
          <div className="h-[3px] overflow-hidden rounded-[2px] bg-white/20">
            <div className="h-[3px] w-[24.5%] rounded-[2px] bg-white" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#d9d9dd] bg-[#ebebed] px-4 py-3 lg:mt-[22px] lg:min-h-16 lg:px-9">
        <p className="min-w-0 flex-1 basis-full text-[13px] text-[#5f5f64] sm:basis-auto">
          {decision.prompt}
        </p>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {decision.choices.map((choice) => (
            <span
              key={choice.label}
              className={`preview-heading flex h-9 cursor-default items-center rounded-[8px] px-3 text-[14px] ${choiceClass[choice.tone]}`}
            >
              {choice.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

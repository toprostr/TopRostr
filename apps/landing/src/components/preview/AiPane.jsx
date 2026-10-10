import PreviewIcon from './PreviewIcon.jsx'

export default function AiPane({ assistant }) {
  return (
    <div className="order-2 flex min-w-0 flex-col border-t border-[#d9d9dd] bg-[#ebebed] lg:order-none lg:h-full lg:border-t-0 lg:border-r">
      <div className="flex h-[52px] items-center pr-[18px] pl-6">
        <p className="preview-heading text-[15px] font-bold text-[#18181b]">AI</p>
        <span className="ml-auto">
          <PreviewIcon name="plus" />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 pt-3 lg:px-6">
        <div data-preview-step="ai-suggestion" className="preview-step">
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#6b6b70]">
            <PreviewIcon name="sparkles" />
            {assistant.name}
          </p>
          <p className="mt-2.5 text-[15px] leading-[22px] text-[#18181b]">{assistant.message}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {assistant.suggestions.map((suggestion) => (
              <span
                key={suggestion.label}
                className={`preview-heading flex h-8 cursor-default items-center rounded-[8px] text-[13px] ${
                  suggestion.emphasis
                    ? 'border border-[#d9d9dd] px-3.5 font-bold text-[#3a3a3d]'
                    : 'px-2.5 font-medium text-[#5f5f64]'
                }`}
              >
                {suggestion.label}
              </span>
            ))}
          </div>
        </div>
        <div
          data-preview-step="coach-approval"
          className="preview-step mt-4 rounded-[8px] border border-[#d9d9dd] bg-white px-3 py-2.5"
        >
          <p className="preview-heading text-[11px] font-bold tracking-[0.12em] text-[#18181b]">
            {assistant.cue}
          </p>
        </div>
      </div>
      <div className="px-5 pt-2 pb-5">
        <div className="flex min-h-[52px] items-center gap-2 rounded-[10px] border border-[#d9d9dd] bg-white py-2 pr-2 pl-3">
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
            <span className="shrink-0 rounded-[6px] border border-[#d9d9dd] bg-[#e2e2e5] px-2 py-1 text-[12px] font-medium text-[#18181b]">
              {assistant.contextChip}
            </span>
            <span className="text-[15px] text-[#9c9ca3]">{assistant.placeholder}</span>
          </span>
          <span className="flex size-8 shrink-0 cursor-default items-center justify-center rounded-[8px] bg-[#0a0a0a]">
            <PreviewIcon name="arrow-up" />
          </span>
        </div>
      </div>
    </div>
  )
}

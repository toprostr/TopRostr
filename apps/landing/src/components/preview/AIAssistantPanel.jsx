export default function AIAssistantPanel({ suggestion }) {
  return (
    <div className="min-w-0 px-4 py-5 sm:px-5 lg:px-5">
      <div data-preview-step="ai-suggestion" className="preview-step">
        <p className="text-xs font-semibold tracking-[0.16em] text-brand-gray">
          AI SUGGESTION
        </p>
        <p className="mt-3 text-sm font-semibold text-off-white">{suggestion.label}</p>
        <p className="mt-1 text-sm text-brand-gray">{suggestion.intro}</p>
        <p className="mt-3 text-sm leading-relaxed text-off-white">{suggestion.body}</p>
      </div>

      <div
        data-preview-step="coach-approval"
        className="preview-step mt-5 rounded-xl border border-gold/40 bg-gold/10 p-4"
      >
        <p className="text-sm font-semibold leading-relaxed text-off-white">
          {suggestion.cue}
        </p>
        <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
          {suggestion.choices.map((choice) => (
            <li
              key={choice}
              className="cursor-default rounded-full border border-off-white/30 px-3 py-1.5 text-sm text-off-white"
            >
              {choice}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

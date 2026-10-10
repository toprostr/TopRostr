export default function MessageList({ inbox }) {
  return (
    <div className="hidden min-h-0 min-w-0 flex-col border-[#d9d9dd] bg-[#f4f4f5] lg:flex lg:border-r">
      <div className="flex h-[52px] items-center gap-2 pr-4 pl-[18px]">
        <p className="preview-heading text-[16px] font-bold text-[#18181b]">{inbox.title}</p>
        <p className="ml-auto text-[12px] text-[#6b6b70]">{inbox.count}</p>
      </div>
      <ul className="min-h-0">
        {inbox.messages.map((message) => (
          <li
            key={message.id}
            className={`flex h-16 items-center gap-2.5 border-b border-[#d9d9dd] px-4 ${
              message.selected ? 'bg-white' : ''
            } ${message.recruit ? '' : 'opacity-50'}`}
          >
            <span className="preview-heading flex size-7 shrink-0 items-center justify-center rounded-full border border-[#d9d9dd] bg-[#e2e2e5] text-[10px] font-bold text-[#18181b]">
              {message.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2">
                <span
                  className={`truncate text-[14px] text-[#18181b] ${
                    message.selected ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {message.name}
                </span>
                <span className="ml-auto shrink-0 text-[11px] text-[#9c9ca3]">{message.time}</span>
              </span>
              <span className="mt-0.5 block truncate text-[12px] text-[#6b6b70]">
                {message.preview}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

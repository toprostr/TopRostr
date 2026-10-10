import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import AiPane from './AiPane.jsx'
import AthleteDossier from './AthleteDossier.jsx'
import MessageList from './MessageList.jsx'
import TopBar from './TopBar.jsx'
import './preview-steps.css'

export default function WorkspacePreview({ fixture }) {
  const { organization, navigation, inbox, recruit, assistant, decision, label } = fixture

  return (
    <div
      data-preview-step="workspace"
      className="preview-step w-full min-w-0 overflow-hidden rounded-[10px] bg-[#f4f4f5] text-[#18181b] shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
    >
      <TopBar organization={organization} navigation={navigation} />
      <div className="flex flex-col lg:grid lg:grid-cols-[minmax(210px,400fr)_minmax(232px,280fr)_minmax(0,760fr)]">
        <AiPane assistant={assistant} />
        <MessageList inbox={inbox} />
        <AthleteDossier recruit={recruit} decision={decision} />
      </div>
      <div className="flex flex-col gap-1 border-t border-[#d9d9dd] bg-[#ebebed] px-4 py-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-9">
        <p className="preview-heading text-[10px] font-bold text-[#18181b]">
          {organization.program}
        </p>
        <p className="text-[10px] font-medium tracking-[0.06em] text-[#5f5f64]">{label}</p>
      </div>
    </div>
  )
}

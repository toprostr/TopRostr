import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import AiPane from './AiPane.jsx'
import AthleteDossier from './AthleteDossier.jsx'
import MessageList from './MessageList.jsx'
import TopBar from './TopBar.jsx'
import './preview-steps.css'
import CalendarConcept from './CalendarConcept.jsx'
import RosterConcept from './RosterConcept.jsx'
import SettingsConcept from './SettingsConcept.jsx'
import { workspaceConcepts } from './concepts.js'

export default function WorkspacePreview({ fixture, view = 'inbox' }) {
  const { organization, navigation, inbox, recruit, assistant, decision, label } = fixture
  const concept = workspaceConcepts.find(concept => concept.id === view)
  const currentAssistant = view === 'inbox' ? assistant : concept.assistant

  return (
    <div
      data-preview-step="workspace"
      data-preview-view={view}
      className="preview-step w-full min-w-0 overflow-hidden rounded-[10px] bg-[#f4f4f5] text-[#18181b] shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
    >
      <TopBar organization={organization} navigation={navigation.map(item => ({ ...item, active: item.id === view }))} leftAligned={view === 'inbox'} />
      <div className={`flex flex-col @min-[1024px]:grid @min-[1024px]:min-h-[844px] ${view === 'inbox' ? '@min-[1024px]:grid-cols-[minmax(232px,280fr)_minmax(0,760fr)_minmax(210px,400fr)]' : '@min-[1024px]:grid-cols-[minmax(0,1040fr)_minmax(210px,400fr)]'}`}>
        {view === 'inbox' ? <><MessageList inbox={inbox} /><AthleteDossier recruit={recruit} /></> : null}
        {view === 'calendar' ? <CalendarConcept /> : null}
        {view === 'rostr' ? <RosterConcept /> : null}
        {view === 'settings' ? <SettingsConcept /> : null}
        <AiPane assistant={currentAssistant} decision={view === 'inbox' ? decision : undefined} />
      </div>
      <div className="flex flex-col gap-1 border-t border-[#d9d9dd] bg-[#ebebed] px-4 py-2.5 @min-[1024px]:flex-row @min-[1024px]:items-center @min-[1024px]:justify-between @min-[1024px]:gap-6 @min-[1024px]:px-9">
        <p className="preview-heading text-[10px] font-bold text-[#18181b]">
          {organization.program}
        </p>
        <p className="text-[10px] font-medium tracking-[0.06em] text-[#5f5f64]">{label}</p>
      </div>
    </div>
  )
}

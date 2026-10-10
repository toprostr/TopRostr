import AIAssistantPanel from './AIAssistantPanel.jsx'
import OrganizationHeader from './OrganizationHeader.jsx'
import RecruitPanel from './RecruitPanel.jsx'
import WorkspaceSidebar from './WorkspaceSidebar.jsx'
import './preview-steps.css'

export default function WorkspacePreview({ fixture }) {
  const { organization, navigation, recruit, suggestion } = fixture

  // Mobile stacks the recruit card, then the AI suggestion.
  // Tablet keeps a narrow sidebar. Desktop places sidebar, recruit, and AI in a row.
  return (
    <div
      data-preview-step="workspace"
      className="preview-step grid grid-cols-1 overflow-hidden rounded-[10px] bg-[#F2F2F2] shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:grid-cols-[5.5rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)_19rem]"
    >
      <div className="hidden bg-[#1C1C1E] md:col-span-2 md:block lg:col-span-3">
        <OrganizationHeader organization={organization} />
      </div>
      <div className="hidden bg-[#E4E4E7] md:row-span-2 md:block md:border-r md:border-[#D4D4D8] lg:row-span-1">
        <WorkspaceSidebar navigation={navigation} />
      </div>
      <div className="min-w-0 bg-white">
        <RecruitPanel recruit={recruit} organization={organization} />
      </div>
      <div className="min-w-0 border-t border-[#D4D4D8] bg-[#22252B] lg:border-l lg:border-t-0 lg:border-[#22252B]">
        <AIAssistantPanel suggestion={suggestion} />
      </div>
    </div>
  )
}

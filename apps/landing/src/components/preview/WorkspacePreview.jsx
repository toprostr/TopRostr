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
      className="preview-step grid grid-cols-1 overflow-hidden rounded-2xl border border-off-white/15 bg-off-white/[0.04] md:grid-cols-[5.5rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)_19rem]"
    >
      <div className="hidden border-b border-off-white/10 md:col-span-2 md:block lg:col-span-3">
        <OrganizationHeader organization={organization} />
      </div>
      <div className="hidden bg-charcoal md:row-span-2 md:block md:border-r md:border-off-white/10 lg:row-span-1">
        <WorkspaceSidebar navigation={navigation} />
      </div>
      <div className="min-w-0">
        <RecruitPanel recruit={recruit} organization={organization} />
      </div>
      <div className="min-w-0 border-t border-off-white/10 lg:border-l lg:border-t-0">
        <AIAssistantPanel suggestion={suggestion} />
      </div>
    </div>
  )
}

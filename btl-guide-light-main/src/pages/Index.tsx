import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import ChecklistTab from '@/components/ChecklistTab';
import DashboardTab from '@/components/DashboardTab';
import CaseTrackingTab from '@/components/CaseTrackingTab';
import InfoTab from '@/components/InfoTab';
import AgentTab from '@/components/AgentTab';
import FeedbackModal from '@/components/FeedbackModal';
import AIAgentChat from '@/components/AIAgentChat';
import { Bot, MessageCircle } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('agent');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFullScreen, setChatFullScreen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main id="main-content" className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-6" role="main">
        {activeTab === 'agent' && <AgentTab />}
        {activeTab === 'checklist' && <ChecklistTab />}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'tracking' && <CaseTrackingTab />}
        {activeTab === 'info' && <InfoTab />}
      </main>

      <AppFooter />
      <FeedbackModal />

      {/* AI Agent FAB — shows on non-agent tabs */}
      {activeTab !== 'agent' && !chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-4 rounded-full shadow-xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95 no-print"
          style={{
            background: 'linear-gradient(135deg, hsl(207 95% 35%) 0%, hsl(213 73% 20%) 100%)',
            boxShadow: '0 8px 32px rgba(3, 104, 176, 0.4)',
          }}
          aria-label="פתח סוכן AI"
        >
          <Bot className="h-6 w-6" />
          <span className="hidden sm:inline">🤖 שאל את נועם</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full" />
        </button>
      )}

      {/* AI Agent Chat Popup */}
      {activeTab !== 'agent' && (
        <AIAgentChat
          isOpen={chatOpen}
          onClose={() => { setChatOpen(false); setChatFullScreen(false); }}
          isFullScreen={chatFullScreen}
          onToggleFullScreen={() => setChatFullScreen(!chatFullScreen)}
        />
      )}
    </div>
  );
};

export default Index;

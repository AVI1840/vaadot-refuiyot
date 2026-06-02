import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import ChecklistTab from '@/components/ChecklistTab';
import DashboardTab from '@/components/DashboardTab';
import CaseTrackingTab from '@/components/CaseTrackingTab';
import InfoTab from '@/components/InfoTab';
import AgentTab from '@/components/AgentTab';
import DigitalTwin from '@/components/DigitalTwin';
import AIControlCenter from '@/components/AIControlCenter';
import LandingPage from '@/components/LandingPage';
import ROIDashboard from '@/components/ROIDashboard';
import ArchitectureView from '@/components/ArchitectureView';
import FeedbackModal from '@/components/FeedbackModal';
import { Bot } from 'lucide-react';

const Index = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('agent');

  // Landing page is the entry point
  if (view === 'landing') {
    return <LandingPage onStart={() => setView('app')} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main id="main-content" className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-6" role="main">
        {activeTab === 'agent' && <AgentTab />}
        {activeTab === 'twin' && <DigitalTwin />}
        {activeTab === 'ai-center' && <AIControlCenter />}
        {activeTab === 'roi' && <ROIDashboard />}
        {activeTab === 'arch' && <ArchitectureView />}
        {activeTab === 'checklist' && <ChecklistTab />}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'info' && <InfoTab />}
      </main>

      <AppFooter />
      <FeedbackModal />
    </div>
  );
};

export default Index;

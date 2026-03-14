import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import AboutTab from '@/components/AboutTab';
import ChecklistTab from '@/components/ChecklistTab';
import DashboardTab from '@/components/DashboardTab';
import CaseTrackingTab from '@/components/CaseTrackingTab';
import InfoTab from '@/components/InfoTab';
import FeedbackModal from '@/components/FeedbackModal';

const Index = () => {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main id="main-content" className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-6" role="main">
        {activeTab === 'about' && <AboutTab />}
        {activeTab === 'checklist' && <ChecklistTab />}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'tracking' && <CaseTrackingTab />}
        {activeTab === 'info' && <InfoTab />}
      </main>

      <AppFooter />
      <FeedbackModal />
    </div>
  );
};

export default Index;

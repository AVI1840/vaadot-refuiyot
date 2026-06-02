import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import AppShell from '@/components/AppShell';
import AgentTab from '@/components/AgentTab';
import DigitalTwin from '@/components/DigitalTwin';
import AIControlCenter from '@/components/AIControlCenter';
import ROIDashboard from '@/components/ROIDashboard';
import ArchitectureView from '@/components/ArchitectureView';
import ChecklistTab from '@/components/ChecklistTab';
import FeedbackModal from '@/components/FeedbackModal';

type View = 'landing' | 'agent' | 'twin' | 'ai' | 'roi' | 'arch' | 'checklist';

const Index = () => {
  const [view, setView] = useState<View>('landing');

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('agent')} />;
  }

  // App shell wraps all non-landing views
  return (
    <>
      <AppShell
        currentStep={view === 'agent' ? 1 : view === 'checklist' ? 2 : view === 'twin' ? 6 : view === 'ai' ? 5 : view === 'roi' ? 7 : 7}
        score={42}
        totalDocs={9}
        completedDocs={3}
        missingRequired={['סיכום אנדוקרינולוג', 'בדיקת HbA1c', 'בדיקת עיניים', 'מכתב רופא משפחה']}
        greenPathCount={3}
        conditions={['סוכרת סוג 2']}
      >
        <div className="max-w-[1000px] mx-auto">
          {/* Tab navigation inside content */}
          <nav className="flex gap-2 mb-8 flex-wrap">
            {([
              { id: 'agent' as View, label: '🤖 מסע התביעה' },
              { id: 'twin' as View, label: '🎯 תאום דיגיטלי' },
              { id: 'ai' as View, label: '🧠 מרכז AI' },
              { id: 'roi' as View, label: '📈 ROI' },
              { id: 'arch' as View, label: '☁️ ארכיטקטורה' },
              { id: 'checklist' as View, label: '📋 צ\'קליסט' },
            ]).map(tab => (
              <button key={tab.id} onClick={() => setView(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  view === tab.id
                    ? 'bg-[#003B7A] text-white shadow-sm'
                    : 'bg-white border text-muted-foreground hover:border-[#003B7A]/30 hover:text-foreground'
                }`}>
                {tab.label}
              </button>
            ))}
            <button onClick={() => setView('landing')}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-white border text-muted-foreground hover:text-foreground mr-auto">
              ← דף הבית
            </button>
          </nav>

          {/* Content */}
          {view === 'agent' && <AgentTab />}
          {view === 'twin' && <DigitalTwin />}
          {view === 'ai' && <AIControlCenter />}
          {view === 'roi' && <ROIDashboard />}
          {view === 'arch' && <ArchitectureView />}
          {view === 'checklist' && <ChecklistTab />}
        </div>
      </AppShell>
      <FeedbackModal />
    </>
  );
};

export default Index;

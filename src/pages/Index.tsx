import { useMemo, useState } from 'react';
import AppShell from '@/components/premium/AppShell';
import LandingScreen from '@/components/screens/LandingScreen';
import IntakeChatScreen from '@/components/screens/IntakeChatScreen';
import ChecklistScreen from '@/components/screens/ChecklistScreen';
import UploadScreen from '@/components/screens/UploadScreen';
import AIControlCenterScreen from '@/components/screens/AIControlCenterScreen';
import ReadinessDashboardScreen from '@/components/screens/ReadinessDashboardScreen';
import CommitteePrepScreen from '@/components/screens/CommitteePrepScreen';
import ActionPlanScreen from '@/components/screens/ActionPlanScreen';
import BL283Screen from '@/components/screens/BL283Screen';
import DigitalTwinScreen from '@/components/screens/DigitalTwinScreen';
import ROIDashboardScreen from '@/components/screens/ROIDashboardScreen';
import ArchitectureScreen from '@/components/screens/ArchitectureScreen';
import AppFooter from '@/components/AppFooter';
import FeedbackModal from '@/components/FeedbackModal';

type StepId = 'landing' | 'intake' | 'checklist' | 'upload' | 'ai' | 'readiness' | 'submit';

const STEPS: { id: StepId; label: string }[] = [
  { id: 'landing',   label: 'דף הבית' },
  { id: 'intake',    label: 'שיחה' },
  { id: 'checklist', label: 'צ׳קליסט' },
  { id: 'upload',    label: 'העלאה' },
  { id: 'ai',        label: 'AI Center' },
  { id: 'readiness', label: 'מוכנות' },
  { id: 'submit',    label: 'הגשה' },
];

const SECONDARY: { id: 'digital-twin' | 'roi' | 'arch' | 'action-plan' | 'bl283'; label: string }[] = [
  { id: 'action-plan',  label: 'תוכנית פעולה' },
  { id: 'bl283',        label: 'טופס BL/283' },
  { id: 'digital-twin', label: 'Digital Twin' },
  { id: 'roi',          label: 'ROI · Executive' },
  { id: 'arch',         label: 'Architecture' },
];

const SCORE_BY_STEP: Record<string, number> = {
  landing: 42,
  intake: 48,
  checklist: 56,
  upload: 71,
  ai: 84,
  readiness: 84,
  submit: 84,
  'action-plan': 56,
  bl283: 56,
  'digital-twin': 81,
  roi: 84,
  arch: 84,
};

const Index = () => {
  const [active, setActive] = useState<string>('landing');
  const completed = useMemo(() => {
    const idx = STEPS.findIndex((s) => s.id === active);
    return idx > 0 ? STEPS.slice(0, idx).map((s) => s.id) : [];
  }, [active]);

  const score = SCORE_BY_STEP[active] ?? 42;
  const delta = `+${Math.max(0, score - 42)}%`;

  return (
    <div className="min-h-screen font-heebo">
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>

      <AppShell
        steps={STEPS}
        activeStepId={STEPS.some((s) => s.id === active) ? active : 'ai'}
        onStepChange={setActive}
        completedIds={completed}
        score={score}
        scoreDelta={delta}
        sidebarExtra={<SecondaryNav active={active} onSelect={setActive} />}
      >
        <div id="main-content">
          {active === 'landing'   && <LandingScreen onCta={() => setActive('intake')} />}
          {active === 'intake'    && <IntakeChatScreen />}
          {active === 'checklist' && <ChecklistScreen />}
          {active === 'upload'    && <UploadScreen />}
          {active === 'ai'        && <AIControlCenterScreen />}
          {active === 'readiness' && <ReadinessDashboardScreen />}
          {active === 'submit'      && <CommitteePrepScreen />}
          {active === 'action-plan' && <ActionPlanScreen />}
          {active === 'bl283'       && <BL283Screen />}
          {active === 'digital-twin' && <DigitalTwinScreen />}
          {active === 'roi'         && <ROIDashboardScreen />}
          {active === 'arch'        && <ArchitectureScreen />}
        </div>
      </AppShell>

      <AppFooter />
      <FeedbackModal />
    </div>
  );
};

function SecondaryNav({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
      <div className="text-eyebrow text-white/55 mb-2 px-1">תצוגות נוספות</div>
      <div className="space-y-1">
        {SECONDARY.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={
                'w-full text-right rounded-lg px-3 py-2 text-sm font-semibold transition ' +
                (isActive ? 'bg-accent text-accent-foreground' : 'text-white/80 hover:bg-white/10')
              }
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Index;

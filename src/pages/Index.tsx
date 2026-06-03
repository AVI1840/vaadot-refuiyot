import { useCallback, useEffect, useMemo, useState } from 'react';
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
import SuccessScreen from '@/components/screens/SuccessScreen';
import AppFooter from '@/components/AppFooter';
import FeedbackModal from '@/components/FeedbackModal';
import { Play, Pause, Sparkles } from 'lucide-react';

type StepId = 'landing' | 'intake' | 'checklist' | 'upload' | 'ai' | 'readiness' | 'submit' | 'success';

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
  landing: 42, intake: 48, checklist: 56, upload: 71,
  ai: 84, readiness: 84, submit: 84, success: 93,
  'action-plan': 56, bl283: 56,
  'digital-twin': 81, roi: 84, arch: 84,
};

// Demo auto-advance intervals (ms per screen)
const DEMO_INTERVALS: Partial<Record<string, number>> = {
  landing: 4000, intake: 6000, checklist: 5000,
  upload: 5000, ai: 6000, readiness: 5000, submit: 5000,
};

const MAIN_STEP_IDS = STEPS.map((s) => s.id);

const Index = () => {
  const [active, setActive] = useState<string>('landing');
  const [demoMode, setDemoMode] = useState(false);

  const completed = useMemo(() => {
    const idx = STEPS.findIndex((s) => s.id === active);
    return idx > 0 ? STEPS.slice(0, idx).map((s) => s.id) : [];
  }, [active]);

  const score = SCORE_BY_STEP[active] ?? 42;
  const delta = `+${Math.max(0, score - 42)}%`;

  // Go to next main step
  const goNext = useCallback(() => {
    const idx = MAIN_STEP_IDS.indexOf(active as StepId);
    if (idx >= 0 && idx < MAIN_STEP_IDS.length - 1) {
      setActive(MAIN_STEP_IDS[idx + 1]);
    } else if (active === 'submit') {
      setActive('success');
    }
  }, [active]);

  // Demo mode auto-advance
  useEffect(() => {
    if (!demoMode) return;
    const delay = DEMO_INTERVALS[active] ?? 4000;
    const t = setTimeout(() => {
      const nextIdx = MAIN_STEP_IDS.indexOf(active as StepId);
      if (nextIdx >= 0 && nextIdx < MAIN_STEP_IDS.length - 1) {
        setActive(MAIN_STEP_IDS[nextIdx + 1]);
      } else if (active === 'submit') {
        setActive('success');
        setTimeout(() => {
          setActive('landing');
          setDemoMode(false);
        }, 5000);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [demoMode, active]);

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
        <div id="main-content" key={active} className="animate-fade-in">
          {active === 'landing'      && <LandingScreen     onCta={goNext} />}
          {active === 'intake'       && <IntakeChatScreen  onNext={goNext} />}
          {active === 'checklist'    && <ChecklistScreen   onNext={goNext} />}
          {active === 'upload'       && <UploadScreen      onNext={goNext} />}
          {active === 'ai'           && <AIControlCenterScreen onNext={goNext} />}
          {active === 'readiness'    && <ReadinessDashboardScreen onNext={goNext} />}
          {active === 'submit'       && <CommitteePrepScreen    onNext={goNext} />}
          {active === 'success'      && <SuccessScreen onRestart={() => setActive('landing')} />}
          {active === 'action-plan'  && <ActionPlanScreen  onNext={() => setActive('checklist')} />}
          {active === 'bl283'        && <BL283Screen       onNext={() => setActive('checklist')} />}
          {active === 'digital-twin' && <DigitalTwinScreen />}
          {active === 'roi'          && <ROIDashboardScreen />}
          {active === 'arch'         && <ArchitectureScreen />}
        </div>
      </AppShell>

      <AppFooter />
      <FeedbackModal />

      {/* ── Demo Mode FAB ─────────────────────────────────────────── */}
      <DemoFab active={demoMode} onToggle={() => {
        if (!demoMode) setActive('landing');
        setDemoMode((v) => !v);
      }} />
    </div>
  );
};

/* ── Demo Mode floating button ──────────────────────────────────── */
function DemoFab({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={
        'fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold shadow-floating transition-all ' +
        (active
          ? 'bg-destructive text-white hover:bg-destructive/90'
          : 'bg-primary text-white hover:bg-primary/90')
      }
      title="הדגמה אוטומטית לשופטים"
    >
      {active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      {active ? 'עצור הדגמה' : 'הדגמה לשופטים'}
      {!active && <Sparkles className="h-3.5 w-3.5 text-accent" />}
    </button>
  );
}

/* ── Secondary nav ──────────────────────────────────────────────── */
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

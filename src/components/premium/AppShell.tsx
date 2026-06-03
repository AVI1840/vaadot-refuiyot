import { ReactNode } from 'react';
import { Bot, LifeBuoy, Sparkles, FileCheck2, FileWarning, Clock, TrendingUp } from 'lucide-react';
import ScoreGauge from './ScoreGauge';
import { SidebarCard, SidebarStat } from './SidebarCard';
import { AIBadge, AIPulseDot } from './AIPulse';
import StepperHeader, { Step } from './StepperHeader';
import { cn } from '@/lib/utils';

type Props = {
  steps: Step[];
  activeStepId: string;
  onStepChange: (id: string) => void;
  completedIds?: string[];
  score: number;
  scoreLabel?: string;
  scoreDelta?: string;
  children: ReactNode;
  sidebarExtra?: ReactNode;
};

export default function AppShell({
  steps,
  activeStepId,
  onStepChange,
  completedIds = [],
  score,
  scoreLabel = 'ציון מוכנות',
  scoreDelta,
  children,
  sidebarExtra,
}: Props) {
  return (
    <div className="min-h-screen bg-canvas-grad" dir="rtl">
      {/* ── Top header — sticky, backdrop-blur ──────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b hairline shadow-soft">
        <div className="flex items-center gap-4 px-4 lg:px-6 h-16">
          {/* Brand mark */}
          <BrandMark />

          {/* Vertical divider */}
          <div className="h-8 w-px bg-slate-200 shrink-0" />

          {/* Stepper — grows to fill remaining space, scrollable */}
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
            <StepperHeader
              steps={steps}
              activeId={activeStepId}
              onSelect={onStepChange}
              completedIds={completedIds}
            />
          </div>

          {/* Right slot: score pill + AWS badge */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <ScorePill score={score} />
            <div className="hidden lg:block">
              <AwsBadge />
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      {/*
        NOTE: DOM order is [main, aside].
        In RTL flex (dir="rtl"), the first child is positioned on the RIGHT,
        the last child on the LEFT. So:
          - <main> → RIGHT side (content area)
          - <aside> → LEFT side (sidebar)
        This matches the design: sidebar on the left, content on the right.
      */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main canvas — RIGHT in RTL */}
        <main className="flex-1 min-w-0 px-5 lg:px-8 py-6 lg:py-8 overflow-x-hidden">
          <div id="main-content">{children}</div>
        </main>

        {/* Sidebar — LEFT in RTL (last child in RTL flex) */}
        <aside
          className={cn(
            'hidden lg:flex flex-col w-72 xl:w-80 shrink-0 sticky top-16',
            'self-start max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide',
            'bg-sidebar-grad text-sidebar-foreground',
            'border-s border-white/8',
          )}
        >
          <SidebarContent
            score={score}
            scoreLabel={scoreLabel}
            scoreDelta={scoreDelta}
            extra={sidebarExtra}
          />
        </aside>
      </div>
    </div>
  );
}

/* ─── Score pill ──────────────────────────────────────────────────── */
function ScorePill({ score }: { score: number }) {
  const colorClass =
    score >= 75
      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
      : score >= 50
        ? 'bg-blue-50 border-blue-200 text-blue-700'
        : 'bg-amber-50 border-amber-200 text-amber-700';

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 shadow-soft text-xs font-bold',
        colorClass,
      )}
    >
      <span className="text-[10px] font-semibold opacity-70">ציון:</span>
      <span className="text-num font-extrabold">{score}%</span>
    </div>
  );
}

/* ─── Sidebar content ─────────────────────────────────────────────── */
function SidebarContent({
  score,
  scoreLabel,
  scoreDelta,
  extra,
}: {
  score: number;
  scoreLabel: string;
  scoreDelta?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 flex-1">

      {/* ── Score gauge card ── */}
      <div className="rounded-2xl bg-white/6 border border-white/10 p-5 text-center">
        <div className="text-eyebrow text-white/50 mb-3 tracking-widest">{scoreLabel}</div>
        <div className="flex justify-center">
          <ScoreGauge
            value={score}
            size={144}
            stroke={13}
            variant={score >= 75 ? 'green' : score >= 50 ? 'blue' : 'gold'}
          />
        </div>
        {scoreDelta && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/15 border border-success/25 px-3 py-1.5">
            <TrendingUp className="h-3 w-3 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-emerald-400 text-num">{scoreDelta}</span>
            <span className="text-[10px] text-white/45">מתחילת התהליך</span>
          </div>
        )}
      </div>

      {/* ── Document status card ── */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="text-eyebrow text-white/50 mb-3 flex items-center gap-1.5">
          <FileCheck2 className="h-3 w-3 opacity-70" />
          סטטוס מסמכים
        </div>
        <SidebarStat label="הושלמו"  value="12" variant="green" hint="מסמכים שאושרו" />
        <SidebarStat label="חסרים"   value="4"  variant="red"   hint="נדרשים לוועדה" />
        <SidebarStat label="בבדיקה"  value="2"  variant="gold"  hint="עיבוד AI פעיל" />
      </div>

      {/* ── AI Agent card ── */}
      <div className="rounded-2xl bg-gradient-to-br from-accent/18 to-accent/5 border border-accent/25 p-4">
        <div className="flex items-center justify-between mb-3">
          <AIBadge />
          <Sparkles className="h-4 w-4 text-accent opacity-80" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-accent/20 border border-accent/30 grid place-items-center shrink-0">
            <Bot className="h-5 w-5 text-accent" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-white leading-tight">AI Agent</div>
            <div className="text-[11px] text-white/60 flex items-center gap-1.5 mt-0.5">
              <AIPulseDot />
              <span>ניתוח התיק שלך…</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full w-[68%] bg-gradient-to-r from-accent/60 to-accent rounded-full"
            style={{ transition: 'width 0.6s ease' }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/45">
          <span>68% הושלם</span>
          <span className="text-accent font-bold text-num">94% confidence</span>
        </div>

        <button className="mt-3 w-full rounded-xl bg-white/92 text-primary text-sm font-bold py-2.5 hover:bg-white transition-all shadow-soft hover:shadow-card active:scale-[0.98]">
          שאל את ה-AI
        </button>
      </div>

      {/* ── Help card ── */}
      <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <LifeBuoy className="h-4 w-4 text-secondary shrink-0" />
          <span className="text-sm font-bold text-white/90">צריך עזרה?</span>
        </div>
        <p className="text-[11px] text-white/55 leading-relaxed">
          נציג שירות זמין בצ׳אט — בדרך כלל עונה תוך 2 דקות.
        </p>
        <button className="mt-3 w-full rounded-xl border border-white/15 text-white/80 text-xs font-semibold py-2 hover:bg-white/8 hover:text-white/95 transition-all active:scale-[0.98]">
          פתח שיחה
        </button>
      </div>

      {/* ── Secondary nav slot (from sidebarExtra prop) ── */}
      {extra}

      {/* ── Footer ── */}
      <div className="mt-auto pt-4 border-t border-white/8 text-[10px] text-white/30 text-center leading-relaxed">
        תביעה ביום v2.0<br />
        <span className="text-white/20">Amazon Bedrock · Claude · Textract</span>
      </div>
    </div>
  );
}

/* ─── Brand mark ─────────────────────────────────────────────────── */
function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      {/* Square "בל" logo */}
      <div className="h-9 w-9 rounded-xl bg-primary shadow-card grid place-items-center">
        <span className="text-white font-extrabold text-sm leading-none select-none">בל</span>
      </div>
      <div className="leading-none">
        <div className="text-[15px] font-extrabold tracking-tight text-primary">תביעה ביום</div>
        <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
          AI Copilot · ביטוח לאומי
        </div>
      </div>
    </div>
  );
}

/* ─── Exported sub-components ────────────────────────────────────── */
export function AwsBadge() {
  return (
    <div className="flex items-center gap-1.5 rounded-full border hairline bg-white px-2.5 py-1.5 shadow-soft">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Built on</span>
      <span className="text-[11px] font-extrabold text-[#FF9900] tracking-tight">aws</span>
      <span className="h-3 w-px bg-slate-200" />
      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Bedrock</span>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { TrendingDown, TrendingUp, Clock, DollarSign, FileX, Users, Star, ArrowRight, Sparkles, BarChart3, Bot, Zap, Brain, CheckCircle2 } from 'lucide-react';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import { AIPulseDot, AIBadge } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';

const KPIS = [
  { icon: DollarSign, label: 'חיסכון תפעולי שנתי',   value: '₪42M',    delta: '+34% YoY', color: 'text-success',   bg: 'bg-success/10 border-success/25',   glow: 'shadow-[0_0_20px_hsl(152_76%_36%/0.18)]' },
  { icon: Clock,      label: 'קיצור זמן המתנה',        value: '-51%',    delta: '73→36 ימים', color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/25', glow: 'shadow-[0_0_20px_hsl(217_91%_56%/0.18)]' },
  { icon: FileX,      label: 'ירידה במסמכים חסרים',   value: '-80%',    delta: '4.6→0.9',  color: 'text-accent',    bg: 'bg-accent/10 border-accent/25',     glow: 'shadow-[0_0_20px_hsl(38_92%_50%/0.18)]' },
  { icon: Star,       label: 'שביעות רצון מועמדים',   value: '4.7★',    delta: '+0.9',     color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200',      glow: '' },
];

const FUNNEL = [
  { label: 'תיקים שהוגשו',          n: 18204, pct: 100 },
  { label: 'עברו טריאז׳ AI',        n: 17891, pct: 98  },
  { label: 'תיק מלא במפגש ראשון',   n: 14721, pct: 81  },
  { label: 'אושרו בוועדה',          n: 12842, pct: 71  },
  { label: 'אישור מהיר (<30 ימים)',  n: 9416,  pct: 52  },
];

// Cumulative ₪M savings per month (Jan–Dec 2026)
const SAVINGS_MONTHS = [1.2, 2.8, 4.5, 6.9, 9.4, 12.1, 15.3, 19.0, 23.5, 28.8, 35.1, 42.0];
const MONTH_LABELS = ['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];

const BEFORE_AFTER = [
  { label: 'זמן ממוצע לוועדה',     before: '73 ימים',   after: '36 ימים',  pct: -51, icon: Clock },
  { label: 'מסמכים חסרים פר תיק', before: '4.6',        after: '0.9',      pct: -80, icon: FileX },
  { label: 'ועדות חוזרות',         before: '38%',        after: '11%',      pct: -71, icon: Users },
  { label: 'זמן טיפול פר תיק',    before: '9.4 שעות',   after: '3.9 שעות', pct: -58, icon: BarChart3 },
];

export default function ROIDashboardScreen() {
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">

      {/* ── 1. DARK HERO with massive 3.8x ─────────────────────────────── */}
      <PremiumCard variant="dark" className="relative overflow-hidden p-0">
        <div className="absolute inset-0 grid-bg opacity-[0.05] pointer-events-none" />
        {/* ambient glows */}
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-32 -bottom-20 h-64 w-64 rounded-full bg-secondary/12 blur-3xl pointer-events-none" />

        <div className="relative p-8 lg:p-10">
          {/* Top row: eyebrow + AI badge */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-eyebrow text-white/75">ROI Dashboard · Executive</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 border border-accent/30 px-3 py-1.5">
              <AIPulseDot />
              <span className="text-[11px] font-bold text-accent tracking-wide">AI Copilot · פעיל</span>
            </div>
          </div>

          {/* Main hero layout: left text + centered 3.8x + right stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: title & subtitle */}
            <div className="lg:col-span-1">
              <h1 className="text-hero text-white leading-tight mb-3">
                מדדי השפעה<br />ופעילות הארגון
              </h1>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                תצוגת הנהלה — ההשפעה של AI Copilot על תיקי הוועדות הרפואיות, שנת 2026.
              </p>
            </div>

            {/* Center: MASSIVE 3.8x ROI */}
            <div className="lg:col-span-1 flex flex-col items-center text-center">
              <div className="text-eyebrow text-white/45 mb-2">ROI Index · Q2 2026</div>
              <div
                className="text-num font-extrabold text-accent leading-none select-none animate-scale-in"
                style={{ fontSize: 'clamp(80px, 12vw, 128px)', textShadow: '0 0 60px hsl(38 92% 50% / 0.45)' }}
              >
                3.8x
              </div>
              <div className="mt-3 flex items-center gap-2 justify-center">
                <span className="text-emerald-400 font-bold text-lg text-num">+82%</span>
                <span className="text-white/45 text-sm">vs Q2 2025</span>
              </div>
              <div className="mt-2 text-white/35 text-xs">על בסיס ₪42M חיסכון שנתי</div>
            </div>

            {/* Right: AI attribution callout */}
            <div className="lg:col-span-1 flex flex-col gap-3">
              <div className="rounded-2xl bg-white/6 border border-white/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-accent/20 grid place-items-center shrink-0">
                    <Bot className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-xs font-bold text-white/70">AI עשה את זה</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { icon: Brain,       text: 'ניתח 17,891 תיקים' },
                    { icon: Zap,         text: 'חסך 34 ימים ממוצע' },
                    { icon: CheckCircle2,text: 'אפס 80% מסמכים חסרים' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-white/55 text-xs">
                      <Icon className="h-3 w-3 text-accent shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PremiumCard>

      {/* ── 2. BEFORE / AFTER — the killer proof point ─────────────────── */}
      <PremiumCard className="p-6 border-2 border-success/20 bg-gradient-to-br from-white to-success/3">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <CardEyebrow color="green">Before / After · הוכחה</CardEyebrow>
            <h2 className="mt-1.5 text-slate-900">מה השתנה מאז השקת ה-Copilot</h2>
          </div>
          <div className="text-xs text-muted-foreground font-semibold bg-slate-100 rounded-full px-3 py-1">
            מדידה שנתית · Q2 2025 → Q2 2026
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {BEFORE_AFTER.map((b) => <BeforeAfterCard key={b.label} {...b} />)}
        </div>
      </PremiumCard>

      {/* ── 3. KPI TILES ────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((k) => (
          <PremiumCard
            key={k.label}
            className={cn('p-5 border hover:-translate-y-1 transition-all duration-200', k.bg, k.glow)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn('h-10 w-10 rounded-xl grid place-items-center border', k.bg)}>
                <k.icon className={cn('h-5 w-5', k.color)} />
              </div>
              <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-md border text-num', k.bg, k.color)}>
                {k.delta}
              </span>
            </div>
            <div className={cn('text-3xl font-extrabold text-num leading-none', k.color)}>{k.value}</div>
            <div className="text-xs text-muted-foreground mt-1.5 leading-snug">{k.label}</div>
          </PremiumCard>
        ))}
      </section>

      {/* ── 4. CITIZEN SPOTLIGHT QUOTE ──────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-l from-secondary to-primary p-[1px]">
        <div className="rounded-2xl bg-white px-8 py-6 flex items-center gap-6 flex-wrap">
          <div className="h-14 w-14 rounded-full bg-secondary/10 border-2 border-secondary/25 grid place-items-center shrink-0">
            <span className="text-2xl font-extrabold text-secondary">י</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-amber-400 text-base mb-1">★★★★★</div>
            <blockquote className="text-lg font-semibold text-slate-800 leading-snug">
              "הגשתי בלי לצאת מהבית. אישור הגיע ב-19 ימים במקום 3 חודשים."
            </blockquote>
            <div className="mt-2 text-sm font-bold text-slate-500">י. מימון · אזרח</div>
          </div>
          <div className="shrink-0 text-center">
            <div className="text-5xl font-extrabold text-num text-secondary leading-none">19</div>
            <div className="text-xs text-muted-foreground font-semibold mt-0.5">ימים בלבד</div>
            <div className="text-[10px] text-muted-foreground line-through mt-0.5">3 חודשים</div>
          </div>
        </div>
      </div>

      {/* ── 5. CHART + FUNNEL ───────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <PremiumCard className="p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardEyebrow color="green">חיסכון מצטבר · 2026</CardEyebrow>
              <h2 className="mt-1.5">₪M חסך ה-AI חודש אחר חודש</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/8 border border-success/20 rounded-full px-3 py-1">
              <TrendingUp className="h-3.5 w-3.5" /> ₪42M בדצמבר
            </div>
          </div>
          <SavingsChart values={SAVINGS_MONTHS} labels={MONTH_LABELS} />
        </PremiumCard>

        <PremiumCard className="p-6 lg:col-span-2">
          <CardEyebrow color="gold">Funnel · 2026</CardEyebrow>
          <h2 className="mt-1.5 mb-4">משפך התיק</h2>
          <div className="space-y-3.5">
            {FUNNEL.map((f, i) => <FunnelRow key={f.label} {...f} first={i === 0} />)}
          </div>
        </PremiumCard>
      </section>

      {/* ── 6. TESTIMONIALS ─────────────────────────────────────────────── */}
      <PremiumCard className="p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <CardEyebrow color="blue">קולות מהשטח</CardEyebrow>
            <h2 className="mt-1.5">מה אומרים המשתמשים</h2>
          </div>
          <div className="text-xs text-muted-foreground font-semibold bg-slate-100 rounded-full px-3 py-1">
            4.7/5 · 1,284 ביקורות
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              who: 'ד״ר ר. כהן · רופאת ועדה',
              text: 'מגיעה לוועדה עם תיק מסודר — חוסך לי שעתיים בכל מפגש.',
              initial: 'ד',
              color: 'text-secondary bg-secondary/10 border-secondary/20',
            },
            {
              who: 'א. לוי · עו״ס מתאמת',
              text: 'הירידה במסמכים חסרים שינתה את קצב כל המחלקה.',
              initial: 'א',
              color: 'text-accent bg-accent/10 border-accent/20',
            },
            {
              who: 'י. מימון · אזרח',
              text: 'הגשתי בלי לצאת מהבית. אישור הגיע ב-19 ימים במקום 3 חודשים.',
              initial: 'י',
              color: 'text-success bg-success/10 border-success/20',
            },
          ].map(({ who, text, initial, color }) => (
            <div key={who} className="rounded-xl border hairline bg-white p-5 hover:-translate-y-0.5 hover:shadow-card transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('h-9 w-9 rounded-full border-2 grid place-items-center shrink-0 text-base font-extrabold', color)}>
                  {initial}
                </div>
                <div className="text-amber-400 text-sm">★★★★★</div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">"{text}"</p>
              <div className="mt-3 text-xs font-bold text-slate-500">{who}</div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function SavingsChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values);
  const W = 800, H = 180;
  const step = W / (values.length - 1);
  const pts = values.map((v, i) => [i * step, H - (v / max) * H * 0.88] as [number, number]);
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const area = `${line} L${W},${H} L0,${H} Z`;
  const lastPt = pts[pts.length - 1];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '148px' }}>
        <defs>
          <linearGradient id="savings-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(152 76% 36%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(152 76% 36%)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#savings-grad)" />
        <path d={line} fill="none" stroke="hsl(152 76% 36%)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 6 : 2.5} fill="white" stroke="hsl(152 76% 36%)" strokeWidth={2} />
        ))}
        {/* Final value label */}
        <text x={lastPt[0] - 4} y={lastPt[1] - 14} textAnchor="middle" fontSize="13" fontWeight="800" fill="hsl(152 76% 36%)">₪42M</text>
      </svg>
      <div className="grid grid-cols-12 gap-1 mt-1">
        {labels.map((m) => <span key={m} className="text-[9px] text-slate-400 font-bold text-center">{m}</span>)}
      </div>
    </div>
  );
}

function FunnelRow({ label, n, pct, first }: { label: string; n: number; pct: number; first?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-extrabold text-num text-slate-900">{n.toLocaleString('he-IL')}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={cn('h-full rounded-full', first ? 'bg-primary' : 'bg-gradient-to-l from-secondary to-secondary/60')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-0.5 text-[10px] text-muted-foreground font-semibold text-num">{pct}%</div>
    </div>
  );
}

function BeforeAfterCard({ label, before, after, pct, icon: Icon }: { label: string; before: string; after: string; pct: number; icon: React.ComponentType<{ className?: string }> }) {
  const isImprovement = pct < 0;
  return (
    <div className="rounded-xl border-2 border-success/15 bg-gradient-to-br from-white to-success/4 p-5 hover:-translate-y-1 hover:shadow-card transition-all duration-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-success/10 border border-success/20 grid place-items-center">
          <Icon className="h-4 w-4 text-success" />
        </div>
        <div className="text-xs font-bold text-slate-600 leading-snug">{label}</div>
      </div>

      {/* Before row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold text-slate-400 w-7 shrink-0">לפני</span>
        <span className="text-base font-bold text-slate-400 line-through text-num">{before}</span>
      </div>

      {/* Arrow */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7" />
        <div className="h-5 w-[2px] bg-success/30 mr-2" />
        <div className="h-2 w-2 border-b-2 border-l-2 border-success/50 rotate-[-45deg] -mt-1" />
      </div>

      {/* After row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold text-success w-7 shrink-0">אחרי</span>
        <span className="text-2xl font-extrabold text-success text-num leading-none">{after}</span>
      </div>

      {/* Delta badge */}
      <div className="inline-flex items-center gap-1 text-xs font-extrabold text-success bg-success/10 border border-success/25 rounded-full px-3 py-1">
        <TrendingDown className="h-3.5 w-3.5" />
        <span>{Math.abs(pct)}% שיפור</span>
      </div>
    </div>
  );
}

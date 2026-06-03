import { Bot, Sparkles, ArrowLeft, FileSearch, FileCheck2, AlertTriangle, ShieldCheck, Activity, Brain, Clock, Cpu, Zap, TrendingUp, CheckCircle2, Users, Calendar } from 'lucide-react';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import ScoreGauge from '@/components/premium/ScoreGauge';
import { AIPulseDot, AIPulseRing } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

/* ── Data ─────────────────────────────────────────────────────────── */
const ACTIVITY = [
  { time: '12:42:08', who: 'Bedrock · Claude',  text: 'מצליב OCR מ"חוות דעת נוירולוג" מול קריטריוני 11.4 — פרק נכות עצבי', tone: 'blue'  as const, live: true },
  { time: '12:42:01', who: 'Vision OCR',         text: 'זוהה תאריך בדיקה: 04/2026 — עדכני וחוקי לפי דרישות', tone: 'green' as const },
  { time: '12:41:55', who: 'מאמת',               text: '⚠ BL/283 — חסרה חתימת רופא מומחה בעמוד 2', tone: 'gold'  as const },
  { time: '12:41:32', who: 'Knowledge Graph',    text: 'חיבור ICD-G35 → דרישות מומחה נוירולוג → 3 מסמכים נדרשים', tone: 'blue'  as const },
  { time: '12:40:58', who: 'Bedrock · Claude',   text: 'המלצה: לבקש תוצאות EMG מ-2025 לחיזוי +9%', tone: 'gold'  as const },
  { time: '12:40:11', who: 'Textract',           text: '12 עמודים עובדו ב-3.4 שניות · 99.1% דיוק OCR', tone: 'green' as const },
];

const SKILLS = [
  { icon: FileSearch,    label: 'סיווג מסמכים',  detail: 'מגדיר ומסווג לפי סוג',          pct: 94,  tone: 'blue'  as const },
  { icon: FileCheck2,    label: 'הצלבת קריטריונים', detail: 'מצליב מול תקנות הוועדה',     pct: 78,  tone: 'gold'  as const },
  { icon: ShieldCheck,   label: 'בדיקת זכאות',   detail: 'לפי תקנות שר הביטחון',          pct: 100, tone: 'green' as const },
  { icon: AlertTriangle, label: 'גילוי פערים',    detail: 'מזהה חוסרים ואזהרות',           pct: 82,  tone: 'gold'  as const },
];

const REASONING = [
  {
    step: '1',
    icon: Brain,
    title: 'זיהוי אבחנה ראשית',
    confidence: 97,
    body: 'ICD-10: G35 (טרשת נפוצה) זוהתה מ-3 מקורות עצמאיים: חוות דעת נוירולוג, דוח MRI, וסיכום אשפוז. ההתאמה בין המקורות חזקה.',
    badge: 'מאומת · 3 מקורות',
    tone: 'blue' as const,
  },
  {
    step: '2',
    icon: FileCheck2,
    title: 'בדיקת עמידה בקריטריונים',
    confidence: 78,
    body: '13 מתוך 16 קריטריוני תקנה 35 מתועדים. חסרים: תוצאות EMG, הצהרת מעסיק, סיכום שיקום עדכני — שלושה מסמכים שניתן לצרף.',
    badge: 'חלקי · 3 פריטים חסרים',
    tone: 'gold' as const,
  },
  {
    step: '3',
    icon: TrendingUp,
    title: 'חיזוי החלטת ועדה',
    confidence: 84,
    body: 'סבירות 84% לאישור בשיעור נכות 50%+ — בתנאי שהמסמכים החסרים יצורפו לפני מועד הוועדה. ללא המסמכים: 51%.',
    badge: '84% סבירות אישור',
    tone: 'green' as const,
  },
];

/* ── Animated counter hook ────────────────────────────────────────── */
function useCountUp(target: number, duration = 1200, delay = 400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

/* ── Live typing hook ─────────────────────────────────────────────── */
function useLiveTyping(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);
  useEffect(() => {
    if (!active) { setDisplayed(text); return; }
    setDisplayed('');
    idx.current = 0;
    const interval = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [text, active]);
  return displayed;
}

/* ── Animated progress bar ────────────────────────────────────────── */
function AnimatedBar({ pct, tone }: { pct: number; tone: 'blue' | 'green' | 'gold' }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);
  const barColor = pct === 100 ? 'bg-success' : tone === 'blue' ? 'bg-secondary' : tone === 'green' ? 'bg-success' : 'bg-amber-500';
  return (
    <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-1000 ease-out', barColor)}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────── */
export default function AIControlCenterScreen() {
  const scoreValue = useCountUp(84, 1400, 300);
  const deltaValue = useCountUp(42, 1200, 600);

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">

      {/* ═══════════════════════════════════════════════════════════════
          HERO — Dark operations band
      ═══════════════════════════════════════════════════════════════ */}
      <PremiumCard variant="dark" className="relative overflow-hidden p-0">
        {/* Ambient glows */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-[0.04] pointer-events-none" />

        <div className="relative p-6 lg:p-8">

          {/* ── Citizen persona strip ───────────────────────────── */}
          <div className="flex flex-wrap items-center gap-3 mb-5 rounded-xl bg-white/6 border border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Users className="h-4 w-4 text-accent shrink-0" />
              <span className="font-semibold text-white">ישראל ישראלי</span>
              <span className="text-white/40">·</span>
              <span>טרשת נפוצה (G35)</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm mr-auto">
              <Calendar className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span>217 ימים בתהליך</span>
              <span className="text-white/40">·</span>
              <span className="text-emerald-400 font-semibold">ועדה: 12/06/2026</span>
            </div>
          </div>

          {/* ── Title row + Score ───────────────────────────────── */}
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span className="text-eyebrow text-white/80">AI Orchestration · זמן אמת</span>
              </div>
              <h1 className="text-hero text-white leading-tight">
                מרכז שליטה — <span className="text-accent">AI Copilot</span>
              </h1>
              <p className="mt-2 text-white/60 max-w-lg text-sm leading-relaxed">
                שקיפות מלאה לתהליך ה-AI — ראה כל פעולה, כל הנמקה, כל המלצה בזמן אמת. אין קופסה שחורה.
              </p>
            </div>

            {/* Score gauge — visual anchor */}
            <div className="rounded-2xl bg-white/8 border border-white/12 p-5 text-center shrink-0 min-w-[160px]">
              <div className="text-eyebrow text-white/50 mb-2">ציון תיק · עכשיו</div>
              <ScoreGauge value={scoreValue} size={130} stroke={12} variant="green" />
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-extrabold text-num text-sm">
                  +{deltaValue} נקודות היום
                </span>
              </div>
              <div className="text-[10px] text-white/35 mt-0.5">לפני: 42% → עכשיו: 84%</div>
            </div>
          </div>

          {/* ── Active task bar ─────────────────────────────────── */}
          <div className="mt-5 rounded-xl bg-white/8 border border-white/10 p-3.5 flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="h-11 w-11 rounded-xl bg-accent/90 grid place-items-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1">
                <AIPulseRing size="sm" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">פועל כעת</span>
                <AIPulseDot />
              </div>
              <div className="text-sm font-bold text-white">
                ניתוח חוות דעת נוירולוג · עמוד 4 מתוך 12 — קריטריון 11.4
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all"
                  style={{ width: '34%' }} />
              </div>
            </div>
            <div className="text-center shrink-0 bg-emerald-500/15 border border-emerald-500/25 rounded-lg px-3 py-2">
              <div className="text-lg font-extrabold text-emerald-400 text-num leading-none">94%</div>
              <div className="text-[9px] text-emerald-400/70 mt-0.5 font-medium">ביטחון</div>
            </div>
          </div>

          {/* ── KPI row ─────────────────────────────────────────── */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: TrendingUp, label: 'ציון תיק', value: `${scoreValue}%`, sub: `+${deltaValue} מ-09:14`, color: 'text-emerald-400' },
              { icon: Zap,        label: 'ביטחון Copilot', value: '94%',  sub: 'Claude Sonnet 4', color: 'text-secondary' },
              { icon: Cpu,        label: 'מסמכים שנסרקו', value: '12',   sub: 'מתוך 14',          color: 'text-amber-400' },
              { icon: Clock,      label: 'זמן ריצה',       value: '4:23', sub: 'דקות · שניות',    color: 'text-white/80' },
            ].map((k) => (
              <div key={k.label} className="rounded-xl bg-white/6 border border-white/10 p-3 text-center">
                <div className={cn('text-2xl font-extrabold text-num leading-none', k.color)}>{k.value}</div>
                <div className="text-[10px] text-white/55 font-semibold mt-1">{k.label}</div>
                <div className="text-[9px] text-white/35">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </PremiumCard>

      {/* ═══════════════════════════════════════════════════════════════
          NEXT BEST ACTION — Full-width, premium treatment
      ═══════════════════════════════════════════════════════════════ */}
      <PremiumCard className="p-0 overflow-hidden border-amber-300/40">
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-5 lg:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500 grid place-items-center shrink-0 shadow-glow-gold">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardEyebrow color="gold">המלצת הסוכן · עדיפות גבוהה</CardEyebrow>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                  צרף תוצאות EMG עדכניות — עלה 9% והשפיע על 12 ימי המתנה
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed max-w-2xl">
                  הוספת <b>תוצאות בדיקת EMG מ-2025</b> תחזק את תיעוד מצב העצבים ותשלים 2 מתוך 3 הקריטריונים
                  החסרים. ה-AI זיהה שזהו צעד הבעל ההשפעה הגדולה ביותר על הציון הסופי.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center shrink-0 flex-wrap">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-emerald-600 text-num leading-none">+9%</div>
                <div className="text-[10px] text-slate-500 font-semibold">שיפור ציון</div>
              </div>
              <div className="w-px h-10 bg-amber-200" />
              <div className="text-center">
                <div className="text-2xl font-extrabold text-secondary text-num leading-none">−12</div>
                <div className="text-[10px] text-slate-500 font-semibold">ימי המתנה</div>
              </div>
              <button className="rounded-xl bg-primary text-white text-sm font-bold py-3 px-5 hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2 shadow-soft">
                צרף מסמך עכשיו
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </PremiumCard>

      {/* ═══════════════════════════════════════════════════════════════
          2-COL: Live feed + Skills
      ═══════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Live activity feed — 2/3 */}
        <PremiumCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardEyebrow color="blue">זרם פעילות חי</CardEyebrow>
              <h2 className="mt-1.5 flex items-center gap-2 text-base font-bold">
                פעולות ה-Copilot
                <AIPulseDot />
              </h2>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-success/10 text-success rounded-full px-2.5 py-1 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse inline-block" />
              זמן אמת
            </div>
          </div>
          <div className="relative pr-5 border-r-2 border-dashed border-slate-200 space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
            {ACTIVITY.map((a, i) => (
              <ActivityRow key={i} {...a} fresh={i === 0} />
            ))}
          </div>
        </PremiumCard>

        {/* Skills panel — 1/3 */}
        <PremiumCard className="p-5">
          <CardEyebrow color="gold">כישורי סוכן</CardEyebrow>
          <h3 className="mt-1.5 mb-4 text-base font-bold">סוכני המשנה הפעילים</h3>
          <div className="space-y-3">
            {SKILLS.map((s) => <SkillRow key={s.label} {...s} />)}
          </div>
        </PremiumCard>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CHAIN OF THOUGHT — Dark section for explainability
      ═══════════════════════════════════════════════════════════════ */}
      <PremiumCard variant="dark" className="relative overflow-hidden p-0">
        <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-[0.04] pointer-events-none" />

        <div className="relative p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 mb-3">
                <Brain className="h-3.5 w-3.5 text-accent" />
                <span className="text-eyebrow text-white/80">שקיפות AI · Chain of Thought</span>
              </div>
              <h2 className="text-white text-xl font-extrabold leading-tight">
                למה אנחנו סומכים על ה-AI הזה
              </h2>
              <p className="mt-1.5 text-white/55 text-sm max-w-xl">
                כל שלב בהנמקת ה-AI מוצג בפירוט — כך תוכל לאמת, לחלוק, ולהסביר לכל ועדה.
              </p>
            </div>
            <div className="text-xs text-white/45 text-left">
              <div>מודל: Claude Sonnet 4</div>
              <div>ביטחון ממוצע: <span className="text-emerald-400 font-bold">91%</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REASONING.map((r) => <ReasonCard key={r.step} {...r} />)}
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function ActivityRow({ time, who, text, tone, fresh, live }: {
  time: string; who: string; text: string;
  tone: 'blue' | 'green' | 'gold'; fresh?: boolean; live?: boolean;
}) {
  const displayed = useLiveTyping(text, live === true);
  const dot  = { blue: 'bg-secondary', green: 'bg-success', gold: 'bg-amber-500' }[tone];
  const chip = { blue: 'text-secondary bg-secondary/10 border-secondary/20', green: 'text-success bg-success/10 border-success/20', gold: 'text-amber-700 bg-amber-100 border-amber-200' }[tone];
  return (
    <div className="relative">
      <span className={cn('absolute -right-[27px] top-3 h-3 w-3 rounded-full ring-4 ring-white shadow-sm', dot, fresh && 'animate-pulse')} />
      <div className={cn(
        'rounded-xl border p-3 bg-white transition-all duration-300',
        fresh ? 'border-secondary/30 shadow-soft' : 'border-slate-100'
      )}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-md border', chip)}>{who}</span>
          <span className="text-[10px] text-muted-foreground font-medium text-num tabular-nums">{time}</span>
        </div>
        <div className="text-sm text-slate-800 leading-relaxed">
          {displayed}
          {live && displayed.length < text.length && (
            <span className="inline-block w-0.5 h-3.5 bg-secondary align-middle ml-0.5 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}

function SkillRow({ icon: Icon, label, detail, pct, tone }: {
  icon: any; label: string; detail: string; pct: number; tone: 'blue' | 'green' | 'gold';
}) {
  const iconCls = { blue: 'text-secondary bg-secondary/10', green: 'text-success bg-success/10', gold: 'text-amber-700 bg-amber-100' }[tone];
  const valueCls = { blue: 'text-secondary', green: 'text-success', gold: 'text-amber-600' }[tone];
  return (
    <div className="rounded-xl border hairline p-3 bg-white hover:shadow-soft transition-shadow">
      <div className="flex items-center gap-3">
        <div className={cn('h-9 w-9 rounded-lg grid place-items-center shrink-0', iconCls)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-slate-800">{label}</span>
            <span className={cn('text-sm font-extrabold text-num', valueCls)}>{pct}%</span>
          </div>
          <AnimatedBar pct={pct} tone={tone} />
          <div className="text-[10px] text-muted-foreground mt-1">{detail}</div>
        </div>
      </div>
    </div>
  );
}

function ReasonCard({ step, icon: Icon, title, confidence, body, badge, tone }: {
  step: string; icon: any; title: string; confidence: number;
  body: string; badge: string; tone: 'blue' | 'green' | 'gold';
}) {
  const accentCls = { blue: 'text-secondary bg-secondary/15 border-secondary/20', green: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20', gold: 'text-amber-400 bg-amber-500/15 border-amber-500/20' }[tone];
  const barCls = { blue: 'bg-secondary', green: 'bg-emerald-400', gold: 'bg-amber-400' }[tone];
  return (
    <div className="rounded-2xl bg-white/6 border border-white/12 p-5 hover:bg-white/8 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/60 border border-white/15 grid place-items-center shrink-0">
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">שלב {step}</div>
            <div className="text-sm font-bold text-white leading-tight">{title}</div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-extrabold text-num text-white/90">{confidence}%</div>
          <div className="text-[9px] text-white/40">ביטחון</div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-3">
        <div className={cn('h-full rounded-full', barCls)} style={{ width: `${confidence}%` }} />
      </div>

      <p className="text-sm text-white/65 leading-relaxed mb-3">{body}</p>

      <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border', accentCls)}>
        <CheckCircle2 className="h-3 w-3" />
        {badge}
      </span>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Sparkles, FileCheck, Users, Building2, Stethoscope, FileText, Clock, ShieldCheck, Bot, Zap, DollarSign, Star, ArrowRight } from 'lucide-react';
import ScoreGauge from '@/components/premium/ScoreGauge';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import { AIPulseDot } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';

const DRIVERS = [
  { icon: FileCheck,   label: 'גיליון רפואי מסכם מעודכן',       impact: '+18%', width: '90%', confidence: 97 },
  { icon: Stethoscope, label: 'חוות דעת נוירולוג (04/2026)',     impact: '+9%',  width: '72%', confidence: 94 },
  { icon: FileText,    label: 'BL/283 חתום ומלא',                impact: '+7%',  width: '60%', confidence: 91 },
  { icon: ShieldCheck, label: 'סיכום שיקום (3 חודשים אחרונים)', impact: '+5%',  width: '48%', confidence: 88 },
];

const TIMELINE = [
  { day: 'יום 1', score: 42, label: 'כניסה למערכת',    done: true,  now: false },
  { day: 'יום 3', score: 61, label: 'העלאת תיק רפואי', done: true,  now: false },
  { day: 'יום 5', score: 73, label: 'אישור חוות דעת',  done: true,  now: true  },
  { day: 'יום 7', score: 93, label: 'תיק מוכן לוועדה', done: false, now: false },
];

/* ── Counter hook — animates a number from 0 to target ── */
function useCountUp(target: number, duration = 1800, delay = 0): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tid = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setVal(Math.round(eased * target));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(tid); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return val;
}

export default function DigitalTwinScreen() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const savings = useCountUp(42, 1600, 400);
  const delta   = useCountUp(39, 1400, 200);

  return (
    <div dir="rtl" className="space-y-7 animate-fade-in">

      {/* ── AI Next Best Action — sticky ribbon above fold ────────── */}
      <div className="rounded-2xl bg-gradient-to-l from-blue-600 to-indigo-700 text-white px-5 py-3.5 flex items-center justify-between gap-4 shadow-floating animate-scale-in">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-white/15 grid place-items-center shrink-0">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold tracking-widest uppercase text-blue-200 block">
              AI · המלצה הבאה
            </span>
            <span className="text-sm font-semibold leading-snug">
              העלה <b>תוצאות EMG עדכניות</b> + <b>הצהרת מעסיק</b> — הציון יקפץ ל-
              <span className="font-extrabold text-num text-yellow-300"> 93%</span> ויקצר את ההליך ב-<b>21 יום</b>
            </span>
          </div>
        </div>
        <button className="shrink-0 rounded-xl bg-white text-indigo-700 font-bold text-sm px-4 py-2 hover:bg-blue-50 transition flex items-center gap-1.5">
          העלה עכשיו <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Hero band ─────────────────────────────────────────────── */}
      <section
        className={cn(
          'relative overflow-hidden rounded-3xl bg-hero-grad text-white shadow-floating transition-all duration-700',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        {/* Background grid texture */}
        <div className="absolute inset-0 grid-bg opacity-[0.06] pointer-events-none" />
        {/* Glow blobs */}
        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-accent/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative p-8 lg:p-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-eyebrow text-white/80">Digital Twin · התאומה הדיגיטלית של תיק התביעה</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
            {/* Copy */}
            <div>
              <h1 className="text-display text-white leading-none">
                ראית פעם<br />
                תביעה <span className="text-accent">חיה</span>?
              </h1>
              <p className="mt-4 text-lg text-white/70 leading-relaxed max-w-lg">
                ה-AI סורק כל מסמך, מצליב מול דרישות הוועדה, ומעלה את ציון המוכנות בזמן אמת.
                כל לחיצה מסבירה <em>למה</em> הציון עלה.
              </p>

              {/* Hero stats row */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {/* Delta pill */}
                <div className="flex items-center gap-2.5 rounded-2xl bg-white/10 border border-white/15 px-4 py-2.5">
                  <span className="text-2xl font-extrabold text-num text-rose-300">42%</span>
                  <TrendingUp className="h-6 w-6 text-accent" strokeWidth={2.5} />
                  <span className="text-2xl font-extrabold text-num text-emerald-300">81%</span>
                  <span className="ml-1 text-sm font-extrabold text-accent text-num bg-accent/20 border border-accent/30 rounded-full px-2.5 py-0.5">
                    +{delta}%
                  </span>
                </div>

                {/* Savings hero stat */}
                <div className="flex items-center gap-2 rounded-2xl bg-amber-400/20 border border-amber-400/30 px-4 py-2.5">
                  <DollarSign className="h-5 w-5 text-amber-300" />
                  <div>
                    <div className="text-xs text-amber-200 font-semibold leading-none">חיסכון ארגוני</div>
                    <div className="text-xl font-extrabold text-num text-amber-300">₪{savings}M / שנה</div>
                  </div>
                </div>

                {/* Live indicator */}
                <div className="flex items-center gap-2 rounded-2xl bg-white/8 border border-white/12 px-3 py-2.5">
                  <AIPulseDot />
                  <span className="text-xs text-white/60 font-semibold">עודכן לפני 12 שניות</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button className="rounded-xl bg-accent text-accent-foreground font-bold px-6 py-3 shadow-glow-gold hover:brightness-110 transition flex items-center gap-2">
                  המשך לשלב הבא <ArrowRight className="h-4 w-4" />
                </button>
                <button className="rounded-xl border border-white/20 text-white font-semibold px-5 py-3 hover:bg-white/10 transition">
                  ראה מה השתנה
                </button>
              </div>
            </div>

            {/* Twin gauges — visual anchor */}
            <div className="flex items-center justify-center gap-3 lg:gap-6">
              {/* Before gauge */}
              <div className={cn(
                'flex flex-col items-center gap-2 rounded-2xl p-5 border transition-all duration-700',
                'bg-white/5 border-white/10 opacity-70',
                mounted ? 'opacity-70 scale-100' : 'opacity-0 scale-90',
              )}>
                <div className="text-eyebrow text-white/50 mb-1">לפני</div>
                <ScoreGauge value={42} size={160} stroke={14} variant="red" animate />
                <div className="text-xs text-white/40 font-semibold">בכניסה למערכת</div>
              </div>

              {/* Arrow + delta */}
              <div className="flex flex-col items-center gap-2">
                <div className={cn(
                  'h-12 w-12 rounded-full bg-accent/25 border border-accent/40 grid place-items-center transition-all duration-700',
                  mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
                  'animate-float-once',
                )}>
                  <TrendingUp className="h-6 w-6 text-accent" strokeWidth={2.5} />
                </div>
                <div className="text-sm font-extrabold text-accent text-num bg-accent/15 border border-accent/25 rounded-full px-3 py-1">
                  +39%
                </div>
              </div>

              {/* After gauge — glowing, prominent */}
              <div className={cn(
                'flex flex-col items-center gap-2 rounded-2xl p-5 border transition-all duration-700 delay-300',
                'bg-white/12 border-emerald-400/30 shadow-glow-gold',
                mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
              )}>
                <div className="text-eyebrow text-emerald-300 mb-1">אחרי AI</div>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-xl pointer-events-none scale-110" />
                  <ScoreGauge value={81} size={200} stroke={16} variant="green" animate />
                </div>
                <div className="text-xs text-emerald-300/80 font-semibold">עם AI Copilot</div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1">
                  <Star className="h-3 w-3 text-emerald-300 fill-emerald-300" />
                  <span className="text-[11px] font-bold text-emerald-300">מוכן לוועדה</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Drivers + Impact cards ─────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver analysis — 2 cols wide */}
        <PremiumCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <CardEyebrow color="blue">Driver Analysis</CardEyebrow>
              <h2 className="mt-1.5">המסמכים שעשו את ההבדל</h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-success/8 border border-success/20 rounded-full px-3 py-1.5">
              <AIPulseDot /> AI Agent עדכן לפני 12 שניות
            </div>
          </div>
          <div className="space-y-3">
            {DRIVERS.map((d, i) => (
              <DriverRow key={d.label} {...d} delay={i * 80} />
            ))}
          </div>
        </PremiumCard>

        {/* Impact cards stacked */}
        <div className="flex flex-col gap-4">
          <ImpactCard
            icon={<Users className="h-5 w-5" />}
            color="blue"
            title="לאזרח"
            metric="-37 ימים"
            sub="זמן המתנה ממוצע"
            lines={[
              'אישור חוסר מסמכים עוד ביום ההגשה',
              'הוועדה מתקיימת עם תיק שלם — אין דחיות',
              'ביטחון מלא לאורך כל הדרך',
            ]}
          />
          <ImpactCard
            icon={<Building2 className="h-5 w-5" />}
            color="gold"
            title="לארגון"
            metric="-58%"
            sub="זמן עיבוד פר תיק"
            metricSub="₪42M חיסכון שנתי"
            lines={[
              'החלטה במפגש ראשון — פחות ועדות חוזרות',
              'חיסכון תפעולי ₪42M בשנה',
              'שביעות רצון מועמדים +0.9 נקודות',
            ]}
          />
        </div>
      </section>

      {/* ── Score timeline ─────────────────────────────────────────── */}
      <PremiumCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <CardEyebrow color="gold">Journey</CardEyebrow>
            <h2 className="mt-1.5">המסע שלך — ציון לאורך זמן</h2>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> מתעדכן בזמן אמת
          </div>
        </div>

        {/* Timeline bar */}
        <div className="relative grid grid-cols-4 gap-3">
          {/* Connecting progress line */}
          <div className="absolute top-[22px] right-[calc(12.5%+12px)] left-[calc(12.5%+12px)] h-0.5 bg-slate-200 pointer-events-none" />
          <div className="absolute top-[22px] right-[calc(12.5%+12px)] w-[calc(50%-8px)] h-0.5 bg-gradient-to-l from-success/60 to-success pointer-events-none" />
          {TIMELINE.map((t) => (
            <TimelineStop key={t.day} {...t} />
          ))}
        </div>

        {/* Bottom summary */}
        <div className="mt-4 rounded-xl bg-slate-50 border hairline p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm text-slate-700">
              עוד 2 ימים להגיע ל-<b className="text-num">93%</b> — העלה EMG + הצהרת מעסיק
            </span>
          </div>
          <span className="text-xs font-bold text-success bg-success/10 border border-success/20 px-3 py-1 rounded-full text-num shrink-0">
            +39% מאז ההתחלה
          </span>
        </div>
      </PremiumCard>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function DriverRow({ icon: Icon, label, impact, width, confidence, delay = 0 }: {
  icon: any; label: string; impact: string; width: string; confidence: number; delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300 + delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className={cn(
      'group flex items-center gap-3 rounded-xl border hairline bg-white p-3 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 cursor-pointer',
      visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
    )}>
      <div className="h-9 w-9 rounded-lg bg-emerald-500 text-white grid place-items-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="text-sm font-semibold truncate">{label}</div>
          <span className="text-[10px] font-bold text-slate-400 shrink-0 text-num">AI {confidence}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-emerald-600 transition-all duration-1000"
            style={{ width: visible ? width : '0%' }}
          />
        </div>
      </div>
      <span className="text-sm font-extrabold text-success text-num shrink-0">{impact}</span>
    </div>
  );
}

function ImpactCard({ icon, color, title, metric, sub, metricSub, lines }: {
  icon: React.ReactNode; color: 'blue' | 'gold';
  title: string; metric: string; sub: string; metricSub?: string; lines: string[];
}) {
  const cls = color === 'blue'
    ? { wrap: 'from-blue-500/10 to-blue-500/0 border-blue-200', icon: 'bg-secondary/10 text-secondary', metric: 'text-secondary' }
    : { wrap: 'from-amber-500/15 to-amber-500/0 border-amber-200', icon: 'bg-amber-100 text-amber-700', metric: 'text-amber-700' };
  return (
    <PremiumCard className={cn('p-5 flex-1 bg-gradient-to-br', cls.wrap)}>
      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
        <span className={cn('h-8 w-8 rounded-lg grid place-items-center', cls.icon)}>{icon}</span>
        {title}
      </div>
      <div className={cn('mt-3 text-4xl font-extrabold text-num', cls.metric)}>{metric}</div>
      <div className="text-xs text-slate-500 font-semibold mt-0.5">{sub}</div>
      {metricSub && (
        <div className={cn('mt-1 text-sm font-bold text-num', cls.metric)}>{metricSub}</div>
      )}
      <ul className="mt-3 space-y-1.5">
        {lines.map((l) => (
          <li key={l} className="text-xs text-slate-700 flex gap-2">
            <span className="text-slate-300 shrink-0">·</span>{l}
          </li>
        ))}
      </ul>
    </PremiumCard>
  );
}

function TimelineStop({ day, score, label, done, now }: {
  day: string; score: number; label: string; done: boolean; now: boolean;
}) {
  return (
    <div className={cn(
      'relative rounded-xl p-4 border text-center transition-all',
      now  ? 'border-secondary/50 bg-secondary/6 shadow-soft ring-2 ring-secondary/20' :
      done ? 'border-success/30 bg-success/4' :
             'border-dashed border-slate-200 bg-white/60 opacity-60',
    )}>
      {now && (
        <span className="absolute -top-2 right-1/2 translate-x-1/2 text-[10px] font-bold bg-secondary text-white px-2 py-0.5 rounded-full whitespace-nowrap">
          עכשיו
        </span>
      )}
      {!done && !now && (
        <span className="absolute -top-2 right-1/2 translate-x-1/2 text-[10px] font-bold bg-slate-400 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
          הבא
        </span>
      )}
      <div className="text-[11px] font-bold text-slate-500">{day}</div>
      <div className={cn(
        'mt-1 text-3xl font-extrabold text-num',
        now  ? 'text-secondary' :
        done ? 'text-success' :
               'text-slate-400',
      )}>
        {score}%
      </div>
      <div className="text-xs text-slate-500 mt-1 leading-tight">{label}</div>
    </div>
  );
}

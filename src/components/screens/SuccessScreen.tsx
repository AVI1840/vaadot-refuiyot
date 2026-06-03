import { useEffect, useState } from 'react';
import { Trophy, CheckCircle2, ArrowLeft, Sparkles, Star, Share2, Download, Calendar } from 'lucide-react';
import ScoreGauge from '@/components/premium/ScoreGauge';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import { AIPulseDot } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';

const ACHIEVEMENTS = [
  { label: 'ציון מוכנות',   value: '93%',    color: 'text-success',   bg: 'bg-success/10 border-success/20'   },
  { label: 'מסמכים שהוגשו', value: '12',     color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20' },
  { label: 'ימי עיבוד',      value: '7',      color: 'text-accent',    bg: 'bg-accent/10 border-accent/20'     },
  { label: 'סיכוי אישור',    value: '93%',    color: 'text-success',   bg: 'bg-success/10 border-success/20'   },
];

const NEXT_STEPS = [
  { day: 'עכשיו',     label: 'קבלת אישור הגשה במייל',  done: true  },
  { day: 'תוך 3 ימים', label: 'ביטוח לאומי מאמת את התיק', done: false },
  { day: '15.06.2026', label: 'יום הוועדה הרפואית',       done: false },
  { day: 'תוך 30 יום', label: 'קבלת ההחלטה',              done: false },
];

export default function SuccessScreen({ onRestart }: { onRestart?: () => void }) {
  const [score, setScore] = useState(0);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setScore(93), 300);
    const t2 = setTimeout(() => setConfetti(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">

      {/* ═══ HERO CELEBRATION ══════════════════════════════════════ */}
      <PremiumCard className="p-0 overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary via-[hsl(222_47%_14%)] to-[hsl(217_91%_18%)] p-8 lg:p-10 text-white overflow-hidden">
          {/* Background glow */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-success/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-[0.04] pointer-events-none" />

          {/* Confetti dots */}
          {confetti && Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-bounce pointer-events-none"
              style={{
                width: 8 + (i % 3) * 4,
                height: 8 + (i % 3) * 4,
                top: `${10 + (i * 7) % 60}%`,
                right: `${5 + (i * 11) % 85}%`,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#a855f7'][i % 4],
                opacity: 0.7,
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${1 + (i % 3) * 0.5}s`,
              }}
            />
          ))}

          <div className="relative flex flex-wrap items-center justify-between gap-8">
            {/* Left — text */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-success/20 border border-success/30 px-4 py-2 mb-4">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">הגשה הושלמה בהצלחה!</span>
              </div>
              <h1 className="text-hero text-white leading-tight mb-2">
                כל הכבוד!<br />
                <span className="text-accent">הבקשה שלך הוגשה</span>
              </h1>
              <p className="text-white/65 text-base leading-relaxed max-w-md mt-3">
                תיקך דורג ב-<b className="text-emerald-400">top 15%</b> מבחינת איכות. ועדת הנכות תדון בבקשתך בתאריך <b className="text-accent">15.06.2026</b>.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <AIPulseDot />
                <span className="text-xs text-white/60">AI Copilot ילווה אותך עד להחלטה הסופית</span>
              </div>
            </div>

            {/* Right — score */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">ציון סופי</div>
              <ScoreGauge value={score} size={148} stroke={13} variant="green" animate />
              <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
                <Star className="h-4 w-4 fill-current" />
                <span>+51 נקודות מתחילת התהליך</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="relative mt-6 flex flex-wrap gap-3">
            <button className="rounded-xl bg-accent text-[hsl(222_47%_18%)] px-6 py-3 text-sm font-extrabold hover:brightness-105 transition shadow-glow-gold flex items-center gap-2">
              <Download className="h-4 w-4" /> הורד אישור הגשה
            </button>
            <button className="rounded-xl border border-white/20 text-white px-5 py-3 text-sm font-semibold hover:bg-white/8 transition flex items-center gap-2">
              <Share2 className="h-4 w-4" /> שתף עם נציג
            </button>
            <button className="rounded-xl border border-white/20 text-white px-5 py-3 text-sm font-semibold hover:bg-white/8 transition flex items-center gap-2">
              <Calendar className="h-4 w-4" /> הוסף ליומן
            </button>
          </div>
        </div>

        {/* Confirmation bar */}
        <div className="bg-success/10 border-t border-success/20 px-6 py-3 flex items-center gap-3">
          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
          <span className="text-sm font-semibold text-success">
            מספר בקשה: <b className="text-num">BTL-2026-04892</b> · אישור נשלח ל: israel@example.com
          </span>
        </div>
      </PremiumCard>

      {/* ═══ ACHIEVEMENTS STRIP ════════════════════════════════════ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ACHIEVEMENTS.map((a) => (
          <PremiumCard key={a.label} className={cn('p-5 text-center border', a.bg)}>
            <div className={cn('text-3xl font-extrabold text-num leading-none', a.color)}>{a.value}</div>
            <div className="mt-1.5 text-xs font-semibold text-slate-600">{a.label}</div>
          </PremiumCard>
        ))}
      </section>

      {/* ═══ 2-COL: NEXT STEPS + AI INSIGHT ═══════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Next steps timeline */}
        <PremiumCard className="p-5">
          <CardEyebrow color="blue">מה קורה הלאה</CardEyebrow>
          <h2 className="mt-1.5 mb-4 text-base font-bold text-primary">לוח זמנים להמשך</h2>
          <div className="relative space-y-3 pr-5 border-r-2 border-dashed border-slate-200">
            {NEXT_STEPS.map((s, i) => (
              <div key={i} className="relative">
                <span className={cn(
                  'absolute -right-[27px] top-3 h-4 w-4 rounded-full border-2 border-white shadow-sm',
                  s.done ? 'bg-success' : 'bg-slate-200',
                )} />
                <div className={cn(
                  'rounded-xl border px-4 py-3',
                  s.done ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200',
                )}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">{s.label}</span>
                    {s.done && <CheckCircle2 className="h-4 w-4 text-success shrink-0" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{s.day}</div>
                </div>
              </div>
            ))}
          </div>
        </PremiumCard>

        {/* AI insight */}
        <PremiumCard className="p-5 flex flex-col">
          <CardEyebrow color="green">AI Copilot</CardEyebrow>
          <h2 className="mt-1.5 mb-4 text-base font-bold text-primary">ניתוח סיכויי הצלחה</h2>

          <div className="flex-1 space-y-4">
            {[
              { label: 'חוזק קליני',         score: 94, color: 'bg-success' },
              { label: 'שלמות תיעוד',         score: 88, color: 'bg-secondary' },
              { label: 'עמידה בקריטריונים',    score: 91, color: 'bg-success' },
              { label: 'סיכוי כולל לאישור',   score: 93, color: 'bg-success' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-bold text-success text-num">{item.score}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all duration-1000', item.color)}
                    style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-primary/5 border border-primary/15 p-3">
            <div className="flex items-start gap-2">
              <AIPulseDot />
              <p className="text-xs text-slate-700 leading-relaxed">
                <b>93% מהמועמדים</b> עם ציון מוכנות זה מאושרים בוועדה. התיק שלך עומד בכל קריטריוני הסף ומכיל תיעוד איכותי.
              </p>
            </div>
          </div>

          <button
            onClick={onRestart}
            className="mt-4 w-full rounded-xl border hairline bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4 rotate-180" />
            חזור לדף הבית
          </button>
        </PremiumCard>
      </section>

      {/* ═══ PROMO ══════════════════════════════════════════════════ */}
      <PremiumCard className="p-6 bg-gradient-to-l from-primary/5 via-white to-secondary/5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-accent/15 grid place-items-center shrink-0">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-primary">הכן גם חבר לוועדה</div>
              <div className="text-xs text-slate-500 mt-0.5">
                שתף את הקישור — כל אחד יכול לבנות תיק מנצח ב-7 שלבים
              </div>
            </div>
          </div>
          <button className="rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-bold hover:bg-primary/90 transition flex items-center gap-2">
            <Share2 className="h-4 w-4" /> שתף את המערכת
          </button>
        </div>
      </PremiumCard>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Trophy, Calendar,
  Sparkles, FileCheck2, ShieldCheck, Upload, TrendingUp,
  Clock, Brain, FileText, Star,
} from 'lucide-react';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import ScoreGauge from '@/components/premium/ScoreGauge';
import { AIPulseDot, AIBadge } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';

/* ── Static data ─────────────────────────────────────────────────── */
const COMMITTEE_DATE = new Date('2026-06-15T10:00:00');

const TIMELINE_STEPS = [
  { date: '01.06', label: 'תחילת תהליך',     done: true,  now: false },
  { date: '03.06', label: 'תיק רפואי הועלה',  done: true,  now: false },
  { date: '05.06', label: 'אישור חוו״ד',      done: true,  now: false },
  { date: '07.06', label: 'תיק מוכן',          done: false, now: true  },
  { date: '15.06', label: 'מועד הוועדה',       done: false, now: false },
];

const READY_DOCS = [
  { label: 'חוות דעת נוירולוג עדכנית', tag: 'מומחה'  },
  { label: 'BL/283 חתום ומלא',         tag: 'טופס'   },
  { label: 'תוצאות MRI מ-2026',        tag: 'דימות'  },
  { label: 'סיכום שיקום (3 חודשים)',    tag: 'שיקום'  },
  { label: 'תעודת זהות מצולמת',        tag: 'זיהוי'  },
];

const MISSING_DOCS = [
  {
    label: 'EMG עדכני',
    tag: 'אופציונלי',
    pct: '+9%',
    why: 'מחזק ממצאי ה-MRI ומעלה את ציון האמינות הקלינית',
  },
  {
    label: 'הצהרת מעסיק על פגיעה תפקודית',
    tag: 'מומלץ',
    pct: '+6%',
    why: 'מוסיף ראיה עצמאית לפגיעה בתפקוד יומיומי',
  },
];

const AI_INSIGHTS = [
  { score: 94, label: 'חוזק קליני', note: 'ממצאים מתואמים ועקביים' },
  { score: 88, label: 'שלמות תיעוד', note: 'כל מסמכי הליבה קיימים' },
  { score: 91, label: 'עמידה בדרישות', note: 'עומד בכל קריטריוני הסף' },
];

/* ── Countdown hook ─────────────────────────────────────────────── */
function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    };
  };
  // Compute once — a static countdown is fine for demo/hackathon purposes
  const [time] = useState(calc);
  return time;
}

/* ── Circular countdown ring ─────────────────────────────────────── */
function CountdownRing({ days }: { days: number }) {
  const max = 30;
  const pct = Math.min(days / max, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct);
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" className="shrink-0">
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={r} fill="none"
        stroke="hsl(38 92% 50%)" strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={dash}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
      <text x="65" y="58" textAnchor="middle" fill="hsl(38 92% 50%)" fontSize="34" fontWeight="800" fontFamily="Heebo,sans-serif" className="text-num">{days}</text>
      <text x="65" y="76" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontFamily="Heebo,sans-serif">ימים</text>
    </svg>
  );
}

/* ── Two-digit unit ─────────────────────────────────────────────── */
function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-extrabold text-num text-white leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] text-white/50 mt-0.5 uppercase tracking-wider">{label}</span>
    </div>
  );
}

/* ── Confidence bar ─────────────────────────────────────────────── */
function ConfidenceBar({ score, label, note }: { score: number; label: string; note: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600 font-semibold">{label}</span>
        <span className="text-xs font-bold text-success text-num">{score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-success/60 to-success transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="text-[10px] text-slate-400">{note}</div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function ReadinessDashboardScreen({ onNext }: { onNext?: () => void }) {
  const { days, hours, minutes, seconds } = useCountdown(COMMITTEE_DATE);

  return (
    <div className="space-y-5 animate-fade-in" dir="rtl">

      {/* ── HERO ROW ────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT — Score + Timeline */}
        <PremiumCard className="lg:col-span-2 p-6 lg:p-8 bg-gradient-to-br from-white via-white to-blue-50/40">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <CardEyebrow color="green">מוכנות לוועדה</CardEyebrow>
              <h1 className="mt-2 text-hero leading-tight">הכנה לוועדה הרפואית</h1>
              <p className="mt-3 text-slate-600 leading-relaxed max-w-sm">
                אתה ב-<b className="text-success text-num">84%</b> מוכנות.
                עוד 2 מסמכים אופציונליים יעלו אותך ל-<b className="text-success text-num">93%</b>.
              </p>

              {/* AI reasoning block */}
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AIPulseDot />
                  <span className="text-xs font-bold text-slate-700">ניתוח AI — מבוסס על 847 תיקים דומים</span>
                </div>
                <div className="space-y-2.5">
                  {AI_INSIGHTS.map((ins) => (
                    <ConfidenceBar key={ins.label} score={ins.score} label={ins.label} note={ins.note} />
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:block shrink-0">
              <ScoreGauge value={84} size={148} stroke={12} variant="green" />
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-6 relative">
            <div className="absolute right-[calc(10%+20px)] left-[calc(10%+20px)] top-[20px] h-0.5 bg-slate-100">
              <div className="h-full w-[60%] bg-gradient-to-l from-success/60 to-success/20 rounded-full" />
            </div>
            <div className="relative grid grid-cols-5 gap-1">
              {TIMELINE_STEPS.map((t) => (
                <div key={t.date} className="flex flex-col items-center text-center gap-1.5">
                  <div className={cn(
                    'relative h-10 w-10 rounded-full grid place-items-center ring-4 ring-white shadow-soft z-10 transition-all duration-300',
                    t.done && 'bg-success text-white',
                    t.now  && 'bg-accent text-white shadow-glow-gold',
                    !t.done && !t.now && 'bg-slate-100 text-slate-400',
                  )}>
                    {t.done
                      ? <CheckCircle2 className="h-5 w-5" />
                      : t.now
                      ? <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                      : <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />}
                  </div>
                  <div className="text-[10px] font-bold text-slate-600">{t.date}</div>
                  <div className="text-[9px] text-slate-500 leading-tight max-w-[76px]">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </PremiumCard>

        {/* RIGHT — Countdown */}
        <PremiumCard className="p-6 bg-gradient-to-br from-primary via-[hsl(222_47%_14%)] to-slate-900 text-white flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="text-eyebrow text-white/60">מועד הוועדה</span>
          </div>

          {/* Animated ring */}
          <div className="flex justify-center">
            <CountdownRing days={days} />
          </div>

          {/* HH:MM:SS */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <TimeUnit value={hours} label="שעות" />
            <span className="text-white/30 text-xl font-bold mb-3">:</span>
            <TimeUnit value={minutes} label="דקות" />
            <span className="text-white/30 text-xl font-bold mb-3">:</span>
            <TimeUnit value={seconds} label="שניות" />
          </div>

          <div className="mt-3 text-center text-sm text-white/55">
            15 ביוני 2026 · שעה 10:00
          </div>

          {/* AI live support */}
          <div className="mt-4 rounded-xl bg-white/[0.07] border border-white/10 p-3">
            <div className="flex items-start gap-2 text-sm text-white/90">
              <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>ה-AI ילווה אותך <b>בשידור חי</b> במהלך הוועדה — הכנה לכל שאלה.</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="rounded-xl border border-white/20 text-white text-xs font-bold py-2.5 hover:bg-white/8 transition">
              הדרכה לוועדה
            </button>
            <button className="rounded-xl bg-accent text-[hsl(222_47%_18%)] text-xs font-bold py-2.5 hover:brightness-105 transition shadow-glow-gold">
              פתח לוח זמנים
            </button>
          </div>
        </PremiumCard>
      </section>

      {/* ── 3-COL: ready / missing / achievement ─────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Col 1 — Ready docs */}
        <PremiumCard className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-8 w-8 rounded-lg grid place-items-center bg-success/10 text-success shrink-0">
              <FileCheck2 className="h-4 w-4" />
            </span>
            <div>
              <h3 className="leading-none">מה שמוכן</h3>
              <div className="text-xs text-muted-foreground mt-0.5">{READY_DOCS.length} מסמכים</div>
            </div>
          </div>
          <ul className="space-y-2 flex-1">
            {READY_DOCS.map((doc) => (
              <li key={doc.label} className="flex items-center gap-2 rounded-xl border hairline bg-white px-3 py-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <span className="flex-1 text-sm text-slate-700 leading-tight">{doc.label}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-success/8 text-success/80 border-success/20">
                  {doc.tag}
                </span>
              </li>
            ))}
          </ul>
        </PremiumCard>

        {/* Col 2 — Missing docs with impact */}
        <PremiumCard className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-8 w-8 rounded-lg grid place-items-center bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div>
              <h3 className="leading-none">מה שחסר</h3>
              <div className="text-xs text-muted-foreground mt-0.5">2 מסמכים אופציונליים</div>
            </div>
          </div>
          <ul className="space-y-3 flex-1">
            {MISSING_DOCS.map((doc) => (
              <li key={doc.label} className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-3 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <span className="flex-1 text-sm font-semibold text-slate-800 leading-tight">{doc.label}</span>
                  {/* Big impact number */}
                  <span className="text-base font-extrabold text-amber-600 text-num shrink-0">{doc.pct}</span>
                </div>
                <div className="flex items-start gap-1.5 pr-6">
                  <TrendingUp className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-700 leading-snug">{doc.why}</p>
                </div>
                <div className="text-[10px] text-amber-600 font-bold pr-6">
                  העלאה תקפוץ את הציון מ-84% ל-{doc.pct === '+9%' ? '93%' : '90%'}
                </div>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full rounded-xl bg-primary text-white text-sm font-bold py-2.5 flex items-center justify-center gap-2 hover:bg-primary/90 transition">
            <Upload className="h-4 w-4" />
            העלה מסמכים עכשיו
          </button>
        </PremiumCard>

        {/* Col 3 — Achievement (clean, no emoji) */}
        <PremiumCard className="p-5 bg-gradient-to-br from-success/8 to-white border-success/20 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="text-eyebrow text-success">הישגים</span>
          </div>
          <h3 className="text-slate-800">ביצועים מצוינים</h3>

          {/* Clean stat strip instead of emoji badges */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              { value: 'פי 3', label: 'מהממוצע' },
              { value: '93%', label: 'אישור' },
              { value: '7/7', label: 'שלבים' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white border hairline py-2.5 px-1">
                <div className="text-base font-extrabold text-success text-num leading-none">{s.value}</div>
                <div className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>

          {/* AI insight */}
          <div className="mt-4 rounded-xl bg-success/8 border border-success/20 p-3 flex items-start gap-2">
            <AIPulseDot />
            <div className="text-xs text-slate-700 leading-relaxed">
              <b>93%</b> מהמועמדים שמגיעים לשלב זה מאושרים בוועדה. התיק שלך ב-<b>top 15%</b> של האיכות.
            </div>
          </div>

          {/* Progress */}
          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground font-semibold">התקדמות כוללת</span>
              <span className="text-xs text-success font-bold text-num">84%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-[84%] bg-gradient-to-r from-success/60 to-success rounded-full transition-all duration-700" />
            </div>
          </div>
        </PremiumCard>
      </section>

      {/* ── CTA STRIP ───────────────────────────────────────────────── */}
      <PremiumCard className="p-5 bg-primary text-white">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/15 grid place-items-center shrink-0">
              <ShieldCheck className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="text-sm font-bold">התיק שלך כמעט מוכן להגשה — שלב 7 מתוך 7</div>
              <div className="text-xs text-white/60 mt-0.5">הגש לוועדה הדיגיטלית או הדפס PDF מסכם</div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold hover:bg-white/8 transition">
              הורד PDF
            </button>
            {/* Primary CTA — larger, with success glow */}
            <button
              onClick={onNext}
              className="rounded-xl bg-accent text-[hsl(222_47%_18%)] px-6 py-3 text-sm font-extrabold flex items-center gap-2 hover:brightness-105 transition shadow-glow-gold"
            >
              הגש לוועדה <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* National deployment footer */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
          <span className="text-[10px] text-white/40 uppercase tracking-widest">מופעל עבור 12 לשכות · ביטוח לאומי</span>
        </div>
      </PremiumCard>
    </div>
  );
}

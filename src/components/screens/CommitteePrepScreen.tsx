import {
  Calendar, Clock, MapPin, Trophy, ChevronLeft, ArrowLeft,
  FileCheck2, ShieldCheck, Brain, CheckCircle2, AlertCircle,
  Phone, MessageSquare, Download, Sparkles, Zap, Users, Star,
} from 'lucide-react';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import ScoreGauge from '@/components/premium/ScoreGauge';
import { AIPulseDot } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';

/* ── Data ───────────────────────────────────────────────────────── */

const COMMITTEE = {
  date: '15.06.2026',
  time: '10:00',
  location: 'ביטוח לאומי — לשכת ירושלים, קומה 3, חדר 12',
  daysLeft: 12,
  score: 84,
};

const TIMELINE = [
  { label: 'הגשת הבקשה',       date: '01.06', done: true  },
  { label: 'בדיקת תיק',         date: '07.06', done: true  },
  { label: 'זימון לוועדה',      date: '10.06', done: true  },
  { label: 'יום הוועדה',        date: '15.06', done: false, now: true },
];

const BRING = [
  { ok: true,  text: 'תעודת זהות מקורית' },
  { ok: true,  text: 'חוות דעת נוירולוג (מודפסת × 2)' },
  { ok: true,  text: 'תוצאות MRI + CT עדכניות' },
  { ok: true,  text: 'טופס BL/283 חתום' },
  { ok: true,  text: 'סיכום שיקום 3 חודשים' },
  { ok: false, text: 'תוצאות EMG (מומלץ)' },
];

const QUESTIONS = [
  'מה הפגיעה התפקודית שגורמת לך הגדולה ביותר?',
  'האם אתה מקבל טיפול תרופתי קבוע?',
  'כיצד הבעיה משפיעה על יכולתך לעבוד?',
  'מה השתנה בשנה האחרונה מבחינה רפואית?',
  'האם עברת בדיקות נוספות מאז הגשת הבקשה?',
];

const POST_COMMITTEE = [
  { label: 'המתן להחלטה', sub: 'עד 30 יום מיום הוועדה', icon: Clock, tone: 'blue' as const },
  { label: 'ערר אם נדחה', sub: 'תוך 60 יום מהחלטה', icon: AlertCircle, tone: 'gold' as const },
  { label: 'קבלת גמלה', sub: 'תוך 14 יום מאישור', icon: CheckCircle2, tone: 'green' as const },
];

const AI_PREP = [
  { label: 'חוזק קליני',    score: 94, note: 'ממצאים עקביים בין 3 מקורות' },
  { label: 'שלמות תיעוד',   score: 88, note: 'כל מסמכי הליבה קיימים' },
  { label: 'עמידה בקריטריונים', score: 91, note: 'עומד בכל קריטריוני הסף' },
];

/* ── Main ───────────────────────────────────────────────────────── */

export default function CommitteePrepScreen() {
  return (
    <div className="space-y-5 animate-fade-in" dir="rtl">

      {/* ═══ HERO BANNER ════════════════════════════════════════════ */}
      <PremiumCard className="p-0 overflow-hidden">
        <div className="bg-gradient-to-l from-primary via-[hsl(222_47%_16%)] to-[hsl(217_91%_22%)] p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-[0.04] pointer-events-none" />

          <div className="relative flex flex-wrap items-start justify-between gap-6">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 mb-4">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                <span className="text-eyebrow text-white/80">הכנה לוועדה הרפואית</span>
              </div>
              <h1 className="text-hero text-white leading-tight mb-2">
                הוועדה <span className="text-accent">בעוד {COMMITTEE.daysLeft} ימים</span>
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-white/75 mt-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-accent shrink-0" />
                  {COMMITTEE.date} · {COMMITTEE.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-secondary shrink-0" />
                  {COMMITTEE.location}
                </span>
              </div>

              {/* AI readiness strips */}
              <div className="mt-5 rounded-xl bg-white/8 border border-white/12 p-4 space-y-3 max-w-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AIPulseDot />
                  <span className="text-xs font-bold text-white/70">ניתוח AI — מוכנות לוועדה</span>
                </div>
                {AI_PREP.map((a) => (
                  <div key={a.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/75 font-semibold">{a.label}</span>
                      <span className="text-emerald-400 font-bold text-num">{a.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500/70 to-emerald-400 transition-all duration-700" style={{ width: `${a.score}%` }} />
                    </div>
                    <div className="text-[10px] text-white/40">{a.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — gauge */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/40">ציון מוכנות</div>
              <ScoreGauge value={COMMITTEE.score} size={140} stroke={12} variant="green" animate />
              <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-current" /> top 15% מהמועמדים
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="px-6 py-4 border-t hairline bg-white flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span>93% מהמועמדים ברמה זו מאושרים בוועדה</span>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border hairline bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2">
              <Download className="h-4 w-4" /> הורד תדריך PDF
            </button>
            <button className="rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-bold hover:bg-primary/90 transition shadow-card flex items-center gap-2">
              <Phone className="h-4 w-4" /> תאם מראש עם הוועדה
            </button>
          </div>
        </div>
      </PremiumCard>

      {/* ═══ TIMELINE ═══════════════════════════════════════════════ */}
      <PremiumCard className="p-5">
        <CardEyebrow color="blue">מצב התהליך</CardEyebrow>
        <h2 className="mt-1.5 mb-5 text-base font-bold text-primary">מסלול התביעה</h2>
        <div className="relative grid grid-cols-4 gap-2">
          <div className="absolute top-5 right-[12.5%] left-[12.5%] h-0.5 bg-slate-100">
            <div className="h-full w-[75%] bg-gradient-to-l from-success/60 to-success/20 rounded-full" />
          </div>
          {TIMELINE.map((t) => (
            <div key={t.label} className="flex flex-col items-center text-center gap-2 relative">
              <div className={cn(
                'h-10 w-10 rounded-full grid place-items-center ring-4 ring-white shadow-soft z-10 transition-all',
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
              <div className="text-[10px] font-bold text-slate-500">{t.date}</div>
              <div className="text-[11px] font-semibold text-slate-700 leading-tight">{t.label}</div>
            </div>
          ))}
        </div>
      </PremiumCard>

      {/* ═══ 3-COL: BRING / QUESTIONS / AFTER ══════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Col 1 — What to bring */}
        <PremiumCard className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-secondary/10 text-secondary grid place-items-center shrink-0">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <CardEyebrow color="blue">מה לקחת</CardEyebrow>
              <h3 className="text-sm font-bold text-primary leading-none mt-0.5">ליום הוועדה</h3>
            </div>
          </div>
          <ul className="space-y-2.5 flex-1">
            {BRING.map((b) => (
              <li key={b.text} className={cn(
                'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm',
                b.ok
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-800',
              )}>
                {b.ok
                  ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  : <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />}
                {b.text}
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-slate-500 bg-slate-50 border hairline rounded-xl px-3 py-2">
            המסמכים נשמרו גם בתיק הדיגיטלי — הוועדה יכולה לגשת אליהם
          </div>
        </PremiumCard>

        {/* Col 2 — Expected questions */}
        <PremiumCard className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 grid place-items-center shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <CardEyebrow color="gold">הכנה לשאלות</CardEyebrow>
              <h3 className="text-sm font-bold text-primary leading-none mt-0.5">מה הוועדה תשאל</h3>
            </div>
          </div>
          <ul className="space-y-2.5 flex-1">
            {QUESTIONS.map((q, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-xl border hairline bg-white px-3 py-2.5 hover:shadow-soft transition-shadow">
                <span className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-extrabold grid place-items-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700 leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full rounded-xl border border-secondary/30 bg-secondary/8 text-secondary text-sm font-bold py-2.5 flex items-center justify-center gap-2 hover:bg-secondary/12 transition">
            <Brain className="h-4 w-4" />
            תרגל עם AI — סימולציה
          </button>
        </PremiumCard>

        {/* Col 3 — After the committee */}
        <PremiumCard className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-success/10 text-success grid place-items-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardEyebrow color="green">אחרי הוועדה</CardEyebrow>
              <h3 className="text-sm font-bold text-primary leading-none mt-0.5">מה קורה הלאה</h3>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            {POST_COMMITTEE.map((p) => {
              const iconBg = { blue: 'bg-secondary/10 text-secondary', gold: 'bg-amber-100 text-amber-700', green: 'bg-success/10 text-success' }[p.tone];
              return (
                <div key={p.label} className="flex items-center gap-3 rounded-xl border hairline bg-white px-4 py-3">
                  <div className={cn('h-9 w-9 rounded-xl grid place-items-center shrink-0', iconBg)}>
                    <p.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{p.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI support */}
          <div className="mt-4 rounded-xl bg-primary/5 border border-primary/15 p-3">
            <div className="flex items-start gap-2">
              <AIPulseDot />
              <p className="text-xs text-slate-700 leading-relaxed">
                ה-AI Copilot ילווה אותך גם לאחר הוועדה — הכנת ערר, מעקב סטטוס, תיאום תשלום.
              </p>
            </div>
          </div>
        </PremiumCard>
      </section>

      {/* ═══ SUCCESS BANNER ═════════════════════════════════════════ */}
      <PremiumCard className="p-6 lg:p-8 bg-gradient-to-br from-success/10 via-white to-secondary/5 border-success/20 overflow-hidden relative">
        <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-100 border border-amber-200 grid place-items-center shrink-0 shadow-glow-gold">
              <Trophy className="h-7 w-7 text-amber-500" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-primary">אתה מוכן לוועדה!</div>
              <p className="text-sm text-slate-600 mt-0.5 max-w-md">
                התיק שלך ב-<b className="text-success">top 15%</b> מהאיכות. 93% מהמועמדים ברמה זו מקבלים אישור — הגיע הזמן.
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button className="rounded-xl border hairline bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2">
              <Users className="h-4 w-4" /> צור קשר עם הלשכה
            </button>
            <button className="rounded-xl bg-accent text-[hsl(222_47%_18%)] px-6 py-3 text-sm font-extrabold hover:brightness-105 transition shadow-glow-gold flex items-center gap-2">
              <Zap className="h-4 w-4" /> אשר הגשה <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </PremiumCard>

    </div>
  );
}

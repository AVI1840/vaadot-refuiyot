import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ShieldCheck, Sparkles, CheckCircle2, Bot, Send,
  MessageSquareText, ClipboardCheck, ListChecks, Upload, FileSearch,
  Calendar, Star, TrendingUp, Users, Building2, Clock,
  Brain, Zap, Globe2, Lock, Database,
} from 'lucide-react';
import ScoreGauge from '@/components/premium/ScoreGauge';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import { AIPulseDot } from '@/components/premium/AIPulse';
import { AwsBadge } from '@/components/premium/AppShell';
import { cn } from '@/lib/utils';

/* ── Data ──────────────────────────────────────────────────────────── */

const STATS = [
  {
    value: '72%',
    label: 'תיקים שמולאו במלואם זכו באישור',
    sub: 'לעומת 34% ממוצע ארצי',
    color: 'text-success',
    border: 'border-l-4 border-l-success',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    value: '19 ימים',
    label: 'ממוצע זמן אישור תביעה',
    sub: 'לעומת 140 יום ממוצע ארצי',
    color: 'text-secondary',
    border: 'border-l-4 border-l-secondary',
    icon: <Clock className="h-4 w-4" />,
  },
  {
    value: '120K',
    label: 'ועדות רפואיות בשנה',
    sub: 'היקף לאומי שאנחנו מייעלים',
    color: 'text-amber-600',
    border: 'border-l-4 border-l-amber-400',
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    value: '3,934',
    label: 'תיקים הוגשו מוכנים החודש',
    sub: 'ועולים בקצב של 28% חודשי',
    color: 'text-primary',
    border: 'border-l-4 border-l-primary',
    icon: <Users className="h-4 w-4" />,
  },
];

const STEPS = [
  { icon: MessageSquareText, n: 1, label: 'שיחה ראשונה',  sub: 'ה-AI מבין את מצבך'    },
  { icon: ClipboardCheck,    n: 2, label: 'בחירת אבחנה',  sub: 'מ-7 קטגוריות'          },
  { icon: ListChecks,        n: 3, label: 'צ׳קליסט חכם',  sub: 'מותאם לתיק שלך'        },
  { icon: Upload,            n: 4, label: 'העלאת מסמכים', sub: 'OCR אוטומטי'           },
  { icon: FileSearch,        n: 5, label: 'ניתוח AI',      sub: '94% confidence'        },
  { icon: Calendar,          n: 6, label: 'תיאום ועדה',   sub: 'מועד מהיר יותר'        },
  { icon: Send,              n: 7, label: 'הגשה',          sub: 'תיק מלא ומאושר'        },
];

const TESTIMONIALS = [
  {
    who: 'ד״ר ר. כהן',
    role: 'רופאת ועדה · קופת חולים כללית',
    stars: 5,
    text: 'מגיעה לוועדה עם תיק מסודר ומלא — חוסך לי שעתיים בכל מפגש. שינוי של ממש בזמן הממוצע לטיפול.',
    org: 'כללית',
  },
  {
    who: 'א. לוי',
    role: 'עובדת סוציאלית · ביטוח לאומי',
    stars: 5,
    text: 'הירידה במסמכים חסרים שינתה את קצב כל המחלקה. מה שלקח שבועות — לוקח ימים.',
    org: 'ביטוח לאומי',
  },
  {
    who: 'י. מימון',
    role: 'מועמד · תביעת נכות כללית',
    stars: 5,
    text: 'הגשתי בלי לצאת מהבית. לא הבנתי כלום בניירת — ה-AI ליווה אותי שלב אחרי שלב. אישור הגיע ב-19 ימים.',
    org: '',
  },
];

/* ── Main component ────────────────────────────────────────────────── */

export default function LandingScreen({ onCta }: { onCta?: () => void }) {
  return (
    <div className="space-y-12 animate-fade-in" dir="rtl">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[560px]">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-[-80px] right-[-100px] h-[480px] w-[480px] rounded-full bg-secondary/8 blur-[100px]" />
          <div className="absolute bottom-[-60px] left-[-80px] h-[360px] w-[360px] rounded-full bg-accent/6 blur-[90px]" />
        </div>

        {/* LEFT — Text */}
        <div className="flex flex-col">
          {/* Eyebrow chip */}
          <div className="inline-flex self-start items-center gap-2 rounded-full border hairline bg-white/95 shadow-soft px-4 py-1.5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-eyebrow text-slate-600">AI Copilot · ביטוח לאומי × AWS Bedrock</span>
          </div>

          <h1 className="text-display tracking-tight text-primary leading-[1.04]">
            הגשת תביעת נכות,<br />
            <span className="text-secondary">בלי לצאת</span> מהבית.
          </h1>

          {/* National scale anchor — visible in first 5 seconds */}
          <p className="mt-3 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 inline-flex items-center gap-2 self-start">
            <Building2 className="h-4 w-4 shrink-0" />
            120,000 ועדות רפואיות בשנה — ואנחנו מייעלים כל אחת מהן
          </p>

          <p className="mt-5 text-[17px] text-slate-600 leading-relaxed max-w-xl">
            ה-AI Copilot ממיין את התיק, מצליב מסמכים מול דרישות הוועדה, ומלווה אותך שלב אחר שלב.
          </p>

          {/* DUAL SCORE STRIP — the #1 audit fix */}
          <DualScoreStrip />

          {/* Trust bullets */}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" /> מאובטח בתקן בנקאי
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" /> תאימות ביטוח לאומי
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500" /> 4.7 ★ מ-1,284 משתמשים
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <button
              onClick={onCta}
              className="rounded-xl bg-primary text-white font-bold px-8 py-4 shadow-floating hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center gap-2 text-base"
            >
              בוא נתחיל עכשיו <ArrowLeft className="h-4 w-4" />
            </button>
            <button className="rounded-xl border hairline bg-white px-6 py-4 font-semibold text-slate-700 hover:bg-slate-50 transition text-base">
              צפה בדמו · 90 שניות
            </button>
          </div>

          {/* Social proof sub-line */}
          <p className="mt-3 text-xs text-slate-500">
            מ-1,284 משתמשים פעילים · ממוצע אישור ב-19 ימים · אבטחה ב-AWS KMS
          </p>
        </div>

        {/* RIGHT — Phone mockup cluster */}
        <div className="relative flex justify-center items-center h-[500px]">
          {/* Large glow behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-secondary/14 blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-success/10 blur-[60px] pointer-events-none" />

          <PhoneMockup />

          {/* Floating chips */}
          <FloatingChip
            className="absolute top-8 -right-2 lg:right-8"
            icon={<Bot className="h-4 w-4" />}
            label="AI מנתח 12 מסמכים"
            tone="blue"
            delay="0s"
          />
          <FloatingChip
            className="absolute bottom-16 -left-4 lg:left-6"
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="ציון עלה ל-81%"
            tone="green"
            delay="1.8s"
          />
          <FloatingChip
            className="absolute bottom-36 -right-2 lg:right-4"
            icon={<ShieldCheck className="h-4 w-4" />}
            label="תיק מוכן לוועדה"
            tone="gold"
            delay="3.5s"
          />
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <PremiumCard
            key={s.label}
            className={cn('p-5 hover:-translate-y-1 hover:shadow-floating transition-all', s.border)}
          >
            <div className={cn('flex items-start justify-between mb-1', s.color)}>
              {s.icon}
            </div>
            <div className={cn('text-4xl font-extrabold text-num leading-none', s.color)}>
              {s.value}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-700 leading-snug">{s.label}</div>
            <div className="mt-1 text-[10px] text-slate-400 leading-snug">{s.sub}</div>
          </PremiumCard>
        ))}
      </section>

      {/* ── 7-STEP PROCESS ────────────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-7">
          <div>
            <CardEyebrow color="blue">כיצד זה עובד</CardEyebrow>
            <h2 className="mt-2 text-xl font-bold text-primary">7 שלבים — מהשיחה ועד ההגשה</h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <AIPulseDot /> AI מלווה כל שלב
          </div>
        </div>

        {/* Steps grid — 7 columns on lg avoids the 3+3+1 collapse bug */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative">
          {/* Connector line — visible on lg */}
          <div className="pointer-events-none absolute top-[36px] right-[3.5%] left-[3.5%] h-[2px] bg-gradient-to-l from-accent/40 via-secondary/30 to-accent/40 hidden lg:block" />
          {STEPS.map((s) => (
            <ProcessStep key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section>
        <div className="mb-6 text-center">
          <CardEyebrow color="gold">עדויות משתמשים</CardEyebrow>
          <h2 className="mt-2 text-xl font-bold text-primary">מה אומרים משתמשים</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <PremiumCard
              key={t.who}
              className="p-6 hover:-translate-y-0.5 hover:shadow-floating transition-all flex flex-col gap-3"
            >
              <div className="text-amber-400 text-base tracking-wide">{'★'.repeat(t.stars)}</div>
              <p className="text-sm text-slate-700 leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="pt-3 border-t hairline flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800">{t.who}</div>
                  <div className="text-[11px] text-slate-500">{t.role}</div>
                </div>
                {t.org && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600 border hairline">
                    {t.org}
                  </span>
                )}
              </div>
            </PremiumCard>
          ))}
        </div>
      </section>

      {/* ── AWS TRUST FOOTER ──────────────────────────────────────── */}
      <section className="rounded-2xl border hairline bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex flex-col gap-3 flex-1">
          <div className="text-sm font-bold text-primary">
            תשתית לאומית — אבטחה ופרטיות ברמה ממשלתית
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-success" /> הצפנת KMS · נתונים לא יוצאים מ-VPC
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-secondary" /> Region אירופה · GDPR
            </span>
            <span className="flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-accent" /> Amazon Bedrock · Claude
            </span>
            <span className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-primary" /> Textract OCR · S3
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <AwsBadge />
        </div>
      </section>

    </div>
  );
}

/* ── DualScoreStrip ──────────────────────────────────────────────── */

function DualScoreStrip() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); obs.disconnect(); } },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mt-6 flex items-center gap-4 p-5 rounded-2xl border hairline bg-white shadow-card"
    >
      {/* Before */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">לפני AI</div>
        <ScoreGauge value={animated ? 42 : 0} size={90} stroke={9} variant="red" animate />
        <div className="text-2xl font-extrabold text-num text-destructive leading-none">42%</div>
        <div className="text-[10px] text-slate-500 text-center">מוכנות ממוצעת<br />בהגשה עצמאית</div>
      </div>

      {/* Arrow */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className="flex items-center gap-0.5 text-success">
          <Zap className="h-5 w-5 fill-success" />
        </div>
        <div className="text-xl font-extrabold text-num text-success leading-none">+39%</div>
        <div className="text-[9px] font-bold text-success/70 uppercase tracking-wide">שיפור</div>
      </div>

      {/* After */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">עם AI Copilot</div>
        <ScoreGauge value={animated ? 81 : 0} size={90} stroke={9} variant="green" animate />
        <div className="text-2xl font-extrabold text-num text-success leading-none">81%</div>
        <div className="text-[10px] text-slate-500 text-center">מוכנות ממוצעת<br />עם הכלי שלנו</div>
      </div>
    </div>
  );
}

/* ── PhoneMockup ─────────────────────────────────────────────────── */

function PhoneMockup() {
  return (
    <div
      className="relative w-[270px] aspect-[9/19.5] rounded-[2.5rem] shadow-floating animate-float-once"
      style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', padding: '10px' }}
    >
      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-20 rounded-full bg-slate-900 z-10" />
      {/* Screen */}
      <div className="h-full w-full rounded-[2rem] bg-canvas-grad overflow-hidden flex flex-col p-4 pt-9 gap-3">
        <div className="text-center text-[9px] font-bold text-slate-500 tracking-widest uppercase">תביעת נכות · AI Copilot</div>

        {/* Score card */}
        <div className="rounded-2xl bg-white shadow-card border hairline p-4 flex flex-col items-center gap-1">
          <div className="text-[10px] font-bold text-slate-500">ציון מוכנות תיק</div>
          <ScoreGauge value={81} size={112} stroke={10} variant="green" animate />
          <div className="text-[10px] text-success font-bold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +39% מתחילת התהליך
          </div>
        </div>

        {/* AI status */}
        <div className="rounded-xl border hairline bg-white p-2.5 flex items-center gap-2">
          <AIPulseDot />
          <div className="text-[10px] font-semibold text-slate-700">AI מסיים לבדוק את המסמך האחרון</div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2 text-center">
            <div className="text-xl font-extrabold text-num text-success">12</div>
            <div className="text-[9px] font-bold text-success/80">מסמכים הושלמו</div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-2 text-center">
            <div className="text-xl font-extrabold text-num text-amber-600">2</div>
            <div className="text-[9px] font-bold text-amber-600/80">חסרים</div>
          </div>
        </div>

        {/* CTA */}
        <button className="mt-auto rounded-xl bg-primary text-white text-[10px] font-bold py-2.5 text-center">
          המשך לשלב הבא ←
        </button>
      </div>
    </div>
  );
}

/* ── FloatingChip ────────────────────────────────────────────────── */

function FloatingChip({
  className, icon, label, tone, delay = '0s',
}: {
  className?: string;
  icon: React.ReactNode;
  label: string;
  tone: 'blue' | 'green' | 'gold';
  delay?: string;
}) {
  const cls = {
    blue:  'bg-secondary text-white shadow-glow-blue',
    green: 'bg-success text-white',
    gold:  'bg-accent text-accent-foreground shadow-glow-gold',
  }[tone];
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-2xl px-3.5 py-2 shadow-floating font-semibold text-xs animate-float-once whitespace-nowrap',
        cls,
        className,
      )}
      style={{ animationDelay: delay }}
    >
      {icon}
      {label}
    </div>
  );
}

/* ── ProcessStep ─────────────────────────────────────────────────── */

function ProcessStep({ n, icon: Icon, label, sub }: {
  n: number; icon: React.ComponentType<{ className?: string }>; label: string; sub: string;
}) {
  return (
    <div className="relative group rounded-2xl border hairline bg-white p-4 hover:-translate-y-1 hover:shadow-card transition-all flex flex-col items-center text-center">
      {/* Number badge — top-right, gold */}
      <div className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-accent text-accent-foreground text-[11px] font-extrabold grid place-items-center shadow-soft text-num z-10">
        {n}
      </div>
      <div className="h-11 w-11 rounded-xl bg-secondary/10 text-secondary grid place-items-center mb-2.5 group-hover:bg-secondary/20 transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm font-bold text-slate-800 leading-tight">{label}</div>
      <div className="text-[10px] text-slate-500 mt-1">{sub}</div>
    </div>
  );
}

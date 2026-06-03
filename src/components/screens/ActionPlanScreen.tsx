import { useState } from 'react';
import {
  Stethoscope, Building2, FlaskConical, Phone, CalendarClock,
  AlertTriangle, CheckCircle2, ChevronLeft, ArrowLeft, Clock,
  Zap, MapPin, Mail, FileText, Star, TrendingUp,
} from 'lucide-react';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import { AIPulseDot } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';

/* ── Data ──────────────────────────────────────────────────────── */

type Urgency = 'high' | 'medium' | 'low';

interface ActionItem {
  id: string;
  type: 'doctor' | 'hospital' | 'lab';
  name: string;
  role: string;
  doc: string;
  impact: string;
  urgency: Urgency;
  deadline: string;
  phone?: string;
  address?: string;
  note?: string;
  done?: boolean;
}

const ACTIONS: ActionItem[] = [
  {
    id: 'gp',
    type: 'doctor',
    name: 'ד"ר כהן — רופא משפחה',
    role: 'מרפאת כללית, רחוב הרצל 14',
    doc: 'גיליון מחלה מסכם + סיכום תרופות עדכני',
    impact: '+18%',
    urgency: 'high',
    deadline: '08.06.2026',
    phone: '02-1234567',
    address: 'מרפאת כללית ירושלים',
    note: 'בקש חתימה על טופס BL/283 בו-זמנית — חוסך ביקור נוסף',
  },
  {
    id: 'hospital',
    type: 'hospital',
    name: 'ביה"ח הדסה עין כרם',
    role: 'מחלקה נוירולוגית',
    doc: 'סיכום אשפוז + דו"ח MRI אחרון',
    impact: '+9%',
    urgency: 'medium',
    deadline: '10.06.2026',
    phone: '02-6776776',
    address: 'קריית הדסה, ירושלים',
    note: 'הזמן בכתב — מחלקת רשומות פתוחה ב-08:00–14:00',
  },
  {
    id: 'lab',
    type: 'lab',
    name: 'מעבדת תל השומר',
    role: 'בדיקות EMG ונוירופיזיולוגיה',
    doc: 'תוצאות EMG מ-2025 (מצב נוירי)',
    impact: '+7%',
    urgency: 'medium',
    deadline: '12.06.2026',
    phone: '03-5302727',
    address: 'שיבא — תל השומר',
    note: 'ניתן לבקש העברת תוצאות דיגיטלית דרך פורטל החולה',
  },
];

const READY_DOCS = [
  { name: 'BL/283 חתום', date: '01.06.2026', tag: 'טופס'  },
  { name: 'חוות דעת נוירולוג', date: '28.05.2026', tag: 'מסמך' },
  { name: 'תוצאות MRI', date: '15.04.2026', tag: 'דימות' },
  { name: 'סיכום שיקום', date: '20.05.2026', tag: 'שיקום' },
];

const URGENCY_MAP: Record<Urgency, { label: string; bg: string; text: string; border: string }> = {
  high:   { label: 'דחוף',   bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'    },
  medium: { label: 'בינוני', bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200'  },
  low:    { label: 'נמוך',   bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200' },
};

const TYPE_ICON: Record<ActionItem['type'], React.ComponentType<{ className?: string }>> = {
  doctor:   Stethoscope,
  hospital: Building2,
  lab:      FlaskConical,
};

const TYPE_COLOR: Record<ActionItem['type'], string> = {
  doctor:   'bg-secondary/10 text-secondary',
  hospital: 'bg-violet-100 text-violet-700',
  lab:      'bg-emerald-100 text-emerald-700',
};

/* ── Main ──────────────────────────────────────────────────────── */

export default function ActionPlanScreen() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string>(ACTIONS[0].id);

  const toggle = (id: string) =>
    setDone((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const completedCount = done.size;
  const totalImpact = ACTIONS.filter((a) => !done.has(a.id)).reduce((s, a) => s + parseInt(a.impact), 0);

  return (
    <div className="space-y-5 animate-fade-in" dir="rtl">

      {/* ═══ HEADER ══════════════════════════════════════════════ */}
      <PremiumCard className="p-5 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardEyebrow color="gold">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3 w-3" />
                AI · תוכנית פעולה מותאמת אישית
              </span>
            </CardEyebrow>
            <h1 className="mt-1.5 text-xl lg:text-2xl font-extrabold text-primary leading-tight">
              תוכנית פעולה להשגת מסמכים
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-lg">
              ה-AI זיהה {ACTIONS.length} פעולות שיעלו את הציון שלך ב-<b className="text-success">+{ACTIONS.reduce((s, a) => s + parseInt(a.impact), 0)}%</b> — ממוינות לפי השפעה ודחיפות.
            </p>
          </div>

          {/* Progress */}
          <div className="shrink-0 text-center rounded-2xl border hairline bg-white p-4 min-w-[140px]">
            <div className="text-3xl font-extrabold text-num text-success leading-none">{completedCount}/{ACTIONS.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">פעולות הושלמו</div>
            {totalImpact > 0 && (
              <div className="mt-2 flex items-center justify-center gap-1 text-xs font-bold text-amber-600">
                <TrendingUp className="h-3 w-3" /> +{totalImpact}% נותרו
              </div>
            )}
          </div>
        </div>

        {/* AI banner */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 font-semibold">
            הפעולה הדחופה ביותר: <b>ד"ר כהן — גיליון מסכם חסר</b> · מועד אחרון: 08.06.2026 · +18% ציון
          </p>
          <button className="mr-auto shrink-0 rounded-xl bg-amber-500 text-white text-xs font-bold px-3 py-1.5 hover:bg-amber-600 transition">
            פתח עכשיו
          </button>
        </div>
      </PremiumCard>

      {/* ═══ 2-COL: TIMELINE + READY DOCS ══════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Action timeline — 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          {ACTIONS.map((a, i) => {
            const isDone = done.has(a.id);
            const Icon = TYPE_ICON[a.type];
            const urg = URGENCY_MAP[a.urgency];
            return (
              <PremiumCard
                key={a.id}
                className={cn(
                  'p-5 relative overflow-hidden transition-all duration-200',
                  isDone ? 'opacity-60' : 'hover:shadow-floating hover:-translate-y-0.5',
                  selected === a.id && !isDone && 'ring-2 ring-secondary/40',
                )}
                onClick={() => setSelected(a.id)}
              >
                {/* Step number */}
                <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-accent text-accent-foreground text-[11px] font-extrabold grid place-items-center shadow-soft text-num">
                  {i + 1}
                </div>

                <div className="flex items-start gap-4 flex-wrap">
                  {/* Icon */}
                  <div className={cn('h-12 w-12 rounded-2xl grid place-items-center shrink-0', TYPE_COLOR[a.type])}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1.5">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-tight">{a.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" /> {a.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full border', urg.bg, urg.text, urg.border)}>
                          {urg.label}
                        </span>
                        <span className="text-lg font-extrabold text-num text-success">{a.impact}</span>
                      </div>
                    </div>

                    {/* Required doc */}
                    <div className="flex items-center gap-2 bg-slate-50 border hairline rounded-xl px-3 py-2 text-sm mb-3">
                      <FileText className="h-4 w-4 text-secondary shrink-0" />
                      <span className="font-semibold text-slate-700">{a.doc}</span>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> מועד: {a.deadline}</span>
                      {a.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {a.phone}</span>}
                    </div>

                    {/* Note */}
                    {a.note && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2">
                        <Star className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800 leading-relaxed">{a.note}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(a.id); }}
                        className={cn(
                          'rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition',
                          isDone
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-primary text-white hover:bg-primary/90',
                        )}
                      >
                        {isDone ? <><CheckCircle2 className="h-3.5 w-3.5" /> הושלם</> : <><CalendarClock className="h-3.5 w-3.5" /> סמן כהושלם</>}
                      </button>
                      {a.phone && (
                        <button className="rounded-xl border hairline bg-white px-3 py-2 text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition">
                          <Phone className="h-3.5 w-3.5 text-secondary" /> התקשר
                        </button>
                      )}
                      <button className="rounded-xl border hairline bg-white px-3 py-2 text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition">
                        <Mail className="h-3.5 w-3.5 text-accent" /> שלח דוא"ל
                      </button>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            );
          })}
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-4">

          {/* Ready docs */}
          <PremiumCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-success/10 text-success grid place-items-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <CardEyebrow color="green">מסמכים מוכנים</CardEyebrow>
                <div className="text-xs text-slate-500">{READY_DOCS.length} הושלמו</div>
              </div>
            </div>
            <ul className="space-y-2">
              {READY_DOCS.map((d) => (
                <li key={d.name} className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                  <span className="flex-1 text-xs font-semibold text-slate-700">{d.name}</span>
                  <span className="text-[9px] text-slate-400">{d.date}</span>
                </li>
              ))}
            </ul>
          </PremiumCard>

          {/* AI insight */}
          <PremiumCard className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <AIPulseDot />
              <span className="text-xs font-bold text-primary">המלצת AI</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              השלמת <b>3 הפעולות</b> תעלה את ציון המוכנות שלך מ-<b className="text-destructive">42%</b> ל-<b className="text-success">76%</b>.
              הפעולה הכי קלה להשגה? <b>מעבדת EMG — בקשה דיגיטלית ב-5 דקות.</b>
            </p>
            <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-[42%] bg-gradient-to-r from-destructive/70 to-destructive rounded-full" />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
              <span>42% כרגע</span>
              <span className="text-success font-bold">76% לאחר השלמה</span>
            </div>
          </PremiumCard>

          {/* Bottom CTA */}
          <button className="w-full rounded-2xl bg-primary text-white font-bold py-3.5 flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-floating text-sm">
            <span>המשך לשלב הוועדה</span>
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

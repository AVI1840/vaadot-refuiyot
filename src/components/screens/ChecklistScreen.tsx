import { useState } from 'react';
import {
  Search, Plus, Check, CheckCircle2, Circle, AlertTriangle,
  FileText, Filter, Sparkles, Brain, TrendingUp, Upload,
  ArrowLeft, ChevronLeft, Zap, ShieldCheck, FileCheck2
} from 'lucide-react';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import ScoreGauge from '@/components/premium/ScoreGauge';
import { AIPulseDot, AIBadge } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  name: string;
  tag: string;
  status: 'open' | 'done';
  impact: number; // score delta % when completed
  reason: string; // AI reasoning chip
}

interface Category {
  id: string;
  label: string;
  eyebrow: string;
  tone: 'red' | 'gold' | 'green';
  items: ChecklistItem[];
}

const CATEGORIES: Category[] = [
  {
    id: 'mandatory',
    label: 'חובה — נדרשים על־ידי הוועדה',
    eyebrow: 'חובה',
    tone: 'red',
    items: [
      {
        name: 'סיכום אישפוז קרדיולוגי',
        tag: 'מסמך רפואי',
        status: 'open',
        impact: 18,
        reason: 'נדרש לפי תקנות ועדת נכות כללית סעיף 5(ג)',
      },
      {
        name: 'בדיקת HbA1c',
        tag: 'בדיקת מעבדה',
        status: 'open',
        impact: 15,
        reason: 'ביומרקר מרכזי לאבחון רמת הסוכרת — מחייב בכל תיק',
      },
      {
        name: 'טופס BL/283 חתום',
        tag: 'טופס',
        status: 'open',
        impact: 12,
        reason: 'טופס רשמי של הביטוח הלאומי — ללא חתימה הוועדה לא מתכנסת',
      },
      {
        name: 'רישום תרופות עדכני',
        tag: 'מסמך רפואי',
        status: 'open',
        impact: 10,
        reason: 'מוכיח טיפול מתמשך — מגדיל משקל ההצהרה הרפואית',
      },
      {
        name: 'חוות דעת אנדוקרינולוג',
        tag: 'חוו״ד מומחה',
        status: 'open',
        impact: 16,
        reason: 'ועדות נכות מסוג זה מקבלות 23% יותר אישורים עם חוו״ד מומחה',
      },
    ],
  },
  {
    id: 'recommended',
    label: 'מומלץ — מחזק תיקים מסוג זה',
    eyebrow: 'מומלץ',
    tone: 'gold',
    items: [
      {
        name: 'גרף בדיקות (סוכר/לחץ דם)',
        tag: 'נתונים',
        status: 'open',
        impact: 8,
        reason: 'ויזואליזציה של מגמה ארוכת טווח — משכנע ועדות',
      },
      {
        name: 'יומן רישום ערכים 30 ימים',
        tag: 'יומן',
        status: 'open',
        impact: 6,
        reason: 'מסמך עצמי חשוב המוכיח תלות יומיומית',
      },
      {
        name: 'תיעוד אירועים היפו-גליקמיים',
        tag: 'יומן',
        status: 'open',
        impact: 7,
        reason: 'אירועי היפוגליקמיה מהווים גורם החמרה מוכר בתקנות',
      },
    ],
  },
  {
    id: 'optional',
    label: 'רשות — תורם לציון מוכנות',
    eyebrow: 'רשות',
    tone: 'green',
    items: [
      {
        name: 'חוות דעת תזונאית',
        tag: 'חוו״ד',
        status: 'done',
        impact: 3,
        reason: 'מחזק את תמונת הטיפול הרב-תחומי',
      },
      {
        name: 'תיעוד פגישות עו״ס',
        tag: 'מסמך',
        status: 'done',
        impact: 2,
        reason: 'מראה מודעות לצרכים סוציאליים — תורם לציון',
      },
    ],
  },
];

const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items);
const INITIAL_DONE = new Set(ALL_ITEMS.filter((i) => i.status === 'done').map((i) => i.name));
const TOTAL = ALL_ITEMS.length;
const MAX_SCORE = 81; // projected score after full completion

export default function ChecklistScreen({ onNext }: { onNext?: () => void }) {
  const [done, setDone] = useState<Set<string>>(INITIAL_DONE);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const completed = done.size;
  const completionPct = Math.round((completed / TOTAL) * 100);

  // Calculate current readiness score based on completed items
  const baseScore = 20;
  const completedImpact = ALL_ITEMS.filter((i) => done.has(i.name)).reduce((sum, i) => sum + i.impact, 0);
  const totalImpact = ALL_ITEMS.reduce((sum, i) => sum + i.impact, 0);
  const currentScore = Math.min(
    Math.round(baseScore + (completedImpact / totalImpact) * (MAX_SCORE - baseScore)),
    MAX_SCORE
  );

  // Missing mandatory count
  const missingMandatory = CATEGORIES.find((c) => c.id === 'mandatory')!
    .items.filter((i) => !done.has(i.name)).length;
  const missingImpact = ALL_ITEMS.filter((i) => !done.has(i.name)).reduce((sum, i) => sum + i.impact, 0);

  const toggle = (name: string) => {
    setDone((s) => {
      const n = new Set(s);
      n.has(name) ? n.delete(name) : n.add(name);
      return n;
    });
  };

  return (
    <div className="space-y-5 animate-fade-in" dir="rtl">

      {/* ── SMART HEADER CARD ── */}
      <PremiumCard className="p-6 lg:p-8 bg-gradient-to-br from-white via-white to-blue-50/60">
        {/* Top row */}
        <div className="flex items-start justify-between gap-6 flex-wrap">
          {/* Left: title + AI insight */}
          <div className="flex-1 min-w-[220px]">
            <CardEyebrow color="blue">
              <span className="flex items-center gap-1.5">
                <Brain className="h-3 w-3" />
                צ׳קליסט חכם · סוכרת — נכות כללית
              </span>
            </CardEyebrow>
            <h1 className="mt-2 text-xl lg:text-2xl font-extrabold text-primary leading-tight">
              {completed} מתוך {TOTAL} הושלמו
            </h1>

            {/* AI Insight banner */}
            <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Zap className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm font-semibold text-amber-800 leading-snug">
                {missingMandatory > 0
                  ? `זיהיתי ${missingMandatory} מסמכי חובה חסרים שמורידים את הציון שלך ב-${missingImpact}% — הוסף אותם כדי לקפוץ ל-${Math.min(currentScore + missingImpact, MAX_SCORE)}%`
                  : 'כל מסמכי החובה הושלמו — הציון המקסימלי שלך נגיש!'}
              </p>
            </div>

            {/* CTA */}
            {missingMandatory > 0 && (
              <button className="mt-4 flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-3 text-sm font-bold shadow-card hover:shadow-floating transition-all hover:-translate-y-0.5">
                <Upload className="h-4 w-4" />
                העלה {missingMandatory} מסמכי חובה
                <ChevronLeft className="h-4 w-4" />
                <span className="text-accent">קפוץ ל-{Math.min(currentScore + missingImpact, MAX_SCORE)}%</span>
              </button>
            )}
          </div>

          {/* Right: dual gauge */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="text-center">
              <ScoreGauge value={currentScore} size={88} stroke={9} />
              <p className="mt-1.5 text-xs font-bold text-muted-foreground">עכשיו</p>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-wide">פוטנציאל</span>
            </div>
            <div className="text-center">
              <ScoreGauge value={MAX_SCORE} size={88} stroke={9} />
              <p className="mt-1.5 text-xs font-bold text-success">לאחר השלמה</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full rounded-xl border hairline bg-white pr-9 pl-3 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              placeholder="חיפוש מסמך…"
              dir="rtl"
            />
          </div>
          <button className="rounded-xl border hairline bg-white px-3 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition">
            <Filter className="h-4 w-4" />
            סינון
          </button>
          <button className="rounded-xl border hairline bg-white px-3 py-2.5 text-sm font-medium text-slate-500 flex items-center gap-2 hover:bg-slate-50 transition">
            <Plus className="h-4 w-4" />
            הוסף ידנית
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold text-success mr-auto">
            <AIPulseDot />
            AI מתעדכן בזמן אמת
          </div>
        </div>
      </PremiumCard>

      {/* ── CATEGORY SECTIONS ── */}
      {CATEGORIES.map((cat) => {
        const catCompleted = cat.items.filter((i) => done.has(i.name)).length;
        const catTotal = cat.items.length;
        const catPct = Math.round((catCompleted / catTotal) * 100);

        return (
          <PremiumCard key={cat.id} className="p-5 overflow-hidden">

            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-eyebrow px-2.5 py-1 rounded-md font-bold',
                  cat.tone === 'red' && 'bg-red-50 text-red-700',
                  cat.tone === 'gold' && 'bg-amber-50 text-amber-700',
                  cat.tone === 'green' && 'bg-emerald-50 text-emerald-700',
                )}>
                  {cat.eyebrow}
                </span>
                <h3 className={cn(
                  'text-sm font-bold',
                  cat.tone === 'red' && 'text-red-800',
                  cat.tone === 'gold' && 'text-amber-800',
                  cat.tone === 'green' && 'text-emerald-800',
                )}>
                  {cat.label.split('—')[1]?.trim()}
                </h3>
              </div>
              <span className="text-xs text-num font-semibold text-muted-foreground">
                {catCompleted}/{catTotal}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {cat.items.map((item) => {
                const isDone = done.has(item.name);
                const isHovered = hoveredItem === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => toggle(item.name)}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      'w-full text-right group flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200',
                      isDone
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-white border-slate-200 hover:shadow-card hover:border-slate-300',
                    )}
                  >
                    {/* Checkbox */}
                    <span className={cn(
                      'h-7 w-7 rounded-full grid place-items-center shrink-0 transition-all duration-200',
                      isDone
                        ? 'bg-success text-white shadow-glow-blue'
                        : 'border-2 border-slate-300 text-transparent group-hover:border-secondary',
                    )}>
                      {isDone
                        ? <Check className="h-4 w-4" strokeWidth={3} />
                        : <Check className="h-3.5 w-3.5 opacity-0 group-hover:opacity-30 transition" strokeWidth={3} />
                      }
                    </span>

                    {/* Doc icon */}
                    <FileCheck2 className={cn(
                      'h-4 w-4 shrink-0 transition',
                      isDone ? 'text-success' : 'text-slate-400',
                    )} />

                    {/* Name + reason */}
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        'block text-sm font-semibold leading-tight transition',
                        isDone ? 'line-through text-slate-400' : 'text-slate-800',
                      )}>
                        {item.name}
                      </span>
                      {(isHovered || isDone) && (
                        <span className={cn(
                          'block text-xs mt-0.5 leading-snug transition animate-fade-in',
                          isDone ? 'text-emerald-600' : 'text-slate-500',
                        )}>
                          {isDone ? '✓ הושלם' : item.reason}
                        </span>
                      )}
                    </div>

                    {/* Tag badge */}
                    <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                      {item.tag}
                    </span>

                    {/* Impact badge — hidden when done */}
                    {!isDone && (
                      <span className={cn(
                        'shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition',
                        cat.tone === 'red' && 'bg-red-50 text-red-700',
                        cat.tone === 'gold' && 'bg-amber-50 text-amber-700',
                        cat.tone === 'green' && 'bg-emerald-50 text-emerald-700',
                      )}>
                        <TrendingUp className="h-3 w-3" />
                        +{item.impact}%
                      </span>
                    )}

                    {/* Hover chevron */}
                    <ChevronLeft className={cn(
                      'h-4 w-4 text-slate-300 shrink-0 transition-all duration-150',
                      isHovered ? 'opacity-100 -translate-x-0.5' : 'opacity-0',
                    )} />
                  </button>
                );
              })}
            </div>

            {/* Section progress bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                <span>{catCompleted} מתוך {catTotal} הושלמו</span>
                <span>{catPct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    cat.tone === 'red' && 'bg-red-500',
                    cat.tone === 'gold' && 'bg-amber-500',
                    cat.tone === 'green' && 'bg-emerald-500',
                  )}
                  style={{ width: `${catPct}%` }}
                />
              </div>
            </div>
          </PremiumCard>
        );
      })}

      {/* ── BOTTOM CTA — what happens next ── */}
      <PremiumCard className="p-6 bg-gradient-to-br from-primary/5 via-white to-secondary/5 border-secondary/20">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 grid place-items-center">
              <ShieldCheck className="h-5 w-5 text-secondary" />
            </div>
            <div dir="rtl">
              <p className="text-sm font-extrabold text-primary">מה קורה אחרי שמשלימים?</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                הצ׳קליסט מועבר אוטומטית לוועדה · ה-AI מסכם את התיק · אתה מקבל עדיפות בתור
              </p>
            </div>
          </div>
          <button
            onClick={onNext}
            className="flex items-center gap-2 bg-secondary text-white rounded-xl px-5 py-3 text-sm font-bold shadow-card hover:shadow-floating transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            המשך להעלאת מסמכים
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </PremiumCard>

    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Upload, FileText, CheckCircle2, AlertTriangle, FileImage, FileType,
  ScanLine, Sparkles, Clock, ArrowLeft, Zap, ShieldCheck, FileCheck2,
  TrendingUp, Brain
} from 'lucide-react';
import PremiumCard, { CardEyebrow, StatTile } from '@/components/premium/PremiumCard';
import { AIPulseDot, AIBadge } from '@/components/premium/AIPulse';
import ScoreGauge from '@/components/premium/ScoreGauge';
import { cn } from '@/lib/utils';

/* ─── data ────────────────────────────────────────────────────────────────── */

const FILES = [
  { name: '2026_06_01_neurologist.pdf', size: '2.1MB', status: 'ok' as const,         note: 'זוהתה חוו״ד נוירולוג · 04/2026' },
  { name: 'BL283_signed.pdf',            size: '0.8MB', status: 'ok' as const,         note: 'טופס BL/283 חתום ומלא' },
  { name: 'MRI_scan_results.jpg',        size: '4.7MB', status: 'processing' as const, note: 'OCR בעיבוד · עמוד 3 מתוך 8' },
  { name: 'rehab_summary.docx',          size: '1.2MB', status: 'warn' as const,       note: 'חסרה חתימת מנהל מחלקת שיקום' },
  { name: 'emg_results.pdf',             size: '3.4MB', status: 'ok' as const,         note: 'בדיקת EMG · 03/2026' },
];

const AI_FEATURES = [
  { icon: ScanLine,      label: 'OCR חכם',          color: 'text-secondary' },
  { icon: Sparkles,      label: 'הצלבה אוטומטית',    color: 'text-accent' },
  { icon: AlertTriangle, label: 'התראות מיידיות',    color: 'text-amber-500' },
  { icon: ShieldCheck,   label: 'אימות חתימות',       color: 'text-success' },
];

/* ─── component ──────────────────────────────────────────────────────────── */

export default function UploadScreen({ onNext }: { onNext?: () => void }) {
  /* Animate readiness score from 66 → 75 on mount */
  const [score, setScore] = useState(66);
  const [ocrProgress, setOcrProgress] = useState(37); // 3/8 pages ≈ 37%

  useEffect(() => {
    const t = setTimeout(() => setScore(75), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOcrProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <PremiumCard className="p-6 lg:p-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-0">
            <CardEyebrow color="blue">העלאת מסמכים</CardEyebrow>
            <h1 className="mt-2 text-xl lg:text-2xl font-extrabold text-primary leading-tight">
              העלאת מסמכים וסריקה חכמה
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-lg">
              גרור־ושחרר, צלם מהטלפון, או בחר מקובץ. ה-AI מסווג כל מסמך אוטומטית ומסמן פערים.
            </p>
          </div>

          {/* Readiness ring — hero stat */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative h-[88px] w-[88px]">
              <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
                <circle cx="44" cy="44" r="36" fill="none" stroke="hsl(215 16% 90%)" strokeWidth="7" />
                <circle
                  cx="44" cy="44" r="36" fill="none"
                  stroke="hsl(152 76% 36%)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - score / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-num text-xl font-extrabold text-success leading-none">{score}%</span>
                <span className="text-[9px] text-muted-foreground font-semibold mt-0.5 leading-none">מוכנות</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">הצ׳קליסט</div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">3 מתוך 4 פריטים ✓</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" /> +9% מהעלאה אחרונה
              </div>
            </div>
          </div>
        </div>
      </PremiumCard>

      {/* ── CRITICAL ALERT (warn row elevated) ───────────────────────────── */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4 flex items-center justify-between gap-4 shadow-soft">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-amber-100 border border-amber-300 grid place-items-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="font-bold text-amber-900 text-sm">פריט 1 חוסם אישור ועדה — חסרה חתימה</div>
            <div className="text-xs text-amber-700 mt-0.5">
              <span className="font-semibold">rehab_summary.docx</span> · חסרה חתימת מנהל מחלקת שיקום · AI זיהה את הפער אוטומטית
            </div>
          </div>
        </div>
        <button className="shrink-0 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 transition-colors">
          הנחה לחתימה
        </button>
      </div>

      {/* ── TWO-COL: DROPZONE + PREVIEW ───────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — Drop zone hero */}
        <PremiumCard className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">גרור מסמכים לכאן</h3>
          </div>

          {/* AI feature badge row — above drop zone, scannable */}
          <div className="flex flex-wrap gap-2">
            {AI_FEATURES.map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1.5 rounded-full border hairline bg-white px-3 py-1 text-xs font-semibold shadow-soft">
                <f.icon className={cn('h-3.5 w-3.5', f.color)} />
                {f.label}
              </span>
            ))}
          </div>

          {/* Drop zone — dominant */}
          <div className="flex-1 min-h-[200px] rounded-2xl border-2 border-dashed border-secondary/40 bg-gradient-to-b from-secondary/5 to-secondary/10 grid place-items-center p-10 text-center cursor-pointer transition-all hover:border-secondary hover:from-secondary/10 hover:to-secondary/15 hover:shadow-glow-blue group">
            <div>
              <div className="mx-auto h-16 w-16 rounded-2xl bg-white shadow-card grid place-items-center group-hover:scale-105 transition-transform">
                <Upload className="h-7 w-7 text-secondary" />
              </div>
              <div className="mt-4 font-bold text-slate-800">גרור קבצים לכאן</div>
              <div className="mt-1 text-xs text-muted-foreground">PDF · JPG · PNG · DOCX · עד 25MB</div>
              <button className="mt-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 transition-colors shadow-card">
                בחר קבצים
              </button>
              <div className="mt-3 text-[11px] text-muted-foreground">צילום ישיר מהמצלמה זמין במכשירים ניידים</div>
            </div>
          </div>
        </PremiumCard>

        {/* RIGHT — Last uploaded preview */}
        <PremiumCard className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">מסמך אחרון שעלה</h3>
            <span className="text-xs text-success flex items-center gap-1.5 font-semibold">
              <AIPulseDot /> AI מנתח
            </span>
          </div>

          {/* Mock document thumbnail — credible visual */}
          <div className="rounded-xl border hairline bg-slate-50 p-4 flex gap-4 items-start">
            {/* Styled PDF thumbnail */}
            <div className="shrink-0 w-[80px] aspect-[3/4] rounded-lg bg-white border hairline shadow-card overflow-hidden flex flex-col">
              {/* PDF header bar */}
              <div className="h-3 bg-rose-500 flex items-center px-1.5 gap-1">
                <div className="h-1 w-1 rounded-full bg-white/70" />
                <div className="h-1 flex-1 rounded-full bg-white/40" />
              </div>
              {/* Simulated text lines */}
              <div className="flex-1 p-2 space-y-1.5">
                <div className="h-1.5 bg-slate-200 rounded-full w-full" />
                <div className="h-1.5 bg-slate-200 rounded-full w-4/5" />
                <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                <div className="h-1.5 bg-slate-200 rounded-full w-3/4" />
                <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                <div className="h-1.5 bg-slate-200 rounded-full w-5/6" />
                <div className="h-2 bg-slate-100 rounded-full w-full mt-1" />
                <div className="h-1.5 bg-slate-200 rounded-full w-2/3" />
                <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                <div className="h-1.5 bg-slate-200 rounded-full w-4/5" />
              </div>
              <div className="h-2 bg-slate-100 border-t hairline flex items-center justify-center">
                <div className="text-[5px] text-slate-400 font-mono">PDF</div>
              </div>
            </div>

            <div className="flex-1 min-w-0 text-sm">
              <div className="font-bold text-slate-800 text-sm truncate">2026_06_01_neurologist.pdf</div>
              <div className="text-xs text-muted-foreground mt-0.5">12 עמודים · 2.1MB · נסרק תוך 3.4 שניות</div>
              <ul className="mt-3 space-y-2 text-xs">
                <CheckLine ok>זוהה כחוו״ד נוירולוג</CheckLine>
                <CheckLine ok>תאריך 04/2026 (תקף)</CheckLine>
                <CheckLine ok>חתימה דיגיטלית מאומתת</CheckLine>
                <CheckLine ok>שויך לפריט: <b>חוות דעת נוירולוג עדכנית</b></CheckLine>
              </ul>
            </div>
          </div>

          {/* Readiness delta — hero callout */}
          <div className="rounded-xl bg-success/10 border border-success/20 px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-success/20 grid place-items-center shrink-0">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="text-success font-extrabold text-base leading-tight">ציון מוכנות עלה ב-9%</div>
              <div className="text-xs text-success/80 mt-0.5">מ-66% ל-75% — מסמך זה השלים פריט קריטי</div>
            </div>
          </div>
        </PremiumCard>
      </section>

      {/* ── FILES TABLE ────────────────────────────────────────────────────── */}
      <PremiumCard className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b hairline flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-slate-800">מסמכים שעלו לאחרונה</h3>
          </div>
          {/* Summary callout — 30-second takeaway */}
          <div className="inline-flex items-center gap-2 rounded-xl border hairline bg-slate-50 px-4 py-2">
            <Brain className="h-4 w-4 text-secondary" />
            <span className="text-sm font-bold text-slate-800">3 מתוך 4 פריטים נדרשים ✓</span>
            <span className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 rounded-md px-2 py-0.5">מסמך 1 חסר</span>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-muted-foreground">
            <tr className="text-right">
              <th className="p-3 font-bold">סטטוס</th>
              <th className="p-3 font-bold">קובץ</th>
              <th className="p-3 font-bold">גודל</th>
              <th className="p-3 font-bold">פעולת AI</th>
              <th className="p-3 font-bold" />
            </tr>
          </thead>
          <tbody>
            {FILES.map((f) => (
              <tr
                key={f.name}
                className={cn(
                  'border-t hairline transition-colors',
                  f.status === 'warn'
                    ? 'bg-amber-50/60 hover:bg-amber-50'
                    : 'hover:bg-slate-50/60'
                )}
              >
                <td className="p-3 whitespace-nowrap"><StatusPill status={f.status} /></td>
                <td className="p-3 font-semibold">
                  <div className="flex items-center gap-2">
                    <FileExt name={f.name} />
                    <span className="truncate max-w-[180px]">{f.name}</span>
                  </div>
                </td>
                <td className="p-3 text-num text-muted-foreground whitespace-nowrap">{f.size}</td>
                <td className="p-3 text-muted-foreground">
                  {f.status === 'processing' ? (
                    <div className="space-y-1">
                      <div className="text-xs text-secondary font-semibold">{f.note}</div>
                      {/* Live OCR progress bar */}
                      <div className="h-1.5 w-40 rounded-full bg-secondary/15 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-secondary transition-all duration-300"
                          style={{ width: `${ocrProgress}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground">{Math.round(ocrProgress / 12.5)} מתוך 8 עמודות</div>
                    </div>
                  ) : f.status === 'warn' ? (
                    <span className="text-amber-700 font-semibold">{f.note}</span>
                  ) : (
                    <span>{f.note}</span>
                  )}
                </td>
                <td className="p-3 text-left">
                  <button className="text-secondary text-xs font-bold flex items-center gap-1 mr-auto whitespace-nowrap">
                    פתח <ArrowLeft className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PremiumCard>

      {/* ── Next Step CTA */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="rounded-2xl bg-primary text-white font-bold px-8 py-3.5 flex items-center gap-2 hover:bg-primary/90 transition shadow-floating text-sm"
        >
          המשך לניתוח AI
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function CheckLine({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className={cn('h-4 w-4 mt-0.5 shrink-0', ok ? 'text-success' : 'text-amber-500')} />
      <span>{children}</span>
    </li>
  );
}

function StatusPill({ status }: { status: 'ok' | 'warn' | 'processing' }) {
  if (status === 'ok')
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
        <CheckCircle2 className="h-3 w-3" /> תקין
      </span>
    );
  if (status === 'warn')
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
        <AlertTriangle className="h-3 w-3" /> השלמה נדרשת
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">
      <AIPulseDot /> מעובד
    </span>
  );
}

function FileExt({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf')                   return <FileType className="h-4 w-4 text-rose-500 shrink-0" />;
  if (ext === 'jpg' || ext === 'png')  return <FileImage className="h-4 w-4 text-secondary shrink-0" />;
  return <FileText className="h-4 w-4 text-slate-500 shrink-0" />;
}

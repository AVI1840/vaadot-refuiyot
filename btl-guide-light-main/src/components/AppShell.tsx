import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bot, Sparkles, FileCheck, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// APP SHELL — Persistent sidebar + top stepper
// Matches the screenshot design: dark-blue left sidebar, numbered step bar
// ═══════════════════════════════════════════════════════════════════════════════

const STEPS = [
  { id: 1, label: 'זיהוי' },
  { id: 2, label: 'צ\'קליסט' },
  { id: 3, label: 'השגה' },
  { id: 4, label: 'העלאה' },
  { id: 5, label: 'טופס' },
  { id: 6, label: 'הערכה' },
  { id: 7, label: 'הכנה' },
];

interface AppShellProps {
  children: React.ReactNode;
  currentStep: number;
  score: number;
  totalDocs: number;
  completedDocs: number;
  missingRequired: string[];
  greenPathCount: number;
  conditions: string[];
}

export default function AppShell({ children, currentStep, score, totalDocs, completedDocs, missingRequired, greenPathCount, conditions }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scoreColor = score >= 70 ? '#10B981' : score >= 45 ? '#F59E0B' : '#EF4444';
  const scoreLabel = score >= 70 ? 'גבוה' : score >= 45 ? 'בינוני' : 'נמוך';
  const progressPct = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background" dir="rtl">
      {/* ─── Top Header ─────────────────────────────────────────────── */}
      <header className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#003B7A] text-white flex items-center justify-center text-xs font-bold">ב״ל</div>
          <div>
            <div className="text-sm font-bold text-[#003B7A] leading-tight">תביעה ביום</div>
            <div className="text-[10px] text-muted-foreground">ליווי חכם להגשת תביעת נכות</div>
          </div>
        </div>

        {/* Step Bar — LTR direction */}
        <div className="hidden md:flex items-center gap-0" dir="ltr">
          {STEPS.map((step, i) => {
            const done = step.id < currentStep;
            const active = step.id === currentStep;
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center gap-0.5" style={{ minWidth: 48 }}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    done ? 'bg-[#10B981] text-white' :
                    active ? 'bg-[#003B7A] text-white shadow-sm shadow-[#003B7A]/30' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {done ? '✓' : step.id}
                  </div>
                  <span className={`text-[9px] ${active ? 'text-[#003B7A] font-bold' : done ? 'text-[#10B981]' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-[2px] mb-3 ${done ? 'bg-[#10B981]' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Bedrock badge */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-[10px] border-[#003B7A]/20 text-[#003B7A]">
            <Sparkles className="h-3 w-3 ml-1 text-[#E8A020]" /> מופעל ע״י Amazon Bedrock
          </Badge>
        </div>
      </header>

      {/* ─── Body: Sidebar + Content ────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-[240px]' : 'w-0'} transition-all duration-300 bg-[#003B7A] text-white overflow-hidden shrink-0 relative hidden md:block`}>
          <div className="p-5 space-y-5 h-full overflow-y-auto" style={{ minWidth: 240 }}>
            {/* Score */}
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-white/50 mb-3">ציון מוכנות</div>
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 314} 314`}
                    className="gauge-ring" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold">{score}</span>
                  <span className="text-[10px] text-white/50">/100</span>
                </div>
              </div>
              <Badge className="text-[10px]" style={{ backgroundColor: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}40` }}>
                {scoreLabel}
              </Badge>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-[10px] text-white/60 mb-1.5">
                <span>התקדמות כוללת</span>
                <span>{completedDocs} מתוך {totalDocs}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            {/* Missing Required */}
            {missingRequired.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/60 mb-2">
                  <AlertCircle className="h-3 w-3" />
                  <span>מסמכים חסרים ({missingRequired.length})</span>
                </div>
                <div className="space-y-1.5">
                  {missingRequired.slice(0, 4).map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-white/80 bg-white/5 rounded-lg px-2.5 py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      <span className="truncate">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Green Path */}
            {greenPathCount > 0 && (
              <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <FileCheck className="h-4 w-4 text-[#10B981]" />
                  <span className="text-xs font-bold text-[#10B981]">מסלול ירוק</span>
                </div>
                <div className="text-[10px] text-white/70">{greenPathCount} מסמכים אובייקטיביים</div>
                <div className="text-[10px] text-white/50">אישור מהיר ✓</div>
              </div>
            )}

            {/* Conditions */}
            {conditions.length > 0 && (
              <div>
                <div className="text-[10px] text-white/50 mb-2">לקויות מזוהות</div>
                <div className="flex flex-wrap gap-1.5">
                  {conditions.map((c, i) => (
                    <span key={i} className="text-[10px] bg-white/10 rounded-full px-2.5 py-1 text-white/80">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Status */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-medium">נועם כאן בשבילך</div>
                  <div className="text-[9px] text-white/50">שאל כל שאלה</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Toggle Sidebar */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex absolute left-[240px] top-1/2 -translate-y-1/2 z-30 w-5 h-10 bg-white border shadow-sm rounded-r-lg items-center justify-center text-gray-400 hover:text-gray-600"
          style={{ left: sidebarOpen ? 240 : 0, transition: 'left 0.3s' }}>
          {sidebarOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

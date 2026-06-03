import { useState, useEffect, useRef } from 'react';
import {
  Bot, Send, CheckCircle2, FileText, Sparkles, Shield, Phone,
  User, MapPin, Calendar, AlertTriangle, ArrowLeft, Zap, Clock,
} from 'lucide-react';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import { AIPulseDot } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';

/* ── Form state ─────────────────────────────────────────────────── */

interface FormField {
  id: string;
  label: string;
  value: string;
  done: boolean;
}

const INITIAL_FIELDS: FormField[] = [
  { id: 'name',    label: 'שם מלא',          value: '',             done: false },
  { id: 'id',      label: 'מספר תעודת זהות',  value: '',             done: false },
  { id: 'dob',     label: 'תאריך לידה',       value: '',             done: false },
  { id: 'address', label: 'כתובת מגורים',     value: '',             done: false },
  { id: 'phone',   label: 'טלפון',            value: '',             done: false },
  { id: 'diag',    label: 'אבחנה ראשית',      value: '',             done: false },
  { id: 'onset',   label: 'תאריך תחילת מחלה', value: '',             done: false },
  { id: 'doctor',  label: 'רופא מטפל',        value: '',             done: false },
];

/* ── Chat messages ──────────────────────────────────────────────── */

interface ChatMsg {
  who: 'ai' | 'user';
  text: string;
  fieldFilled?: string;
}

const INITIAL_MESSAGES: ChatMsg[] = [
  {
    who: 'ai',
    text: 'שלום! אני נועם — אמלא איתך את טופס BL/283 שלב אחר שלב. הטופס ישמר אוטומטית. מוכן להתחיל?',
  },
  {
    who: 'user',
    text: 'כן, מוכן',
  },
  {
    who: 'ai',
    text: 'מצוין! נתחיל בפרטים הבסיסיים. מה שמך המלא כפי שמופיע בתעודת הזהות?',
  },
  {
    who: 'user',
    text: 'ישראל ישראלי',
  },
  {
    who: 'ai',
    text: 'תודה, ישראל ✓ הוספתי לטופס. עכשיו — מה מספר תעודת הזהות שלך?',
    fieldFilled: 'name',
  },
  {
    who: 'user',
    text: '042-123-456',
  },
  {
    who: 'ai',
    text: 'תעודת הזהות נרשמה ✓ כדי שהטופס יהיה תקני, אצטרך גם את תאריך לידתך (DD/MM/YYYY).',
    fieldFilled: 'id',
  },
];

const FILLED_VALUES: Record<string, string> = {
  name: 'ישראל ישראלי',
  id:   '042-123-456',
};

/* ── Typing indicator ───────────────────────────────────────────── */

function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-4 py-2.5">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
      ))}
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────── */

export default function BL283Screen() {
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [fields, setFields] = useState<FormField[]>(() =>
    INITIAL_FIELDS.map((f) => ({ ...f, value: FILLED_VALUES[f.id] ?? '', done: !!FILLED_VALUES[f.id] }))
  );
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: 9999, behavior: 'smooth' });
  }, [messages, typing]);

  const completedCount = fields.filter((f) => f.done).length;
  const pct = Math.round((completedCount / fields.length) * 100);

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { who: 'user', text }]);
    setTyping(true);

    // Simulate AI filling the next field
    const nextField = fields.find((f) => !f.done);
    setTimeout(() => {
      setTyping(false);
      if (nextField) {
        setFields((prev) => prev.map((f) => f.id === nextField.id ? { ...f, value: text, done: true } : f));
        const nextNextField = fields.find((f) => !f.done && f.id !== nextField.id);
        const reply = nextNextField
          ? `${nextField.label} נרשם ✓ כעת אצטרך גם את ה${nextNextField.label} שלך.`
          : 'מצוין! כל השדות הבסיסיים הושלמו. הטופס מוכן לחתימה ולשליחה לביטוח לאומי.';
        setMessages((prev) => [...prev, { who: 'ai', text: reply, fieldFilled: nextField.id }]);
      }
    }, 1100);
  };

  return (
    <div className="space-y-5 animate-fade-in" dir="rtl">

      {/* ═══ HEADER ══════════════════════════════════════════════ */}
      <PremiumCard className="p-5 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardEyebrow color="blue">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                AI ממלא איתך · טופס רשמי
              </span>
            </CardEyebrow>
            <h1 className="mt-1.5 text-xl lg:text-2xl font-extrabold text-primary leading-tight">
              טופס BL/283 — תביעת נכות כללית
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              ה-AI ישאל אותך שאלות קצרות וימלא את הטופס אוטומטית. ממוצע: 4 דקות.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-num text-success leading-none">{pct}%</div>
              <div className="text-[11px] text-slate-500">הושלם</div>
            </div>
            {/* Mini progress bar */}
            <div className="h-16 w-1.5 rounded-full bg-slate-100 overflow-hidden flex flex-col justify-end">
              <div className="rounded-full bg-success transition-all duration-700" style={{ height: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Field progress dots */}
        <div className="mt-4 flex flex-wrap gap-2">
          {fields.map((f) => (
            <span key={f.id} className={cn(
              'inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1 border transition-all',
              f.done
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-400',
            )}>
              {f.done ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />}
              {f.label}
            </span>
          ))}
        </div>
      </PremiumCard>

      {/* ═══ 2-COL: CHAT + FORM PREVIEW ════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Chat — 3/5 */}
        <PremiumCard className="p-0 lg:col-span-3 flex flex-col overflow-hidden" style={{ height: 560 }}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b hairline bg-white">
            <div className="relative">
              <div className="h-11 w-11 rounded-full bg-primary text-white grid place-items-center shadow-glow-blue">
                <Bot className="h-5 w-5" />
              </div>
              <span className="absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full bg-success border-2 border-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-extrabold text-primary">נועם · ממלא טפסים</div>
              <div className="text-[11px] text-success flex items-center gap-1">
                <AIPulseDot />
                <span>מקשיב ורושם לטופס בזמן אמת</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5">
              <Shield className="h-3.5 w-3.5 text-success" />
              <span className="text-[11px] font-bold text-emerald-700">מוצפן · KMS</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50/60">
            {messages.map((msg, i) => {
              const isAi = msg.who === 'ai';
              return (
                <div key={i} className={cn('flex gap-2 animate-fade-in', isAi ? 'justify-start' : 'justify-end')}>
                  {isAi && (
                    <div className="h-7 w-7 rounded-full bg-primary text-white grid place-items-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft leading-relaxed',
                    isAi
                      ? msg.fieldFilled
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-tr-md'
                        : 'bg-white border hairline text-slate-800 rounded-tr-md'
                      : 'bg-secondary text-white rounded-tl-md',
                  )}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            {typing && (
              <div className="flex gap-2 items-end animate-fade-in">
                <div className="h-7 w-7 rounded-full bg-primary text-white grid place-items-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-white border hairline rounded-2xl rounded-tr-md shadow-soft">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t hairline bg-white">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-xl border hairline bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/30"
                placeholder="כתוב לנועם…"
                dir="rtl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="h-11 w-11 rounded-xl bg-primary text-white grid place-items-center hover:bg-primary/90 transition shrink-0"
              >
                <Send className="h-4 w-4 rotate-180" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {['כן', 'ישראל ישראלי', '01/01/1980', 'ירושלים 123'].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-[11px] font-semibold text-secondary border border-secondary/30 rounded-full px-3 py-1 hover:bg-secondary/8 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </PremiumCard>

        {/* Form preview — 2/5 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Form visual */}
          <PremiumCard className="p-0 overflow-hidden">
            {/* Official form header */}
            <div className="bg-primary px-5 py-4 flex items-center justify-between">
              <div>
                <div className="text-white font-extrabold text-base">טופס BL/283</div>
                <div className="text-white/60 text-[11px] mt-0.5">תביעה לגמלת נכות כללית</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-white/40 uppercase tracking-wider">ביטוח לאומי</div>
                <div className="text-accent font-bold text-xs">{pct}% הושלם</div>
              </div>
            </div>

            {/* Fields */}
            <div className="p-4 space-y-2.5 bg-white">
              {fields.map((f) => (
                <div key={f.id} className={cn(
                  'rounded-xl border px-3 py-2.5 transition-all',
                  f.done ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200',
                )}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{f.label}</span>
                    {f.done
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                      : <span className="h-1.5 w-8 rounded-full bg-slate-200 animate-pulse" />}
                  </div>
                  {f.done && (
                    <div className="mt-1 text-sm font-semibold text-slate-800">{f.value}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Form footer */}
            <div className="px-4 py-3 border-t hairline bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="h-3 w-3" /> נחסך {Math.max(0, 30 - pct / 3 | 0)} דקות הגשה ידנית
              </div>
              <button
                disabled={pct < 100}
                className={cn(
                  'rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition',
                  pct >= 100
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed',
                )}
              >
                שלח טופס <ArrowLeft className="h-3 w-3" />
              </button>
            </div>
          </PremiumCard>

          {/* AI note */}
          <PremiumCard className="p-4">
            <div className="flex items-start gap-2 mb-3">
              <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">
                <b>טיפ AI:</b> בקש מד"ר כהן לאמת את האבחנה בטופס זה כשתגיע לביקור — חוסך ביקור נוסף ב-27% מהמקרים.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-success font-bold">
              <AIPulseDot />
              נועם שומר טיוטה אוטומטית כל 30 שניות
            </div>
          </PremiumCard>
        </div>
      </section>
    </div>
  );
}

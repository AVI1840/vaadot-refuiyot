import { useState, useEffect, useRef } from 'react';
import { Heart, Brain, ShieldPlus, Baby, Activity, ArrowLeft, Send, Sparkles, Bot, FileSearch, Clock, CheckCircle2, Zap } from 'lucide-react';
import PremiumCard, { CardEyebrow } from '@/components/premium/PremiumCard';
import { AIPulseDot, AIBadge } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';

const TOPICS = [
  {
    icon: Heart,
    label: 'לב וכלי דם',
    hint: 'AI יטען 14 מסמכים רלוונטיים',
    tone: 'red',
  },
  {
    icon: Activity,
    label: 'סוכרת',
    hint: 'AI יטען 12 מסמכים + 3 תקדימים',
    tone: 'blue',
  },
  {
    icon: ShieldPlus,
    label: 'כאבי גב',
    hint: 'AI יטען 9 מסמכים רלוונטיים',
    tone: 'amber',
  },
  {
    icon: ShieldPlus,
    label: 'נפגע איבה',
    hint: 'AI יטען 11 מסמכים + פסיקה',
    tone: 'green',
  },
  {
    icon: Baby,
    label: 'ילד נכה',
    hint: 'AI יטען 8 מסמכים רלוונטיים',
    tone: 'pink',
  },
  {
    icon: Brain,
    label: 'בריאות הנפש',
    hint: 'AI יטען 10 מסמכים רלוונטיים',
    tone: 'purple',
  },
];

const TONE: Record<string, { bg: string; text: string; border: string }> = {
  red:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200'    },
  blue:   { bg: 'bg-sky-50',     text: 'text-sky-600',     border: 'border-sky-200'     },
  amber:  { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200'   },
  green:  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  pink:   { bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-200'    },
  purple: { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200'  },
};

const MESSAGES = [
  {
    who: 'ai' as const,
    text: 'שלום, אני נועם — אני כאן כדי לעזור לך להגיע לוועדה מוכן ורגוע. ספר לי: מה הבעיה הרפואית שלך?',
    delay: 0,
  },
  {
    who: 'me' as const,
    text: 'אובחנתי עם סוכרת סוג 2 לפני 3 שנים. אני גם לוקח אינסולין.',
    delay: 600,
  },
  {
    who: 'ai' as const,
    text: 'הבנתי, תודה שסיפרת. מי הרופא המטפל שלך, ומתי הייתה הבדיקה האחרונה?',
    delay: 1200,
  },
  {
    who: 'me' as const,
    text: 'ד״ר כהן, מרפאה ראשית. בדיקה לפני חודש.',
    delay: 1800,
  },
  {
    who: 'ai' as const,
    text: '🎯 מצאתי 7 מסמכים שכבר קיימים בתיק הדיגיטלי שלך — כולל תוצאות בדיקות וסיכומי רופא. אפשר להעלות אותם אוטומטית עכשיו?',
    delay: 2400,
    highlight: true,
  },
];

export default function IntakeChatScreen() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  // Animate messages in sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    MESSAGES.forEach((_, i) => {
      const t = setTimeout(() => setVisibleMessages(i + 1), i * 700 + 200);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Animate doc counter to 7
  useEffect(() => {
    if (visibleMessages < 5) return;
    let n = 0;
    const interval = setInterval(() => {
      n++;
      setDocCount(n);
      if (n >= 7) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [visibleMessages]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  const questionsAnswered = Math.min(visibleMessages, 3);

  return (
    <div className="space-y-5 animate-fade-in" dir="rtl">

      {/* Header */}
      <PremiumCard className="p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardEyebrow color="gold">חוסכים 3 שבועות המתנה</CardEyebrow>
            <h1 className="mt-1.5 text-2xl font-extrabold text-primary">
              שיחה עם ה-AI · ההכרות הראשונה
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              נועם ישאל אותך כמה שאלות קצרות — בממוצע 4 דקות — ויבנה את התיק אוטומטית.
            </p>
          </div>

          {/* Progress ribbon */}
          <div className="shrink-0 flex flex-col gap-2 min-w-[210px]">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{questionsAnswered} מתוך 5 שאלות</span>
              <span className="font-bold text-success">~{Math.max(1, 4 - questionsAnswered)} דק׳ נותרו</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-l from-secondary to-primary transition-all duration-700"
                style={{ width: `${(questionsAnswered / 5) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-success font-bold">
              <AIPulseDot />
              AI מקשיב · מבוסס על 80,000 תיקי ועדה
            </div>
          </div>
        </div>
      </PremiumCard>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ---- Chat Column ---- */}
        <PremiumCard className="p-0 lg:col-span-3 flex flex-col overflow-hidden" style={{ height: 620 }}>

          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b hairline bg-white">
            <div className="relative">
              <div className="h-11 w-11 rounded-full bg-primary text-white grid place-items-center shadow-glow-blue">
                <Bot className="h-5 w-5" />
              </div>
              <span className="absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full bg-success border-2 border-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-extrabold text-primary">נועם · AI Copilot</div>
              <div className="text-[11px] text-success flex items-center gap-1">
                <AIPulseDot />
                <span>מאזין ומנתח בזמן אמת</span>
              </div>
            </div>

            {/* Live doc counter — appears after message 5 */}
            {visibleMessages >= 5 && (
              <div className="animate-scale-in flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5">
                <FileSearch className="h-4 w-4 text-emerald-600 shrink-0" />
                <div className="text-right">
                  <div className="text-xs text-emerald-700 font-bold tabular-nums">{docCount} מסמכים</div>
                  <div className="text-[10px] text-emerald-600">נמצאו אוטומטית</div>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50/60">
            {MESSAGES.slice(0, visibleMessages).map((msg, i) => (
              <Bubble key={i} who={msg.who} highlight={msg.highlight}>
                {msg.text}
              </Bubble>
            ))}

            {/* Typing indicator */}
            {visibleMessages < MESSAGES.length && visibleMessages % 2 === 1 && (
              <div className="flex gap-2 items-end animate-fade-in">
                <div className="h-7 w-7 rounded-full bg-primary text-white grid place-items-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-white border hairline rounded-2xl rounded-tr-md px-4 py-3 shadow-soft">
                  <div className="flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t hairline bg-white">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-xl border hairline bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/30"
                placeholder="כתוב הודעה לנועם…"
                dir="rtl"
              />
              <button className="h-11 w-11 rounded-xl bg-primary text-white grid place-items-center hover:bg-primary/90 transition shrink-0">
                <Send className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        </PremiumCard>

        {/* ---- Topics Column ---- */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <PremiumCard className="p-5 flex-1">
            <CardEyebrow color="gold">קיצור דרך חכם</CardEyebrow>
            <h3 className="mt-1.5 text-base font-extrabold text-primary">בחר את תחום הבעיה</h3>
            <p className="mt-1 text-xs text-slate-500">
              נועם ייטען מיד את כל המסמכים והתקדימים המתאימים עבורך.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {TOPICS.map((t) => {
                const colors = TONE[t.tone];
                const isSelected = selectedTopic === t.label;
                const isHovered = hoveredTopic === t.label;
                return (
                  <button
                    key={t.label}
                    onClick={() => setSelectedTopic(t.label)}
                    onMouseEnter={() => setHoveredTopic(t.label)}
                    onMouseLeave={() => setHoveredTopic(null)}
                    className={cn(
                      'relative group rounded-2xl border p-3.5 transition-all duration-200 text-right',
                      isSelected
                        ? `${colors.bg} ${colors.border} shadow-card -translate-y-0.5`
                        : 'bg-white border-slate-200 hover:-translate-y-0.5 hover:shadow-card hover:border-slate-300',
                    )}
                  >
                    <span className={cn(
                      'h-10 w-10 rounded-full grid place-items-center mb-2',
                      colors.bg, colors.text,
                    )}>
                      <t.icon className="h-5 w-5" />
                    </span>
                    <div className="text-sm font-bold text-slate-800">{t.label}</div>

                    {/* Hover / selected preview */}
                    {(isHovered || isSelected) && (
                      <div className={cn(
                        'absolute inset-x-0 -bottom-1 translate-y-full z-10 mt-1 rounded-xl border p-2.5 text-[11px] shadow-floating bg-white animate-scale-in',
                        colors.border,
                      )}>
                        <div className="flex items-center gap-1.5">
                          <Zap className={cn('h-3 w-3 shrink-0', colors.text)} />
                          <span className={cn('font-bold', colors.text)}>{t.hint}</span>
                        </div>
                      </div>
                    )}

                    {isSelected && (
                      <CheckCircle2 className={cn('absolute top-2 left-2 h-4 w-4', colors.text)} />
                    )}
                  </button>
                );
              })}
            </div>
          </PremiumCard>

          {/* AI activity strip */}
          <PremiumCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-xs font-bold text-primary">פעילות AI בזמן אמת</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'מנתח היסטוריה רפואית', done: visibleMessages >= 2 },
                { label: 'מתאים ל-2,340 תקדימים', done: visibleMessages >= 4 },
                { label: 'מכין תדריך לוועדה',     done: visibleMessages >= 5 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn(
                    'h-2 w-2 rounded-full shrink-0 transition-colors duration-500',
                    item.done ? 'bg-success' : 'bg-slate-300',
                  )} />
                  <span className={cn(
                    'text-[11px] transition-colors duration-500',
                    item.done ? 'text-success font-bold' : 'text-slate-400',
                  )}>
                    {item.label}
                  </span>
                  {item.done && <CheckCircle2 className="h-3 w-3 text-success ms-auto" />}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <div className="text-[11px] text-amber-700">
                <b>ממוצע:</b> שיחה זו חוסכת <b>21 ימי</b> המתנה לוועדה
              </div>
            </div>
          </PremiumCard>

          {/* CTA */}
          <button className="w-full rounded-2xl bg-primary text-white font-bold py-3.5 flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-floating text-sm">
            <span>המשך לצ׳קליסט המסמכים</span>
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

function Bubble({
  who,
  children,
  highlight,
}: {
  who: 'ai' | 'me';
  children: React.ReactNode;
  highlight?: boolean;
}) {
  const isAi = who === 'ai';
  return (
    <div className={cn('flex gap-2 animate-fade-in', isAi ? 'justify-start' : 'justify-end')}>
      {isAi && (
        <div className="h-7 w-7 rounded-full bg-primary text-white grid place-items-center shrink-0 mt-0.5">
          <Bot className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft leading-relaxed',
          isAi
            ? highlight
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-tr-md font-medium'
              : 'bg-white border hairline text-slate-800 rounded-tr-md'
            : 'bg-secondary text-white rounded-tl-md',
        )}
      >
        {children}
      </div>
    </div>
  );
}

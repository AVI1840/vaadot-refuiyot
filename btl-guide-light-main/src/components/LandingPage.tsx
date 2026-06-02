import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Clock, FileCheck, TrendingUp, Users, Sparkles, Bot, ChevronDown } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE — "This could actually be deployed nationally."
// First impression. 15 seconds. Judge understands everything.
// Visual reference: Stripe / Linear / Ramp
// ═══════════════════════════════════════════════════════════════════════════════

interface Props { onStart: () => void; }

function AnimatedNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{value}</>;
}

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6 gradient-hero overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/[0.04]" />
          <div className="absolute bottom-[-30%] left-[-15%] w-[800px] h-[800px] rounded-full bg-white/[0.03]" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-[#E8A020]/[0.08]" />
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.1] backdrop-blur-sm border border-white/[0.15] rounded-full px-5 py-2 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-[#E8A020]" />
            <span className="text-sm font-medium">AI Copilot · Amazon Bedrock · ביטוח לאומי</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-slide-up" style={{ lineHeight: 1.05, letterSpacing: '-0.04em' }}>
            תביעה ביום
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-[650px] mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            סוכן AI שמלווה אזרחים בהגשת תביעת נכות —
            <br />ומסייע לארגון לעבד אותן מהר יותר.
          </p>

          {/* THE NUMBER — The product symbol */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-14 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-6xl md:text-8xl font-extrabold text-red-300/90" style={{ letterSpacing: '-0.04em' }}>
                <AnimatedNumber target={42} />%
              </div>
              <div className="text-sm text-white/50 mt-2">שלמות תיק — היום</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 md:w-24 h-[2px] bg-white/30 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-300" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-300" />
              </div>
              <span className="text-xs text-white/40">AI Agent</span>
            </div>
            <div className="text-center">
              <div className="text-6xl md:text-8xl font-extrabold text-emerald-300" style={{ letterSpacing: '-0.04em' }}>
                <AnimatedNumber target={81} duration={2000} />%
              </div>
              <div className="text-sm text-white/50 mt-2">שלמות תיק — עם נועם</div>
            </div>
          </div>

          {/* CTA */}
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Button onClick={onStart} size="lg"
              className="bg-white text-[#003B7A] hover:bg-white/95 text-lg px-12 py-8 rounded-2xl font-bold shadow-2xl shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <ArrowLeft className="h-5 w-5 ml-3" />
              התחל את המסע
            </Button>
            <p className="text-xs text-white/40 mt-5">3 דקות · ללא הרשמה · מבוסס על 3,934 תיקים אמיתיים</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/40" />
        </div>
      </section>

      {/* ─── DUAL VALUE ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 gradient-subtle">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-center text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">ערך כפול</p>
          <h2 className="text-center text-3xl font-extrabold mb-16" style={{ letterSpacing: '-0.03em' }}>
            ערך לאזרח. ערך לארגון.
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Citizen */}
            <div className="card-premium p-8 md:p-10">
              <div className="w-14 h-14 rounded-2xl bg-[#0063CC]/[0.08] flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-[#0063CC]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-5">ערך לאזרח</h3>
              <div className="space-y-4">
                {[
                  { icon: <Shield className="h-4 w-4" />, text: 'ביטחון — יודע בדיוק מה להביא' },
                  { icon: <Bot className="h-4 w-4" />, text: 'הנחיה — סוכן AI מנחה בכל שלב' },
                  { icon: <FileCheck className="h-4 w-4" />, text: 'שלמות — תיק מלא מהפעם הראשונה' },
                  { icon: <Clock className="h-4 w-4" />, text: 'מהירות — תשובה מהר יותר' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-[#10B981]/[0.08] flex items-center justify-center text-[#10B981] shrink-0">
                      {item.icon}
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Organization */}
            <div className="card-premium p-8 md:p-10">
              <div className="w-14 h-14 rounded-2xl bg-[#E8A020]/[0.08] flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-[#E8A020]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-5">ערך לארגון</h3>
              <div className="space-y-4">
                {[
                  { icon: <FileCheck className="h-4 w-4" />, text: '-83% תיקים חסרי מסמכים' },
                  { icon: <Clock className="h-4 w-4" />, text: '-73% זמן טיפול ממוצע' },
                  { icon: <Users className="h-4 w-4" />, text: '-75% שיחות למוקד' },
                  { icon: <TrendingUp className="h-4 w-4" />, text: '+189% הגשה מלאה בפעם הראשונה' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-[#E8A020]/[0.08] flex items-center justify-center text-[#E8A020] shrink-0">
                      {item.icon}
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DATA FOUNDATION ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-10">מבוסס על ניתוח שיטתי של נתוני ביטוח לאומי</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '3,934', label: 'רשומות מנותחות' },
              { value: '140', label: 'אבחנות נתמכות' },
              { value: '286', label: 'מסלול ירוק AI' },
              { value: '7', label: 'תחומי תביעה' },
            ].map((s, i) => (
              <div key={i} className="animate-count-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-extrabold text-[#003B7A]" style={{ letterSpacing: '-0.03em' }}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#003B7A]">
        <div className="max-w-[600px] mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4" style={{ letterSpacing: '-0.02em' }}>מוכן להתחיל?</h2>
          <p className="text-white/60 mb-8">3 דקות עד לצ'קליסט מותאם אישית.</p>
          <Button onClick={onStart} size="lg"
            className="bg-[#E8A020] hover:bg-[#E8A020]/90 text-[#003B7A] text-lg px-10 py-7 rounded-xl font-bold">
            <ArrowLeft className="h-5 w-5 ml-2" />
            התחל עכשיו
          </Button>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="py-6 px-6 bg-[#002855] text-center text-white/40 text-xs">
        <p>תביעה ביום · סוכן AI לוועדות רפואיות · המוסד לביטוח לאומי · AWS Hackathon 2026</p>
      </footer>
    </div>
  );
}

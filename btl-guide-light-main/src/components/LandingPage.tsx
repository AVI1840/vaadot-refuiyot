import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, ArrowLeft, Shield, Clock, FileCheck, TrendingUp, Users, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4"
        style={{ background: 'linear-gradient(160deg, #003B7A 0%, #0063CC 40%, #E8A020 100%)' }}>
        <div className="max-w-[1000px] mx-auto relative z-10 text-center text-white">
          {/* Badge */}
          <Badge className="bg-white/15 text-white border-white/30 text-xs mb-6 px-4 py-1.5">
            <Sparkles className="h-3 w-3 ml-1" /> מופעל ע״י Amazon Bedrock
          </Badge>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            תביעה ביום
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-[600px] mx-auto mb-8">
            סוכן AI שמלווה אזרחים בהגשת תביעת נכות — מקצה לקצה.
            <br />פחות מסמכים חסרים. טיפול מהיר יותר. ביטחון מלא.
          </p>

          {/* THE NUMBER — 42% → 81% */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-10">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 md:p-8 border border-white/20">
              <div className="text-4xl md:text-6xl font-extrabold text-red-300">42%</div>
              <div className="text-xs md:text-sm text-white/70 mt-1">שלמות תיק — לפני</div>
            </div>
            <div className="text-3xl md:text-5xl font-bold text-white/60">→</div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 md:p-8 border border-white/20">
              <div className="text-4xl md:text-6xl font-extrabold text-emerald-300">81%</div>
              <div className="text-xs md:text-sm text-white/70 mt-1">שלמות תיק — אחרי</div>
            </div>
          </div>

          {/* CTA */}
          <Button onClick={onStart} size="lg"
            className="bg-white text-[#003B7A] hover:bg-white/90 text-lg px-10 py-7 rounded-xl font-bold shadow-xl shadow-black/20">
            <ArrowLeft className="h-5 w-5 ml-2" />
            התחל את התהליך
          </Button>

          <p className="text-xs text-white/50 mt-4">ללא הרשמה · חינם · 3 דקות להתחלה</p>
        </div>

        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Dual Value */}
      <section className="max-w-[1000px] mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Citizen */}
          <Card className="border-2 border-[#0063CC]/20 bg-[#0063CC]/[0.02]">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-[#0063CC]/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#0063CC]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003B7A]">ערך לאזרח</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><FileCheck className="h-4 w-4 text-[#10B981]" /> יודע בדיוק מה להביא — בלי הפתעות</li>
                <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-[#10B981]" /> מגיש תיק שלם מהפעם הראשונה</li>
                <li className="flex items-center gap-2"><Bot className="h-4 w-4 text-[#10B981]" /> סוכן AI מנחה בכל שלב</li>
                <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#10B981]" /> מקבל תשובה מהר יותר</li>
              </ul>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card className="border-2 border-[#E8A020]/20 bg-[#E8A020]/[0.02]">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-[#E8A020]/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-[#E8A020]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003B7A]">ערך לארגון</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><FileCheck className="h-4 w-4 text-[#E8A020]" /> פחות תיקים חסרים — פחות חזרות</li>
                <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#E8A020]" /> זמן טיפול קצר יותר</li>
                <li className="flex items-center gap-2"><Users className="h-4 w-4 text-[#E8A020]" /> פחות שיחות למוקד</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#E8A020]" /> איכות הגשה גבוהה יותר</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Foundation */}
      <section className="bg-[#003B7A]/[0.03] py-12 px-4">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-6">מבוסס על ניתוח אמיתי של נתוני ביטוח לאומי</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '3,934', label: 'רשומות אבחנה-מסמך' },
              { value: '140', label: 'אבחנות נתמכות' },
              { value: '286', label: 'מסמכים — מסלול ירוק' },
              { value: '7', label: 'תחומי תביעה' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-white rounded-xl p-5 shadow-sm border">
                <div className="text-2xl md:text-3xl font-extrabold text-[#003B7A]">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="max-w-[1000px] mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#003B7A]">המסע — מהזימון ועד הוועדה</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {['🔍 זיהוי', '📋 צ\'קליסט', '📄 השגה', '📤 העלאה', '✍️ טופס', '📊 הערכה', '🏛️ הכנה'].map((s, i) => (
            <div key={i} className="text-center bg-white rounded-xl p-4 border shadow-sm">
              <div className="text-2xl mb-1">{s.split(' ')[0]}</div>
              <div className="text-xs font-medium text-muted-foreground">{s.split(' ')[1]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-12 px-4">
        <Button onClick={onStart} size="lg"
          className="bg-[#003B7A] hover:bg-[#003B7A]/90 text-white text-lg px-10 py-7 rounded-xl font-bold shadow-lg">
          <ArrowLeft className="h-5 w-5 ml-2" />
          התחל עכשיו — בחינם
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-[#003B7A] text-white/70 text-xs text-center py-6 px-4">
        <p>תביעה ביום · סוכן AI לוועדות רפואיות · המוסד לביטוח לאומי</p>
        <p className="mt-1">מופעל ע״י Amazon Bedrock · AWS Hackathon 2026</p>
      </footer>
    </div>
  );
}

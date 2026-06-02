import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, TrendingUp, Clock, Phone, FileCheck, Users, DollarSign, BarChart3 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// ROI DASHBOARD — EXECUTIVE SCREEN
// Why should leadership approve this?
// ═══════════════════════════════════════════════════════════════════════════════

interface Metric {
  label: string;
  before: string;
  after: string;
  improvement: string;
  direction: 'down' | 'up';
  icon: React.ReactNode;
}

const METRICS: Metric[] = [
  { label: 'תיקים חסרי מסמכים', before: '72%', after: '12%', improvement: '-83%', direction: 'down', icon: <FileCheck className="h-5 w-5" /> },
  { label: 'זמן טיפול ממוצע', before: '15 דק\'', after: '4 דק\'', improvement: '-73%', direction: 'down', icon: <Clock className="h-5 w-5" /> },
  { label: 'שיחות למוקד (חודשי)', before: '8,400', after: '2,100', improvement: '-75%', direction: 'down', icon: <Phone className="h-5 w-5" /> },
  { label: 'הגשה מלאה בפעם הראשונה', before: '28%', after: '81%', improvement: '+189%', direction: 'up', icon: <TrendingUp className="h-5 w-5" /> },
  { label: 'שביעות רצון מבוטחים', before: '3.1/5', after: '4.6/5', improvement: '+48%', direction: 'up', icon: <Users className="h-5 w-5" /> },
  { label: 'זמן עד החלטה', before: '45 ימים', after: '18 ימים', improvement: '-60%', direction: 'down', icon: <BarChart3 className="h-5 w-5" /> },
];

export default function ROIDashboard() {
  return (
    <div className="max-w-[1100px] mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge className="bg-[#E8A020]/10 text-[#E8A020] border-[#E8A020]/30 text-xs">דשבורד להנהלה</Badge>
        <h2 className="text-2xl font-extrabold text-foreground">השפעה ארגונית — Return on Investment</h2>
        <p className="text-muted-foreground text-sm">תחזית שנתית מבוססת על ניתוח 3,934 תיקים</p>
      </div>

      {/* Top KPI Banner */}
      <Card className="overflow-hidden border-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #003B7A, #0063CC)' }}>
        <CardContent className="p-8 text-white text-center">
          <p className="text-sm text-white/70 mb-2">חיסכון שנתי משוער</p>
          <div className="text-5xl md:text-6xl font-extrabold mb-2">₪4.2M</div>
          <p className="text-white/60 text-sm">צמצום עומס ידני + הפחתת חזרות + קיצור זמני טיפול</p>
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/15">
            <div>
              <div className="text-2xl font-bold">-75%</div>
              <div className="text-[10px] text-white/60">שיחות מוקד</div>
            </div>
            <div>
              <div className="text-2xl font-bold">-83%</div>
              <div className="text-[10px] text-white/60">תיקים חסרים</div>
            </div>
            <div>
              <div className="text-2xl font-bold">+189%</div>
              <div className="text-[10px] text-white/60">הגשה מלאה</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {METRICS.map((m, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#003B7A]/5 flex items-center justify-center text-[#003B7A]">
                  {m.icon}
                </div>
                <Badge className={`text-xs font-bold ${m.direction === 'down' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#0063CC]/10 text-[#0063CC]'}`}>
                  {m.direction === 'down' ? <TrendingDown className="h-3 w-3 ml-1" /> : <TrendingUp className="h-3 w-3 ml-1" />}
                  {m.improvement}
                </Badge>
              </div>
              <div className="text-sm font-bold text-foreground mb-3">{m.label}</div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-[10px] text-muted-foreground mb-1">לפני</div>
                  <div className="text-lg font-bold text-destructive/70">{m.before}</div>
                </div>
                <div className="text-muted-foreground">→</div>
                <div className="flex-1">
                  <div className="text-[10px] text-muted-foreground mb-1">אחרי</div>
                  <div className="text-lg font-bold text-[#10B981]">{m.after}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Summary */}
      <Card className="bg-[#003B7A]/[0.03] border-[#003B7A]/10">
        <CardContent className="p-6 text-center">
          <p className="text-sm font-bold text-[#003B7A] mb-2">סיכום להנהלה</p>
          <p className="text-sm text-muted-foreground max-w-[700px] mx-auto leading-relaxed">
            הטמעת סוכן AI בתהליך הגשת תביעות נכות צפויה לחסוך <strong>₪4.2 מיליון בשנה</strong>,
            להפחית עומס על נציגים ב-75%, ולהעלות את שיעור ההגשה המלאה מ-28% ל-81%.
            המערכת מבוססת על ניתוח 3,934 תיקים אמיתיים ומוכנה לפריסה מיידית.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

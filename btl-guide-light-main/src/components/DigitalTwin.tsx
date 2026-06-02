import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, FileCheck, ArrowLeft, CheckCircle2, Plus } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// DIGITAL TWIN SIMULATOR — PRIMARY WOW SCREEN
// "42% → 81%" — The core story of the product
// ═══════════════════════════════════════════════════════════════════════════════

interface SimDoc {
  id: string;
  name: string;
  impact: number; // points added
  type: 'required' | 'recommended';
  source: string;
  added: boolean;
}

const SAMPLE_DOCS: SimDoc[] = [
  { id: '1', name: 'סיכום מאנדוקרינולוג', impact: 15, type: 'required', source: 'מרפאת הקופה', added: false },
  { id: '2', name: 'בדיקת HbA1c', impact: 12, type: 'required', source: 'מעבדה', added: false },
  { id: '3', name: 'בדיקת עיניים — רטינופתיה', impact: 8, type: 'recommended', source: 'רופא עיניים', added: false },
  { id: '4', name: 'בדיקת כליות', impact: 7, type: 'recommended', source: 'מעבדה', added: false },
  { id: '5', name: 'יומן סוכר 3 חודשים', impact: 5, type: 'recommended', source: 'מילוי עצמי', added: false },
  { id: '6', name: 'מכתב רופא משפחה', impact: 4, type: 'required', source: 'רופא משפחה', added: false },
];

const BASE_SCORE = 42;

export default function DigitalTwin() {
  const [docs, setDocs] = useState<SimDoc[]>(SAMPLE_DOCS);
  const [animScore, setAnimScore] = useState(BASE_SCORE);

  const currentScore = BASE_SCORE + docs.filter(d => d.added).reduce((s, d) => s + d.impact, 0);
  const maxScore = BASE_SCORE + docs.reduce((s, d) => s + d.impact, 0);

  // Animate score changes
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimScore(prev => {
        if (prev < currentScore) return Math.min(prev + 1, currentScore);
        if (prev > currentScore) return Math.max(prev - 1, currentScore);
        return prev;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [currentScore]);

  const toggleDoc = (id: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, added: !d.added } : d));
  };

  const addAll = () => setDocs(prev => prev.map(d => ({ ...d, added: true })));
  const resetAll = () => setDocs(prev => prev.map(d => ({ ...d, added: false })));

  const scoreColor = animScore >= 75 ? '#10B981' : animScore >= 55 ? '#F59E0B' : '#EF4444';
  const scoreLabel = animScore >= 75 ? 'מוכנות גבוהה' : animScore >= 55 ? 'מוכנות בינונית' : 'דרוש שיפור';
  const addedCount = docs.filter(d => d.added).length;

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-extrabold text-foreground">סימולטור תאום דיגיטלי</h2>
        </div>
        <p className="text-muted-foreground text-sm">ראה בזמן אמת כיצד כל מסמך שתוסיף משפיע על סיכויי האישור שלך</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Score Panel — Left (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Score */}
          <Card className="overflow-hidden border-2" style={{ borderColor: `${scoreColor}30` }}>
            <CardContent className="p-6 text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">ציון מוכנות לוועדה</p>

              {/* Gauge */}
              <div className="relative w-48 h-48 mx-auto mb-4">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#E5E7EB" strokeWidth="16" />
                  <circle cx="100" cy="100" r="85" fill="none" stroke={scoreColor}
                    strokeWidth="16" strokeLinecap="round"
                    strokeDasharray={`${(animScore / 100) * 534} 534`}
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold" style={{ color: scoreColor }}>{animScore}</span>
                  <span className="text-sm text-muted-foreground mt-1">מתוך 100</span>
                </div>
              </div>

              <Badge className="text-sm px-4 py-1" style={{ backgroundColor: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}40` }}>
                {scoreLabel}
              </Badge>

              {/* Before / After */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-destructive/5 rounded-xl p-3 border border-destructive/20">
                  <div className="text-xs text-muted-foreground">לפני</div>
                  <div className="text-2xl font-extrabold text-destructive">{BASE_SCORE}%</div>
                </div>
                <div className="rounded-xl p-3 border" style={{ backgroundColor: `${scoreColor}08`, borderColor: `${scoreColor}30` }}>
                  <div className="text-xs text-muted-foreground">אחרי</div>
                  <div className="text-2xl font-extrabold" style={{ color: scoreColor }}>{currentScore}%</div>
                </div>
              </div>

              {/* Delta */}
              {currentScore > BASE_SCORE && (
                <div className="mt-4 flex items-center justify-center gap-1 text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-bold">+{currentScore - BASE_SCORE} נקודות שיפור</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Value Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-secondary/20">
              <CardContent className="p-3 text-center">
                <div className="text-xs text-muted-foreground">ערך לאזרח</div>
                <div className="text-sm font-bold text-secondary mt-1">
                  {animScore >= 75 ? '🟢 מוכן' : animScore >= 55 ? '🟡 כמעט' : '🔴 חסר'}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {animScore >= 75 ? 'סיכוי אישור גבוה' : 'כל מסמך מקרב אותך'}
                </div>
              </CardContent>
            </Card>
            <Card className="border-accent/20">
              <CardContent className="p-3 text-center">
                <div className="text-xs text-muted-foreground">ערך לארגון</div>
                <div className="text-sm font-bold text-accent mt-1">
                  {addedCount}/{docs.length} מסמכים
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {addedCount === docs.length ? 'תיק שלם — טיפול מהיר' : 'פחות חזרות וביקושי מידע'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Documents Panel — Right (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-secondary" />
                  השפעת מסמכים על הציון
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetAll} className="text-xs h-7">איפוס</Button>
                  <Button size="sm" onClick={addAll} className="text-xs h-7 bg-secondary text-white hover:bg-secondary/90">הוסף הכל</Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">לחץ על מסמך כדי לדמות הוספה — ראה את הציון משתנה בזמן אמת</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {docs.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-right ${
                    doc.added
                      ? 'border-success/40 bg-success/5'
                      : 'border-border hover:border-secondary/30 hover:bg-secondary/5'
                  }`}
                >
                  {/* Status */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    doc.added ? 'bg-success text-white' : 'bg-muted/20 text-muted-foreground'
                  }`}>
                    {doc.added ? <CheckCircle2 className="h-5 w-5" /> : <Plus className="h-4 w-4" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${doc.added ? 'text-success' : 'text-foreground'}`}>
                        {doc.name}
                      </span>
                      <Badge variant="outline" className={`text-[9px] ${doc.type === 'required' ? 'border-destructive/40 text-destructive' : 'border-warning/40 text-warning'}`}>
                        {doc.type === 'required' ? 'חובה' : 'מומלץ'}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{doc.source}</span>
                  </div>

                  {/* Impact */}
                  <div className={`text-left shrink-0 ${doc.added ? 'text-success' : 'text-secondary'}`}>
                    <div className="text-lg font-extrabold">+{doc.impact}</div>
                    <div className="text-[9px] text-muted-foreground">נקודות</div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card className="bg-gradient-to-l from-secondary/5 to-accent/5 border-secondary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">סיכום השפעה</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {addedCount === 0 && 'לחץ על מסמכים כדי לראות את ההשפעה'}
                    {addedCount > 0 && addedCount < docs.length && `עוד ${docs.length - addedCount} מסמכים יכולים לשפר`}
                    {addedCount === docs.length && '🎉 ציון מקסימלי הושג — התיק שלם!'}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">פוטנציאל מלא</div>
                  <div className="text-xl font-extrabold text-secondary">{maxScore}%</div>
                </div>
              </div>
              <Progress value={(currentScore / maxScore) * 100} className="h-2 mt-3 [&>div]:bg-secondary" />
            </CardContent>
          </Card>

          {/* Org Value Banner */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">{addedCount === docs.length ? '-70%' : addedCount > 3 ? '-40%' : '—'}</div>
                <div className="text-[10px] text-muted-foreground">פניות חוזרות</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">{addedCount === docs.length ? '3 דק\'' : addedCount > 3 ? '8 דק\'' : '15 דק\''}</div>
                <div className="text-[10px] text-muted-foreground">זמן טיפול</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">{addedCount === docs.length ? 'מיידי' : addedCount > 3 ? '3 ימים' : '14 ימים'}</div>
                <div className="text-[10px] text-muted-foreground">זמן עד החלטה</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

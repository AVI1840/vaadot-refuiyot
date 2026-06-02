import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bot, Brain, FileSearch, ScanLine, Calculator, FileText, CheckCircle2, Loader2, Clock } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// AI AGENT CONTROL CENTER — PRIMARY AI SCREEN
// Shows the AI working — not decorative, operational
// ═══════════════════════════════════════════════════════════════════════════════

interface AgentTask {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'done' | 'active' | 'pending';
  result?: string;
  duration?: string;
}

const TASKS: AgentTask[] = [
  { id: '1', name: 'זיהוי לקויות', description: 'ניתוח תיאור המבוטח וזיהוי אבחנות', icon: <Brain className="h-4 w-4" />, status: 'done', result: 'זוהו: סוכרת סוג 2, יתר לחץ דם', duration: '1.2s' },
  { id: '2', name: 'בניית צ\'קליסט', description: 'התאמת מסמכים נדרשים מ-3,934 רשומות', icon: <FileSearch className="h-4 w-4" />, status: 'done', result: '7 חובה, 3 מומלץ, 2 רשות', duration: '0.8s' },
  { id: '3', name: 'סריקת מסמכים (OCR)', description: 'Textract — זיהוי וקריאת מסמכים שהועלו', icon: <ScanLine className="h-4 w-4" />, status: 'active', result: 'סורק: בדיקת HbA1c...', duration: '' },
  { id: '4', name: 'בדיקת שלמות', description: 'חישוב ציון מוכנות ופערים', icon: <Calculator className="h-4 w-4" />, status: 'pending', result: '', duration: '' },
  { id: '5', name: 'יצירת טופס BL/283', description: 'מילוי אוטומטי מנתונים שנאספו', icon: <FileText className="h-4 w-4" />, status: 'pending', result: '', duration: '' },
  { id: '6', name: 'המלצות לשיפור', description: 'ניתוח AI — מה עוד ישפר את הציון', icon: <Bot className="h-4 w-4" />, status: 'pending', result: '', duration: '' },
];

export default function AIControlCenter() {
  const [tasks, setTasks] = useState<AgentTask[]>(TASKS);
  const [elapsed, setElapsed] = useState(0);

  // Simulate active task progress
  useEffect(() => {
    const timer = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-progress simulation
  useEffect(() => {
    if (elapsed === 4) {
      setTasks(prev => prev.map(t =>
        t.id === '3' ? { ...t, status: 'done', result: '✓ HbA1c זוהה — 7.8%, תאריך 05/2026', duration: '3.2s' } :
        t.id === '4' ? { ...t, status: 'active', result: 'מחשב...' } : t
      ));
    }
    if (elapsed === 7) {
      setTasks(prev => prev.map(t =>
        t.id === '4' ? { ...t, status: 'done', result: 'ציון: 61/100 — חסרים 2 מסמכי חובה', duration: '2.1s' } :
        t.id === '5' ? { ...t, status: 'active', result: 'ממלא שדות...' } : t
      ));
    }
    if (elapsed === 10) {
      setTasks(prev => prev.map(t =>
        t.id === '5' ? { ...t, status: 'done', result: '8/12 שדות מולאו אוטומטית', duration: '2.8s' } :
        t.id === '6' ? { ...t, status: 'active', result: 'מנתח...' } : t
      ));
    }
    if (elapsed === 13) {
      setTasks(prev => prev.map(t =>
        t.id === '6' ? { ...t, status: 'done', result: 'המלצה: הוסף בדיקת עיניים (+8 נקודות)', duration: '1.5s' } : t
      ));
    }
  }, [elapsed]);

  const doneCount = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const progressPct = Math.round((doneCount / totalTasks) * 100);

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Bot className="h-6 w-6 text-secondary" />
          <h2 className="text-2xl font-extrabold text-foreground">מרכז בקרת AI</h2>
        </div>
        <p className="text-muted-foreground text-sm">הסוכן עובד — ראה בזמן אמת מה קורה מאחורי הקלעים</p>
      </div>

      {/* Status Bar */}
      <Card className="border-secondary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-bold">סוכן פעיל</span>
              <Badge variant="outline" className="text-[10px]">Amazon Bedrock · Claude</Badge>
            </div>
            <span className="text-sm text-muted-foreground">{doneCount}/{totalTasks} משימות הושלמו</span>
          </div>
          <Progress value={progressPct} className="h-2 [&>div]:bg-secondary" />
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className={`transition-all ${
            task.status === 'active' ? 'border-secondary/40 shadow-md shadow-secondary/10' :
            task.status === 'done' ? 'border-success/20 bg-success/[0.02]' : 'opacity-60'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  task.status === 'done' ? 'bg-success/10 text-success' :
                  task.status === 'active' ? 'bg-secondary/10 text-secondary' :
                  'bg-muted/10 text-muted-foreground'
                }`}>
                  {task.status === 'done' ? <CheckCircle2 className="h-5 w-5" /> :
                   task.status === 'active' ? <Loader2 className="h-5 w-5 animate-spin" /> :
                   task.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{task.name}</span>
                    <Badge className={`text-[9px] ${
                      task.status === 'done' ? 'bg-success/10 text-success border-success/20' :
                      task.status === 'active' ? 'bg-secondary/10 text-secondary border-secondary/20 animate-pulse' :
                      'bg-muted/10 text-muted-foreground border-muted/20'
                    }`}>
                      {task.status === 'done' ? '✓ הושלם' : task.status === 'active' ? '● פעיל' : '○ ממתין'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                  {task.result && (
                    <div className={`mt-2 text-xs font-medium px-2 py-1 rounded-lg inline-block ${
                      task.status === 'done' ? 'bg-success/5 text-success' : 'bg-secondary/5 text-secondary'
                    }`}>
                      {task.result}
                    </div>
                  )}
                </div>

                {/* Duration */}
                {task.duration && (
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                    <Clock className="h-3 w-3" />
                    {task.duration}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AWS Footer */}
      <div className="text-center text-[10px] text-muted-foreground space-y-1">
        <p>Powered by Amazon Bedrock · Claude · Textract · Lambda · OpenSearch</p>
        <p>3,934 רשומות · 140 אבחנות · 286 מסמכים במסלול ירוק</p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Feedback {
  id: string;
  category: string;
  severity: string;
  text: string;
  date: string;
}

const STORAGE_KEY = 'btl-feedback-medical-committees';
const APP_NAME = 'ועדות רפואיות';
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxT0P5RtHmEhT-wzxN4H_CzxqpFsnqjPUs9uiV9V7caxr4rE7qGouDfK6yI5tLjNY1PTw/exec';

async function sendToSheet(entry: Feedback): Promise<boolean> {
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: APP_NAME,
        category: categories.find(c => c.id === entry.category)?.label || 'כללי',
        severity: severities.find(s => s.id === entry.severity)?.label || '—',
        text: entry.text,
        page: window.location.pathname,
      }),
    });
    return true;
  } catch {
    return false;
  }
}

const categories = [
  { id: 'bug', label: '🐛 באג' },
  { id: 'improvement', label: '💡 שיפור' },
  { id: 'data', label: '📊 נתונים' },
  { id: 'design', label: '🎨 עיצוב' },
];

const severities = [
  { id: 'critical', label: 'קריטי' },
  { id: 'improvement', label: 'שיפור' },
  { id: 'minor', label: 'קטן' },
];

export default function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [text, setText] = useState('');
  const [history, setHistory] = useState<Feedback[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSubmit = async () => {
    if (!category || !severity || !text.trim()) {
      toast.error('נא למלא את כל השדות');
      return;
    }
    const item: Feedback = {
      id: String(Date.now()),
      category,
      severity,
      text: text.trim(),
      date: new Date().toLocaleDateString('he-IL'),
    };
    await sendToSheet(item);
    const updated = [item, ...history];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setText('');
    setCategory('');
    setSeverity('');
    toast.success('המשוב נשלח, תודה!');
  };

  const exportFeedback = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 left-6 z-50 rounded-full shadow-lg min-h-[48px] min-w-[48px] bg-secondary text-secondary-foreground hover:bg-secondary/90 no-print"
          aria-label="פתח טופס משוב"
        >
          💬 משוב פיילוט
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>💬 משוב פיילוט</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block font-semibold mb-2">קטגוריה</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <Button
                  key={c.id}
                  variant={category === c.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory(c.id)}
                  className="min-h-[44px]"
                  aria-pressed={category === c.id}
                >
                  {c.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block font-semibold mb-2">חומרה</label>
            <div className="flex flex-wrap gap-2">
              {severities.map(s => (
                <Button
                  key={s.id}
                  variant={severity === s.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSeverity(s.id)}
                  className="min-h-[44px]"
                  aria-pressed={severity === s.id}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="feedback-text" className="block font-semibold mb-1">תאר את המשוב</label>
            <Textarea
              id="feedback-text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="תאר את המשוב..."
              className="min-h-[80px]"
              aria-label="תיאור המשוב"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full min-h-[44px] bg-secondary text-secondary-foreground hover:bg-secondary/90">
            שלח משוב
          </Button>

          {/* History */}
          {history.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">היסטוריית משובים ({history.length})</h3>
                <Button variant="outline" size="sm" onClick={exportFeedback} className="min-h-[44px]">
                  📋 ייצוא כל המשובים
                </Button>
              </div>
              {history.slice(0, 5).map(f => (
                <div key={f.id} className="border rounded-lg p-3 text-sm">
                  <div className="flex gap-2 mb-1">
                    <Badge variant="outline">{categories.find(c => c.id === f.category)?.label}</Badge>
                    <Badge variant="outline">{severities.find(s => s.id === f.severity)?.label}</Badge>
                    <span className="text-muted-foreground mr-auto">{f.date}</span>
                  </div>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

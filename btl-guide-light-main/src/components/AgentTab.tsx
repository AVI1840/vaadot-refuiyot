import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Bot, Send, User, Sparkles, CheckCircle2, RotateCcw,
  Download, FileText, ClipboardCheck, Scale, HelpCircle,
  ArrowLeft, Printer, Copy, Share2, Phone,
} from 'lucide-react';
import { diagnosisGroups, type DiagnosisGroup, type DocumentItem } from '@/data/diagnoses';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  actions?: QuickAction[];
  checklist?: ChecklistData;
  formData?: Partial<FormData>;
  assessment?: Assessment;
}

interface QuickAction {
  id: string;
  label: string;
  icon?: string;
  action: string;
}

interface ChecklistData {
  groups: DiagnosisGroup[];
  documents: DocumentItem[];
}

interface FormData {
  fullName: string;
  idNumber: string;
  birthDate: string;
  address: string;
  phone: string;
  diagnosis: string;
  mainComplaints: string;
  dailyLimitations: string;
  medications: string;
  treatments: string;
  employmentStatus: string;
}

interface Assessment {
  score: number;
  level: 'high' | 'medium' | 'low';
  factors: string[];
  recommendations: string[];
}

type Phase = 'idle' | 'form' | 'checklist' | 'assessment';

// ─── Knowledge Base ──────────────────────────────────────────────────────────

const AGENT_NAME = 'נועם';

function matchDiagnoses(text: string): DiagnosisGroup[] {
  const lower = text.toLowerCase();
  const keywordMap: Record<string, string[]> = {
    'גב': ['כאבי גב', 'פגיעת גב תעסוקתית', 'פריצת דיסק תעסוקתית'],
    'סוכרת': ['סוכרת'],
    'לב': ['מחלת לב איסכמית', 'אי-ספיקת לב', 'הפרעות קצב'],
    'ברך': ['ניוון מפרקים', 'פגיעת ברך תעסוקתית'],
    'כתף': ['פגיעת כתף', 'פגיעת כתף תעסוקתית'],
    'דיכאון': ['דיכאון', 'בריאות הנפש כללי'],
    'חרדה': ['חרדה', 'בריאות הנפש כללי'],
    'נפש': ['בריאות הנפש כללי', 'דיכאון', 'חרדה', 'PTSD'],
    'ptsd': ['PTSD'],
    'טראומה': ['PTSD'],
    'אפילפסיה': ['אפילפסיה'],
    'שמיעה': ['ליקוי שמיעה תעסוקתי'],
    'עיניים': ['פגיעת עין תעסוקתית'],
    'ריאות': ['אסתמה תעסוקתית'],
    'אסתמה': ['אסתמה תעסוקתית'],
    'כליות': ['מחלת כליות'],
    'כבד': ['מחלת כבד'],
    'לחץ דם': ['יתר לחץ דם'],
    'שבר': ['שברים', 'שבר תעסוקתי'],
    'מפרק': ['ניוון מפרקים', 'החלפת מפרק'],
    'עבודה': ['פגיעת גב תעסוקתית', 'תסמונת התעלה הקרפלית', 'ליקוי שמיעה תעסוקתי'],
    'קרפל': ['תסמונת התעלה הקרפלית'],
    'אורתופד': ['אורתופדיה כללי', 'כאבי גב', 'ניוון מפרקים'],
    'סרטן': ['סרטן תעסוקתי'],
    'כוויה': ['כוויות תעסוקתיות'],
    'עור': ['מחלת עור תעסוקתית'],
    'ראש': ['פגיעת ראש תעסוקתית'],
    'נוירולוגי': ['נוירולוגיה כללי', 'אפילפסיה'],
    'פנימית': ['פנימית כללי'],
  };

  const results: DiagnosisGroup[] = [];
  for (const [kw, names] of Object.entries(keywordMap)) {
    if (lower.includes(kw)) {
      for (const name of names) {
        const g = diagnosisGroups.find(d => d.name === name);
        if (g && !results.find(r => r.id === g.id)) results.push(g);
      }
    }
  }
  if (results.length === 0) {
    const direct = diagnosisGroups.filter(g => lower.includes(g.name.toLowerCase()) || g.name.toLowerCase().includes(lower));
    results.push(...direct.slice(0, 3));
  }
  return results;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AgentTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [selectedGroups, setSelectedGroups] = useState<DiagnosisGroup[]>([]);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [formStep, setFormStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      pushAgent(
        `שלום! 👋 אני **${AGENT_NAME}**, הסוכן החכם שלך לוועדות רפואיות.\n\nאני כאן כדי ללוות אותך מהרגע שקיבלת זימון ועד שתגיע מוכן לוועדה — צ'קליסט מסמכים, מילוי טפסים, הערכת מוכנות, וכל מה שצריך.\n\n**איך אני יכול לעזור?**`,
        [
          { id: '1', label: '📋 מה להביא לוועדה?', action: 'מה אני צריך להביא לוועדה?' },
          { id: '2', label: '📝 עזרה במילוי טופס', action: 'אני צריך עזרה במילוי טופס התביעה' },
          { id: '3', label: '⚖️ הזכויות שלי', action: 'מה הזכויות שלי בוועדה?' },
          { id: '4', label: '📊 הערכת מוכנות', action: 'מה הסיכויים שלי?' },
          { id: '5', label: '🏥 סוגי ועדות', action: 'מה ההבדל בין סוגי הוועדות?' },
          { id: '6', label: '❓ שאלות נפוצות', action: 'שאלות נפוצות' },
        ]
      );
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Focus input
  useEffect(() => { inputRef.current?.focus(); }, [typing]);

  const pushAgent = (content: string, actions?: QuickAction[], extra?: Partial<Message>) => {
    setMessages(prev => [...prev, {
      id: `a-${Date.now()}-${Math.random()}`,
      role: 'agent',
      content,
      timestamp: new Date(),
      actions,
      ...extra,
    }]);
  };

  const pushUser = (content: string) => {
    setMessages(prev => [...prev, {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }]);
  };

  const typeAndRespond = (cb: () => void, delay = 1200) => {
    setTyping(true);
    setTimeout(() => { setTyping(false); cb(); }, delay);
  };

  const handleSend = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    pushUser(msg);
    setInput('');
    processMessage(msg);
  };

  const processMessage = (text: string) => {
    const lower = text.toLowerCase();

    // Form filling mode
    if (phase === 'form') {
      handleFormStep(text);
      return;
    }

    // Rights
    if (lower.includes('זכויות') || lower.includes('זכות')) {
      typeAndRespond(() => {
        pushAgent(
          `⚖️ **הזכויות שלך בוועדה הרפואית:**\n\n• **ליווי** — מלווה (בן משפחה, עו"ד, נציג ארגון)\n• **תרגום** — אם אינך דובר עברית\n• **פרוטוקול** — העתק מפרוטוקול הוועדה\n• **ערעור** — תוך 60 יום מההחלטה\n• **מסמכים נוספים** — להציג בכל שלב\n• **נגישות** — תנאי נגישות מלאים\n• **דחייה** — בנסיבות מיוחדות\n\n🔑 **טיפ:** הגע 15 דקות לפני, תאר בכנות, אל תחתום על מסמך שאינך מבין.\n\nרוצה שאכין לך צ'קליסט מסמכים מותאם?`,
          [
            { id: 'c', label: '📋 הכן צ\'קליסט', action: 'מה להביא?' },
            { id: 'f', label: '📝 מילוי טופס', action: 'עזרה בטופס' },
          ]
        );
      });
      return;
    }

    // Committee types
    if (lower.includes('סוגי ועדות') || lower.includes('הבדל') || lower.includes('סוג ועדה')) {
      typeAndRespond(() => {
        pushAgent(
          `🏥 **סוגי ועדות רפואיות:**\n\n**1. נכות כללית** 🏥 — אחוזי נכות למחלה/פגיעה שאינה מעבודה\n**2. נפגעי עבודה** ⚒️ — נכות מתאונת עבודה / מחלת מקצוע\n**3. ניידות** 🚗 — זכאות לקצבת ניידות\n**4. סיעוד** 👴 — רמת תלות בעזרת הזולת\n**5. ועדת ערר** ⚖️ — ערעור על החלטה קודמת (60 יום)\n\nלאיזו ועדה אתה מוזמן? אעזור להתכונן.`,
          [
            { id: 'g', label: 'נכות כללית', action: 'ועדה לנכות כללית' },
            { id: 'w', label: 'נפגעי עבודה', action: 'ועדה לנפגעי עבודה' },
            { id: 'a', label: 'ועדת ערר', action: 'ועדת ערר' },
          ]
        );
      });
      return;
    }

    // FAQ
    if (lower.includes('שאלות') || lower.includes('faq')) {
      typeAndRespond(() => {
        pushAgent(
          `❓ **שאלות נפוצות:**\n\n**כמה זמן נמשכת ועדה?** 15-30 דקות\n**מתי תשובה?** 14 ימי עבודה בדואר\n**אפשר לדחות?** כן, בנסיבות מוצדקות\n**חייבים להגיע?** בד"כ כן. לפעמים על סמך מסמכים\n**מה אם לא מגיעים?** עלול לגרום לדחיית התביעה\n\n**כמה אחוזי נכות אקבל?** תלוי באבחנה, בממצאים ובמסמכים. ככל שהתיק שלם יותר — הסיכוי גבוה יותר.\n\nיש שאלה נוספת?`,
          [
            { id: 'c', label: '📋 צ\'קליסט', action: 'מה להביא?' },
            { id: 'f', label: '📝 טופס', action: 'עזרה בטופס' },
            { id: 'a', label: '📊 הערכה', action: 'הערכת מוכנות' },
          ]
        );
      });
      return;
    }

    // Form filling
    if (lower.includes('טופס') || lower.includes('מילוי')) {
      typeAndRespond(() => {
        setPhase('form');
        setFormStep(0);
        setFormData({});
        pushAgent(`📝 **מעולה! נמלא את טופס התביעה יחד.**\n\nאנחה אותך שלב אחר שלב. בסוף תקבל טופס מוכן להדפסה.\n\n**שלב 1/9:** מה השם המלא שלך?`);
      });
      return;
    }

    // Assessment
    if (lower.includes('סיכויים') || lower.includes('הערכה') || lower.includes('מוכנות') || lower.includes('סיכוי')) {
      if (selectedGroups.length > 0) {
        typeAndRespond(() => {
          const assessment = computeAssessment(selectedGroups, checkedDocs);
          const emoji = assessment.level === 'high' ? '🟢' : assessment.level === 'medium' ? '🟡' : '🔴';
          let resp = `📊 **הערכת מוכנות לוועדה:**\n\n${emoji} ציון: **${assessment.score}/100**\n\n`;
          resp += '**ממצאים:**\n';
          assessment.factors.forEach(f => { resp += `• ${f}\n`; });
          resp += '\n**המלצות לשיפור:**\n';
          assessment.recommendations.forEach(r => { resp += `• ${r}\n`; });
          pushAgent(resp, undefined, { assessment });
        });
      } else {
        typeAndRespond(() => {
          pushAgent('כדי להעריך מוכנות, ספר לי קודם — מה האבחנה / הבעיה הרפואית שלך?', [
            { id: 'b', label: 'כאבי גב', action: 'כאבי גב' },
            { id: 'd', label: 'סוכרת', action: 'סוכרת' },
            { id: 'h', label: 'לב', action: 'בעיות לב' },
            { id: 'm', label: 'נפשי', action: 'בעיות נפשיות' },
          ]);
        });
      }
      return;
    }

    // Diagnosis matching
    const matches = matchDiagnoses(text);
    if (matches.length > 0) {
      setSelectedGroups(matches);
      typeAndRespond(() => {
        const g = matches[0];
        const req = g.documents.filter(d => d.priority === 'required');
        const rec = g.documents.filter(d => d.priority === 'recommended');
        const opt = g.documents.filter(d => d.priority === 'optional');

        let resp = `✅ מצאתי! עבור **${g.name}** (${g.domain}):\n\n`;
        resp += `🔴 **חובה (${req.length}):**\n`;
        req.forEach((d, i) => {
          resp += `${i + 1}. ${d.name}`;
          if (d.whereToGet) resp += ` — _${d.whereToGet}_`;
          resp += '\n';
        });
        if (rec.length > 0) {
          resp += `\n🟡 **מומלץ (${rec.length}):**\n`;
          rec.forEach((d, i) => { resp += `${i + 1}. ${d.name}\n`; });
        }
        if (opt.length > 0) {
          resp += `\n🔵 **אופציונלי (${opt.length}):**\n`;
          opt.forEach((d, i) => { resp += `${i + 1}. ${d.name}\n`; });
        }
        const tips = g.documents.filter(d => d.tip).slice(0, 3);
        if (tips.length > 0) {
          resp += '\n💡 **טיפים:**\n';
          tips.forEach(d => { resp += `• ${d.tip}\n`; });
        }

        pushAgent(resp, [
          { id: 'interactive', label: '✅ צ\'קליסט אינטראקטיבי', action: '__checklist__' },
          { id: 'form', label: '📝 מילוי טופס', action: 'עזרה בטופס' },
          { id: 'assess', label: '📊 הערכת מוכנות', action: 'הערכת מוכנות' },
        ], {
          checklist: { groups: matches, documents: g.documents },
        });
        setPhase('checklist');
      }, 1500);
      return;
    }

    // What to bring (generic)
    if (lower.includes('להביא') || lower.includes('צריך') || lower.includes('מה')) {
      typeAndRespond(() => {
        pushAgent(
          `בשמחה! כדי להכין צ'קליסט מדויק, ספר לי:\n\n1️⃣ מה הבעיה הרפואית / האבחנה?\n2️⃣ האם זו תביעה חדשה או ערר?\n\nלדוגמה: _"יש לי סוכרת ובעיות גב"_`,
          [
            { id: 'b', label: 'כאבי גב', action: 'כאבי גב' },
            { id: 'd', label: 'סוכרת', action: 'סוכרת' },
            { id: 'h', label: 'לב', action: 'בעיות לב' },
            { id: 'm', label: 'נפשי', action: 'בעיות נפשיות' },
            { id: 'w', label: 'פגיעה בעבודה', action: 'נפגעתי בעבודה' },
            { id: 'k', label: 'ברך/מפרקים', action: 'בעיות ברך' },
          ]
        );
      });
      return;
    }

    // Fallback
    typeAndRespond(() => {
      pushAgent(
        `הבנתי. אני יכול לעזור עם:\n\n• **📋 צ'קליסט מסמכים** — ספר את האבחנה\n• **📝 מילוי טופס** — שלב אחר שלב\n• **⚖️ זכויות** — מה מגיע לך\n• **📊 הערכת מוכנות** — כמה מוכן התיק\n• **❓ שאלות** — כל שאלה על הוועדה\n\nמה תרצה?`,
        [
          { id: '1', label: '📋 צ\'קליסט', action: 'מה להביא?' },
          { id: '2', label: '📝 טופס', action: 'עזרה בטופס' },
          { id: '3', label: '⚖️ זכויות', action: 'זכויות' },
          { id: '4', label: '📊 הערכה', action: 'הערכת מוכנות' },
        ]
      );
    });
  };

  // ─── Form Steps ──────────────────────────────────────────────────────────

  const FORM_STEPS = [
    { field: 'fullName', label: 'שם מלא', next: '**שלב 2/9:** מספר תעודת זהות?' },
    { field: 'idNumber', label: 'ת.ז.', next: '**שלב 3/9:** תאריך לידה? (DD/MM/YYYY)' },
    { field: 'birthDate', label: 'תאריך לידה', next: '**שלב 4/9:** כתובת מגורים?' },
    { field: 'address', label: 'כתובת', next: '**שלב 5/9:** מספר טלפון?' },
    { field: 'phone', label: 'טלפון', next: '**שלב 6/9:** מה האבחנה הרפואית העיקרית?' },
    { field: 'diagnosis', label: 'אבחנה', next: '**שלב 7/9:** תאר את התלונות העיקריות ואיך הן משפיעות על היום-יום:' },
    { field: 'mainComplaints', label: 'תלונות', next: '**שלב 8/9:** אילו תרופות אתה לוקח? (שם + מינון)' },
    { field: 'medications', label: 'תרופות', next: '**שלב 9/9:** מצב תעסוקה? (עובד / לא עובד / חלקית)' },
    { field: 'employmentStatus', label: 'תעסוקה', next: '' },
  ];

  const handleFormStep = (text: string) => {
    if (formStep >= FORM_STEPS.length) return;
    const step = FORM_STEPS[formStep];
    const updated = { ...formData, [step.field]: text };
    setFormData(updated);
    const nextStep = formStep + 1;
    setFormStep(nextStep);

    if (nextStep >= FORM_STEPS.length) {
      // Complete
      typeAndRespond(() => {
        let summary = `🎉 **הטופס מוכן!**\n\n`;
        summary += `👤 ${updated.fullName} | ת.ז. ${updated.idNumber}\n`;
        summary += `📅 ${updated.birthDate} | 📍 ${updated.address}\n`;
        summary += `📱 ${updated.phone}\n`;
        summary += `🏥 ${updated.diagnosis}\n`;
        summary += `💊 ${updated.medications}\n`;
        summary += `💼 ${updated.employmentStatus}\n\n`;
        summary += `📋 **תלונות:** ${updated.mainComplaints}\n\n`;
        summary += `---\n✅ ניתן להעתיק, להדפיס ולהגיש!`;
        pushAgent(summary, [
          { id: 'copy', label: '📋 העתק טופס', action: '__copy_form__' },
          { id: 'checklist', label: '📋 המשך לצ\'קליסט', action: `מה להביא עבור ${updated.diagnosis}` },
          { id: 'assess', label: '📊 הערכת מוכנות', action: 'הערכת מוכנות' },
        ], { formData: updated });
        setPhase('idle');
      });
    } else {
      const pct = Math.round((nextStep / FORM_STEPS.length) * 100);
      typeAndRespond(() => {
        pushAgent(`✓ _${step.label}:_ **${text}**\n\n━━━ ${pct}% ━━━\n\n${FORM_STEPS[nextStep - 1].next}`);
      }, 600);
    }
  };

  // ─── Assessment ──────────────────────────────────────────────────────────

  const computeAssessment = (groups: DiagnosisGroup[], checked: Record<string, boolean>): Assessment => {
    const docs = groups.flatMap(g => g.documents);
    const total = docs.length;
    const checkedCount = docs.filter(d => checked[d.id]).length;
    const required = docs.filter(d => d.priority === 'required');
    const reqChecked = required.filter(d => checked[d.id]).length;
    const aiDocs = docs.filter(d => d.aiRating && d.aiRating >= 4);
    const aiChecked = aiDocs.filter(d => checked[d.id]).length;

    const completeness = total > 0 ? (checkedCount / total) * 100 : 0;
    const reqPct = required.length > 0 ? (reqChecked / required.length) * 100 : 0;
    const aiPct = aiDocs.length > 0 ? (aiChecked / aiDocs.length) * 100 : 0;

    const score = Math.min(Math.round(completeness * 0.5 + reqPct * 0.3 + aiPct * 0.2), 100);
    const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

    const factors: string[] = [];
    if (reqPct === 100) factors.push('✅ כל מסמכי החובה מוכנים');
    else factors.push(`⚠️ חסרים ${required.length - reqChecked} מסמכי חובה`);
    if (aiPct >= 80) factors.push('✅ מסמכים אובייקטיביים (מסלול ירוק) מוכנים');
    if (completeness >= 80) factors.push('✅ שלמות תיק גבוהה');
    else if (completeness < 50) factors.push('⚠️ שלמות תיק נמוכה');

    const recommendations: string[] = [];
    const missingReq = required.filter(d => !checked[d.id]);
    if (missingReq.length > 0) recommendations.push(`השג בדחיפות: ${missingReq.slice(0, 3).map(d => d.name).join(', ')}`);
    if (aiPct < 50) recommendations.push('הוסף בדיקות אובייקטיביות (דם, הדמיה) — מחזקות את התיק');
    recommendations.push('הגע עם מלווה שמכיר את מצבך');
    recommendations.push('הכן רשימת תרופות עדכנית');

    return { score, level, factors, recommendations };
  };

  // ─── Actions ─────────────────────────────────────────────────────────────

  const handleAction = (action: string) => {
    if (action === '__checklist__') {
      // Show interactive checklist inline
      if (selectedGroups.length > 0) {
        pushUser('הצג צ\'קליסט אינטראקטיבי');
        typeAndRespond(() => {
          pushAgent(
            `✅ **צ'קליסט אינטראקטיבי — ${selectedGroups[0].name}**\n\nסמן מסמכים שיש לך:`,
            undefined,
            { checklist: { groups: selectedGroups, documents: selectedGroups[0].documents } }
          );
        }, 600);
      }
      return;
    }
    if (action === '__copy_form__') {
      const text = Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join('\n');
      navigator.clipboard.writeText(text);
      toast.success('הטופס הועתק ללוח');
      return;
    }
    handleSend(action);
  };

  const handleDocToggle = (docId: string) => {
    setCheckedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handleReset = () => {
    setMessages([]);
    setPhase('idle');
    setSelectedGroups([]);
    setCheckedDocs({});
    setFormData({});
    setFormStep(0);
    setTimeout(() => {
      pushAgent(
        `שלום שוב! 👋 איך אני יכול לעזור?`,
        [
          { id: '1', label: '📋 צ\'קליסט', action: 'מה להביא?' },
          { id: '2', label: '📝 טופס', action: 'עזרה בטופס' },
          { id: '3', label: '⚖️ זכויות', action: 'זכויות' },
          { id: '4', label: '📊 הערכה', action: 'הערכת מוכנות' },
        ]
      );
    }, 200);
  };

  const handleExport = () => {
    const text = messages.map(m => `[${m.role === 'user' ? 'אני' : AGENT_NAME}] ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('השיחה הועתקה');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl mb-6 p-6 md:p-8 text-white"
        style={{ background: 'linear-gradient(135deg, hsl(213 73% 20%) 0%, hsl(207 95% 35%) 50%, hsl(37 78% 52%) 100%)' }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/30">
              <Bot className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">{AGENT_NAME} — סוכן AI לוועדות רפואיות</h2>
              <p className="text-white/80 text-sm">ליווי חכם מהזימון ועד הוועדה | מופעל ע״י Amazon Bedrock</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { icon: <ClipboardCheck className="h-5 w-5" />, label: 'צ\'קליסט חכם', sub: '140 אבחנות' },
              { icon: <FileText className="h-5 w-5" />, label: 'מילוי טפסים', sub: 'שלב אחר שלב' },
              { icon: <Scale className="h-5 w-5" />, label: 'מיצוי זכויות', sub: 'מותאם אישית' },
              { icon: <Sparkles className="h-5 w-5" />, label: 'הערכת מוכנות', sub: 'AI מתקדם' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">{item.icon}</div>
                <div className="text-xs font-bold">{item.label}</div>
                <div className="text-[10px] text-white/60">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Chat Area */}
      <Card className="border-2 border-secondary/20 shadow-xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-l from-primary/5 to-secondary/5 border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-semibold">שיחה עם {AGENT_NAME}</span>
            <Badge variant="outline" className="text-[10px]">
              <Sparkles className="h-3 w-3 ml-1" /> GenAI
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleExport} className="h-8 w-8 p-0" aria-label="ייצוא">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 w-8 p-0" aria-label="שיחה חדשה">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-[500px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-card">
          {messages.map(msg => (
            <div key={msg.id}>
              {msg.role === 'user' ? (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                    <div className="bg-accent/10 border border-accent/20 rounded-2xl rounded-br-sm px-4 py-3">
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div className="flex items-end gap-2 max-w-[85%] flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="space-y-2">
                      <div className="bg-card border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                        <div className="text-sm whitespace-pre-wrap leading-relaxed">
                          <RichText text={msg.content} />
                        </div>
                      </div>

                      {/* Interactive Checklist */}
                      {msg.checklist && (
                        <ChecklistWidget
                          data={msg.checklist}
                          checked={checkedDocs}
                          onToggle={handleDocToggle}
                        />
                      )}

                      {/* Assessment */}
                      {msg.assessment && <AssessmentWidget data={msg.assessment} />}

                      {/* Actions */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {msg.actions.map(a => (
                            <button
                              key={a.id}
                              onClick={() => handleAction(a.action)}
                              className="px-3 py-2 text-xs font-medium rounded-xl border border-secondary/30 bg-secondary/5 text-secondary hover:bg-secondary/15 transition-all hover:shadow-sm min-h-[36px]"
                            >
                              {a.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-secondary" />
              </div>
              <div className="bg-card border rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t bg-card p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={phase === 'form' ? 'הקלד את התשובה...' : 'שאל אותי משהו על הוועדה...'}
              className="flex-1 min-h-[48px] text-right text-base"
              dir="rtl"
              aria-label="הודעה"
            />
            <Button
              type="submit"
              disabled={!input.trim() || typing}
              className="min-h-[48px] min-w-[48px] bg-secondary hover:bg-secondary/90 text-white"
              aria-label="שלח"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-[10px] text-muted-foreground">
              מופעל ע״י Amazon Bedrock | Claude | ביטוח לאומי
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                {diagnosisGroups.length} אבחנות
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <Sparkles className="h-3 w-3 ml-1" /> AI Agent
              </Badge>
            </div>
          </div>
        </form>
      </Card>

      {/* Stats Bar */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'אבחנות נתמכות', value: '140+', icon: <ClipboardCheck className="h-4 w-4" /> },
          { label: 'מסמכים במאגר', value: '3,934', icon: <FileText className="h-4 w-4" /> },
          { label: 'תחומי תביעה', value: '7', icon: <Scale className="h-4 w-4" /> },
          { label: 'דירוגי AI', value: '286', icon: <Sparkles className="h-4 w-4" /> },
        ].map((s, i) => (
          <Card key={i} className="border-secondary/10">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                {s.icon}
              </div>
              <div>
                <div className="text-lg font-extrabold text-secondary">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('_') && part.endsWith('_')) return <em key={i} className="text-muted-foreground">{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function ChecklistWidget({ data, checked, onToggle }: { data: ChecklistData; checked: Record<string, boolean>; onToggle: (id: string) => void }) {
  const docs = data.documents;
  const total = docs.length;
  const done = docs.filter(d => checked[d.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const required = docs.filter(d => d.priority === 'required');
  const recommended = docs.filter(d => d.priority === 'recommended');
  const optional = docs.filter(d => d.priority === 'optional');

  return (
    <Card className="border-secondary/20">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">{done}/{total} מסמכים מוכנים</span>
          <Badge className={`text-[10px] ${pct >= 80 ? 'bg-success text-white' : pct >= 50 ? 'bg-warning text-white' : 'bg-destructive text-white'}`}>
            {pct}%
          </Badge>
        </div>
        <Progress value={pct} className={`h-2.5 rounded-full ${pct >= 80 ? '[&>div]:bg-success' : pct >= 50 ? '[&>div]:bg-warning' : '[&>div]:bg-destructive'}`} />

        <div className="space-y-1 max-h-[250px] overflow-y-auto">
          {required.length > 0 && (
            <>
              <div className="text-[10px] font-bold text-destructive mt-1">🔴 חובה ({required.length})</div>
              {required.map(d => <DocItem key={d.id} doc={d} checked={!!checked[d.id]} onToggle={onToggle} />)}
            </>
          )}
          {recommended.length > 0 && (
            <>
              <div className="text-[10px] font-bold text-warning mt-2">🟡 מומלץ ({recommended.length})</div>
              {recommended.map(d => <DocItem key={d.id} doc={d} checked={!!checked[d.id]} onToggle={onToggle} />)}
            </>
          )}
          {optional.length > 0 && (
            <>
              <div className="text-[10px] font-bold text-secondary mt-2">🔵 אופציונלי ({optional.length})</div>
              {optional.map(d => <DocItem key={d.id} doc={d} checked={!!checked[d.id]} onToggle={onToggle} />)}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DocItem({ doc, checked, onToggle }: { doc: DocumentItem; checked: boolean; onToggle: (id: string) => void }) {
  return (
    <button
      onClick={() => onToggle(doc.id)}
      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-right text-xs transition-all ${
        checked ? 'bg-success/10' : 'hover:bg-muted/10'
      }`}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-success border-success' : 'border-muted/40'
      }`}>
        {checked && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
      </div>
      <span className={`flex-1 ${checked ? 'line-through text-muted-foreground' : ''}`}>{doc.name}</span>
      {doc.aiRating && doc.aiRating >= 4 && (
        <Badge className="text-[8px] bg-accent/20 text-accent-foreground px-1.5">AI {doc.aiRating}/5</Badge>
      )}
    </button>
  );
}

function AssessmentWidget({ data }: { data: Assessment }) {
  const bgColor = data.level === 'high' ? 'bg-success/10 border-success/30' : data.level === 'medium' ? 'bg-warning/10 border-warning/30' : 'bg-destructive/10 border-destructive/30';
  const textColor = data.level === 'high' ? 'text-success' : data.level === 'medium' ? 'text-warning' : 'text-destructive';
  const barColor = data.level === 'high' ? '[&>div]:bg-success' : data.level === 'medium' ? '[&>div]:bg-warning' : '[&>div]:bg-destructive';

  return (
    <Card className={`border ${bgColor}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center`}>
            <span className={`text-xl font-extrabold ${textColor}`}>{data.score}</span>
          </div>
          <div>
            <div className="text-sm font-bold">ציון מוכנות לוועדה</div>
            <Badge className={`text-[10px] ${data.level === 'high' ? 'bg-success' : data.level === 'medium' ? 'bg-warning' : 'bg-destructive'} text-white`}>
              {data.level === 'high' ? '🟢 מוכנות גבוהה' : data.level === 'medium' ? '🟡 בינונית' : '🔴 דרוש שיפור'}
            </Badge>
          </div>
        </div>
        <Progress value={data.score} className={`h-3 rounded-full ${barColor}`} />
      </CardContent>
    </Card>
  );
}

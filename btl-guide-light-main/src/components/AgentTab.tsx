import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Bot, Send, User, Sparkles, CheckCircle2, RotateCcw,
  Download, FileText, ClipboardCheck, Scale,
  Upload, Eye, MessageCircle, ArrowLeft,
} from 'lucide-react';
import { diagnosisGroups, type DiagnosisGroup, type DocumentItem } from '@/data/diagnoses';
import { toast } from 'sonner';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  actions?: QuickAction[];
  widget?: 'checklist' | 'form-progress' | 'assessment' | 'upload' | 'prep';
  widgetData?: any;
}

interface QuickAction { id: string; label: string; action: string; }
interface Assessment { score: number; level: 'high' | 'medium' | 'low'; factors: string[]; recommendations: string[]; }

// Steps in the user journey
type JourneyStep = 'welcome' | 'identify' | 'checklist' | 'find-docs' | 'upload' | 'fill-form' | 'assess' | 'prepare';

// ═══════════════════════════════════════════════════════════════════════════════
// DIAGNOSIS MATCHING
// ═══════════════════════════════════════════════════════════════════════════════

function matchDiagnoses(text: string): DiagnosisGroup[] {
  const lower = text.toLowerCase();
  const map: Record<string, string[]> = {
    'גב': ['כאבי גב', 'פגיעת גב תעסוקתית', 'פריצת דיסק תעסוקתית'],
    'סוכרת': ['סוכרת'],
    'לב': ['מחלת לב איסכמית', 'אי-ספיקת לב', 'הפרעות קצב'],
    'ברך': ['ניוון מפרקים', 'פגיעת ברך תעסוקתית'],
    'כתף': ['פגיעת כתף', 'פגיעת כתף תעסוקתית'],
    'דיכאון': ['דיכאון', 'בריאות הנפש כללי'],
    'חרדה': ['חרדה', 'בריאות הנפש כללי'],
    'נפש': ['בריאות הנפש כללי', 'דיכאון', 'חרדה', 'PTSD'],
    'ptsd': ['PTSD', 'PTSD מאירוע איבה'],
    'טראומה': ['PTSD', 'PTSD מאירוע איבה'],
    'אפילפסיה': ['אפילפסיה'],
    'שמיעה': ['ליקוי שמיעה תעסוקתי', 'אובדן שמיעה מפיצוץ'],
    'ריאות': ['אסתמה תעסוקתית'],
    'אסתמה': ['אסתמה תעסוקתית'],
    'כליות': ['מחלת כליות'],
    'כבד': ['מחלת כבד'],
    'לחץ דם': ['יתר לחץ דם'],
    'שבר': ['שברים', 'שבר תעסוקתי'],
    'מפרק': ['ניוון מפרקים', 'החלפת מפרק'],
    'קרפל': ['תסמונת התעלה הקרפלית'],
    'אורתופד': ['אורתופדיה כללי', 'כאבי גב'],
    'סרטן': ['סרטן תעסוקתי'],
    'עור': ['מחלת עור תעסוקתית'],
    'ראש': ['פגיעת ראש תעסוקתית', 'פגיעת ראש טראומטית'],
    'נוירולוגי': ['נוירולוגיה כללי', 'אפילפסיה'],
    'פנימית': ['פנימית כללי'],
    'איבה': ['PTSD מאירוע איבה', 'פגיעת ראש טראומטית', 'פגיעת גפיים מפיצוץ', 'אובדן שמיעה מפיצוץ'],
    'פיצוץ': ['אובדן שמיעה מפיצוץ', 'פגיעת גפיים מפיצוץ'],
    'אוטיזם': ['אוטיזם'],
    'adhd': ['ADHD'],
    'קשב': ['ADHD'],
    'ילד': ['אוטיזם', 'ADHD'],
    'התפתחות': ['אוטיזם', 'ADHD'],
  };

  const results: DiagnosisGroup[] = [];
  for (const [kw, names] of Object.entries(map)) {
    if (lower.includes(kw)) {
      for (const name of names) {
        const g = diagnosisGroups.find(d => d.name === name);
        if (g && !results.find(r => r.id === g.id)) results.push(g);
      }
    }
  }
  if (results.length === 0) {
    const direct = diagnosisGroups.filter(g =>
      lower.includes(g.name.toLowerCase()) || g.name.toLowerCase().includes(lower)
    );
    results.push(...direct.slice(0, 3));
  }
  return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AgentTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [journeyStep, setJourneyStep] = useState<JourneyStep>('welcome');
  const [selectedGroups, setSelectedGroups] = useState<DiagnosisGroup[]>([]);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formStep, setFormStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const AGENT = 'נועם';

  // Dynamic quick replies per journey step
  const QUICK_REPLIES: Record<JourneyStep, QuickAction[]> = {
    welcome: [],
    identify: [
      { id: '1', label: 'סוכרת', action: 'סוכרת' },
      { id: '2', label: 'כאבי גב', action: 'כאבי גב' },
      { id: '3', label: 'דיכאון / חרדה', action: 'דיכאון' },
      { id: '4', label: 'בעיות לב', action: 'מחלת לב' },
      { id: '5', label: 'ילד נכה', action: 'אוטיזם' },
      { id: '6', label: 'נפגע איבה', action: 'נפגע פעולות איבה' },
    ],
    checklist: [
      { id: '1', label: '🔍 איך משיגים?', action: '__find_docs__' },
      { id: '2', label: '📤 אעלה מסמכים', action: '__upload__' },
      { id: '3', label: '📝 מילוי טופס', action: '__start_form__' },
    ],
    'find-docs': [
      { id: '1', label: 'הבנתי, אצא להשיג', action: '__back_checklist__' },
      { id: '2', label: 'שאלה על מסמך', action: 'איך משיגים סיכום רופא?' },
      { id: '3', label: 'מוכן להמשיך', action: '__upload__' },
    ],
    upload: [
      { id: '1', label: '🧪 הדמה: בדיקת דם', action: '__sim_upload_blood__' },
      { id: '2', label: '🔬 הדמה: MRI', action: '__sim_upload_mri__' },
      { id: '3', label: '📝 המשך לטופס', action: '__start_form__' },
    ],
    'fill-form': [],
    assess: [
      { id: '1', label: '🔍 שיפור ציון', action: '__find_docs__' },
      { id: '2', label: '🎯 הכנה לוועדה', action: '__prepare__' },
    ],
    prepare: [
      { id: '1', label: '⚖️ זכויות', action: '__rights__' },
      { id: '2', label: '📊 בדיקה אחרונה', action: '__assess__' },
      { id: '3', label: 'תודה, הכל ברור!', action: '__done__' },
    ],
  };

  // ─── Init ──────────────────────────────────────────────────────────────

  useEffect(() => {
    setTimeout(() => {
      push('agent',
        `שלום 👋 אני **${AGENT}**.\n\nאני יודע בדיוק מה צריך לוועדה הרפואית — על בסיס ניתוח **3,934 תיקים** בביטוח לאומי.\n\n**ספר לי: מה הבעיה הרפואית שלך?**`,
        [
          { id: '1', label: '🦴 כאבי גב', action: 'יש לי כאבי גב' },
          { id: '2', label: '💉 סוכרת', action: 'סוכרת' },
          { id: '3', label: '❤️ לב', action: 'בעיות לב' },
          { id: '4', label: '🧠 נפשי', action: 'דיכאון' },
          { id: '5', label: '👶 ילד נכה', action: 'אוטיזם אצל הילד' },
          { id: '6', label: '🎖️ נפגע איבה', action: 'נפגע פעולות איבה' },
        ]
      );
      setJourneyStep('identify');
    }, 400);
  }, []);

  // Auto-scroll & focus
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, typing]);
  useEffect(() => { inputRef.current?.focus(); }, [typing]);

  // ─── Message Helpers ───────────────────────────────────────────────────

  const push = (role: 'user' | 'agent', content: string, actions?: QuickAction[], widget?: Message['widget'], widgetData?: any) => {
    setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, role, content, timestamp: new Date(), actions, widget, widgetData }]);
  };

  const respond = (cb: () => void, delay = 1000) => {
    setTyping(true);
    setTimeout(() => { setTyping(false); cb(); }, delay);
  };

  // ─── Main Input Handler ────────────────────────────────────────────────

  const handleSend = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    push('user', msg);
    setInput('');
    processMessage(msg);
  };

  const processMessage = (text: string) => {
    const lower = text.toLowerCase();

    // If in form-filling mode
    if (journeyStep === 'fill-form') { handleFormInput(text); return; }

    // ─── Step 1: Identify diagnosis ──────────────────────────────────
    const matches = matchDiagnoses(text);
    if (matches.length > 0) {
      setSelectedGroups(matches);
      setJourneyStep('checklist');
      respond(() => {
        const g = matches[0];
        const req = g.documents.filter(d => d.priority === 'required');
        const rec = g.documents.filter(d => d.priority === 'recommended');
        const opt = g.documents.filter(d => d.priority === 'optional');
        const total = g.documents.length;
        const aiDocs = g.documents.filter(d => d.aiRating && d.aiRating >= 4);

        let resp = `✅ זיהיתי: **${g.name}**`;
        if (matches.length > 1) resp += ` + ${matches.slice(1).map(m => m.name).join(', ')}`;
        resp += ` (${g.domain})\n\n`;

        // Show the "aha" - this is personalized based on analysis
        resp += `📊 _על בסיס ניתוח ${g.domain === 'נכות' ? '778' : g.domain === 'ילד נכה' ? '812' : '778'} תיקים דומים בבטל"א:_\n\n`;

        resp += `🔴 **חובה (${req.length})** — בלי זה התיק לא יטופל:\n`;
        req.forEach((d, i) => {
          resp += `  ${i + 1}. **${d.name}**`;
          if (d.whereToGet) resp += ` ← ${d.whereToGet}`;
          if (d.aiRating && d.aiRating >= 4) resp += ` 🟢`;
          resp += '\n';
        });

        if (rec.length > 0) {
          resp += `\n🟡 **מומלץ (${rec.length})** — מחזק את התיק משמעותית:\n`;
          rec.forEach((d, i) => { resp += `  ${i + 1}. ${d.name}\n`; });
        }

        if (opt.length > 0) {
          resp += `\n🔵 **רשות (${opt.length}):** ${opt.map(d => d.name).join(', ')}\n`;
        }

        if (aiDocs.length > 0) {
          resp += `\n🟢 **מסלול ירוק:** ${aiDocs.length} מסמכים אובייקטיביים — ניתנים לאישור מהיר\n`;
        }

        resp += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        resp += `**סמן מה יש לך** ← אני מחשב מוכנות בזמן אמת`;

        push('agent', resp, [
          { id: 'find', label: '🔍 איך משיגים את מה שחסר?', action: '__find_docs__' },
          { id: 'form', label: '📝 נמלא את הטופס ביחד', action: '__start_form__' },
          { id: 'upload', label: '📤 יש לי מסמכים — אעלה', action: '__upload__' },
          { id: 'assess', label: '📊 מה הסיכויים שלי?', action: '__assess__' },
          { id: 'prep', label: '🎯 הכנה לוועדה', action: '__prepare__' },
        ], 'checklist', { groups: matches, documents: g.documents });
      }, 1200);
      return;
    }

    // ─── Keywords routing ────────────────────────────────────────────
    if (lower.includes('טופס') || lower.includes('מילוי')) { handleAction('__start_form__'); return; }
    if (lower.includes('איפה') || lower.includes('להשיג') || lower.includes('תור') || lower.includes('קופ')) { handleAction('__find_docs__'); return; }
    if (lower.includes('זכויות') || lower.includes('זכות')) { handleAction('__rights__'); return; }
    if (lower.includes('הכנה') || lower.includes('ועדה') || lower.includes('יעוץ') || lower.includes('טיפ')) { handleAction('__prepare__'); return; }
    if (lower.includes('סיכוי') || lower.includes('הערכ') || lower.includes('מוכנות')) { handleAction('__assess__'); return; }
    if (lower.includes('העלא') || lower.includes('סריק') || lower.includes('ocr') || lower.includes('צילום')) { handleAction('__upload__'); return; }

    // ─── Fallback: ask for diagnosis ─────────────────────────────────
    respond(() => {
      push('agent',
        `לא הצלחתי לזהות את הלקות. נסה לתאר שוב — מה הבעיה הרפואית?\n\nלדוגמה:\n• "יש לי סוכרת"\n• "כאבי גב כרוניים"\n• "הילד שלי אובחן עם אוטיזם"\n• "נפגעתי באירוע טרור"`,
        [
          { id: '1', label: '🦴 גב', action: 'כאבי גב' },
          { id: '2', label: '💉 סוכרת', action: 'סוכרת' },
          { id: '3', label: '❤️ לב', action: 'מחלת לב' },
          { id: '4', label: '🧠 נפשי', action: 'דיכאון' },
          { id: '5', label: '👶 ילד', action: 'אוטיזם' },
          { id: '6', label: '🎖️ איבה', action: 'נפגע איבה' },
        ]
      );
    }, 800);
  };

  // ─── Action Handlers ───────────────────────────────────────────────────

  const handleAction = (action: string) => {
    if (action === '__find_docs__') {
      setJourneyStep('find-docs');
      if (selectedGroups.length === 0) { push('user', 'איך משיגים מסמכים?'); }
      respond(() => {
        const g = selectedGroups.length > 0 ? selectedGroups[0] : null;
        const diagName = g ? g.name : '';
        const missingReq = g ? g.documents.filter(d => d.priority === 'required' && !checkedDocs[d.id]) : [];

        let resp = `🔍 **תוכנית פעולה אישית${diagName ? ` — ${diagName}` : ''}:**\n\n`;

        if (missingReq.length > 0) {
          resp += `⚠️ חסרים לך **${missingReq.length} מסמכי חובה**. הנה בדיוק מה לעשות:\n\n`;
        }

        resp += `**📍 צעד 1 — רופא משפחה** (התחל כאן)\n`;
        resp += `קבע תור ← בקש:\n`;
        resp += `• הפניות למומחים הרלוונטיים\n`;
        resp += `• מכתב מלווה לוועדה\n`;
        resp += `• רשימת תרופות מעודכנת\n`;
        resp += `• הפניה לבדיקות דם\n`;
        resp += `📌 _אמור לרופא: "אני מגיש תביעה לוועדה רפואית — צריך סיכומים מפורטים"_\n\n`;

        resp += `**🏥 צעד 2 — רופא מומחה**\n`;
        if (g) {
          // Personalize based on diagnosis
          const specialists = new Set<string>();
          g.documents.forEach(d => {
            if (d.name.includes('אורתופד')) specialists.add('אורתופד');
            if (d.name.includes('קרדיולוג') || d.name.includes('אקו לב')) specialists.add('קרדיולוג');
            if (d.name.includes('נוירולוג') || d.name.includes('EMG')) specialists.add('נוירולוג');
            if (d.name.includes('פסיכיאטר')) specialists.add('פסיכיאטר');
            if (d.name.includes('אנדוקרינולוג') || d.name.includes('HbA1c')) specialists.add('אנדוקרינולוג');
            if (d.name.includes('ריאות') || d.name.includes('ספירומטריה')) specialists.add('רופא ריאות');
            if (d.name.includes('עיניים')) specialists.add('רופא עיניים');
          });
          if (specialists.size > 0) {
            resp += `עבורך: **${[...specialists].join(', ')}**\n`;
          }
        }
        resp += `בקש סיכום מפורט הכולל: אבחנות + ממצאים + **מגבלות תפקודיות**\n`;
        resp += `⚠️ _ודא שהסיכום מ-6 חודשים אחרונים!_\n\n`;

        resp += `**🔬 צעד 3 — בדיקות**\n`;
        resp += `• דם → הפניה מרופא משפחה → תוצאות תוך 1-3 ימים\n`;
        resp += `• הדמיה (MRI/CT) → הפניה ממומחה → **הביא דיסק + פענוח**\n\n`;

        resp += `**📱 קביעת תורים:**\n`;
        resp += `כללית *2700 | מכבי *3555 | מאוחדת *3833 | לאומית *507\n\n`;
        resp += `⏱️ **תכנן 3-4 שבועות** לפני הוועדה`;

        push('agent', resp, [
          { id: 'clalit', label: '🏥 כללית אונליין', action: '__open_clalit__' },
          { id: 'maccabi', label: '🏥 מכבי אונליין', action: '__open_maccabi__' },
          { id: 'upload', label: '📤 יש לי — אעלה', action: '__upload__' },
          { id: 'form', label: '📝 בינתיים נמלא טופס', action: '__start_form__' },
          { id: 'back', label: '← חזור לצ\'קליסט', action: '__back_checklist__' },
        ]);
      }, 1000);
      return;
    }

    if (action === '__upload__') {
      setJourneyStep('upload');
      push('user', 'רוצה להעלות מסמכים');
      respond(() => {
        push('agent',
          `📤 **העלאת מסמכים — סריקה וזיהוי אוטומטי**\n\n` +
          `העלה תמונה או PDF של מסמך רפואי. המערכת תזהה:\n\n` +
          `✅ סוג המסמך (סיכום רופא / בדיקת דם / הדמיה...)\n` +
          `✅ האם המסמך תקין ועדכני\n` +
          `✅ התאמה לצ'קליסט שלך\n\n` +
          `⚠️ _בגרסת הדמו — לחץ על הכפתור להדמיית הסריקה_`,
          [
            { id: 'sim-blood', label: '🧪 הדמה: בדיקת דם', action: '__sim_upload_blood__' },
            { id: 'sim-mri', label: '🔬 הדמה: MRI', action: '__sim_upload_mri__' },
            { id: 'sim-doc', label: '📄 הדמה: סיכום רופא', action: '__sim_upload_doc__' },
            { id: 'back', label: '← חזור לצ\'קליסט', action: '__back_checklist__' },
          ], 'upload'
        );
      }, 800);
      return;
    }

    if (action.startsWith('__sim_upload_')) {
      const type = action.replace('__sim_upload_', '').replace('__', '');
      const simulations: Record<string, { name: string; status: string; match: string }> = {
        'blood': { name: 'בדיקות דם — ספירה + כימיה', status: '✅ תקין — תאריך עדכני (מאי 2026)', match: 'מתאים לצ\'קליסט: "בדיקות דם עדכניות"' },
        'mri': { name: 'MRI עמוד שדרה מותני', status: '✅ תקין — כולל פענוח רדיולוג', match: 'מתאים לצ\'קליסט: "MRI עמוד שדרה"' },
        'doc': { name: 'סיכום רופא — אורתופד', status: '⚠️ תאריך ישן (לפני 8 חודשים) — מומלץ לעדכן', match: 'מתאים לצ\'קליסט: "סיכום רפואי מאורתופד"' },
      };
      const sim = simulations[type] || simulations['blood'];
      respond(() => {
        push('agent',
          `📄 **סריקת מסמך (OCR + AI):**\n\n` +
          `🔎 מזהה: **${sim.name}**\n` +
          `${sim.status}\n` +
          `📋 ${sim.match}\n\n` +
          `🟢 _מסלול ירוק: מסמך אובייקטיבי — ניתן לאישור אוטומטי_`,
          [
            { id: 'more', label: '📤 העלה עוד מסמך', action: '__upload__' },
            { id: 'assess', label: '📊 הערכת סיכויים', action: '__assess__' },
            { id: 'form', label: '📝 מילוי טופס', action: '__start_form__' },
          ]
        );
      }, 1500);
      return;
    }

    if (action === '__start_form__') {
      setJourneyStep('fill-form');
      setFormStep(0);
      setFormData({});
      push('user', 'רוצה למלא טופס תביעה');
      respond(() => {
        push('agent',
          `📝 **טופס BL/283 — תביעה לקביעת דרגת נכות**\n\n` +
          `נמלא ביחד, שלב אחר שלב. אני שואל — אתה עונה.\n` +
          `שדות שידועים לי ימולאו אוטומטית.\n\n` +
          `━━━ **שלב 1/12** ━━━\n\n` +
          `מה **השם המלא** שלך?`
        );
      }, 600);
      return;
    }

    if (action === '__assess__') {
      setJourneyStep('assess');
      push('user', 'מה הסיכויים שלי?');
      respond(() => {
        const assessment = computeAssessment();
        const emoji = assessment.level === 'high' ? '🟢' : assessment.level === 'medium' ? '🟡' : '🔴';
        const diagName = selectedGroups.length > 0 ? selectedGroups[0].name : 'הלקות שלך';
        let resp = `📊 **הערכת סיכויים — ${diagName}:**\n\n`;
        resp += `${emoji} ציון מוכנות: **${assessment.score}/100**\n\n`;

        // Data-driven insight
        if (selectedGroups.length > 0) {
          const g = selectedGroups[0];
          const reqCount = g.documents.filter(d => d.priority === 'required').length;
          const aiCount = g.documents.filter(d => d.aiRating && d.aiRating >= 4).length;
          resp += `_מבוסס על ניתוח תיקים דומים: ${reqCount} מסמכי חובה, ${aiCount} במסלול ירוק_\n\n`;
        }

        resp += `**מצב התיק שלך:**\n`;
        assessment.factors.forEach(f => { resp += `${f}\n`; });
        resp += `\n**מה לעשות עכשיו:**\n`;
        assessment.recommendations.forEach((r, i) => { resp += `${i + 1}. ${r}\n`; });

        if (assessment.score < 70) {
          resp += `\n💡 _טיפ: כל מסמך חובה שתוסיף מעלה את הציון ב-10-15 נקודות_`;
        } else {
          resp += `\n🎉 _התיק שלך במצב טוב! מומלץ להמשיך להכנה לוועדה._`;
        }

        push('agent', resp, [
          { id: 'find', label: '🔍 השג מה שחסר', action: '__find_docs__' },
          { id: 'prep', label: '🎯 הכנה לוועדה', action: '__prepare__' },
          { id: 'form', label: '📝 מילוי טופס', action: '__start_form__' },
        ], 'assessment', assessment);
      }, 1200);
      return;
    }

    if (action === '__rights__') {
      push('user', 'מה הזכויות שלי?');
      respond(() => {
        push('agent',
          `⚖️ **הזכויות שלך בוועדה:**\n\n` +
          `• **מלווה** — בן משפחה, עו"ד, נציג ארגון\n` +
          `• **תרגום** — אם אינך דובר עברית\n` +
          `• **פרוטוקול** — זכות לקבל העתק\n` +
          `• **ערעור** — תוך 60 יום מההחלטה\n` +
          `• **מסמכים** — להציג גם ביום הוועדה\n` +
          `• **נגישות** — תנאי נגישות מלאים\n` +
          `• **דחייה** — בנסיבות מיוחדות\n\n` +
          `🔑 **זכור:** אל תחתום על מסמך שאינך מבין. בקש הסבר.`,
          [
            { id: 'prep', label: '🎯 הכנה לוועדה', action: '__prepare__' },
            { id: 'back', label: '← חזור', action: '__back_checklist__' },
          ]
        );
      }, 800);
      return;
    }

    if (action === '__prepare__') {
      setJourneyStep('prepare');
      push('user', 'איך מתכוננים לוועדה?');
      respond(() => {
        const diag = selectedGroups.length > 0 ? selectedGroups[0].name : '';
        let resp = `🎯 **הכנה לוועדה הרפואית${diag ? ` — ${diag}` : ''}:**\n\n`;
        resp += `**📅 יום לפני:**\n`;
        resp += `• סדר את כל המסמכים בתיקייה שקופה\n`;
        resp += `• הכן רשימת תרופות (שם + מינון + תדירות)\n`;
        resp += `• כתוב 3-4 משפטים על איך המצב משפיע על היום-יום\n\n`;
        resp += `**🏥 ביום הוועדה:**\n`;
        resp += `• הגע 15 דקות לפני\n`;
        resp += `• הגע עם מלווה שמכיר את מצבך\n`;
        resp += `• הביא תעודת זהות + כל המסמכים\n\n`;
        resp += `**🗣️ בזמן הוועדה:**\n`;
        resp += `• דבר על **היום-יום** — לא על אבחנות\n`;
        resp += `• "אני לא יכול..." חשוב יותר מ-"יש לי..."\n`;
        resp += `• תאר בכנות — אל תגזים ואל תמעיט\n`;
        resp += `• אם כואב — תגיד. אל תסתיר\n\n`;
        resp += `**❌ מה לא לעשות:**\n`;
        resp += `• לא לחתום על מסמך שלא מבינים\n`;
        resp += `• לא להגיד "הכל בסדר" כשלא\n`;
        resp += `• לא לשכוח לבקש פרוטוקול\n\n`;
        resp += `💪 **אתה מוכן. בהצלחה!**`;

        push('agent', resp, [
          { id: 'rights', label: '⚖️ זכויות', action: '__rights__' },
          { id: 'assess', label: '📊 בדיקה אחרונה', action: '__assess__' },
          { id: 'back', label: '← חזור', action: '__back_checklist__' },
        ], 'prep');
      }, 1000);
      return;
    }

    if (action === '__back_checklist__') {
      if (selectedGroups.length > 0) {
        setJourneyStep('checklist');
        respond(() => {
          push('agent', `חזרנו לצ'קליסט שלך. מה תרצה לעשות?`, [
            { id: 'find', label: '🔍 השגת מסמכים', action: '__find_docs__' },
            { id: 'form', label: '📝 מילוי טופס', action: '__start_form__' },
            { id: 'upload', label: '📤 העלאת מסמכים', action: '__upload__' },
            { id: 'assess', label: '📊 הערכת סיכויים', action: '__assess__' },
            { id: 'prep', label: '🎯 הכנה לוועדה', action: '__prepare__' },
          ], 'checklist', { groups: selectedGroups, documents: selectedGroups[0].documents });
        }, 400);
      }
      return;
    }

    if (action === '__open_clalit__') { window.open('https://www.clalit.co.il/he/online', '_blank'); toast.success('נפתח כללית אונליין'); return; }
    if (action === '__open_maccabi__') { window.open('https://online.maccabi4u.co.il', '_blank'); toast.success('נפתח מכבי אונליין'); return; }
    if (action === '__done__') {
      push('user', 'תודה, הכל ברור!');
      respond(() => {
        push('agent', `🌟 **בהצלחה בוועדה!**\n\nאני כאן תמיד אם תצטרך עוד עזרה.\n\nזכור:\n• הגע 15 דק' לפני\n• קח מלווה + ת.ז. + מסמכים\n• דבר על יום-יום\n\n💪 אתה מוכן!`, [
          { id: 'restart', label: '↺ תביעה חדשה', action: '__restart__' },
        ]);
      }, 800);
      return;
    }
    if (action === '__restart__') { handleReset(); return; }

    // Default: send as message
    handleSend(action);
  };

  // ─── Form Filling ──────────────────────────────────────────────────────

  const FORM_STEPS = [
    { field: 'fullName', q: 'מה **השם המלא** שלך?' },
    { field: 'idNumber', q: '**מספר תעודת זהות?** (9 ספרות)' },
    { field: 'birthDate', q: '**תאריך לידה?**' },
    { field: 'maritalStatus', q: '**מצב משפחתי?** (רווק/נשוי/גרוש/אלמן)' },
    { field: 'address', q: '**כתובת מגורים?** (רחוב, מספר, עיר)' },
    { field: 'phone', q: '**טלפון נייד?**' },
    { field: 'committeeType', q: '**סוג ועדה?**\n• נכות כללית\n• ילד נכה\n• נפגעי פעולות איבה' },
    { field: 'diagnosis', q: '**האבחנה הרפואית העיקרית?**\n💡 _תאר בשפה חופשית_' },
    { field: 'complaints', q: '**תלונות עיקריות** — מה כואב/מפריע?\n💡 _הוועדה שמה דגש על תפקוד יומיומי_' },
    { field: 'limitations', q: '**מגבלות ביום-יום** — איך זה משפיע?\n💡 _"לא יכול להרים", "לא ישן", "לא עובד"_' },
    { field: 'medications', q: '**תרופות** — שם + מינון?\n💡 _אפשר גם לצלם את השקית_' },
    { field: 'employment', q: '**מצב תעסוקה?** (עובד / לא עובד / חלקית)' },
  ];

  const handleFormInput = (text: string) => {
    const step = FORM_STEPS[formStep];
    const updated = { ...formData, [step.field]: text };
    setFormData(updated);
    const next = formStep + 1;
    setFormStep(next);

    if (next >= FORM_STEPS.length) {
      // Form complete
      setJourneyStep('assess');
      respond(() => {
        let s = `🎉 **טופס BL/283 מוכן!**\n\n`;
        s += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        s += `👤 ${updated.fullName} | ת.ז. ${updated.idNumber}\n`;
        s += `📅 ${updated.birthDate} | ${updated.maritalStatus}\n`;
        s += `📍 ${updated.address} | 📱 ${updated.phone}\n`;
        s += `🏥 ${updated.committeeType} | 🩺 ${updated.diagnosis}\n`;
        s += `📋 ${updated.complaints}\n`;
        s += `🚶 ${updated.limitations}\n`;
        s += `💊 ${updated.medications} | 💼 ${updated.employment}\n`;
        s += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        s += `✅ ניתן להעתיק ולהגיש!`;
        push('agent', s, [
          { id: 'copy', label: '📋 העתק טופס', action: '__copy_form__' },
          { id: 'assess', label: '📊 הערכת סיכויים', action: '__assess__' },
          { id: 'prep', label: '🎯 הכנה לוועדה', action: '__prepare__' },
        ]);
      });
    } else {
      const pct = Math.round((next / FORM_STEPS.length) * 100);
      respond(() => {
        push('agent', `✓ **${text}**\n\n━━━ ${pct}% ━━━\n\n${FORM_STEPS[next].q}`);
      }, 500);
    }
  };

  // ─── Assessment ────────────────────────────────────────────────────────

  const computeAssessment = (): Assessment => {
    if (selectedGroups.length === 0) return { score: 30, level: 'low', factors: ['לא זוהתה לקות — ציון בסיסי'], recommendations: ['ספר לי על הלקות שלך כדי שאוכל להעריך'] };
    const docs = selectedGroups.flatMap(g => g.documents);
    const total = docs.length;
    const checked = docs.filter(d => checkedDocs[d.id]).length;
    const required = docs.filter(d => d.priority === 'required');
    const reqChecked = required.filter(d => checkedDocs[d.id]).length;

    const pct = total > 0 ? (checked / total) * 100 : 0;
    const reqPct = required.length > 0 ? (reqChecked / required.length) * 100 : 0;
    const hasForm = Object.keys(formData).length >= 5;

    let score = Math.round(pct * 0.4 + reqPct * 0.4 + (hasForm ? 20 : 0));
    score = Math.min(score, 100);
    const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

    const factors: string[] = [];
    if (reqPct === 100) factors.push('✅ כל מסמכי החובה מוכנים');
    else factors.push(`⚠️ חסרים ${required.length - reqChecked} מסמכי חובה מתוך ${required.length}`);
    if (hasForm) factors.push('✅ טופס תביעה מולא');
    else factors.push('⚠️ טופס תביעה טרם מולא');
    if (pct >= 80) factors.push('✅ שלמות תיק גבוהה');

    const recommendations: string[] = [];
    const missing = required.filter(d => !checkedDocs[d.id]);
    if (missing.length > 0) recommendations.push(`השג: ${missing.slice(0, 3).map(d => d.name).join(', ')}`);
    if (!hasForm) recommendations.push('מלא את טופס התביעה');
    recommendations.push('הגע עם מלווה ורשימת תרופות');

    return { score, level, factors, recommendations };
  };

  // ─── Copy Form ─────────────────────────────────────────────────────────

  if (messages.find(m => m.actions?.find(a => a.action === '__copy_form__'))) {
    // handled in handleAction
  }

  const handleCopyForm = () => {
    const lines = [
      '═══════════════════════════════════════',
      'טופס BL/283 — תביעה לקביעת דרגת נכות',
      'המוסד לביטוח לאומי',
      '═══════════════════════════════════════',
      '', `שם: ${formData.fullName || ''}`, `ת.ז.: ${formData.idNumber || ''}`,
      `תאריך לידה: ${formData.birthDate || ''}`, `מצב משפחתי: ${formData.maritalStatus || ''}`,
      `כתובת: ${formData.address || ''}`, `טלפון: ${formData.phone || ''}`,
      '', `סוג ועדה: ${formData.committeeType || ''}`, `אבחנה: ${formData.diagnosis || ''}`,
      `תלונות: ${formData.complaints || ''}`, `מגבלות: ${formData.limitations || ''}`,
      `תרופות: ${formData.medications || ''}`, `תעסוקה: ${formData.employment || ''}`,
      '', `תאריך: ${new Date().toLocaleDateString('he-IL')}`, 'חתימה: _______________',
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    toast.success('הטופס הועתק — הדבק ב-Word והדפס');
  };

  // ─── Doc Toggle ────────────────────────────────────────────────────────

  const handleDocToggle = (docId: string) => { setCheckedDocs(prev => ({ ...prev, [docId]: !prev[docId] })); };

  // ─── Submit / Reset ────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSend(); };
  const handleReset = () => {
    setMessages([]); setJourneyStep('welcome'); setSelectedGroups([]); setCheckedDocs({}); setFormData({}); setFormStep(0);
    setTimeout(() => {
      push('agent', `שלום שוב! 👋 ספר לי — מה הלקות שלך?`, [
        { id: '1', label: '🦴 גב', action: 'כאבי גב' },
        { id: '2', label: '💉 סוכרת', action: 'סוכרת' },
        { id: '3', label: '❤️ לב', action: 'מחלת לב' },
        { id: '4', label: '🧠 נפשי', action: 'דיכאון' },
      ]);
      setJourneyStep('identify');
    }, 200);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl mb-6 p-6 md:p-8 text-white"
        style={{ background: 'linear-gradient(135deg, hsl(213 73% 20%) 0%, hsl(207 95% 35%) 50%, hsl(37 78% 52%) 100%)' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/30">
              <Bot className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">תביעה ביום</h2>
              <p className="text-white/80 text-sm">הגשת תביעה לוועדה רפואית — מקצה לקצה, בליווי סוכן AI</p>
            </div>
          </div>

          {/* Journey Progress — visual, not text */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold">המסע שלך</span>
              <span className="text-[10px] text-white/60">
                {journeyStep === 'identify' ? 'שלב 1' : journeyStep === 'checklist' ? 'שלב 2' : journeyStep === 'find-docs' ? 'שלב 3' : journeyStep === 'upload' ? 'שלב 4' : journeyStep === 'fill-form' ? 'שלב 5' : journeyStep === 'assess' ? 'שלב 6' : 'שלב 7'} מתוך 7
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[
                { label: 'זיהוי', step: 'identify' as JourneyStep },
                { label: 'צ\'קליסט', step: 'checklist' as JourneyStep },
                { label: 'השגה', step: 'find-docs' as JourneyStep },
                { label: 'העלאה', step: 'upload' as JourneyStep },
                { label: 'טופס', step: 'fill-form' as JourneyStep },
                { label: 'הערכה', step: 'assess' as JourneyStep },
                { label: 'הכנה', step: 'prepare' as JourneyStep },
              ].map((s, i) => {
                const steps: JourneyStep[] = ['welcome', 'identify', 'checklist', 'find-docs', 'upload', 'fill-form', 'assess', 'prepare'];
                const currentIdx = steps.indexOf(journeyStep);
                const thisIdx = steps.indexOf(s.step);
                const isActive = s.step === journeyStep;
                const isDone = thisIdx < currentIdx;
                return (
                  <div key={i} className={`text-center rounded-lg py-1.5 px-1 text-[9px] font-medium transition-all ${isActive ? 'bg-white/30 scale-105' : isDone ? 'bg-white/15' : 'bg-white/5'}`}>
                    <div className="mb-0.5">{isDone ? '✓' : i + 1}</div>
                    {s.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live stats — only shows after diagnosis selected */}
          {selectedGroups.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-lg font-bold">{selectedGroups[0].documents.filter(d => d.priority === 'required').length}</div>
                <div className="text-[9px] text-white/70">מסמכי חובה</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-lg font-bold">{selectedGroups[0].documents.filter(d => checkedDocs[d.id]).length}/{selectedGroups[0].documents.length}</div>
                <div className="text-[9px] text-white/70">מוכנים</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-lg font-bold">{selectedGroups[0].documents.filter(d => d.aiRating && d.aiRating >= 4).length}</div>
                <div className="text-[9px] text-white/70">🟢 מסלול ירוק</div>
              </div>
            </div>
          )}
        </div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Chat */}
      <Card className="border-2 border-secondary/20 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-l from-primary/5 to-secondary/5 border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-semibold">{AGENT}</span>
            <Badge variant="outline" className="text-[10px]"><Sparkles className="h-3 w-3 ml-1" />AI</Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(messages.map(m => `[${m.role === 'user' ? 'אני' : AGENT}] ${m.content}`).join('\n\n')); toast.success('הועתק'); }} className="h-8 w-8 p-0"><Download className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 w-8 p-0"><RotateCcw className="h-4 w-4" /></Button>
          </div>
        </div>

        <div ref={scrollRef} className="h-[500px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-card">
          {messages.map(msg => (
            <div key={msg.id}>
              {msg.role === 'user' ? (
                <div className="flex justify-start"><div className="flex items-end gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0"><User className="h-4 w-4 text-accent" /></div>
                  <div className="bg-accent/10 border border-accent/20 rounded-2xl rounded-br-sm px-4 py-3"><p className="text-sm whitespace-pre-wrap">{msg.content}</p></div>
                </div></div>
              ) : (
                <div className="flex justify-end"><div className="flex items-end gap-2 max-w-[88%] flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0"><Bot className="h-4 w-4 text-secondary" /></div>
                  <div className="space-y-2">
                    <div className="bg-card border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="text-sm whitespace-pre-wrap leading-relaxed"><RichText text={msg.content} /></div>
                    </div>
                    {/* Checklist Widget */}
                    {msg.widget === 'checklist' && msg.widgetData && (
                      <ChecklistWidget data={msg.widgetData} checked={checkedDocs} onToggle={handleDocToggle} />
                    )}
                    {/* Assessment Widget */}
                    {msg.widget === 'assessment' && msg.widgetData && (
                      <AssessmentWidget data={msg.widgetData} />
                    )}
                    {/* Actions */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.actions.map(a => (
                          <button key={a.id} onClick={() => a.action === '__copy_form__' ? handleCopyForm() : handleAction(a.action)}
                            className="px-3 py-2 text-xs font-medium rounded-xl border border-secondary/30 bg-secondary/5 text-secondary hover:bg-secondary/15 transition-all min-h-[36px]">
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div></div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center"><Bot className="h-4 w-4 text-secondary" /></div>
              <div className="bg-card border rounded-2xl px-4 py-3"><div className="flex gap-1.5">
                <span className="w-2 h-2 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div></div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t bg-card p-4">
          {/* Dynamic Quick Replies */}
          {!typing && QUICK_REPLIES[journeyStep]?.length > 0 && journeyStep !== 'fill-form' && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-2 -mx-1 px-1">
              {QUICK_REPLIES[journeyStep].map(qr => (
                <button key={qr.id} onClick={() => qr.action.startsWith('__') ? handleAction(qr.action) : handleSend(qr.action)}
                  className="shrink-0 px-3 py-2 text-xs font-medium rounded-full border border-secondary/20 bg-secondary/5 text-secondary hover:bg-secondary/10 transition-colors whitespace-nowrap">
                  {qr.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              placeholder={journeyStep === 'fill-form' ? 'הקלד תשובה...' : journeyStep === 'identify' ? 'תאר את הבעיה הרפואית...' : 'שאל או כתוב משהו...'}
              className="flex-1 min-h-[48px] text-right text-base" dir="rtl" />
            <Button type="submit" disabled={!input.trim() || typing} className="min-h-[48px] min-w-[48px] bg-secondary hover:bg-secondary/90 text-white">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">מופעל ע״י Amazon Bedrock | ביטוח לאומי | 3,934 רשומות · 140 אבחנות · 286 מסלול ירוק</p>
        </form>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return <>{parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('_') && p.endsWith('_')) return <em key={i} className="text-muted-foreground">{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  })}</>;
}

function ChecklistWidget({ data, checked, onToggle }: { data: { documents: DocumentItem[] }; checked: Record<string, boolean>; onToggle: (id: string) => void }) {
  const docs = data.documents;
  const done = docs.filter(d => checked[d.id]).length;
  const pct = docs.length > 0 ? Math.round((done / docs.length) * 100) : 0;
  const required = docs.filter(d => d.priority === 'required');
  const recommended = docs.filter(d => d.priority === 'recommended');
  const optional = docs.filter(d => d.priority === 'optional');
  const reqDone = required.filter(d => checked[d.id]).length;
  const greenDocs = docs.filter(d => d.aiRating && d.aiRating >= 4);

  return (
    <Card className="border-secondary/20">
      <CardContent className="p-3 space-y-3">
        {/* Progress header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">{done}/{docs.length} מסמכים</span>
            {greenDocs.length > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">🟢 {greenDocs.length} מסלול ירוק</span>
            )}
          </div>
          <Badge className={`text-[10px] ${pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-destructive'} text-white`}>{pct}%</Badge>
        </div>
        <Progress value={pct} className={`h-2.5 rounded-full ${pct >= 80 ? '[&>div]:bg-success' : pct >= 50 ? '[&>div]:bg-warning' : '[&>div]:bg-destructive'}`} />

        {/* Required status */}
        {required.length > 0 && reqDone < required.length && (
          <div className="text-[10px] bg-destructive/5 border border-destructive/20 rounded-lg px-2 py-1.5 text-destructive font-medium">
            ⚠️ חסרים {required.length - reqDone} מסמכי חובה — בלעדיהם התיק לא יטופל
          </div>
        )}
        {required.length > 0 && reqDone === required.length && (
          <div className="text-[10px] bg-success/5 border border-success/20 rounded-lg px-2 py-1.5 text-success font-medium">
            ✅ כל מסמכי החובה מוכנים!
          </div>
        )}

        {/* Document list */}
        <div className="space-y-1 max-h-[220px] overflow-y-auto">
          {required.length > 0 && <><div className="text-[10px] font-bold text-destructive">🔴 חובה — בלי זה לא יטפלו</div>{required.map(d => <DocRow key={d.id} doc={d} checked={!!checked[d.id]} onToggle={onToggle} />)}</>}
          {recommended.length > 0 && <><div className="text-[10px] font-bold text-warning mt-2">🟡 מומלץ — מחזק משמעותית</div>{recommended.map(d => <DocRow key={d.id} doc={d} checked={!!checked[d.id]} onToggle={onToggle} />)}</>}
          {optional.length > 0 && <><div className="text-[10px] font-bold text-secondary mt-2">🔵 רשות — משפר</div>{optional.map(d => <DocRow key={d.id} doc={d} checked={!!checked[d.id]} onToggle={onToggle} />)}</>}
        </div>
      </CardContent>
    </Card>
  );
}

function DocRow({ doc, checked, onToggle }: { doc: DocumentItem; checked: boolean; onToggle: (id: string) => void }) {
  return (
    <button onClick={() => onToggle(doc.id)} className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-right text-xs transition-all ${checked ? 'bg-success/10' : 'hover:bg-muted/10'}`}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${checked ? 'bg-success border-success' : 'border-muted/40'}`}>
        {checked && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
      </div>
      <span className={`flex-1 ${checked ? 'line-through text-muted-foreground' : ''}`}>{doc.name}</span>
      {doc.aiRating && doc.aiRating >= 4 && <Badge className="text-[8px] bg-accent/20 text-accent-foreground px-1.5">🟢 ירוק</Badge>}
    </button>
  );
}

function AssessmentWidget({ data }: { data: Assessment }) {
  const color = data.level === 'high' ? 'success' : data.level === 'medium' ? 'warning' : 'destructive';
  return (
    <Card className={`border-${color}/30`}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full bg-${color}/10 flex items-center justify-center`}>
            <span className={`text-xl font-extrabold text-${color}`}>{data.score}</span>
          </div>
          <div>
            <div className="text-sm font-bold">ציון מוכנות</div>
            <Badge className={`text-[10px] bg-${color} text-white`}>
              {data.level === 'high' ? '🟢 מוכן' : data.level === 'medium' ? '🟡 חלקי' : '🔴 דרוש שיפור'}
            </Badge>
          </div>
        </div>
        <Progress value={data.score} className={`h-3 rounded-full [&>div]:bg-${color}`} />
      </CardContent>
    </Card>
  );
}

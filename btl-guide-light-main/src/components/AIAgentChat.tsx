import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot, Send, User, Sparkles, FileCheck, ClipboardList,
  MapPin, Lightbulb, CheckCircle2, AlertCircle, ArrowLeft,
  RotateCcw, Download, Share2, Mic, MicOff, X, Minimize2, Maximize2,
} from 'lucide-react';
import { diagnosisGroups, type DiagnosisGroup, type DocumentItem } from '@/data/diagnoses';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  actions?: AgentAction[];
  checklist?: ChecklistResult;
  formData?: Partial<ClaimFormData>;
  assessment?: AssessmentResult;
  suggestions?: string[];
}

interface AgentAction {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
}

interface ChecklistResult {
  diagnosis: string;
  domain: string;
  documents: DocumentItem[];
  completeness: number;
}

interface ClaimFormData {
  fullName: string;
  idNumber: string;
  birthDate: string;
  address: string;
  phone: string;
  email: string;
  committeeType: string;
  diagnosis: string;
  mainComplaints: string;
  dailyLimitations: string;
  medications: string;
  treatments: string;
  employmentStatus: string;
}

interface AssessmentResult {
  score: number;
  level: 'high' | 'medium' | 'low';
  factors: string[];
  recommendations: string[];
}

type ConversationPhase = 'greeting' | 'understanding' | 'checklist' | 'form-filling' | 'assessment' | 'summary';

// ─── AI Agent Logic ──────────────────────────────────────────────────────────

const AGENT_NAME = 'נועם';

const GREETING_MESSAGES = [
  `שלום! אני ${AGENT_NAME}, הסוכן החכם שלך לוועדות רפואיות 🤖\n\nאני כאן כדי ללוות אותך מהרגע שקיבלת זימון ועד שתגיע מוכן לוועדה.\n\nאיך אני יכול לעזור?`,
];

const QUICK_ACTIONS = [
  { label: '📋 מה להביא לוועדה?', value: 'מה אני צריך להביא לוועדה?' },
  { label: '📝 עזרה במילוי טופס', value: 'אני צריך עזרה במילוי טופס התביעה' },
  { label: '⚖️ מה הזכויות שלי?', value: 'מה הזכויות שלי בוועדה?' },
  { label: '📊 הערכת סיכויים', value: 'מה הסיכויים שלי?' },
  { label: '🏥 סוגי ועדות', value: 'מה ההבדל בין סוגי הוועדות?' },
  { label: '❓ שאלות נפוצות', value: 'יש לי שאלות על הוועדה' },
];

function findDiagnosisMatch(text: string): DiagnosisGroup[] {
  const normalized = text.toLowerCase().trim();
  const hebrewKeywords: Record<string, string[]> = {
    'גב': ['כאבי גב', 'פגיעת גב תעסוקתית', 'פריצת דיסק תעסוקתית'],
    'סוכרת': ['סוכרת'],
    'לב': ['מחלת לב איסכמית', 'אי-ספיקת לב', 'הפרעות קצב'],
    'ברך': ['ניוון מפרקים', 'פגיעת ברך תעסוקתית'],
    'כתף': ['פגיעת כתף', 'פגיעת כתף תעסוקתית'],
    'דיכאון': ['דיכאון', 'בריאות הנפש כללי'],
    'חרדה': ['חרדה', 'בריאות הנפש כללי'],
    'נפשי': ['בריאות הנפש כללי', 'דיכאון', 'חרדה', 'PTSD'],
    'ptsd': ['PTSD'],
    'אפילפסיה': ['אפילפסיה'],
    'שמיעה': ['ליקוי שמיעה תעסוקתי'],
    'עיניים': ['פגיעת עין תעסוקתית'],
    'ריאות': ['אסתמה תעסוקתית', 'COPD'],
    'אסתמה': ['אסתמה תעסוקתית'],
    'כליות': ['מחלת כליות'],
    'כבד': ['מחלת כבד'],
    'לחץ דם': ['יתר לחץ דם'],
    'שבר': ['שברים', 'שבר תעסוקתי'],
    'ניתוח': ['החלפת מפרק'],
    'עבודה': ['פגיעת גב תעסוקתית', 'תסמונת התעלה הקרפלית', 'ליקוי שמיעה תעסוקתי'],
    'קרפל': ['תסמונת התעלה הקרפלית'],
    'אורתופד': ['אורתופדיה כללי', 'כאבי גב', 'ניוון מפרקים'],
    'סרטן': ['סרטן תעסוקתי'],
    'כוויה': ['כוויות תעסוקתיות'],
    'עור': ['מחלת עור תעסוקתית'],
    'ראש': ['פגיעת ראש תעסוקתית'],
    'נוירולוגי': ['נוירולוגיה כללי', 'אפילפסיה'],
  };

  const matches: DiagnosisGroup[] = [];
  
  for (const [keyword, diagNames] of Object.entries(hebrewKeywords)) {
    if (normalized.includes(keyword)) {
      for (const name of diagNames) {
        const found = diagnosisGroups.find(g => g.name === name);
        if (found && !matches.find(m => m.id === found.id)) {
          matches.push(found);
        }
      }
    }
  }

  // Direct name match
  if (matches.length === 0) {
    const directMatch = diagnosisGroups.filter(g => 
      normalized.includes(g.name.toLowerCase()) || g.name.includes(normalized)
    );
    matches.push(...directMatch);
  }

  return matches;
}

function generateChecklistResponse(groups: DiagnosisGroup[]): string {
  if (groups.length === 0) return '';
  
  const group = groups[0];
  const required = group.documents.filter(d => d.priority === 'required');
  const recommended = group.documents.filter(d => d.priority === 'recommended');
  
  let response = `מצאתי! עבור **${group.name}** (${group.domain}), הנה מה שצריך:\n\n`;
  response += `🔴 **מסמכי חובה (${required.length}):**\n`;
  required.forEach((d, i) => {
    response += `${i + 1}. ${d.name}`;
    if (d.whereToGet) response += ` — _${d.whereToGet}_`;
    response += '\n';
  });
  
  if (recommended.length > 0) {
    response += `\n🟡 **מומלצים (${recommended.length}):**\n`;
    recommended.forEach((d, i) => {
      response += `${i + 1}. ${d.name}\n`;
    });
  }

  const tips = group.documents.filter(d => d.tip).slice(0, 3);
  if (tips.length > 0) {
    response += '\n💡 **טיפים חשובים:**\n';
    tips.forEach(d => {
      response += `• ${d.tip}\n`;
    });
  }

  return response;
}

function generateRightsResponse(): string {
  return `⚖️ **הזכויות שלך בוועדה הרפואית:**\n
• **ליווי** — זכותך להגיע עם מלווה (בן משפחה, עו"ד, נציג ארגון)
• **תרגום** — אם אינך דובר עברית, זכותך לתרגום
• **פרוטוקול** — זכותך לקבל העתק מפרוטוקול הוועדה
• **ערעור** — זכותך לערער על ההחלטה תוך 60 יום
• **מסמכים** — זכותך להציג מסמכים רפואיים נוספים
• **נגישות** — זכותך לתנאי נגישות מלאים
• **דחייה** — זכותך לדחות את המועד בנסיבות מיוחדות

🔑 **טיפ חשוב:** הגע 15 דקות לפני, תאר את מצבך בכנות, ואל תחתום על מסמך שאינך מבין.

רוצה שאעזור לך להתכונן עם צ'קליסט מסמכים מותאם?`;
}

function generateCommitteeTypesResponse(): string {
  return `🏥 **סוגי ועדות רפואיות:**\n
**1. ועדה לנכות כללית** 🏥
קובעת אחוזי נכות למחלה/פגיעה שאינה קשורה לעבודה.

**2. ועדה לנפגעי עבודה** ⚒️
נכות מתאונת עבודה או מחלת מקצוע. דורשת תיעוד קשר לעבודה.

**3. ועדה לניידות** 🚗
זכאות לקצבת ניידות — ליקוי ברגליים המגביל הליכה.

**4. ועדה לסיעוד** 👴
רמת תלות בעזרת הזולת (רחצה, הלבשה, אכילה, ניידות).

**5. ועדת ערר** ⚖️
ערעור על החלטת ועדה קודמת (תוך 60 יום).

לאיזו ועדה אתה מוזמן? אעזור לך להתכונן בהתאם.`;
}

function generateAssessment(groups: DiagnosisGroup[], checkedDocs: Record<string, boolean>): AssessmentResult {
  if (groups.length === 0) {
    return { score: 0, level: 'low', factors: [], recommendations: [] };
  }

  const group = groups[0];
  const total = group.documents.length;
  const checked = group.documents.filter(d => checkedDocs[d.id]).length;
  const requiredDocs = group.documents.filter(d => d.priority === 'required');
  const requiredChecked = requiredDocs.filter(d => checkedDocs[d.id]).length;
  const aiRatedDocs = group.documents.filter(d => d.aiRating && d.aiRating >= 4);
  const aiChecked = aiRatedDocs.filter(d => checkedDocs[d.id]).length;

  let score = 0;
  const factors: string[] = [];
  const recommendations: string[] = [];

  // Base score from completeness
  const completeness = total > 0 ? (checked / total) * 100 : 0;
  score += completeness * 0.5;

  // Required docs weight
  const requiredCompleteness = requiredDocs.length > 0 ? (requiredChecked / requiredDocs.length) * 100 : 0;
  score += requiredCompleteness * 0.3;

  // AI-rated docs bonus
  const aiCompleteness = aiRatedDocs.length > 0 ? (aiChecked / aiRatedDocs.length) * 100 : 0;
  score += aiCompleteness * 0.2;

  score = Math.min(Math.round(score), 100);

  if (requiredCompleteness === 100) factors.push('כל מסמכי החובה מוכנים ✅');
  else if (requiredCompleteness >= 50) factors.push(`${requiredChecked}/${requiredDocs.length} מסמכי חובה מוכנים`);
  else factors.push(`חסרים ${requiredDocs.length - requiredChecked} מסמכי חובה ⚠️`);

  if (aiCompleteness >= 80) factors.push('מסמכים אובייקטיביים (מסלול ירוק) מוכנים');
  if (completeness >= 80) factors.push('שלמות תיק גבוהה');

  const missingRequired = requiredDocs.filter(d => !checkedDocs[d.id]);
  if (missingRequired.length > 0) {
    recommendations.push(`השג בדחיפות: ${missingRequired.slice(0, 3).map(d => d.name).join(', ')}`);
  }
  if (aiCompleteness < 50) {
    recommendations.push('הוסף בדיקות אובייקטיביות (דם, הדמיה) — מחזקות את התיק');
  }
  recommendations.push('הגע עם מלווה שמכיר את מצבך');
  recommendations.push('הכן רשימת תרופות עדכנית עם מינונים');

  const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

  return { score, level, factors, recommendations };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AIAgentChatProps {
  isOpen: boolean;
  onClose: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export default function AIAgentChat({ isOpen, onClose, isFullScreen = false, onToggleFullScreen }: AIAgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<ConversationPhase>('greeting');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<DiagnosisGroup[]>([]);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Partial<ClaimFormData>>({});
  const [formStep, setFormStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addAgentMessage(GREETING_MESSAGES[0], QUICK_ACTIONS.map(a => ({
          id: a.value,
          label: a.label,
          onClick: () => handleUserInput(a.value),
        })));
      }, 500);
    }
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addAgentMessage = useCallback((content: string, actions?: AgentAction[], extra?: Partial<Message>) => {
    const msg: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role: 'agent',
      content,
      timestamp: new Date(),
      actions,
      ...extra,
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    const msg: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  const simulateTyping = useCallback(async (callback: () => void, delay = 1200) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
    callback();
  }, []);

  const handleUserInput = useCallback((text: string) => {
    if (!text.trim()) return;
    addUserMessage(text);
    setInput('');
    processInput(text);
  }, [selectedDiagnoses, phase, formStep, formData, checkedDocs]);

  const processInput = (text: string) => {
    const lower = text.toLowerCase();

    // Check for diagnosis-related queries
    const diagMatches = findDiagnosisMatch(text);
    
    if (lower.includes('זכויות') || lower.includes('זכות')) {
      simulateTyping(() => {
        addAgentMessage(generateRightsResponse());
        setPhase('understanding');
      });
      return;
    }

    if (lower.includes('סוגי ועדות') || lower.includes('הבדל') || lower.includes('סוג ועדה')) {
      simulateTyping(() => {
        addAgentMessage(generateCommitteeTypesResponse());
        setPhase('understanding');
      });
      return;
    }

    if (lower.includes('טופס') || lower.includes('מילוי')) {
      simulateTyping(() => {
        setPhase('form-filling');
        setFormStep(0);
        addAgentMessage(
          `📝 מעולה! אעזור לך למלא את טופס התביעה שלב אחר שלב.\n\nנתחיל — מה השם המלא שלך?`,
          undefined,
          { formData: {} }
        );
      });
      return;
    }

    if (lower.includes('סיכויים') || lower.includes('הערכה') || lower.includes('סיכוי')) {
      if (selectedDiagnoses.length > 0) {
        simulateTyping(() => {
          const assessment = generateAssessment(selectedDiagnoses, checkedDocs);
          const levelText = assessment.level === 'high' ? '🟢 גבוהה' : assessment.level === 'medium' ? '🟡 בינונית' : '🔴 נמוכה';
          let response = `📊 **הערכת מוכנות לוועדה:**\n\nציון כללי: **${assessment.score}/100** — מוכנות ${levelText}\n\n`;
          response += '**גורמים:**\n';
          assessment.factors.forEach(f => { response += `• ${f}\n`; });
          response += '\n**המלצות:**\n';
          assessment.recommendations.forEach(r => { response += `• ${r}\n`; });
          addAgentMessage(response, undefined, { assessment });
          setPhase('assessment');
        });
      } else {
        simulateTyping(() => {
          addAgentMessage('כדי שאוכל להעריך את הסיכויים שלך, ספר לי קודם — מה האבחנה או הבעיה הרפואית שלך?');
        });
      }
      return;
    }

    if (lower.includes('שאלות') || lower.includes('שאלה') || lower.includes('faq')) {
      simulateTyping(() => {
        addAgentMessage(
          `❓ **שאלות נפוצות:**\n
**כמה זמן נמשכת ועדה?**
15-30 דקות, תלוי במורכבות.

**מתי אקבל תשובה?**
תוך 14 ימי עבודה בדואר.

**אפשר לדחות?**
כן, בנסיבות מוצדקות. פנה לסניף בהקדם.

**חייבים להגיע פיזית?**
בדרך כלל כן. במקרים מיוחדים — ועדה על סמך מסמכים.

**מה אם לא מגיעים?**
אי-הגעה ללא הודעה עלולה לגרום לדחיית התביעה.

יש שאלה נוספת? אני כאן.`,
          [
            { id: 'checklist', label: '📋 הכן לי צ\'קליסט', onClick: () => handleUserInput('מה אני צריך להביא?') },
            { id: 'form', label: '📝 עזרה בטופס', onClick: () => handleUserInput('עזרה במילוי טופס') },
          ]
        );
      });
      return;
    }

    // Form filling flow
    if (phase === 'form-filling') {
      handleFormInput(text);
      return;
    }

    // Diagnosis found
    if (diagMatches.length > 0) {
      setSelectedDiagnoses(diagMatches);
      simulateTyping(() => {
        const response = generateChecklistResponse(diagMatches);
        const allDocs = diagMatches.flatMap(g => g.documents);
        addAgentMessage(response, [
          { id: 'show-full', label: '📋 צ\'קליסט אינטראקטיבי', onClick: () => showInteractiveChecklist(diagMatches) },
          { id: 'form-help', label: '📝 עזרה בטופס', onClick: () => handleUserInput('עזרה במילוי טופס') },
          { id: 'assess', label: '📊 הערכת מוכנות', onClick: () => handleUserInput('מה הסיכויים שלי?') },
        ], {
          checklist: {
            diagnosis: diagMatches[0].name,
            domain: diagMatches[0].domain,
            documents: allDocs,
            completeness: 0,
          }
        });
        setPhase('checklist');
      }, 1500);
      return;
    }

    // General query — try to understand
    if (lower.includes('מה') && (lower.includes('להביא') || lower.includes('צריך'))) {
      simulateTyping(() => {
        addAgentMessage(
          'בשמחה! כדי שאוכל להכין לך צ\'קליסט מדויק, ספר לי:\n\n1. מה הבעיה הרפואית / האבחנה שלך?\n2. האם זו תביעה חדשה או ועדת ערר?\n\nלדוגמה: "יש לי סוכרת ובעיות גב"',
          [
            { id: 'back', label: 'כאבי גב', onClick: () => handleUserInput('כאבי גב') },
            { id: 'diabetes', label: 'סוכרת', onClick: () => handleUserInput('סוכרת') },
            { id: 'heart', label: 'לב', onClick: () => handleUserInput('בעיות לב') },
            { id: 'mental', label: 'בריאות הנפש', onClick: () => handleUserInput('בעיות נפשיות') },
            { id: 'work', label: 'פגיעה בעבודה', onClick: () => handleUserInput('נפגעתי בעבודה') },
          ]
        );
      });
      return;
    }

    // Default response
    simulateTyping(() => {
      addAgentMessage(
        `הבנתי. אני יכול לעזור לך עם:\n\n• **צ'קליסט מסמכים** — ספר לי את האבחנה ואכין רשימה מותאמת\n• **מילוי טופס** — אנחה אותך שלב אחר שלב\n• **זכויות** — אסביר מה מגיע לך\n• **הערכת מוכנות** — אבדוק כמה מוכן התיק שלך\n\nמה תרצה?`,
        QUICK_ACTIONS.map(a => ({
          id: a.value,
          label: a.label,
          onClick: () => handleUserInput(a.value),
        }))
      );
    });
  };

  const showInteractiveChecklist = (groups: DiagnosisGroup[]) => {
    const allDocs = groups.flatMap(g => g.documents);
    const required = allDocs.filter(d => d.priority === 'required');
    
    addAgentMessage(
      `✅ **צ'קליסט אינטראקטיבי — ${groups[0].name}**\n\nסמן את המסמכים שכבר יש לך. אעדכן את הערכת המוכנות בזמן אמת.`,
      undefined,
      {
        checklist: {
          diagnosis: groups[0].name,
          domain: groups[0].domain,
          documents: allDocs,
          completeness: 0,
        }
      }
    );
  };

  const handleFormInput = (text: string) => {
    const newFormData = { ...formData };
    
    const formSteps = [
      { field: 'fullName', next: 'מה מספר תעודת הזהות שלך?', label: 'שם מלא' },
      { field: 'idNumber', next: 'מה תאריך הלידה שלך? (DD/MM/YYYY)', label: 'ת.ז.' },
      { field: 'birthDate', next: 'מה הכתובת שלך?', label: 'תאריך לידה' },
      { field: 'address', next: 'מה מספר הטלפון שלך?', label: 'כתובת' },
      { field: 'phone', next: 'מה האבחנה הרפואית העיקרית שלך?', label: 'טלפון' },
      { field: 'diagnosis', next: 'תאר בקצרה את התלונות העיקריות שלך ואיך הן משפיעות על היום-יום:', label: 'אבחנה' },
      { field: 'mainComplaints', next: 'אילו תרופות אתה לוקח? (שם + מינון)', label: 'תלונות' },
      { field: 'medications', next: 'מה מצב התעסוקה שלך? (עובד/לא עובד/חלקית)', label: 'תרופות' },
      { field: 'employmentStatus', next: '', label: 'תעסוקה' },
    ];

    if (formStep < formSteps.length) {
      const step = formSteps[formStep];
      (newFormData as any)[step.field] = text;
      setFormData(newFormData);
      setFormStep(formStep + 1);

      if (formStep === formSteps.length - 1) {
        // Form complete
        simulateTyping(() => {
          let summary = `🎉 **מעולה! הטופס מוכן:**\n\n`;
          summary += `👤 **${newFormData.fullName}** | ת.ז. ${newFormData.idNumber}\n`;
          summary += `📅 ${newFormData.birthDate} | 📍 ${newFormData.address}\n`;
          summary += `📱 ${newFormData.phone}\n`;
          summary += `🏥 אבחנה: ${newFormData.diagnosis}\n`;
          summary += `💊 תרופות: ${newFormData.medications}\n`;
          summary += `💼 תעסוקה: ${newFormData.employmentStatus}\n\n`;
          summary += `📋 תלונות: ${newFormData.mainComplaints}\n\n`;
          summary += `---\n✅ הטופס מוכן להדפסה ולהגשה!`;
          
          addAgentMessage(summary, [
            { id: 'print', label: '🖨️ הדפס טופס', onClick: () => handlePrintForm(newFormData) },
            { id: 'checklist', label: '📋 המשך לצ\'קליסט', onClick: () => handleUserInput(`מה להביא עבור ${newFormData.diagnosis}`) },
            { id: 'assess', label: '📊 הערכת מוכנות', onClick: () => handleUserInput('הערכת סיכויים') },
          ], { formData: newFormData });
          setPhase('summary');
        });
      } else {
        simulateTyping(() => {
          const nextStep = formSteps[formStep + 1];
          const progressPct = Math.round(((formStep + 1) / formSteps.length) * 100);
          addAgentMessage(
            `✓ ${step.label}: **${text}**\n\n(${progressPct}% הושלם)\n\n${formSteps[formStep].next}`
          );
        }, 800);
      }
    }
  };

  const handlePrintForm = (data: Partial<ClaimFormData>) => {
    const printContent = `
טופס תביעה — ועדה רפואית
========================
שם מלא: ${data.fullName || ''}
ת.ז.: ${data.idNumber || ''}
תאריך לידה: ${data.birthDate || ''}
כתובת: ${data.address || ''}
טלפון: ${data.phone || ''}
אבחנה: ${data.diagnosis || ''}
תלונות עיקריות: ${data.mainComplaints || ''}
תרופות: ${data.medications || ''}
מצב תעסוקה: ${data.employmentStatus || ''}
    `.trim();
    navigator.clipboard.writeText(printContent);
    toast.success('הטופס הועתק ללוח — ניתן להדביק ולהדפיס');
  };

  const handleDocToggle = (docId: string) => {
    setCheckedDocs(prev => {
      const updated = { ...prev, [docId]: !prev[docId] };
      return updated;
    });
  };

  const handleReset = () => {
    setMessages([]);
    setPhase('greeting');
    setSelectedDiagnoses([]);
    setCheckedDocs({});
    setFormData({});
    setFormStep(0);
    setTimeout(() => {
      addAgentMessage(GREETING_MESSAGES[0], QUICK_ACTIONS.map(a => ({
        id: a.value,
        label: a.label,
        onClick: () => handleUserInput(a.value),
      })));
    }, 300);
  };

  const handleExportChat = () => {
    const text = messages.map(m => {
      const role = m.role === 'user' ? 'אני' : AGENT_NAME;
      return `[${role}] ${m.content}`;
    }).join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('השיחה הועתקה ללוח');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserInput(input);
  };

  if (!isOpen) return null;

  const containerClass = isFullScreen
    ? 'fixed inset-0 z-[100] flex flex-col bg-background'
    : 'fixed bottom-24 left-6 z-[100] w-[420px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] flex flex-col rounded-2xl shadow-2xl border-2 border-secondary/30 bg-background overflow-hidden';

  return (
    <div className={containerClass} dir="rtl" role="dialog" aria-label="סוכן AI לוועדות רפואיות">
      {/* Header */}
      <div className="bg-gradient-to-l from-primary to-secondary text-white px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base">{AGENT_NAME} — סוכן AI</h3>
          <p className="text-xs text-white/70">ליווי חכם לוועדות רפואיות</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            aria-label="שיחה חדשה"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportChat}
            className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            aria-label="ייצוא שיחה"
          >
            <Download className="h-4 w-4" />
          </Button>
          {onToggleFullScreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullScreen}
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
              aria-label={isFullScreen ? 'מזער' : 'הגדל'}
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            aria-label="סגור"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onDocToggle={handleDocToggle}
            checkedDocs={checkedDocs}
          />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t bg-card p-3 shrink-0">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={phase === 'form-filling' ? 'הקלד את התשובה...' : 'שאל אותי משהו...'}
            className="flex-1 min-h-[44px] text-right"
            dir="rtl"
            aria-label="הודעה לסוכן"
          />
          <Button
            type="submit"
            disabled={!input.trim()}
            className="min-h-[44px] min-w-[44px] bg-secondary hover:bg-secondary/90"
            aria-label="שלח"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">
            מופעל ע״י Amazon Bedrock | ביטוח לאומי
          </span>
          <Badge variant="outline" className="text-[10px]">
            <Sparkles className="h-3 w-3 ml-1" />
            GenAI
          </Badge>
        </div>
      </form>
    </div>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
  onDocToggle: (docId: string) => void;
  checkedDocs: Record<string, boolean>;
}

function MessageBubble({ message, onDocToggle, checkedDocs }: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-start">
        <div className="flex items-end gap-2 max-w-[85%]">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-accent" />
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-2xl rounded-br-sm px-4 py-2.5">
            <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="flex items-end gap-2 max-w-[90%] flex-row-reverse">
        <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
          <Bot className="h-4 w-4 text-secondary" />
        </div>
        <div className="space-y-2">
          <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              <FormattedText text={message.content} />
            </div>
          </div>

          {/* Interactive Checklist */}
          {message.checklist && (
            <InteractiveChecklist
              checklist={message.checklist}
              checkedDocs={checkedDocs}
              onDocToggle={onDocToggle}
            />
          )}

          {/* Assessment */}
          {message.assessment && (
            <AssessmentCard assessment={message.assessment} />
          )}

          {/* Action buttons */}
          {message.actions && message.actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {message.actions.map(action => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-secondary/30 bg-secondary/5 text-secondary hover:bg-secondary/10 transition-colors min-h-[36px]"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Formatted Text ──────────────────────────────────────────────────────────

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('_') && part.endsWith('_')) {
          return <em key={i} className="text-muted-foreground">{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─── Interactive Checklist ───────────────────────────────────────────────────

function InteractiveChecklist({ checklist, checkedDocs, onDocToggle }: {
  checklist: ChecklistResult;
  checkedDocs: Record<string, boolean>;
  onDocToggle: (docId: string) => void;
}) {
  const checked = checklist.documents.filter(d => checkedDocs[d.id]).length;
  const total = checklist.documents.length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  const required = checklist.documents.filter(d => d.priority === 'required');
  const recommended = checklist.documents.filter(d => d.priority === 'recommended');
  const optional = checklist.documents.filter(d => d.priority === 'optional');

  return (
    <Card className="border-secondary/20 overflow-hidden">
      <CardContent className="p-3 space-y-3">
        {/* Progress */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold">{checked}/{total} מסמכים</span>
          <Badge className={`text-[10px] ${pct >= 80 ? 'bg-success text-success-foreground' : pct >= 50 ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'}`}>
            {pct}%
          </Badge>
        </div>
        <Progress value={pct} className={`h-2 ${pct >= 80 ? '[&>div]:bg-success' : pct >= 50 ? '[&>div]:bg-warning' : '[&>div]:bg-destructive'}`} />

        {/* Documents */}
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {required.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-destructive">🔴 חובה</span>
              {required.map(doc => (
                <DocCheckItem key={doc.id} doc={doc} checked={!!checkedDocs[doc.id]} onToggle={onDocToggle} />
              ))}
            </div>
          )}
          {recommended.length > 0 && (
            <div className="space-y-1 mt-2">
              <span className="text-[10px] font-bold text-warning">🟡 מומלץ</span>
              {recommended.map(doc => (
                <DocCheckItem key={doc.id} doc={doc} checked={!!checkedDocs[doc.id]} onToggle={onDocToggle} />
              ))}
            </div>
          )}
          {optional.length > 0 && (
            <div className="space-y-1 mt-2">
              <span className="text-[10px] font-bold text-secondary">🔵 אופציונלי</span>
              {optional.map(doc => (
                <DocCheckItem key={doc.id} doc={doc} checked={!!checkedDocs[doc.id]} onToggle={onDocToggle} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DocCheckItem({ doc, checked, onToggle }: { doc: DocumentItem; checked: boolean; onToggle: (id: string) => void }) {
  return (
    <button
      onClick={() => onToggle(doc.id)}
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-right text-xs transition-colors ${
        checked ? 'bg-success/10 text-muted-foreground' : 'hover:bg-muted/20'
      }`}
    >
      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
        checked ? 'bg-success border-success' : 'border-border'
      }`}>
        {checked && <CheckCircle2 className="h-3 w-3 text-white" />}
      </div>
      <span className={checked ? 'line-through' : ''}>{doc.name}</span>
      {doc.aiRating && doc.aiRating >= 4 && (
        <Badge className="text-[8px] bg-accent/20 text-accent-foreground mr-auto px-1">AI {doc.aiRating}/5</Badge>
      )}
    </button>
  );
}

// ─── Assessment Card ─────────────────────────────────────────────────────────

function AssessmentCard({ assessment }: { assessment: AssessmentResult }) {
  const color = assessment.level === 'high' ? 'success' : assessment.level === 'medium' ? 'warning' : 'destructive';
  
  return (
    <Card className={`border-${color}/30 overflow-hidden`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-12 h-12 rounded-full bg-${color}/10 flex items-center justify-center`}>
            <span className="text-lg font-bold">{assessment.score}</span>
          </div>
          <div>
            <div className="text-sm font-bold">ציון מוכנות</div>
            <Badge className={`text-[10px] bg-${color} text-${color}-foreground`}>
              {assessment.level === 'high' ? 'מוכנות גבוהה' : assessment.level === 'medium' ? 'מוכנות בינונית' : 'דרוש שיפור'}
            </Badge>
          </div>
        </div>
        <Progress value={assessment.score} className={`h-2 [&>div]:bg-${color}`} />
      </CardContent>
    </Card>
  );
}

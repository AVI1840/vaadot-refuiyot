// ═══════════════════════════════════════════════════════════════════════════════
// DEMO MODE — Automated 90-second guided demo for hackathon judges
// One click → full journey plays automatically
// ═══════════════════════════════════════════════════════════════════════════════

export interface DemoStep {
  screen: string;
  delay: number; // ms before this step
  action?: 'type' | 'click' | 'highlight' | 'transition';
  target?: string;
  value?: string;
  narrative?: string; // what the presenter says
}

export const DEMO_SCRIPT: DemoStep[] = [
  // ─── Opening (0-10s) — Landing ──────────────────────────────────────
  {
    screen: 'landing',
    delay: 0,
    action: 'highlight',
    target: 'hero-score',
    narrative: 'הבעיה: 42% מהתיקים חסרים. הפתרון: סוכן AI שמלווה את האזרח.',
  },
  {
    screen: 'landing',
    delay: 5000,
    action: 'click',
    target: 'cta-start',
    narrative: 'לחיצה אחת — מתחילים.',
  },

  // ─── Condition Detection (10-25s) ───────────────────────────────────
  {
    screen: 'onboarding',
    delay: 3000,
    action: 'type',
    target: 'chat-input',
    value: 'יש לי סוכרת סוג 2 כבר 8 שנים',
    narrative: 'המבוטח מתאר בשפה חופשית.',
  },
  {
    screen: 'onboarding',
    delay: 4000,
    action: 'highlight',
    target: 'agent-response',
    narrative: 'הסוכן מזהה: סוכרת סוג 2. בונה צ\'קליסט מותאם.',
  },

  // ─── Checklist (25-35s) ─────────────────────────────────────────────
  {
    screen: 'checklist',
    delay: 3000,
    action: 'highlight',
    target: 'required-docs',
    narrative: '5 מסמכי חובה, 3 מומלצים. על בסיס ניתוח 778 תיקים דומים.',
  },
  {
    screen: 'checklist',
    delay: 5000,
    action: 'click',
    target: 'doc-hba1c',
    narrative: 'המבוטח מסמן מה יש לו.',
  },

  // ─── OCR Upload (35-50s) ────────────────────────────────────────────
  {
    screen: 'upload',
    delay: 3000,
    action: 'click',
    target: 'upload-demo',
    narrative: 'העלאת מסמך — סריקה אוטומטית.',
  },
  {
    screen: 'upload',
    delay: 4000,
    action: 'highlight',
    target: 'ocr-result',
    narrative: 'OCR מזהה: בדיקת HbA1c, תקין, מסלול ירוק — אישור אוטומטי.',
  },

  // ─── Digital Twin (50-65s) — THE WOW MOMENT ────────────────────────
  {
    screen: 'digital-twin',
    delay: 3000,
    action: 'highlight',
    target: 'score-42',
    narrative: 'הציון היום: 42%. סיכוי בינוני.',
  },
  {
    screen: 'digital-twin',
    delay: 4000,
    action: 'click',
    target: 'add-all-docs',
    narrative: 'מה קורה אם משלימים את כל המסמכים?',
  },
  {
    screen: 'digital-twin',
    delay: 3000,
    action: 'highlight',
    target: 'score-81',
    narrative: '81%! שיפור של 39 נקודות. סיכוי גבוה לאישור.',
  },

  // ─── AI Control Center (65-75s) ────────────────────────────────────
  {
    screen: 'ai-center',
    delay: 3000,
    action: 'highlight',
    target: 'agent-tasks',
    narrative: 'הסוכן עבד: זיהה לקות, בנה צ\'קליסט, סרק OCR, חישב ציון.',
  },

  // ─── ROI (75-85s) ──────────────────────────────────────────────────
  {
    screen: 'roi',
    delay: 3000,
    action: 'highlight',
    target: 'savings',
    narrative: 'ערך לארגון: ₪42 מיליון חיסכון שנתי. -83% תיקים חסרים. -75% שיחות מוקד.',
  },

  // ─── Architecture (85-90s) ─────────────────────────────────────────
  {
    screen: 'architecture',
    delay: 3000,
    action: 'highlight',
    target: 'aws-stack',
    narrative: 'Bedrock Agent, Claude, Textract, OpenSearch, Lambda. Serverless. מוכן לפריסה.',
  },

  // ─── End ───────────────────────────────────────────────────────────
  {
    screen: 'landing',
    delay: 5000,
    action: 'highlight',
    target: 'hero-score',
    narrative: '42% → 81%. תביעה ביום. תודה.',
  },
];

// ─── Demo Runner ─────────────────────────────────────────────────────────────

export type DemoCallback = (step: DemoStep, index: number, total: number) => void;

export function runDemo(onStep: DemoCallback): () => void {
  let cancelled = false;
  let timeoutId: number;

  const execute = async () => {
    for (let i = 0; i < DEMO_SCRIPT.length; i++) {
      if (cancelled) break;
      const step = DEMO_SCRIPT[i];
      await new Promise(resolve => {
        timeoutId = window.setTimeout(resolve, step.delay);
      });
      if (cancelled) break;
      onStep(step, i, DEMO_SCRIPT.length);
    }
  };

  execute();

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
}

// ─── Demo Narration (for presenter) ──────────────────────────────────────────

export function getDemoNarration(): string {
  return DEMO_SCRIPT
    .filter(s => s.narrative)
    .map((s, i) => `${i + 1}. ${s.narrative}`)
    .join('\n');
}

export const DEMO_DURATION_SECONDS = 90;
export const DEMO_SCREEN_COUNT = new Set(DEMO_SCRIPT.map(s => s.screen)).size;

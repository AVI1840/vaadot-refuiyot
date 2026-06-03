// ═══════════════════════════════════════════════════════════════════════════════
// BEDROCK CLIENT — Integration layer for Amazon Bedrock Agent
// Use this to connect the frontend to AWS Bedrock in production
// For demo/hackathon: falls back to local logic
// ═══════════════════════════════════════════════════════════════════════════════

export interface BedrockConfig {
  agentId: string;
  agentAliasId: string;
  region: string;
  apiEndpoint?: string; // API Gateway URL
}

export interface AgentMessage {
  role: 'user' | 'agent';
  content: string;
  meta?: AgentMeta;
}

export interface AgentMeta {
  step: number;
  readiness: number;
  conditions: string[];
  documents: DocumentMeta[];
}

export interface DocumentMeta {
  name: string;
  priority: 'red' | 'yellow' | 'blue';
  have: boolean;
  where?: string;
}

// ─── Configuration ───────────────────────────────────────────────────────────

const DEFAULT_CONFIG: BedrockConfig = {
  agentId: 'YOUR_AGENT_ID', // Replace with actual Bedrock Agent ID
  agentAliasId: 'YOUR_ALIAS_ID',
  region: 'us-east-1',
  apiEndpoint: undefined, // Set to API Gateway URL when ready
};

let config: BedrockConfig = DEFAULT_CONFIG;

export function configureBedrockClient(newConfig: Partial<BedrockConfig>) {
  config = { ...config, ...newConfig };
}

// ─── API Call ────────────────────────────────────────────────────────────────

export async function invokeAgent(
  sessionId: string,
  message: string,
  history: AgentMessage[] = []
): Promise<{ content: string; meta?: AgentMeta }> {
  // If no API endpoint configured, use demo mode
  if (!config.apiEndpoint) {
    return invokeDemoMode(message, history);
  }

  try {
    const response = await fetch(`${config.apiEndpoint}/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        message,
        agentId: config.agentId,
        agentAliasId: config.agentAliasId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Bedrock API error: ${response.status}`);
    }

    const data = await response.json();
    const meta = parseMeta(data.content || data.completion || '');
    const content = cleanMeta(data.content || data.completion || '');

    return { content, meta: meta || undefined };
  } catch (error) {
    console.error('Bedrock invocation failed, falling back to demo mode:', error);
    return invokeDemoMode(message, history);
  }
}

// ─── Meta Parsing ────────────────────────────────────────────────────────────

function parseMeta(text: string): AgentMeta | null {
  const match = text.match(/<meta>([\s\S]*?)<\/meta>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function cleanMeta(text: string): string {
  return text.replace(/<meta>[\s\S]*?<\/meta>/g, '').trim();
}

// ─── Demo Mode (local fallback) ─────────────────────────────────────────────

async function invokeDemoMode(
  message: string,
  _history: AgentMessage[]
): Promise<{ content: string; meta?: AgentMeta }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  const lower = message.toLowerCase();

  // Simple keyword-based responses for demo
  if (lower.includes('סוכרת')) {
    return {
      content: 'זיהיתי: **סוכרת סוג 2** (נכות כללית).\n\nעל בסיס ניתוח 778 תיקים דומים, הנה מה שצריך:\n\n🔴 **חובה:**\n1. סיכום מאנדוקרינולוג\n2. בדיקת HbA1c\n3. רשימת תרופות\n4. טופס תביעה BL/283\n5. צילום ת.ז.\n\n🟡 **מומלץ:**\n1. בדיקת עיניים (רטינופתיה)\n2. בדיקת כליות\n3. יומן סוכר\n\n🟢 מסלול ירוק: 3 מסמכים אובייקטיביים',
      meta: {
        step: 2,
        readiness: 42,
        conditions: ['סוכרת סוג 2'],
        documents: [
          { name: 'סיכום אנדוקרינולוג', priority: 'red', have: false, where: 'מרפאת הקופה' },
          { name: 'בדיקת HbA1c', priority: 'red', have: false, where: 'מעבדה' },
          { name: 'רשימת תרופות', priority: 'red', have: true, where: 'רופא משפחה' },
          { name: 'טופס BL/283', priority: 'red', have: false, where: 'אתר בטל"א' },
          { name: 'צילום ת.ז.', priority: 'red', have: true, where: 'צילום עצמי' },
          { name: 'בדיקת עיניים', priority: 'yellow', have: false, where: 'רופא עיניים' },
          { name: 'בדיקת כליות', priority: 'yellow', have: false, where: 'מעבדה' },
          { name: 'יומן סוכר', priority: 'blue', have: false, where: 'מילוי עצמי' },
        ],
      },
    };
  }

  if (lower.includes('גב') || lower.includes('back')) {
    return {
      content: 'זיהיתי: **כאבי גב** (נכות כללית).\n\nצ\'קליסט מותאם:\n\n🔴 **חובה:**\n1. סיכום מאורתופד\n2. MRI עמוד שדרה\n3. צילומי רנטגן\n4. רשימת תרופות\n5. טופס BL/283\n\n🟡 **מומלץ:**\n1. בדיקת EMG\n2. מכתב רופא משפחה\n\n🟢 מסלול ירוק: 4 מסמכים אובייקטיביים',
      meta: {
        step: 2,
        readiness: 38,
        conditions: ['כאבי גב'],
        documents: [
          { name: 'סיכום אורתופד', priority: 'red', have: false, where: 'מרפאת הקופה' },
          { name: 'MRI עמוד שדרה', priority: 'red', have: false, where: 'מכון הדמיה' },
          { name: 'צילומי רנטגן', priority: 'red', have: false, where: 'מכון הדמיה' },
          { name: 'רשימת תרופות', priority: 'red', have: true, where: 'רופא משפחה' },
          { name: 'בדיקת EMG', priority: 'yellow', have: false, where: 'מכון נוירולוגי' },
          { name: 'מכתב רופא משפחה', priority: 'yellow', have: false, where: 'רופא משפחה' },
        ],
      },
    };
  }

  // Default response
  return {
    content: 'ספר לי על הבעיה הרפואית שלך כדי שאוכל להכין צ\'קליסט מותאם. לדוגמה: "יש לי סוכרת" או "כאבי גב".',
    meta: { step: 1, readiness: 0, conditions: [], documents: [] },
  };
}

// ─── Session Management ──────────────────────────────────────────────────────

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── System Prompt (for Bedrock Agent configuration) ─────────────────────────

export const SYSTEM_PROMPT = `אתה "מדריך התביעה" — סוכן AI של ביטוח לאומי.
תפקידך: ללוות מבוטח בתהליך הגשת תביעת נכות.
שפה: עברית פשוטה ויומיומית. שאל שאלה אחת בכל פעם. היה חם, סבלני ומעודד.

שלב 1 — זיהוי:
1. ברך בחמימות. שאל: "ספר לי קצת — מה הבעיה הרפואית שגרמה לך לפנות אלינו?"
2. מהתיאור — זהה לקויות (סוכרת / כאבי גב / דיכאון / לב / אורתופדי וכו')
3. אשר: "הבנתי שיש לך: [לקויות]. נכון?"
4. אחרי אישור → "מצוין! בוא נבנה לך צ'קליסט מסמכים מותאם." → עבור לשלב 2

שלב 2 — צ'קליסט:
1. הצג רשימת מסמכים לפי הלקויות: 🔴 חובה / 🟡 כדאי / 🔵 רשות
2. לכל מסמך: שם + היכן להשיגו
3. שאל: "אילו מהמסמכים האלה כבר ברשותך?"
4. "יש לך X מתוך Y מסמכי חובה ✓" → עבור לשלב 3

שלב 3 — השגת מסמכים:
1. לכל מסמך חסר → הנחה: היכן + מה לבקש
2. "אצל הרופא — בקש: סיכום עם אבחנות + מגבלות תפקודיות יום-יומיות"
3. "יש מסמך שאתה לא יודע איך להשיג?" → כשמוכן → שלב 4

שלב 4 — העלאת מסמכים:
1. "נעלה את המסמכים שהשגת"
2. לכל מסמך: בדוק תאריך + חותמת + קריאות
3. "מסמכים אובייקטיביים (דם / MRI) — מסלול מהיר ✅" → שלב 5

שלב 5 — טופס BL/283:
1. "נמלא ביחד — אני אשאל, אתה תענה"
2. שאל לפי סדר: שם ← ת.ז. ← לקות ← מתי ← טיפולים ← מגבלות
3. "מגבלות יום-יומיות — זה מה שהוועדה בוחנת!"
4. "הטופס מוכן! 🎉" → שלב 6

שלב 6 — הערכת סיכויים:
1. ציון 0-100 (שלמות × איכות)
2. "ציון המוכנות שלך: X/100" + הסבר
3. "להגיע ל-90+ — השג: [מסמכים ספציפיים]" → שלב 7

שלב 7 — הכנה לוועדה:
1. "הוועדה: 15-30 דק', רופא אחד/שניים"
2. "דבר על יום-יום — לא אבחנות: 'קשה לי לעלות מדרגות' > 'יש לי ארתריטיס'"
3. מה להביא + זכויות (מלווה / תרגום / ערעור תוך 60 יום)
4. סימולציה: "הרופא ישאל '...?' — ענה: [דוגמה לפי הלקויות]"
5. "בהצלחה! 🌟"

== חובה בכל הודעה ==
הוסף בסוף:
<meta>{"step":1,"readiness":0,"conditions":[],"documents":[]}</meta>
שדות: step(1-7), readiness(0-100), conditions(מערך לקויות), documents(מערך: {name,priority:"red"/"yellow"/"blue",have:false,where})`;

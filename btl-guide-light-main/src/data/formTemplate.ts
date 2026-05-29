// ─── טופס תביעה אמיתי — בטל"א ───────────────────────────────────────────
// מבוסס על טופס BL/283 — תביעה לקביעת דרגת נכות כללית

export interface FormField {
  id: string;
  label: string;
  section: string;
  type: 'text' | 'date' | 'select' | 'textarea' | 'phone' | 'id';
  placeholder: string;
  required: boolean;
  helpText?: string;
  options?: string[];
  validation?: string;
  agentPrompt: string; // מה הסוכן שואל
  agentFollowUp?: string; // מה הסוכן אומר אחרי
}

export const FORM_SECTIONS = [
  { id: 'personal', title: '👤 פרטים אישיים', icon: '👤' },
  { id: 'contact', title: '📍 כתובת ופרטי קשר', icon: '📍' },
  { id: 'claim', title: '🏥 פרטי התביעה', icon: '🏥' },
  { id: 'medical', title: '💊 מצב רפואי', icon: '💊' },
  { id: 'functional', title: '🚶 מצב תפקודי', icon: '🚶' },
  { id: 'employment', title: '💼 תעסוקה', icon: '💼' },
];

export const FORM_FIELDS: FormField[] = [
  // ─── פרטים אישיים ─────────────────────────────────────────────
  {
    id: 'fullName',
    label: 'שם מלא',
    section: 'personal',
    type: 'text',
    placeholder: 'ישראל ישראלי',
    required: true,
    agentPrompt: 'מה השם המלא שלך? (שם פרטי + שם משפחה)',
    agentFollowUp: 'תודה, {value}! נמשיך.',
  },
  {
    id: 'idNumber',
    label: 'מספר תעודת זהות',
    section: 'personal',
    type: 'id',
    placeholder: '000000000',
    required: true,
    validation: '9 ספרות',
    agentPrompt: 'מה מספר תעודת הזהות שלך? (9 ספרות)',
    helpText: 'המספר מופיע בתעודת הזהות שלך',
  },
  {
    id: 'birthDate',
    label: 'תאריך לידה',
    section: 'personal',
    type: 'date',
    placeholder: '01/01/1980',
    required: true,
    agentPrompt: 'מה תאריך הלידה שלך?',
  },
  {
    id: 'gender',
    label: 'מין',
    section: 'personal',
    type: 'select',
    placeholder: '',
    required: true,
    options: ['זכר', 'נקבה'],
    agentPrompt: 'מין? (זכר/נקבה)',
  },
  {
    id: 'maritalStatus',
    label: 'מצב משפחתי',
    section: 'personal',
    type: 'select',
    placeholder: '',
    required: true,
    options: ['רווק/ה', 'נשוי/אה', 'גרוש/ה', 'אלמן/ה'],
    agentPrompt: 'מה המצב המשפחתי שלך?',
  },
  // ─── כתובת ופרטי קשר ───────────────────────────────────────────
  {
    id: 'street',
    label: 'רחוב ומספר',
    section: 'contact',
    type: 'text',
    placeholder: 'הרצל 1',
    required: true,
    agentPrompt: 'מה הכתובת שלך? (רחוב ומספר)',
  },
  {
    id: 'city',
    label: 'עיר',
    section: 'contact',
    type: 'text',
    placeholder: 'תל אביב',
    required: true,
    agentPrompt: 'באיזו עיר אתה גר?',
  },
  {
    id: 'zipCode',
    label: 'מיקוד',
    section: 'contact',
    type: 'text',
    placeholder: '0000000',
    required: false,
    agentPrompt: 'מה המיקוד? (אם ידוע, אם לא — אפשר לדלג)',
  },
  {
    id: 'phone',
    label: 'טלפון נייד',
    section: 'contact',
    type: 'phone',
    placeholder: '050-0000000',
    required: true,
    agentPrompt: 'מה מספר הטלפון הנייד שלך?',
  },
  {
    id: 'email',
    label: 'דואר אלקטרוני',
    section: 'contact',
    type: 'text',
    placeholder: 'example@email.com',
    required: false,
    agentPrompt: 'יש לך כתובת מייל? (אופציונלי — לקבלת עדכונים)',
  },
  // ─── פרטי התביעה ───────────────────────────────────────────────
  {
    id: 'committeeType',
    label: 'סוג הוועדה',
    section: 'claim',
    type: 'select',
    placeholder: '',
    required: true,
    options: ['נכות כללית', 'נכות מעבודה', 'נפגעי פעולות איבה', 'ילד נכה', 'פטור ממס', 'ועדת ערר'],
    agentPrompt: 'לאיזה סוג ועדה אתה מגיש? אם לא בטוח — ספר לי על המצב ואני אעזור לבחור.',
    helpText: 'אם אינך בטוח, הסוכן יעזור לך לבחור',
  },
  {
    id: 'diagnosis',
    label: 'אבחנה רפואית עיקרית',
    section: 'claim',
    type: 'text',
    placeholder: 'סוכרת, כאבי גב...',
    required: true,
    agentPrompt: 'מה האבחנה הרפואית העיקרית שלך? תאר בשפה חופשית — אני אזהה.',
    agentFollowUp: 'זיהיתי: **{value}**. אכין לך צ\'קליסט מסמכים מותאם.',
  },
  {
    id: 'diagnosisSecondary',
    label: 'אבחנות נוספות',
    section: 'claim',
    type: 'text',
    placeholder: 'אם יש — פרט',
    required: false,
    agentPrompt: 'יש אבחנות נוספות? (אם כן — ציין. אם לא — אמור "אין")',
  },
  {
    id: 'claimReason',
    label: 'סיבת הפנייה',
    section: 'claim',
    type: 'select',
    placeholder: '',
    required: true,
    options: ['תביעה ראשונה', 'החמרה', 'ועדת ערר', 'חידוש'],
    agentPrompt: 'האם זו תביעה ראשונה, החמרה, ערר, או חידוש?',
  },
  // ─── מצב רפואי ─────────────────────────────────────────────────
  {
    id: 'mainComplaints',
    label: 'תלונות עיקריות',
    section: 'medical',
    type: 'textarea',
    placeholder: 'תאר את התלונות העיקריות שלך...',
    required: true,
    agentPrompt: 'תאר בקצרה את התלונות העיקריות שלך — מה כואב, מה מפריע, מה השתנה?',
    helpText: 'תאר את מה שמפריע לך ביום-יום. ככל שתפרט יותר — כך הוועדה תבין טוב יותר.',
  },
  {
    id: 'medications',
    label: 'תרופות',
    section: 'medical',
    type: 'textarea',
    placeholder: 'שם תרופה + מינון + תדירות',
    required: true,
    agentPrompt: 'אילו תרופות אתה לוקח? (שם + מינון + כמה פעמים ביום)\n\n💡 _טיפ: אפשר לצלם את שקית התרופות ולהביא לוועדה_',
  },
  {
    id: 'treatments',
    label: 'טיפולים',
    section: 'medical',
    type: 'textarea',
    placeholder: 'פיזיותרפיה, פסיכולוג...',
    required: false,
    agentPrompt: 'אילו טיפולים אתה מקבל? (פיזיותרפיה, פסיכולוג, ריפוי בעיסוק וכו\')',
  },
  {
    id: 'hospitalizations',
    label: 'אשפוזים',
    section: 'medical',
    type: 'textarea',
    placeholder: 'תאריך + בית חולים + סיבה',
    required: false,
    agentPrompt: 'היו אשפוזים בשנה האחרונה? (אם כן — מתי ואיפה)',
  },
  // ─── מצב תפקודי ────────────────────────────────────────────────
  {
    id: 'dailyLimitations',
    label: 'מגבלות בתפקוד יומיומי',
    section: 'functional',
    type: 'textarea',
    placeholder: 'קושי בהליכה, לא יכול להרים...',
    required: true,
    agentPrompt: 'איך המצב הרפואי משפיע על היום-יום שלך? (הליכה, עבודה, שינה, פעילויות...)\n\n💡 _טיפ חשוב: הוועדה מתייחסת מאוד למגבלות תפקודיות. תאר בכנות._',
  },
  {
    id: 'mobilityAids',
    label: 'עזרים',
    section: 'functional',
    type: 'text',
    placeholder: 'מקל, כיסא גלגלים, מחוך...',
    required: false,
    agentPrompt: 'האם אתה משתמש בעזרים? (מקל, מחוך, כיסא גלגלים, מכשיר שמיעה...)',
  },
  // ─── תעסוקה ────────────────────────────────────────────────────
  {
    id: 'employmentStatus',
    label: 'מצב תעסוקה',
    section: 'employment',
    type: 'select',
    placeholder: '',
    required: true,
    options: ['עובד/ת', 'לא עובד/ת', 'עובד/ת חלקית', 'פנסיונר/ית'],
    agentPrompt: 'מה מצב התעסוקה שלך? (עובד / לא עובד / חלקית / פנסיונר)',
  },
  {
    id: 'employer',
    label: 'מקום עבודה',
    section: 'employment',
    type: 'text',
    placeholder: 'שם המעסיק',
    required: false,
    agentPrompt: 'אם עובד — מה שם מקום העבודה?',
  },
  {
    id: 'occupation',
    label: 'מקצוע',
    section: 'employment',
    type: 'text',
    placeholder: 'מקצוע / תפקיד',
    required: false,
    agentPrompt: 'מה המקצוע / התפקיד שלך?',
  },
];

// ─── סיוע במציאת מסמכים — קישורים אמיתיים ─────────────────────────────

export interface DocumentSource {
  name: string;
  description: string;
  url?: string;
  phone?: string;
  action: string; // מה לעשות
  timeEstimate: string; // כמה זמן לוקח
  tips: string[];
}

export const DOCUMENT_SOURCES: Record<string, DocumentSource[]> = {
  'קופת חולים — כללית': [
    {
      name: 'כללית אונליין',
      description: 'שליפת סיכומים רפואיים, תוצאות בדיקות, רשימת תרופות',
      url: 'https://www.clalit.co.il/he/online',
      phone: '*2700',
      action: 'היכנס לאזור האישי → מסמכים רפואיים → סיכומי ביקורים',
      timeEstimate: 'מיידי (אונליין)',
      tips: ['אפשר להדפיס ישירות מהאתר', 'סיכומי מומחים זמינים תוך 48 שעות מהביקור'],
    },
    {
      name: 'קביעת תור למומחה',
      description: 'קביעת תור לרופא מומחה לקבלת סיכום רפואי עדכני',
      url: 'https://www.clalit.co.il/he/online/appointments',
      phone: '*2700',
      action: 'כללית אונליין → תורים → בחר מומחה רלוונטי',
      timeEstimate: '1-4 שבועות (תלוי מומחה)',
      tips: ['בקש מהרופא סיכום מפורט הכולל אבחנות ומגבלות', 'ציין שזה לוועדה רפואית'],
    },
  ],
  'קופת חולים — מכבי': [
    {
      name: 'מכבי אונליין',
      description: 'שליפת מסמכים רפואיים, תוצאות בדיקות',
      url: 'https://online.maccabi4u.co.il',
      phone: '*3555',
      action: 'היכנס לאזור האישי → התיק הרפואי → מסמכים',
      timeEstimate: 'מיידי (אונליין)',
      tips: ['ניתן לבקש סיכום מרופא המשפחה דרך הודעה באתר'],
    },
    {
      name: 'קביעת תור',
      description: 'קביעת תור למומחה',
      url: 'https://online.maccabi4u.co.il/appointments',
      phone: '*3555',
      action: 'מכבי אונליין → תורים → מומחים',
      timeEstimate: '1-3 שבועות',
      tips: ['אפשר לבקש תור דחוף אם יש זימון לוועדה'],
    },
  ],
  'קופת חולים — מאוחדת': [
    {
      name: 'מאוחדת אונליין',
      description: 'גישה למסמכים רפואיים',
      url: 'https://www.meuhedet.co.il/online',
      phone: '*3833',
      action: 'אזור אישי → מסמכים רפואיים',
      timeEstimate: 'מיידי',
      tips: ['ניתן לשלוח הודעה לרופא דרך האתר'],
    },
  ],
  'קופת חולים — לאומית': [
    {
      name: 'לאומית אונליין',
      description: 'גישה למסמכים',
      url: 'https://www.leumit.co.il/online',
      phone: '*507',
      action: 'אזור אישי → תיק רפואי',
      timeEstimate: 'מיידי',
      tips: [],
    },
  ],
  'בית חולים': [
    {
      name: 'מזכירות רפואית',
      description: 'סיכומי אשפוז, פרוטוקולי ניתוח, תעודות חדר מיון',
      phone: 'מזכירות המחלקה הרלוונטית',
      action: 'התקשר למזכירות המחלקה → בקש סיכום אשפוז / פרוטוקול ניתוח',
      timeEstimate: '3-14 ימי עבודה',
      tips: ['בקש גם גיליון קבלה', 'ציין שזה לוועדה רפואית — לפעמים מזרזים', 'אפשר לשלוח פקס עם בקשה'],
    },
  ],
  'מכון הדמיה': [
    {
      name: 'מכון הדמיה',
      description: 'צילומי רנטגן, MRI, CT — דיסק + פענוח',
      action: 'פנה למכון ההדמיה שבו בוצעה הבדיקה → בקש דיסק + פענוח כתוב',
      timeEstimate: '1-7 ימים',
      tips: ['הביא דיסק ולא רק תמונות מודפסות', 'ודא שיש פענוח רדיולוג חתום'],
    },
  ],
  'ביטוח לאומי': [
    {
      name: 'אתר ביטוח לאומי',
      description: 'טפסי תביעה, פרוטוקולי ועדות קודמות',
      url: 'https://www.btl.gov.il',
      phone: '*6050',
      action: 'אתר בטל"א → טפסים → תביעה לנכות כללית (BL/283)',
      timeEstimate: 'מיידי (הורדה)',
      tips: ['ניתן למלא טופס אונליין', 'שמור העתק של כל מה שמגיש'],
    },
    {
      name: 'סניף ביטוח לאומי',
      description: 'הגשת תביעה, קבלת פרוטוקולי ועדות קודמות',
      phone: '*6050',
      action: 'פנה לסניף הקרוב עם תעודת זהות',
      timeEstimate: 'באותו יום (בסניף)',
      tips: ['קח תור מראש באתר', 'הגע עם כל המסמכים מסודרים בתיקייה'],
    },
  ],
  'מעבדה': [
    {
      name: 'מעבדת קופת חולים',
      description: 'בדיקות דם, שתן, HbA1c',
      action: 'קבל הפניה מרופא משפחה → לך למעבדה → תוצאות תוך 1-3 ימים באתר הקופה',
      timeEstimate: '1-3 ימים',
      tips: ['ודא שהבדיקות מ-3 חודשים אחרונים', 'הדפס מאתר הקופה'],
    },
  ],
  'רופא משפחה': [
    {
      name: 'רופא משפחה',
      description: 'מכתב מלווה, רשימת תרופות, הפניות למומחים',
      action: 'קבע תור לרופא משפחה → בקש: מכתב מלווה לוועדה + רשימת תרופות + הפניות',
      timeEstimate: 'באותו ביקור',
      tips: ['בקש שהמכתב יפרט השפעה על תפקוד יומיומי', 'בקש הפניות לכל המומחים הרלוונטיים'],
    },
  ],
};

// ─── הנחיות חכמות לפי אבחנה ─────────────────────────────────────────────

export interface SmartGuidance {
  diagnosis: string;
  urgentActions: string[];
  whereToStart: string;
  commonMistakes: string[];
  proTips: string[];
  estimatedPrepTime: string;
}

export const SMART_GUIDANCE: SmartGuidance[] = [
  {
    diagnosis: 'סוכרת',
    urgentActions: [
      'בדיקת HbA1c עדכנית (מ-3 חודשים אחרונים)',
      'סיכום מאנדוקרינולוג',
      'בדיקת עיניים (קרקעית עין)',
    ],
    whereToStart: 'התחל ברופא משפחה — בקש הפניה לאנדוקרינולוג + הפניה לבדיקת עיניים + הפניה לבדיקות דם',
    commonMistakes: [
      'להגיע בלי HbA1c עדכני — זו הבדיקה הכי חשובה',
      'לשכוח בדיקת עיניים — רטינופתיה סוכרתית מעלה אחוזים',
      'לא להביא יומן סוכר — מחזק את התיק',
    ],
    proTips: [
      'יומן סוכר של 3 חודשים מראה לוועדה את חומרת המצב',
      'אם יש סיבוכים (כליות, עיניים, נוירופתיה) — כל אחד מוסיף אחוזים',
      'ודא שהאנדוקרינולוג כותב "סוכרת לא מאוזנת" אם רלוונטי',
    ],
    estimatedPrepTime: '2-3 שבועות',
  },
  {
    diagnosis: 'כאבי גב',
    urgentActions: [
      'MRI עמוד שדרה עדכני',
      'סיכום מאורתופד',
      'בדיקת EMG (אם יש קרינה לרגליים)',
    ],
    whereToStart: 'התחל ברופא משפחה — בקש הפניה לאורתופד + הפניה ל-MRI',
    commonMistakes: [
      'להביא רק צילום רנטגן — MRI הרבה יותר מפורט',
      'לא לציין קרינה לרגליים — זה מעלה אחוזים',
      'לשכוח דוח פיזיותרפיה — מראה שניסית טיפול',
    ],
    proTips: [
      'אם יש פריצת דיסק — ודא שזה כתוב ב-MRI',
      'בקש מהאורתופד לציין הגבלת תנועה במעלות',
      'הביא דיסק של ה-MRI ולא רק את הפענוח',
    ],
    estimatedPrepTime: '3-4 שבועות',
  },
  {
    diagnosis: 'דיכאון',
    urgentActions: [
      'סיכום מפסיכיאטר (לא פסיכולוג!)',
      'רשימת תרופות פסיכיאטריות',
      'דוח סוציאלי (אם יש)',
    ],
    whereToStart: 'אם אין פסיכיאטר — בקש הפניה מרופא משפחה. סיכום מפסיכיאטר הוא חובה.',
    commonMistakes: [
      'להביא רק מכתב מפסיכולוג — הוועדה דורשת פסיכיאטר',
      'לא לציין השפעה על תפקוד — "לא יכול לעבוד" חשוב',
      'להסתיר אשפוזים פסיכיאטריים — הם דווקא מחזקים',
    ],
    proTips: [
      'אם היו אשפוזים — הביא סיכומי אשפוז',
      'בקש מהפסיכיאטר לציין GAF score (ציון תפקוד)',
      'דוח סוציאלי מהרשות המקומית מחזק מאוד',
    ],
    estimatedPrepTime: '2-4 שבועות',
  },
  {
    diagnosis: 'מחלת לב',
    urgentActions: [
      'אקו לב עדכני (מ-6 חודשים)',
      'סיכום מקרדיולוג',
      'מבחן מאמץ (אם רלוונטי)',
    ],
    whereToStart: 'קבע תור לקרדיולוג — בקש אקו לב + סיכום מפורט',
    commonMistakes: [
      'אקו לב ישן (מעל שנה) — הוועדה דורשת עדכני',
      'לא להביא תוצאות צנתור אם בוצע',
      'לשכוח הולטר אם יש הפרעות קצב',
    ],
    proTips: [
      'EF (תפקוד חדר שמאל) הוא המדד המרכזי — ודא שמופיע באקו',
      'אם EF מתחת ל-40% — זה משמעותי מאוד',
      'הביא גם תוצאות מבחן מאמץ אם בוצע',
    ],
    estimatedPrepTime: '2-3 שבועות',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MEDICAL KNOWLEDGE BASE — Data from Chief Medical Officer analysis
// Source: Official NII diagnosis-document mapping
// ~150 diagnoses × ~100 documents × required/optional classification
// ═══════════════════════════════════════════════════════════════════════════════

export interface DiagnosisCategory {
  code: number;
  name: string;
}

export interface Diagnosis {
  id: number;
  categoryCode: number;
  categoryName: string;
  icdCode: string;
  nameEn: string;
  nameHe: string;
  synonyms: string[];
  additionalInfo?: string;
  rightsInfo?: string;
  documentCount: number;
}

export interface MedicalDocument {
  code: number;
  name: string;
  requiredCount: number;
  optionalCount: number;
  totalUsage: number;
}

export interface DiagnosisDocumentLink {
  diagnosisIcd: string;
  diagnosisNameHe: string;
  categoryName: string;
  documentCode: number;
  documentName: string;
  importance: 'נדרש' | 'רשות';
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const CATEGORIES: DiagnosisCategory[] = [
  { code: 1, name: 'פסיכיאטריה' },
  { code: 2, name: 'נוירולוגיה' },
  { code: 3, name: 'עיניים' },
  { code: 4, name: 'אוזניים' },
  { code: 5, name: 'נשימה וגרון' },
  { code: 6, name: 'לב וכלי דם' },
  { code: 7, name: 'יתר לחץ דם' },
  { code: 8, name: 'דם וקרישה' },
  { code: 9, name: 'מערכת העיכול' },
  { code: 10, name: 'פה ולסת' },
  { code: 11, name: 'שתן ומין' },
  { code: 12, name: 'עור וכוויות' },
  { code: 13, name: 'אורתופדיה וטראומה' },
  { code: 14, name: 'סוכרת' },
  { code: 15, name: 'בלוטת התריס (תירואיד)' },
  { code: 16, name: 'אנדוקרינולוגיה (הורמונים)' },
  { code: 17, name: 'סרטן' },
];

// ─── DIAGNOSES (partial — most common) ───────────────────────────────────────

export const DIAGNOSES: Diagnosis[] = [
  // פסיכיאטריה
  { id: 1, categoryCode: 1, categoryName: 'פסיכיאטריה', icdCode: 'F33.9', nameEn: 'Major depressive disorder', nameHe: 'דיכאון מג\'ורי', synonyms: ['דכאון'], documentCount: 5 },
  { id: 2, categoryCode: 1, categoryName: 'פסיכיאטריה', icdCode: 'F41.9', nameEn: 'Anxiety disorder', nameHe: 'חרדה', synonyms: [], documentCount: 4 },
  { id: 3, categoryCode: 1, categoryName: 'פסיכיאטריה', icdCode: 'F43.1', nameEn: 'PTSD', nameHe: 'תגובת דחק פוסט-טראומטית (PTSD)', synonyms: [], documentCount: 4 },
  { id: 4, categoryCode: 1, categoryName: 'פסיכיאטריה', icdCode: 'F43.0', nameEn: 'Acute stress reaction', nameHe: 'תגובת דחק חריפה', synonyms: ['ASR', 'הלם קרב'], documentCount: 4 },
  { id: 5, categoryCode: 1, categoryName: 'פסיכיאטריה', icdCode: 'F90', nameEn: 'ADHD', nameHe: 'הפרעות קשב וריכוז והיפראקטיביות', synonyms: ['ADHD'], documentCount: 4 },
  { id: 6, categoryCode: 1, categoryName: 'פסיכיאטריה', icdCode: 'F84', nameEn: 'Pervasive developmental disorders', nameHe: 'הפרעות על הספקטרום האוטיסטי', synonyms: ['PDD', 'הפרעה התפתחותית נרחבת (PDD)', 'הפרעות על הרצף האוטיסטי'], documentCount: 4 },
  { id: 7, categoryCode: 1, categoryName: 'פסיכיאטריה', icdCode: 'F20', nameEn: 'Schizophrenia', nameHe: 'סכיזופרניה', synonyms: [], documentCount: 4 },

  // נוירולוגיה
  { id: 8, categoryCode: 2, categoryName: 'נוירולוגיה', icdCode: '434.91', nameEn: 'Cerebral artery occlusion', nameHe: 'שבץ מוחי', synonyms: ['CVA', 'Stroke', 'Cerebrovascular accident', 'Cerebral Stroke', 'אירוע מוחי'], documentCount: 9 },
  { id: 9, categoryCode: 2, categoryName: 'נוירולוגיה', icdCode: '345', nameEn: 'Epilepsy', nameHe: 'מחלת הנפילה', synonyms: ['אפילפסיה'], documentCount: 7 },
  { id: 10, categoryCode: 2, categoryName: 'נוירולוגיה', icdCode: '340', nameEn: 'Multiple sclerosis', nameHe: 'טרשת נפוצה', synonyms: ['MS'], documentCount: 5 },
  { id: 11, categoryCode: 2, categoryName: 'נוירולוגיה', icdCode: '332', nameEn: 'Parkinson\'s disease', nameHe: 'פרקינסון', synonyms: [], documentCount: 4 },
  { id: 12, categoryCode: 2, categoryName: 'נוירולוגיה', icdCode: '344.1', nameEn: 'Paraplegia', nameHe: 'שיתוק בפלג גוף תחתון', synonyms: [], documentCount: 8 },

  // לב וכלי דם
  { id: 13, categoryCode: 6, categoryName: 'לב וכלי דם', icdCode: '410', nameEn: 'Acute myocardial infarction', nameHe: 'אוטם שריר הלב', synonyms: ['Heart attack', 'Acute coronary syndrome', 'Coronary infarction', 'התקף לב'], documentCount: 9 },
  { id: 14, categoryCode: 6, categoryName: 'לב וכלי דם', icdCode: '414', nameEn: 'Chronic ischemic heart disease', nameHe: 'מחלת לב איסכמית', synonyms: ['Angina pectoris', 'אנגינה פקטוריס'], documentCount: 9 },
  { id: 15, categoryCode: 6, categoryName: 'לב וכלי דם', icdCode: '428', nameEn: 'Heart failure', nameHe: 'אי-ספיקת לב', synonyms: [], documentCount: 8 },
  { id: 16, categoryCode: 6, categoryName: 'לב וכלי דם', icdCode: '427', nameEn: 'Cardiac dysrhythmias', nameHe: 'הפרעת קצב', synonyms: ['Arrhythmia', 'Cardiac arrhythmia'], documentCount: 5 },

  // סוכרת
  { id: 17, categoryCode: 14, categoryName: 'סוכרת', icdCode: '250', nameEn: 'Diabetes mellitus', nameHe: 'סוכרת', synonyms: [], documentCount: 11 },
  { id: 18, categoryCode: 14, categoryName: 'סוכרת', icdCode: '250.5', nameEn: 'Diabetes with ophthalmic manifestations', nameHe: 'סוכרת עם סיבוכים עיניים', synonyms: [], documentCount: 8 },
  { id: 19, categoryCode: 14, categoryName: 'סוכרת', icdCode: '250.8', nameEn: 'Diabetes with other manifestations', nameHe: 'סוכרת עם סיבוכים אחרים', synonyms: [], documentCount: 10 },

  // אורתופדיה
  { id: 20, categoryCode: 13, categoryName: 'אורתופדיה וטראומה', icdCode: '724', nameEn: 'Disorders of back', nameHe: 'מחלות וחבלות של עמוד השדרה (צוואר, גב)', synonyms: [], documentCount: 9 },
  { id: 21, categoryCode: 13, categoryName: 'אורתופדיה וטראומה', icdCode: '354.0', nameEn: 'Carpal tunnel syndrome', nameHe: 'תסמונת התעלה הקרפלית', synonyms: ['Entrapment Neuropathy, Carpal Tunnel', 'CTS'], documentCount: 7 },
  { id: 22, categoryCode: 13, categoryName: 'אורתופדיה וטראומה', icdCode: '729.1', nameEn: 'Myalgia and myositis', nameHe: 'כאבים בשריר ודלקת בשריר כולל פיברומיאלגיה', synonyms: ['Fibromyalgia'], documentCount: 6 },

  // אוזניים
  { id: 23, categoryCode: 4, categoryName: 'אוזניים', icdCode: '388.12', nameEn: 'Noise-induced hearing loss', nameHe: 'אובדן שמיעה מושרה רעש', synonyms: ['NIHL', 'Acoustic trauma', 'טראומה אקוסטית'], documentCount: 11 },
  { id: 24, categoryCode: 4, categoryName: 'אוזניים', icdCode: '389', nameEn: 'Hearing loss', nameHe: 'ליקוי שמיעה', synonyms: ['ירידה בשמיעה'], documentCount: 11 },
  { id: 25, categoryCode: 4, categoryName: 'אוזניים', icdCode: '388.3', nameEn: 'Tinnitus', nameHe: 'טנטון', synonyms: ['צפצופים באזניים'], documentCount: 8 },

  // יתר לחץ דם
  { id: 26, categoryCode: 7, categoryName: 'יתר לחץ דם', icdCode: '401', nameEn: 'Essential hypertension', nameHe: 'יתר לחץ דם', synonyms: ['יל"ד', 'HTN'], documentCount: 6 },

  // נשימה
  { id: 27, categoryCode: 5, categoryName: 'נשימה וגרון', icdCode: '496', nameEn: 'COPD', nameHe: 'מחלת ריאות חסימתית כרונית', synonyms: ['COPD'], documentCount: 7 },
  { id: 28, categoryCode: 5, categoryName: 'נשימה וגרון', icdCode: '493', nameEn: 'Asthma', nameHe: 'אסטמה', synonyms: ['קצרת'], documentCount: 7 },

  // שתן
  { id: 29, categoryCode: 11, categoryName: 'שתן ומין', icdCode: '586', nameEn: 'Renal failure', nameHe: 'אי-ספיקת כליות', synonyms: [], documentCount: 10 },
];

// ─── DIAGNOSIS → DOCUMENTS MAPPING (key relationships) ───────────────────────

export const DIAGNOSIS_DOCUMENTS: DiagnosisDocumentLink[] = [
  // סוכרת (250)
  { diagnosisIcd: '250', diagnosisNameHe: 'סוכרת', categoryName: 'סוכרת', documentCode: 61, documentName: 'מכתב סיכום מרופא - אנדוקרינולוג', importance: 'נדרש' },
  { diagnosisIcd: '250', diagnosisNameHe: 'סוכרת', categoryName: 'סוכרת', documentCode: 61084, documentName: 'תוצאות בדיקות מעבדה - סוכר בדם', importance: 'נדרש' },
  { diagnosisIcd: '250', diagnosisNameHe: 'סוכרת', categoryName: 'סוכרת', documentCode: 61599, documentName: 'תוצאות בדיקות מעבדה - המוגלובין מסוכר (HbA1C)', importance: 'נדרש' },
  { diagnosisIcd: '250', diagnosisNameHe: 'סוכרת', categoryName: 'סוכרת', documentCode: 95106, documentName: 'סיכום מחלה מרופא מטפל', importance: 'נדרש' },
  { diagnosisIcd: '250', diagnosisNameHe: 'סוכרת', categoryName: 'סוכרת', documentCode: 1, documentName: 'סיכום אשפוז בבית חולים', importance: 'רשות' },
  { diagnosisIcd: '250', diagnosisNameHe: 'סוכרת', categoryName: 'סוכרת', documentCode: 59, documentName: 'מכתב סיכום מרופא - עיניים', importance: 'רשות' },
  { diagnosisIcd: '250', diagnosisNameHe: 'סוכרת', categoryName: 'סוכרת', documentCode: 62, documentName: 'מכתב סיכום מרופא - נוירולוג', importance: 'רשות' },
  { diagnosisIcd: '250', diagnosisNameHe: 'סוכרת', categoryName: 'סוכרת', documentCode: 64, documentName: 'מכתב סיכום מרופא - נפרולוג', importance: 'רשות' },

  // שבץ מוחי (434.91)
  { diagnosisIcd: '434.91', diagnosisNameHe: 'שבץ מוחי', categoryName: 'נוירולוגיה', documentCode: 158, documentName: 'צילומים ובדיקות דימות (CT, MRI, US, מיפוי וכו\')', importance: 'נדרש' },
  { diagnosisIcd: '434.91', diagnosisNameHe: 'שבץ מוחי', categoryName: 'נוירולוגיה', documentCode: 72103, documentName: 'תוצאות בדיקת CT ראש', importance: 'נדרש' },
  { diagnosisIcd: '434.91', diagnosisNameHe: 'שבץ מוחי', categoryName: 'נוירולוגיה', documentCode: 1, documentName: 'סיכום אשפוז בבית חולים', importance: 'נדרש' },
  { diagnosisIcd: '434.91', diagnosisNameHe: 'שבץ מוחי', categoryName: 'נוירולוגיה', documentCode: 62, documentName: 'מכתב סיכום מרופא - נוירולוג', importance: 'נדרש' },
  { diagnosisIcd: '434.91', diagnosisNameHe: 'שבץ מוחי', categoryName: 'נוירולוגיה', documentCode: 72206, documentName: 'תוצאות בדיקת MRI של המוח', importance: 'נדרש' },
  { diagnosisIcd: '434.91', diagnosisNameHe: 'שבץ מוחי', categoryName: 'נוירולוגיה', documentCode: 115, documentName: 'מכתב סיכום מרופא שיקום', importance: 'רשות' },
  { diagnosisIcd: '434.91', diagnosisNameHe: 'שבץ מוחי', categoryName: 'נוירולוגיה', documentCode: 290, documentName: 'סיכום פיזיותרפיה', importance: 'רשות' },

  // מחלת לב איסכמית (414)
  { diagnosisIcd: '414', diagnosisNameHe: 'מחלת לב איסכמית', categoryName: 'לב וכלי דם', documentCode: 1, documentName: 'סיכום אשפוז בבית חולים', importance: 'נדרש' },
  { diagnosisIcd: '414', diagnosisNameHe: 'מחלת לב איסכמית', categoryName: 'לב וכלי דם', documentCode: 48, documentName: 'מכתב שחרור מחדר מיון', importance: 'נדרש' },
  { diagnosisIcd: '414', diagnosisNameHe: 'מחלת לב איסכמית', categoryName: 'לב וכלי דם', documentCode: 67, documentName: 'מכתב סיכום מרופא - קרדיולוג', importance: 'נדרש' },
  { diagnosisIcd: '414', diagnosisNameHe: 'מחלת לב איסכמית', categoryName: 'לב וכלי דם', documentCode: 51501, documentName: 'אק"ג', importance: 'נדרש' },
  { diagnosisIcd: '414', diagnosisNameHe: 'מחלת לב איסכמית', categoryName: 'לב וכלי דם', documentCode: 51546, documentName: 'אקו לב (TTE)', importance: 'נדרש' },
  { diagnosisIcd: '414', diagnosisNameHe: 'מחלת לב איסכמית', categoryName: 'לב וכלי דם', documentCode: 51584, documentName: 'תוצאות מבחן מאמץ', importance: 'נדרש' },
  { diagnosisIcd: '414', diagnosisNameHe: 'מחלת לב איסכמית', categoryName: 'לב וכלי דם', documentCode: 95106, documentName: 'סיכום מחלה מרופא מטפל', importance: 'נדרש' },
  { diagnosisIcd: '414', diagnosisNameHe: 'מחלת לב איסכמית', categoryName: 'לב וכלי דם', documentCode: 20103, documentName: 'תוצאות צנתור לב', importance: 'רשות' },

  // כאבי גב (724)
  { diagnosisIcd: '724', diagnosisNameHe: 'מחלות וחבלות של עמוד השדרה (צוואר, גב)', categoryName: 'אורתופדיה וטראומה', documentCode: 57, documentName: 'מכתב סיכום מרופא - אורתופד', importance: 'נדרש' },
  { diagnosisIcd: '724', diagnosisNameHe: 'מחלות וחבלות של עמוד השדרה (צוואר, גב)', categoryName: 'אורתופדיה וטראומה', documentCode: 158, documentName: 'צילומים ובדיקות דימות (CT, MRI, US, מיפוי וכו\')', importance: 'נדרש' },
  { diagnosisIcd: '724', diagnosisNameHe: 'מחלות וחבלות של עמוד השדרה (צוואר, גב)', categoryName: 'אורתופדיה וטראומה', documentCode: 48, documentName: 'מכתב שחרור מחדר מיון', importance: 'רשות' },
  { diagnosisIcd: '724', diagnosisNameHe: 'מחלות וחבלות של עמוד השדרה (צוואר, גב)', categoryName: 'אורתופדיה וטראומה', documentCode: 1, documentName: 'סיכום אשפוז בבית חולים', importance: 'רשות' },
  { diagnosisIcd: '724', diagnosisNameHe: 'מחלות וחבלות של עמוד השדרה (צוואר, גב)', categoryName: 'אורתופדיה וטראומה', documentCode: 62, documentName: 'מכתב סיכום מרופא - נוירולוג', importance: 'רשות' },
  { diagnosisIcd: '724', diagnosisNameHe: 'מחלות וחבלות של עמוד השדרה (צוואר, גב)', categoryName: 'אורתופדיה וטראומה', documentCode: 51519, documentName: 'אלקטרומיוגרפיה ממוחשבת (EMG)', importance: 'רשות' },
  { diagnosisIcd: '724', diagnosisNameHe: 'מחלות וחבלות של עמוד השדרה (צוואר, גב)', categoryName: 'אורתופדיה וטראומה', documentCode: 290, documentName: 'סיכום פיזיותרפיה', importance: 'רשות' },

  // דיכאון (F33.9)
  { diagnosisIcd: 'F33.9', diagnosisNameHe: 'דיכאון מג\'ורי', categoryName: 'פסיכיאטריה', documentCode: 97, documentName: 'מכתב סיכום מרופא - פסיכיאטר', importance: 'נדרש' },
  { diagnosisIcd: 'F33.9', diagnosisNameHe: 'דיכאון מג\'ורי', categoryName: 'פסיכיאטריה', documentCode: 1, documentName: 'סיכום אשפוז בבית חולים', importance: 'רשות' },
  { diagnosisIcd: 'F33.9', diagnosisNameHe: 'דיכאון מג\'ורי', categoryName: 'פסיכיאטריה', documentCode: 48, documentName: 'מכתב שחרור מחדר מיון', importance: 'רשות' },
  { diagnosisIcd: 'F33.9', diagnosisNameHe: 'דיכאון מג\'ורי', categoryName: 'פסיכיאטריה', documentCode: 149, documentName: 'מכתב סיכום מפסיכולוג', importance: 'רשות' },
  { diagnosisIcd: 'F33.9', diagnosisNameHe: 'דיכאון מג\'ורי', categoryName: 'פסיכיאטריה', documentCode: 95106, documentName: 'סיכום מחלה מרופא מטפל', importance: 'רשות' },

  // PTSD (F43.1)
  { diagnosisIcd: 'F43.1', diagnosisNameHe: 'תגובת דחק פוסט-טראומטית (PTSD)', categoryName: 'פסיכיאטריה', documentCode: 97, documentName: 'מכתב סיכום מרופא - פסיכיאטר', importance: 'נדרש' },
  { diagnosisIcd: 'F43.1', diagnosisNameHe: 'תגובת דחק פוסט-טראומטית (PTSD)', categoryName: 'פסיכיאטריה', documentCode: 1, documentName: 'סיכום אשפוז בבית חולים', importance: 'רשות' },
  { diagnosisIcd: 'F43.1', diagnosisNameHe: 'תגובת דחק פוסט-טראומטית (PTSD)', categoryName: 'פסיכיאטריה', documentCode: 48, documentName: 'מכתב שחרור מחדר מיון', importance: 'רשות' },
  { diagnosisIcd: 'F43.1', diagnosisNameHe: 'תגובת דחק פוסט-טראומטית (PTSD)', categoryName: 'פסיכיאטריה', documentCode: 149, documentName: 'מכתב סיכום מפסיכולוג', importance: 'רשות' },

  // ליקוי שמיעה (389)
  { diagnosisIcd: '389', diagnosisNameHe: 'ליקוי שמיעה', categoryName: 'אוזניים', documentCode: 51107, documentName: 'תוצאות בדיקת רופא אף אוזן וגרון', importance: 'נדרש' },
  { diagnosisIcd: '389', diagnosisNameHe: 'ליקוי שמיעה', categoryName: 'אוזניים', documentCode: 51246, documentName: 'תוצאות בדיקת מאפייני טינטון', importance: 'נדרש' },
  { diagnosisIcd: '389', diagnosisNameHe: 'ליקוי שמיעה', categoryName: 'אוזניים', documentCode: 51506, documentName: 'תוצאות בדיקת שמיעה', importance: 'נדרש' },
  { diagnosisIcd: '389', diagnosisNameHe: 'ליקוי שמיעה', categoryName: 'אוזניים', documentCode: 51526, documentName: 'תוצאות בדיקת רישום רפלקס אקוסטי', importance: 'נדרש' },
  { diagnosisIcd: '389', diagnosisNameHe: 'ליקוי שמיעה', categoryName: 'אוזניים', documentCode: 55, documentName: 'מכתב סיכום מרופא - אף אוזן גרון', importance: 'רשות' },
  { diagnosisIcd: '389', diagnosisNameHe: 'ליקוי שמיעה', categoryName: 'אוזניים', documentCode: 51567, documentName: 'התאמת מכשיר שמיעה', importance: 'רשות' },
];

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Find diagnosis by Hebrew text (searches name + synonyms)
 */
export function findDiagnosis(text: string): Diagnosis[] {
  const lower = text.toLowerCase();
  return DIAGNOSES.filter(d => {
    if (d.nameHe.includes(text)) return true;
    if (d.nameEn.toLowerCase().includes(lower)) return true;
    if (d.synonyms.some(s => s.includes(text) || s.toLowerCase().includes(lower))) return true;
    if (d.icdCode.toLowerCase() === lower) return true;
    return false;
  });
}

/**
 * Get documents for a specific diagnosis ICD code
 */
export function getDocumentsForDiagnosis(icdCode: string): { required: DiagnosisDocumentLink[]; optional: DiagnosisDocumentLink[] } {
  const docs = DIAGNOSIS_DOCUMENTS.filter(d => d.diagnosisIcd === icdCode);
  return {
    required: docs.filter(d => d.importance === 'נדרש'),
    optional: docs.filter(d => d.importance === 'רשות'),
  };
}

/**
 * Get all diagnoses in a category
 */
export function getDiagnosesByCategory(categoryCode: number): Diagnosis[] {
  return DIAGNOSES.filter(d => d.categoryCode === categoryCode);
}

// ─── STATS ───────────────────────────────────────────────────────────────────

export const KB_STATS = {
  totalCategories: 17,
  totalDiagnoses: 150, // full dataset
  totalDocuments: 100, // unique document types
  totalMappings: 750, // total diagnosis-document links
  source: 'ניתוח הרופא הראשי — ביטוח לאומי',
  lastUpdated: '2026-06',
};

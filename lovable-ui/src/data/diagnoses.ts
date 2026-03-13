export type Priority = 'required' | 'recommended' | 'optional';

export interface DocumentItem {
  id: string;
  name: string;
  description?: string;
  priority: Priority;
  whereToGet?: string;
  tip?: string;
  aiRating?: number;
}

export interface DiagnosisGroup {
  id: string;
  name: string;
  domain: string;
  documents: DocumentItem[];
}

export const DOMAINS = [
  'נכות',
  'נכות מעבודה',
  'נפגעי פעולות איבה',
  'ילד נכה',
  'פטור ממס',
  'מס הכנסה',
  'שירותים מיוחדים',
] as const;

export type Domain = typeof DOMAINS[number];

let docCounter = 0;
const docId = () => `DOC-${String(++docCounter).padStart(4, '0')}`;

const commonDocs = {
  idCopy: () => ({ id: docId(), name: 'צילום תעודת זהות', description: 'העתק ברור של תעודת הזהות', priority: 'required' as Priority, whereToGet: 'צילום עצמי' }),
  claimForm: () => ({ id: docId(), name: 'טופס תביעה מלא וחתום', description: 'טופס התביעה המקורי חתום בכל העמודים', priority: 'required' as Priority, whereToGet: 'סניף ביטוח לאומי או אתר האינטרנט', tip: 'ודא שכל השדות מולאו — טופס חלקי מעכב טיפול' }),
  medSummary: (specialist: string) => ({ id: docId(), name: `סיכום רפואי מ${specialist}`, description: `סיכום עדכני מ-6 חודשים אחרונים מ${specialist} מטפל`, priority: 'required' as Priority, whereToGet: `מרפאת ${specialist} בקופת חולים`, tip: 'בקש סיכום מפורט הכולל אבחנות, ממצאים ומגבלות תפקודיות', aiRating: 5 }),
  drugList: () => ({ id: docId(), name: 'רשימת תרופות עדכנית', description: 'רשימה מלאה של כל התרופות כולל מינון ותדירות', priority: 'required' as Priority, whereToGet: 'רופא משפחה או רוקח', tip: 'ניתן להדפיס מאתר קופת החולים', aiRating: 5 }),
  xray: (type: string) => ({ id: docId(), name: `צילומי ${type}`, description: `צילומי ${type} עדכניים מ-6 חודשים אחרונים`, priority: 'required' as Priority, whereToGet: 'מחלקת הדמיה בקופת חולים', tip: 'בקש דיסק ולא רק תמונות מודפסות' }),
  mri: (area: string) => ({ id: docId(), name: `MRI ${area}`, description: `בדיקת MRI של ${area} אם בוצעה`, priority: 'recommended' as Priority, whereToGet: 'מכון הדמיה בהפניית רופא מומחה', tip: 'הביאו את הדיסק ואת פענוח הרדיולוג' }),
  ct: (area: string) => ({ id: docId(), name: `CT ${area}`, description: `סריקת CT של ${area}`, priority: 'recommended' as Priority, whereToGet: 'מכון הדמיה', tip: 'הביאו דיסק + פענוח כתוב' }),
  bloodTests: () => ({ id: docId(), name: 'בדיקות דם עדכניות', description: 'בדיקות דם מ-3 חודשים אחרונים', priority: 'required' as Priority, whereToGet: 'מעבדת קופת חולים', tip: 'כללו ספירת דם, כימיה, תפקודי כליות וכבד' }),
  familyDoc: () => ({ id: docId(), name: 'מכתב מרופא משפחה', description: 'מכתב מלווה מרופא המשפחה', priority: 'recommended' as Priority, whereToGet: 'מרפאת רופא משפחה', tip: 'בקש שהמכתב יפרט את ההשפעה על תפקוד יומיומי' }),
  privateOpinion: () => ({ id: docId(), name: 'חוות דעת פרטית', description: 'חוות דעת רפואית ממומחה פרטי', priority: 'optional' as Priority, whereToGet: 'רופא מומחה פרטי', tip: 'חוות דעת פרטית יכולה לחזק את התיק אך אינה חובה' }),
  socialReport: () => ({ id: docId(), name: 'דוח סוציאלי', description: 'דוח עובד סוציאלי על מצב תפקודי וחברתי', priority: 'optional' as Priority, whereToGet: 'שירותי רווחה ברשות המקומית' }),
  hospitalSummary: () => ({ id: docId(), name: 'סיכום אשפוז', description: 'סיכומי אשפוזים רלוונטיים', priority: 'recommended' as Priority, whereToGet: 'מזכירות המחלקה בבית החולים', tip: 'בקש גם את גיליון הקבלה' }),
  surgeryReport: () => ({ id: docId(), name: 'סיכום ניתוח', description: 'פרוטוקול ניתוח מפורט', priority: 'recommended' as Priority, whereToGet: 'מזכירות חדר ניתוח בבית החולים' }),
  prevCommittee: () => ({ id: docId(), name: 'פרוטוקול ועדה רפואית קודמת', description: 'החלטות ועדות קודמות', priority: 'recommended' as Priority, whereToGet: 'סניף ביטוח לאומי' }),
  funcReport: () => ({ id: docId(), name: 'דוח תפקודי', description: 'הערכה תפקודית מריפוי בעיסוק או פיזיותרפיה', priority: 'recommended' as Priority, whereToGet: 'מכון שיקום או מרפאת פיזיותרפיה' }),
  erReport: () => ({ id: docId(), name: 'תעודת חדר מיון', description: 'סיכום ביקור בחדר מיון', priority: 'required' as Priority, whereToGet: 'מזכירות חדר מיון בבית החולים' }),
};

const createDiagnosisGroups = (): DiagnosisGroup[] => {
  const groups: DiagnosisGroup[] = [];

  // =================== נכות (20) ===================
  const nakutDiagnoses: Array<{ name: string; docs: DocumentItem[] }> = [
    { name: 'כאבי גב', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('עמוד שדרה'), commonDocs.mri('עמוד שדרה'), commonDocs.drugList(), commonDocs.familyDoc(), commonDocs.privateOpinion(), { id: docId(), name: 'בדיקת EMG', description: 'בדיקת הולכה עצבית', priority: 'recommended', whereToGet: 'מכון נוירולוגי בהפניית רופא' }] },
    { name: 'אורתופדיה כללי', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('רנטגן'), commonDocs.drugList(), commonDocs.familyDoc(), commonDocs.privateOpinion()] },
    { name: 'ניוון מפרקים', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('מפרקים'), commonDocs.mri('מפרקים'), commonDocs.drugList(), { id: docId(), name: 'הפניה לפיזיותרפיה', description: 'אישור על טיפולי פיזיותרפיה', priority: 'recommended', whereToGet: 'מרפאת פיזיותרפיה' }, commonDocs.privateOpinion()] },
    { name: 'שברים', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('רנטגן עדכניים'), commonDocs.erReport(), commonDocs.mri('אם בוצע'), commonDocs.familyDoc()] },
    { name: 'פגיעת כתף', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('כתף'), commonDocs.mri('כתף'), commonDocs.drugList(), commonDocs.familyDoc()] },
    { name: 'החלפת מפרק', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('מפרק'), commonDocs.surgeryReport(), commonDocs.drugList(), commonDocs.funcReport()] },
    { name: 'פנימית כללי', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא פנימי'), commonDocs.bloodTests(), commonDocs.drugList(), commonDocs.familyDoc(), commonDocs.privateOpinion()] },
    { name: 'סוכרת', docs: [commonDocs.claimForm(), commonDocs.medSummary('אנדוקרינולוג'), commonDocs.bloodTests(), { id: docId(), name: 'בדיקת HbA1c', description: 'בדיקת ממוצע סוכר ב-3 חודשים אחרונים', priority: 'required', whereToGet: 'מעבדת קופת חולים', tip: 'ערך מעל 7% מעיד על איזון לקוי', aiRating: 5 }, commonDocs.drugList(), { id: docId(), name: 'בדיקת עיניים', description: 'בדיקת קרקעית עין לגילוי רטינופתיה', priority: 'recommended', whereToGet: 'רופא עיניים בקופת חולים' }, { id: docId(), name: 'בדיקת כליות', description: 'בדיקת תפקודי כליות ומיקרואלבומינוריה', priority: 'recommended', whereToGet: 'מעבדת קופת חולים' }, { id: docId(), name: 'יומן סוכר', description: 'מדידות סוכר יומיות ל-3 חודשים', priority: 'optional', whereToGet: 'מדידה עצמית', tip: 'יומן מסודר מחזק את התיק' }] },
    { name: 'יתר לחץ דם', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא פנימי'), commonDocs.bloodTests(), commonDocs.drugList(), { id: docId(), name: 'ניטור לחץ דם 24 שעות', description: 'בדיקת הולטר לחץ דם', priority: 'recommended', whereToGet: 'מכון קרדיולוגי' }] },
    { name: 'מחלת כליות', docs: [commonDocs.claimForm(), commonDocs.medSummary('נפרולוג'), commonDocs.bloodTests(), commonDocs.drugList(), { id: docId(), name: 'בדיקת שתן', description: 'בדיקת שתן כללית + מיקרואלבומין', priority: 'required', whereToGet: 'מעבדת קופת חולים' }, { id: docId(), name: 'אולטרסאונד כליות', description: 'הדמיית כליות', priority: 'recommended', whereToGet: 'מכון הדמיה' }] },
    { name: 'מחלת כבד', docs: [commonDocs.claimForm(), commonDocs.medSummary('גסטרואנטרולוג'), commonDocs.bloodTests(), commonDocs.drugList(), { id: docId(), name: 'אולטרסאונד כבד', description: 'הדמיית כבד ודרכי מרה', priority: 'recommended', whereToGet: 'מכון הדמיה' }, { id: docId(), name: 'ביופסיית כבד', description: 'תוצאות ביופסיה אם בוצעה', priority: 'optional', whereToGet: 'מחלקת גסטרו בבית חולים' }] },
    { name: 'בריאות הנפש כללי', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), { id: docId(), name: 'אישור טיפול פסיכולוגי', description: 'אישור על טיפול פסיכולוגי שוטף', priority: 'recommended', whereToGet: 'פסיכולוג מטפל' }, commonDocs.socialReport(), commonDocs.hospitalSummary()] },
    { name: 'דיכאון', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), { id: docId(), name: 'מכתב מפסיכולוג', description: 'חוות דעת על מהלך הטיפול', priority: 'recommended', whereToGet: 'פסיכולוג מטפל' }, commonDocs.hospitalSummary(), commonDocs.socialReport()] },
    { name: 'חרדה', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), { id: docId(), name: 'אבחון פסיכולוגי', description: 'אבחון מלא כולל שאלונים', priority: 'recommended', whereToGet: 'פסיכולוג קליני' }, commonDocs.socialReport()] },
    { name: 'PTSD', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), { id: docId(), name: 'תיעוד אירוע טראומטי', description: 'תיעוד רשמי של האירוע הטראומטי', priority: 'required', whereToGet: 'משטרה / צבא / מעסיק', tip: 'תיעוד האירוע הוא קריטי לקביעת הקשר הסיבתי' }, { id: docId(), name: 'אבחון פסיכולוגי', description: 'אבחון PTSD מלא', priority: 'recommended', whereToGet: 'פסיכולוג קליני מומחה בטראומה' }, commonDocs.hospitalSummary()] },
    { name: 'נוירולוגיה כללי', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), commonDocs.drugList(), commonDocs.mri('מוח'), { id: docId(), name: 'EEG', description: 'בדיקת גלי מוח', priority: 'recommended', whereToGet: 'מעבדת EEG בבית חולים' }, commonDocs.familyDoc()] },
    { name: 'אפילפסיה', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), { id: docId(), name: 'EEG עדכני', description: 'בדיקת גלי מוח מ-6 חודשים אחרונים', priority: 'required', whereToGet: 'מעבדת EEG בבית חולים', tip: 'EEG תקין אינו שולל אפילפסיה — הביאו גם יומן התקפים', aiRating: 5 }, commonDocs.drugList(), commonDocs.mri('מוח'), { id: docId(), name: 'יומן התקפים', description: 'תיעוד תדירות, משך וסוג ההתקפים', priority: 'recommended', whereToGet: 'מילוי עצמי', tip: 'תעדו כל התקף כולל תאריך, שעה ומשך' }] },
    { name: 'מחלת לב איסכמית', docs: [commonDocs.claimForm(), commonDocs.medSummary('קרדיולוג'), { id: docId(), name: 'אקו לב', description: 'בדיקת אקו-קרדיוגרפיה עדכנית', priority: 'required', whereToGet: 'מכון קרדיולוגי', tip: 'חשוב שהבדיקה תהיה מ-6 חודשים אחרונים', aiRating: 5 }, commonDocs.drugList(), { id: docId(), name: 'מבחן מאמץ', description: 'ארגומטריה או מבחן מאמץ תחת מעקב', priority: 'recommended', whereToGet: 'מכון קרדיולוגי' }, { id: docId(), name: 'צנתור לב', description: 'תוצאות צנתור אם בוצע', priority: 'recommended', whereToGet: 'מחלקת קרדיולוגיה בבית חולים' }, { id: docId(), name: 'הולטר', description: 'ניטור קצב לב 24 שעות', priority: 'optional', whereToGet: 'מכון קרדיולוגי' }] },
    { name: 'אי-ספיקת לב', docs: [commonDocs.claimForm(), commonDocs.medSummary('קרדיולוג'), { id: docId(), name: 'אקו לב עדכני', description: 'בדיקת תפקוד חדרי הלב', priority: 'required', whereToGet: 'מכון קרדיולוגי', aiRating: 5 }, commonDocs.drugList(), { id: docId(), name: 'מבחן מאמץ', description: 'הערכת כושר גופני', priority: 'recommended', whereToGet: 'מכון קרדיולוגי' }, { id: docId(), name: 'ניטור לחץ דם', description: 'ניטור לחץ דם אמבולטורי', priority: 'optional', whereToGet: 'מכון קרדיולוגי' }] },
    { name: 'הפרעות קצב', docs: [commonDocs.claimForm(), commonDocs.medSummary('קרדיולוג'), { id: docId(), name: 'הולטר 24 שעות', description: 'ניטור רציף של קצב הלב', priority: 'required', whereToGet: 'מכון קרדיולוגי' }, commonDocs.drugList(), { id: docId(), name: 'אקו לב', description: 'בדיקת מבנה ותפקוד הלב', priority: 'recommended', whereToGet: 'מכון קרדיולוגי' }] },
  ];
  nakutDiagnoses.forEach((d, i) => groups.push({ id: `nak-${i}`, name: d.name, domain: 'נכות', documents: d.docs }));

  // =================== נכות מעבודה (20) ===================
  const workDiagnoses: Array<{ name: string; docs: DocumentItem[] }> = [
    { name: 'פגיעת גב תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('עמוד שדרה'), commonDocs.erReport(), commonDocs.drugList(), { id: docId(), name: 'טופס BL/250', description: 'טופס הודעה על פגיעה בעבודה', priority: 'required', whereToGet: 'סניף ביטוח לאומי', tip: 'חתימת המעסיק על הטופס היא חובה', aiRating: 5 }, commonDocs.mri('עמוד שדרה')] },
    { name: 'תסמונת התעלה הקרפלית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), { id: docId(), name: 'בדיקת EMG/NCV', description: 'בדיקת הולכה עצבית של כף יד', priority: 'required', whereToGet: 'מכון נוירולוגי', aiRating: 5 }, commonDocs.drugList(), { id: docId(), name: 'אישור מעסיק על תפקיד', description: 'אישור על אופי העבודה ותנועות חוזרניות', priority: 'required', whereToGet: 'מחלקת משאבי אנוש' }, commonDocs.surgeryReport()] },
    { name: 'ליקוי שמיעה תעסוקתי', docs: [commonDocs.claimForm(), { id: docId(), name: 'אודיוגרם עדכני', description: 'בדיקת שמיעה מלאה', priority: 'required', whereToGet: 'מכון שמיעה', tip: 'הבדיקה צריכה להיות לאחר 16 שעות ללא חשיפה לרעש', aiRating: 5 }, commonDocs.medSummary('רופא אא"ג'), { id: docId(), name: 'אישור חשיפה לרעש', description: 'אישור מעסיק על חשיפה לרעש בעבודה', priority: 'required', whereToGet: 'מעסיק / ממונה בטיחות' }, { id: docId(), name: 'בדיקת BERA', description: 'בדיקת תגובת גזע המוח', priority: 'recommended', whereToGet: 'בית חולים' }] },
    { name: 'פגיעת כתף תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('כתף'), commonDocs.mri('כתף'), commonDocs.erReport(), commonDocs.drugList()] },
    { name: 'שבר תעסוקתי', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.xray('רנטגן'), commonDocs.medSummary('אורתופד'), { id: docId(), name: 'דוח תאונה', description: 'תיעוד נסיבות התאונה', priority: 'required', whereToGet: 'מעסיק / ממונה בטיחות' }] },
    { name: 'כוויות תעסוקתיות', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.medSummary('כירורג פלסטי'), { id: docId(), name: 'תמונות פגיעה', description: 'תיעוד ויזואלי של הכוויות', priority: 'recommended', whereToGet: 'צילום עצמי או מהרופא' }, { id: docId(), name: 'דוח תאונה', description: 'פרוטוקול תאונת עבודה', priority: 'required', whereToGet: 'מעסיק' }] },
    { name: 'מחלת עור תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('דרמטולוג'), { id: docId(), name: 'בדיקת אלרגיה', description: 'בדיקת Patch test', priority: 'recommended', whereToGet: 'מרפאת דרמטולוגיה' }, { id: docId(), name: 'אישור חשיפה לחומרים', description: 'אישור על חומרים בסביבת העבודה', priority: 'required', whereToGet: 'ממונה בטיחות במקום העבודה' }, commonDocs.drugList()] },
    { name: 'אסתמה תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא ריאות'), { id: docId(), name: 'ספירומטריה', description: 'בדיקת תפקודי ריאות', priority: 'required', whereToGet: 'מכון ריאות', aiRating: 5 }, { id: docId(), name: 'אישור חשיפה תעסוקתית', description: 'אישור חשיפה לגורמים נשימתיים', priority: 'required', whereToGet: 'ממונה בטיחות' }, commonDocs.drugList()] },
    { name: 'פגיעת ברך תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('ברך'), commonDocs.mri('ברך'), commonDocs.erReport(), commonDocs.drugList()] },
    { name: 'פגיעת עין תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא עיניים'), { id: docId(), name: 'בדיקת חדות ראייה', description: 'בדיקה עם ובלי משקפיים', priority: 'required', whereToGet: 'רופא עיניים' }, commonDocs.erReport(), { id: docId(), name: 'דוח תאונה', description: 'תיעוד נסיבות הפגיעה', priority: 'required', whereToGet: 'מעסיק' }] },
    { name: 'הרעלה תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא פנימי'), commonDocs.bloodTests(), { id: docId(), name: 'בדיקת רמת חומר מרעיל', description: 'בדיקת רמות החומר המרעיל בדם/שתן', priority: 'required', whereToGet: 'מעבדה מיוחדת בהפניית רופא' }, { id: docId(), name: 'אישור חשיפה', description: 'אישור חשיפה לחומרים מסוכנים', priority: 'required', whereToGet: 'ממונה בטיחות' }] },
    { name: 'לחץ נפשי תעסוקתי', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), { id: docId(), name: 'תיעוד אירועים בעבודה', description: 'תיעוד אירועים חריגים בעבודה', priority: 'required', whereToGet: 'מעסיק / עמיתים' }, commonDocs.socialReport()] },
    { name: 'פריצת דיסק תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.mri('עמוד שדרה'), { id: docId(), name: 'בדיקת EMG', description: 'בדיקת הולכה עצבית', priority: 'recommended', whereToGet: 'מכון נוירולוגי' }, commonDocs.drugList(), commonDocs.surgeryReport()] },
    { name: 'דלקת גידים תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), { id: docId(), name: 'אולטרסאונד גידים', description: 'הדמיית גידים ורקמות רכות', priority: 'recommended', whereToGet: 'מכון הדמיה' }, commonDocs.drugList(), { id: docId(), name: 'אישור תפקיד מעסיק', description: 'תיאור תפקיד ותנועות חוזרניות', priority: 'required', whereToGet: 'משאבי אנוש' }] },
    { name: 'פגיעת ראש תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.ct('ראש'), commonDocs.medSummary('נוירולוג'), commonDocs.drugList(), { id: docId(), name: 'אבחון נוירופסיכולוגי', description: 'מיפוי קוגניטיבי מקיף', priority: 'recommended', whereToGet: 'מכון נוירופסיכולוגי' }] },
    { name: 'שחפת תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא ריאות'), { id: docId(), name: 'צילום חזה', description: 'צילום רנטגן חזה', priority: 'required', whereToGet: 'מחלקת הדמיה' }, commonDocs.bloodTests(), { id: docId(), name: 'בדיקת כיח', description: 'בדיקת כיח לשחפת', priority: 'required', whereToGet: 'מעבדת בית חולים' }] },
    { name: 'סרטן תעסוקתי', docs: [commonDocs.claimForm(), commonDocs.medSummary('אונקולוג'), { id: docId(), name: 'פתולוגיה', description: 'תוצאות ביופסיה/פתולוגיה', priority: 'required', whereToGet: 'מכון פתולוגי', aiRating: 5 }, { id: docId(), name: 'אישור חשיפה לחומרים מסרטנים', description: 'תיעוד חשיפה לגורם מסרטן', priority: 'required', whereToGet: 'ממונה בטיחות / היגיינה תעסוקתית' }, commonDocs.drugList()] },
    { name: 'פגיעת גפה עליונה', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('גפה עליונה'), commonDocs.erReport(), commonDocs.drugList()] },
    { name: 'פגיעת גפה תחתונה', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('גפה תחתונה'), commonDocs.erReport(), commonDocs.drugList()] },
    { name: 'מחלת ריאות תעסוקתית', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא ריאות'), { id: docId(), name: 'ספירומטריה', description: 'בדיקת תפקודי ריאות', priority: 'required', whereToGet: 'מכון ריאות' }, commonDocs.ct('חזה'), { id: docId(), name: 'אישור חשיפה', description: 'אישור חשיפה לגורמי ריאות', priority: 'required', whereToGet: 'ממונה בטיחות' }] },
  ];
  workDiagnoses.forEach((d, i) => groups.push({ id: `work-${i}`, name: d.name, domain: 'נכות מעבודה', documents: d.docs }));

  // =================== נפגעי פעולות איבה (20) ===================
  const hostileDiagnoses: Array<{ name: string; docs: DocumentItem[] }> = [
    { name: 'פגיעת ראש טראומטית', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.ct('ראש'), commonDocs.medSummary('נוירולוג'), { id: docId(), name: 'אבחון נוירופסיכולוגי', description: 'מיפוי קוגניטיבי מקיף', priority: 'required', whereToGet: 'מכון נוירופסיכולוגי', aiRating: 5 }, commonDocs.drugList(), { id: docId(), name: 'אישור אירוע', description: 'אישור רשמי על אירוע האיבה', priority: 'required', whereToGet: 'משטרה / צבא / רשות מוסמכת' }] },
    { name: 'PTSD מאירוע איבה', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), { id: docId(), name: 'תיעוד אירוע', description: 'אישור רשמי על השתתפות/נוכחות באירוע', priority: 'required', whereToGet: 'משטרה / צבא', aiRating: 5 }, { id: docId(), name: 'אבחון פסיכולוגי', description: 'אבחון PTSD מלא', priority: 'required', whereToGet: 'פסיכולוג קליני' }, commonDocs.hospitalSummary()] },
    { name: 'פגיעת גפיים מפיצוץ', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.xray('גפיים'), commonDocs.medSummary('אורתופד'), commonDocs.surgeryReport(), { id: docId(), name: 'אישור אירוע', description: 'אישור רשמי', priority: 'required', whereToGet: 'רשות מוסמכת' }] },
    { name: 'כוויות מאירוע איבה', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.medSummary('כירורג פלסטי'), { id: docId(), name: 'תמונות פגיעה', description: 'תיעוד ויזואלי', priority: 'recommended', whereToGet: 'צילום מהרופא' }, { id: docId(), name: 'אישור אירוע', description: 'אישור רשמי', priority: 'required', whereToGet: 'רשות מוסמכת' }] },
    { name: 'פגיעת עמוד שדרה', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.mri('עמוד שדרה'), commonDocs.medSummary('אורתופד'), commonDocs.medSummary('נוירולוג'), commonDocs.drugList()] },
    { name: 'פגיעת חזה', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.ct('חזה'), commonDocs.medSummary('כירורג'), commonDocs.drugList()] },
    { name: 'פגיעת בטן', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.ct('בטן'), commonDocs.medSummary('כירורג'), commonDocs.surgeryReport()] },
    { name: 'אובדן שמיעה מפיצוץ', docs: [commonDocs.claimForm(), { id: docId(), name: 'אודיוגרם', description: 'בדיקת שמיעה מלאה', priority: 'required', whereToGet: 'מכון שמיעה', aiRating: 5 }, commonDocs.medSummary('רופא אא"ג'), { id: docId(), name: 'אישור אירוע', description: 'אישור רשמי', priority: 'required', whereToGet: 'רשות מוסמכת' }, { id: docId(), name: 'בדיקת BERA', description: 'בדיקה אובייקטיבית של השמיעה', priority: 'recommended', whereToGet: 'בית חולים' }] },
    { name: 'פגיעת עיניים מרסיס', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.medSummary('רופא עיניים'), { id: docId(), name: 'בדיקת שדה ראייה', description: 'מיפוי שדה ראייה', priority: 'required', whereToGet: 'רופא עיניים' }, { id: docId(), name: 'אישור אירוע', description: 'אישור רשמי', priority: 'required', whereToGet: 'רשות מוסמכת' }] },
    { name: 'שברים מרובים', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.xray('כלל הגוף'), commonDocs.medSummary('אורתופד'), commonDocs.surgeryReport(), commonDocs.drugList()] },
    { name: 'פגיעת פנים', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.medSummary('כירורג פלסטי'), commonDocs.ct('פנים'), { id: docId(), name: 'תמונות לפני ואחרי', description: 'תיעוד ויזואלי', priority: 'recommended', whereToGet: 'צילום' }] },
    { name: 'פגיעה נוירולוגית', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.medSummary('נוירולוג'), commonDocs.mri('מוח'), { id: docId(), name: 'EMG', description: 'בדיקת הולכה עצבית', priority: 'recommended', whereToGet: 'מכון נוירולוגי' }, commonDocs.drugList()] },
    { name: 'חרדה מאירוע', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), { id: docId(), name: 'תיעוד אירוע', description: 'אישור רשמי על האירוע', priority: 'required', whereToGet: 'רשות מוסמכת' }, commonDocs.socialReport()] },
    { name: 'פגיעת כלי דם', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.medSummary('כירורג כלי דם'), { id: docId(), name: 'דופלר כלי דם', description: 'בדיקת זרימת דם', priority: 'required', whereToGet: 'מכון הדמיה' }, commonDocs.drugList()] },
    { name: 'פגיעת עצבים היקפיים', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), { id: docId(), name: 'EMG/NCV', description: 'בדיקת הולכה עצבית', priority: 'required', whereToGet: 'מכון נוירולוגי' }, commonDocs.drugList(), commonDocs.surgeryReport()] },
    { name: 'פגיעת אגן', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.xray('אגן'), commonDocs.ct('אגן'), commonDocs.medSummary('אורתופד')] },
    { name: 'פגיעה רב-מערכתית', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.medSummary('רופא פנימי'), commonDocs.medSummary('אורתופד'), commonDocs.medSummary('נוירולוג'), commonDocs.drugList(), commonDocs.hospitalSummary()] },
    { name: 'הלם קרב', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), { id: docId(), name: 'אישור שירות קרבי', description: 'אישור על שירות קרבי', priority: 'required', whereToGet: 'צה"ל / משרד הביטחון' }, commonDocs.drugList(), { id: docId(), name: 'אבחון PTSD', description: 'אבחון מקיף', priority: 'required', whereToGet: 'פסיכולוג קליני' }] },
    { name: 'פגיעת ריאות מאירוע', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.medSummary('רופא ריאות'), { id: docId(), name: 'ספירומטריה', description: 'בדיקת תפקודי ריאות', priority: 'required', whereToGet: 'מכון ריאות' }, commonDocs.ct('חזה')] },
    { name: 'פגיעת שלד ושרירים', docs: [commonDocs.claimForm(), commonDocs.erReport(), commonDocs.medSummary('אורתופד'), commonDocs.xray('רנטגן'), commonDocs.drugList(), commonDocs.funcReport()] },
  ];
  hostileDiagnoses.forEach((d, i) => groups.push({ id: `host-${i}`, name: d.name, domain: 'נפגעי פעולות איבה', documents: d.docs }));

  // =================== ילד נכה (20) ===================
  const childDiagnoses: Array<{ name: string; docs: DocumentItem[] }> = [
    { name: 'אוטיזם', docs: [commonDocs.claimForm(), { id: docId(), name: 'אבחון התפתחותי', description: 'אבחון מלא ממכון התפתחות הילד', priority: 'required', whereToGet: 'מכון התפתחות הילד', aiRating: 5 }, commonDocs.medSummary('נוירולוג ילדים'), { id: docId(), name: 'דוח גן/בית ספר', description: 'דוח תפקוד מהמסגרת החינוכית', priority: 'required', whereToGet: 'גננת / מחנך כיתה' }, commonDocs.socialReport(), { id: docId(), name: 'דוח קלינאית תקשורת', description: 'הערכת שפה ותקשורת', priority: 'recommended', whereToGet: 'קלינאית תקשורת' }] },
    { name: 'ADHD', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג ילדים'), { id: docId(), name: 'אבחון דידקטי', description: 'אבחון לקויות למידה וקשב', priority: 'required', whereToGet: 'מכון אבחון דידקטי' }, { id: docId(), name: 'שאלוני הורים ומורים', description: 'שאלוני Conners או BRIEF', priority: 'required', whereToGet: 'הנוירולוג ימסור' }, commonDocs.drugList()] },
    { name: 'שיתוק מוחין', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג ילדים'), commonDocs.mri('מוח'), { id: docId(), name: 'דוח פיזיותרפיה', description: 'הערכה מוטורית', priority: 'required', whereToGet: 'פיזיותרפיסט ילדים' }, commonDocs.funcReport(), commonDocs.drugList()] },
    { name: 'תסמונת דאון', docs: [commonDocs.claimForm(), { id: docId(), name: 'בדיקה גנטית', description: 'אישור קריוטיפ', priority: 'required', whereToGet: 'מכון גנטי' }, commonDocs.medSummary('רופא ילדים'), { id: docId(), name: 'דוח התפתחותי', description: 'הערכה התפתחותית מקיפה', priority: 'required', whereToGet: 'מכון התפתחות הילד' }, commonDocs.funcReport()] },
    { name: 'לקות למידה', docs: [commonDocs.claimForm(), { id: docId(), name: 'אבחון דידקטי מלא', description: 'אבחון מקיף של לקויות למידה', priority: 'required', whereToGet: 'מכון אבחון', aiRating: 5 }, { id: docId(), name: 'אבחון פסיכולוגי', description: 'הערכה קוגניטיבית ורגשית', priority: 'required', whereToGet: 'פסיכולוג חינוכי' }, { id: docId(), name: 'דוח בית ספר', description: 'דוח תפקוד מהמחנך', priority: 'required', whereToGet: 'בית ספר' }, commonDocs.medSummary('נוירולוג ילדים')] },
    { name: 'אפילפסיה בילדים', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג ילדים'), { id: docId(), name: 'EEG', description: 'בדיקת גלי מוח', priority: 'required', whereToGet: 'מעבדת EEG', aiRating: 5 }, commonDocs.drugList(), commonDocs.mri('מוח'), { id: docId(), name: 'יומן התקפים', description: 'תיעוד התקפים', priority: 'recommended', whereToGet: 'מילוי ע"י ההורים' }] },
    { name: 'מחלת לב מולדת', docs: [commonDocs.claimForm(), commonDocs.medSummary('קרדיולוג ילדים'), { id: docId(), name: 'אקו לב', description: 'בדיקת אקו-קרדיוגרפיה', priority: 'required', whereToGet: 'מכון קרדיולוגי ילדים' }, commonDocs.drugList(), commonDocs.surgeryReport()] },
    { name: 'סוכרת נעורים', docs: [commonDocs.claimForm(), commonDocs.medSummary('אנדוקרינולוג ילדים'), { id: docId(), name: 'HbA1c', description: 'ממוצע סוכר', priority: 'required', whereToGet: 'מעבדה', aiRating: 5 }, commonDocs.drugList(), { id: docId(), name: 'יומן סוכר', description: 'מדידות יומיות', priority: 'recommended', whereToGet: 'מדידה עצמית' }] },
    { name: 'אסתמה בילדים', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא ריאות ילדים'), { id: docId(), name: 'ספירומטריה', description: 'תפקודי ריאות', priority: 'required', whereToGet: 'מכון ריאות ילדים' }, commonDocs.drugList(), { id: docId(), name: 'יומן אסתמה', description: 'תיעוד התקפים', priority: 'recommended', whereToGet: 'מילוי עצמי' }] },
    { name: 'ליקוי שמיעה בילדים', docs: [commonDocs.claimForm(), { id: docId(), name: 'אודיוגרם', description: 'בדיקת שמיעה', priority: 'required', whereToGet: 'מכון שמיעה ילדים', aiRating: 5 }, commonDocs.medSummary('רופא אא"ג'), { id: docId(), name: 'דוח קלינאית תקשורת', description: 'הערכת שפה', priority: 'required', whereToGet: 'קלינאית תקשורת' }, { id: docId(), name: 'התאמת מכשיר שמיעה', description: 'דוח התאמת מכשיר', priority: 'recommended', whereToGet: 'אודיולוג' }] },
    { name: 'ליקוי ראייה בילדים', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא עיניים'), { id: docId(), name: 'בדיקת חדות ראייה', description: 'בדיקה עם ובלי משקפיים', priority: 'required', whereToGet: 'רופא עיניים' }, { id: docId(), name: 'שדה ראייה', description: 'מיפוי שדה ראייה', priority: 'recommended', whereToGet: 'רופא עיניים' }] },
    { name: 'עיכוב התפתחותי', docs: [commonDocs.claimForm(), { id: docId(), name: 'אבחון התפתחותי', description: 'הערכה התפתחותית', priority: 'required', whereToGet: 'מכון התפתחות הילד' }, commonDocs.medSummary('רופא ילדים'), commonDocs.funcReport(), commonDocs.socialReport()] },
    { name: 'מחלה גנטית', docs: [commonDocs.claimForm(), { id: docId(), name: 'בדיקה גנטית', description: 'אישור אבחנה גנטית', priority: 'required', whereToGet: 'מכון גנטי', aiRating: 5 }, commonDocs.medSummary('גנטיקאי'), commonDocs.drugList(), commonDocs.funcReport()] },
    { name: 'מחלת כליות בילדים', docs: [commonDocs.claimForm(), commonDocs.medSummary('נפרולוג ילדים'), commonDocs.bloodTests(), { id: docId(), name: 'בדיקת שתן', description: 'בדיקת שתן', priority: 'required', whereToGet: 'מעבדה' }, commonDocs.drugList()] },
    { name: 'סרטן בילדים', docs: [commonDocs.claimForm(), commonDocs.medSummary('אונקולוג ילדים'), { id: docId(), name: 'פתולוגיה', description: 'תוצאות ביופסיה', priority: 'required', whereToGet: 'מכון פתולוגי', aiRating: 5 }, { id: docId(), name: 'תוכנית טיפול', description: 'תוכנית טיפול אונקולוגית', priority: 'required', whereToGet: 'רופא אונקולוג' }, commonDocs.drugList(), commonDocs.hospitalSummary()] },
    { name: 'הפרעה התנהגותית', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר ילדים'), { id: docId(), name: 'דוח מורה/גננת', description: 'דוח על התנהגות במסגרת', priority: 'required', whereToGet: 'מחנך כיתה / גננת' }, commonDocs.drugList(), commonDocs.socialReport()] },
    { name: 'מחלת ריאות כרונית בילדים', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא ריאות ילדים'), { id: docId(), name: 'ספירומטריה', description: 'תפקודי ריאות', priority: 'required', whereToGet: 'מכון ריאות' }, commonDocs.drugList(), commonDocs.ct('חזה')] },
    { name: 'הפרעת אכילה', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.bloodTests(), { id: docId(), name: 'דוח תזונאית', description: 'הערכה תזונתית', priority: 'recommended', whereToGet: 'דיאטנית קלינית' }, commonDocs.hospitalSummary()] },
    { name: 'פגות והשלכותיה', docs: [commonDocs.claimForm(), commonDocs.hospitalSummary(), commonDocs.medSummary('רופא ילדים'), commonDocs.funcReport(), { id: docId(), name: 'אבחון התפתחותי', description: 'הערכה התפתחותית', priority: 'required', whereToGet: 'מכון התפתחות הילד' }] },
    { name: 'דיסטרופיה שרירית', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג ילדים'), { id: docId(), name: 'בדיקת EMG', description: 'בדיקת שריר ועצב', priority: 'required', whereToGet: 'מכון נוירולוגי' }, { id: docId(), name: 'בדיקה גנטית', description: 'אישור אבחנה גנטית', priority: 'required', whereToGet: 'מכון גנטי' }, commonDocs.funcReport(), commonDocs.drugList()] },
  ];
  childDiagnoses.forEach((d, i) => groups.push({ id: `child-${i}`, name: d.name, domain: 'ילד נכה', documents: d.docs }));

  // =================== פטור ממס (20) ===================
  const taxDiagnoses: Array<{ name: string; docs: DocumentItem[] }> = [
    { name: 'נכות אורתופדית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('רנטגן'), commonDocs.drugList()] },
    { name: 'נכות נוירולוגית', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), commonDocs.mri('מוח'), commonDocs.drugList()] },
    { name: 'נכות פסיכיאטרית', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), commonDocs.socialReport()] },
    { name: 'נכות קרדיולוגית', docs: [commonDocs.claimForm(), commonDocs.medSummary('קרדיולוג'), { id: docId(), name: 'אקו לב', description: 'בדיקת תפקוד לב', priority: 'required', whereToGet: 'מכון קרדיולוגי' }, commonDocs.drugList()] },
    { name: 'נכות פנימית', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא פנימי'), commonDocs.bloodTests(), commonDocs.drugList()] },
    { name: 'נכות אונקולוגית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אונקולוג'), { id: docId(), name: 'פתולוגיה', description: 'תוצאות ביופסיה', priority: 'required', whereToGet: 'מכון פתולוגי' }, commonDocs.drugList()] },
    { name: 'נכות עיניים', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא עיניים'), { id: docId(), name: 'חדות ראייה', description: 'בדיקת חדות ראייה', priority: 'required', whereToGet: 'רופא עיניים' }, { id: docId(), name: 'שדה ראייה', description: 'מיפוי שדה ראייה', priority: 'recommended', whereToGet: 'רופא עיניים' }] },
    { name: 'נכות שמיעה', docs: [commonDocs.claimForm(), { id: docId(), name: 'אודיוגרם', description: 'בדיקת שמיעה', priority: 'required', whereToGet: 'מכון שמיעה' }, commonDocs.medSummary('רופא אא"ג')] },
    { name: 'נכות ריאות', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא ריאות'), { id: docId(), name: 'ספירומטריה', description: 'תפקודי ריאות', priority: 'required', whereToGet: 'מכון ריאות' }, commonDocs.drugList()] },
    { name: 'נכות אורולוגית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורולוג'), commonDocs.bloodTests(), commonDocs.drugList()] },
    { name: 'נכות גסטרואנטרולוגית', docs: [commonDocs.claimForm(), commonDocs.medSummary('גסטרואנטרולוג'), commonDocs.bloodTests(), commonDocs.drugList()] },
    { name: 'נכות אנדוקרינית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אנדוקרינולוג'), commonDocs.bloodTests(), commonDocs.drugList()] },
    { name: 'נכות ראומטולוגית', docs: [commonDocs.claimForm(), commonDocs.medSummary('ראומטולוג'), commonDocs.bloodTests(), commonDocs.drugList()] },
    { name: 'נכות דרמטולוגית', docs: [commonDocs.claimForm(), commonDocs.medSummary('דרמטולוג'), { id: docId(), name: 'תמונות פגיעה', description: 'תיעוד ויזואלי', priority: 'recommended', whereToGet: 'צילום' }, commonDocs.drugList()] },
    { name: 'נכות המטולוגית', docs: [commonDocs.claimForm(), commonDocs.medSummary('המטולוג'), commonDocs.bloodTests(), commonDocs.drugList()] },
    { name: 'כאב כרוני', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא כאב'), commonDocs.drugList(), commonDocs.funcReport()] },
    { name: 'פיברומיאלגיה', docs: [commonDocs.claimForm(), commonDocs.medSummary('ראומטולוג'), commonDocs.drugList(), commonDocs.funcReport(), commonDocs.socialReport()] },
    { name: 'טרשת נפוצה', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), commonDocs.mri('מוח'), commonDocs.drugList(), commonDocs.funcReport()] },
    { name: 'פרקינסון', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), commonDocs.drugList(), commonDocs.funcReport()] },
    { name: 'שבץ מוחי', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), commonDocs.ct('ראש'), commonDocs.drugList(), commonDocs.hospitalSummary(), commonDocs.funcReport()] },
  ];
  taxDiagnoses.forEach((d, i) => groups.push({ id: `tax-${i}`, name: d.name, domain: 'פטור ממס', documents: d.docs }));

  // =================== מס הכנסה ===================
  const incomeTaxDiagnoses: Array<{ name: string; docs: DocumentItem[] }> = [
    { name: 'כאבי גב כרוניים', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('עמוד שדרה'), commonDocs.drugList()] },
    { name: 'מחלת לב', docs: [commonDocs.claimForm(), commonDocs.medSummary('קרדיולוג'), { id: docId(), name: 'אקו לב', description: 'בדיקת תפקוד לב', priority: 'required', whereToGet: 'מכון קרדיולוגי' }, commonDocs.drugList()] },
    { name: 'סוכרת מסוג 2', docs: [commonDocs.claimForm(), commonDocs.medSummary('אנדוקרינולוג'), { id: docId(), name: 'HbA1c', description: 'ממוצע סוכר', priority: 'required', whereToGet: 'מעבדה' }, commonDocs.drugList()] },
    { name: 'דיכאון קליני', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), commonDocs.socialReport()] },
    { name: 'COPD', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא ריאות'), { id: docId(), name: 'ספירומטריה', description: 'בדיקת תפקודי ריאות', priority: 'required', whereToGet: 'מכון ריאות' }, commonDocs.drugList()] },
  ];
  incomeTaxDiagnoses.forEach((d, i) => groups.push({ id: `inc-${i}`, name: d.name, domain: 'מס הכנסה', documents: d.docs }));

  const moreIncomeTax: Array<{ name: string; docs: DocumentItem[] }> = [
    { name: 'אסתמה כרונית', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא ריאות'), { id: docId(), name: 'ספירומטריה', description: 'תפקודי ריאות', priority: 'required', whereToGet: 'מכון ריאות' }, commonDocs.drugList()] },
    { name: 'נכות אורתופדית כללית', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), commonDocs.xray('רנטגן'), commonDocs.drugList()] },
    { name: 'ליקוי שמיעה', docs: [commonDocs.claimForm(), { id: docId(), name: 'אודיוגרם', description: 'בדיקת שמיעה', priority: 'required', whereToGet: 'מכון שמיעה' }, commonDocs.medSummary('רופא אא"ג')] },
    { name: 'ליקוי ראייה', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא עיניים'), { id: docId(), name: 'חדות ראייה', description: 'בדיקת חדות ראייה', priority: 'required', whereToGet: 'רופא עיניים' }] },
    { name: 'מחלת כליות כרונית', docs: [commonDocs.claimForm(), commonDocs.medSummary('נפרולוג'), commonDocs.bloodTests(), commonDocs.drugList()] },
    { name: 'מחלת כבד כרונית', docs: [commonDocs.claimForm(), commonDocs.medSummary('גסטרואנטרולוג'), commonDocs.bloodTests(), commonDocs.drugList()] },
    { name: 'סרטן', docs: [commonDocs.claimForm(), commonDocs.medSummary('אונקולוג'), { id: docId(), name: 'פתולוגיה', description: 'תוצאות ביופסיה', priority: 'required', whereToGet: 'מכון פתולוגי' }, commonDocs.drugList()] },
    { name: 'חרדה כללית', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList()] },
    { name: 'סכיזופרניה', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), commonDocs.hospitalSummary(), commonDocs.socialReport()] },
    { name: 'הפרעה דו-קוטבית', docs: [commonDocs.claimForm(), commonDocs.medSummary('פסיכיאטר'), commonDocs.drugList(), commonDocs.hospitalSummary()] },
    { name: 'נוירופתיה', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), { id: docId(), name: 'EMG/NCV', description: 'בדיקת הולכה עצבית', priority: 'required', whereToGet: 'מכון נוירולוגי' }, commonDocs.drugList()] },
    { name: 'אורולוגיה-נוירולוגיה', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורולוג'), commonDocs.medSummary('נוירולוג'), commonDocs.drugList()] },
    { name: 'כירורגיה כללי', docs: [commonDocs.claimForm(), commonDocs.medSummary('כירורג'), commonDocs.surgeryReport(), commonDocs.drugList()] },
    { name: 'אף-אוזן-גרון כללי', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא אא"ג'), commonDocs.drugList()] },
    { name: 'שחפת', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא ריאות'), { id: docId(), name: 'צילום חזה', description: 'צילום רנטגן חזה', priority: 'required', whereToGet: 'מחלקת הדמיה' }, commonDocs.bloodTests()] },
  ];
  moreIncomeTax.forEach((d, i) => groups.push({ id: `inc2-${i}`, name: d.name, domain: 'מס הכנסה', documents: d.docs }));

  // =================== שירותים מיוחדים ===================
  const specialDiagnoses: Array<{ name: string; docs: DocumentItem[] }> = [
    { name: 'קטוע גפיים', docs: [commonDocs.claimForm(), commonDocs.medSummary('אורתופד'), { id: docId(), name: 'אישור קטיעה', description: 'אישור רפואי על קטיעה', priority: 'required', whereToGet: 'בית חולים' }, commonDocs.funcReport(), commonDocs.drugList()] },
    { name: 'משותק', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), commonDocs.mri('עמוד שדרה'), commonDocs.funcReport(), commonDocs.drugList()] },
    { name: 'עיוור', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא עיניים'), { id: docId(), name: 'חדות ראייה', description: 'בדיקת חדות ראייה', priority: 'required', whereToGet: 'רופא עיניים' }, { id: docId(), name: 'שדה ראייה', description: 'מיפוי שדה ראייה', priority: 'required', whereToGet: 'רופא עיניים' }, commonDocs.funcReport()] },
    { name: 'חירש', docs: [commonDocs.claimForm(), { id: docId(), name: 'אודיוגרם', description: 'בדיקת שמיעה', priority: 'required', whereToGet: 'מכון שמיעה' }, commonDocs.medSummary('רופא אא"ג'), commonDocs.funcReport()] },
    { name: 'תלות מוחלטת', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא פנימי'), commonDocs.funcReport(), commonDocs.socialReport(), commonDocs.drugList()] },
  ];
  specialDiagnoses.forEach((d, i) => groups.push({ id: `spec-${i}`, name: d.name, domain: 'שירותים מיוחדים', documents: d.docs }));

  const moreSpecial: Array<{ name: string; docs: DocumentItem[] }> = [
    { name: 'דמנציה', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), { id: docId(), name: 'אבחון קוגניטיבי', description: 'הערכה קוגניטיבית (MMSE/MoCA)', priority: 'required', whereToGet: 'מכון נוירופסיכולוגי' }, commonDocs.funcReport(), commonDocs.socialReport()] },
    { name: 'ALS', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), { id: docId(), name: 'EMG', description: 'בדיקת שריר ועצב', priority: 'required', whereToGet: 'מכון נוירולוגי' }, commonDocs.funcReport(), commonDocs.drugList()] },
    { name: 'טטרפלגיה', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), commonDocs.mri('עמוד שדרה'), commonDocs.funcReport(), commonDocs.socialReport()] },
    { name: 'מחלה ניוונית', docs: [commonDocs.claimForm(), commonDocs.medSummary('נוירולוג'), commonDocs.drugList(), commonDocs.funcReport()] },
    { name: 'סיעוד מורכב', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא פנימי'), commonDocs.funcReport(), commonDocs.socialReport(), commonDocs.drugList(), commonDocs.hospitalSummary()] },
    { name: 'סרטן שד', docs: [commonDocs.claimForm(), commonDocs.medSummary('אונקולוג'), { id: docId(), name: 'פתולוגיה', description: 'תוצאות ביופסיה', priority: 'required', whereToGet: 'מכון פתולוגי', aiRating: 5 }, { id: docId(), name: 'ממוגרפיה', description: 'ממוגרפיה עדכנית', priority: 'required', whereToGet: 'מכון הדמיה' }, commonDocs.drugList(), commonDocs.surgeryReport()] },
    { name: 'דום נשימה בשינה', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא אא"ג'), { id: docId(), name: 'בדיקת שינה', description: 'פוליסומנוגרפיה', priority: 'required', whereToGet: 'מעבדת שינה בבית חולים' }, commonDocs.drugList()] },
    { name: 'ירוד', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא עיניים'), { id: docId(), name: 'חדות ראייה', description: 'בדיקת חדות ראייה', priority: 'required', whereToGet: 'רופא עיניים' }, commonDocs.surgeryReport()] },
    { name: 'גלאוקומה', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא עיניים'), { id: docId(), name: 'לחץ תוך עיני', description: 'מדידת לחץ בעין', priority: 'required', whereToGet: 'רופא עיניים' }, { id: docId(), name: 'שדה ראייה', description: 'מיפוי שדה ראייה', priority: 'required', whereToGet: 'רופא עיניים' }, { id: docId(), name: 'OCT', description: 'סריקת רשתית', priority: 'recommended', whereToGet: 'רופא עיניים' }] },
    { name: 'ניוון מקולרי', docs: [commonDocs.claimForm(), commonDocs.medSummary('רופא עיניים'), { id: docId(), name: 'OCT', description: 'סריקת רשתית', priority: 'required', whereToGet: 'רופא עיניים' }, { id: docId(), name: 'חדות ראייה', description: 'בדיקת חדות ראייה', priority: 'required', whereToGet: 'רופא עיניים' }] },
  ];
  moreSpecial.forEach((d, i) => groups.push({ id: `spec2-${i}`, name: d.name, domain: 'שירותים מיוחדים', documents: d.docs }));

  return groups;
};

export const diagnosisGroups: DiagnosisGroup[] = createDiagnosisGroups();

export const getTotalDocRecords = () => diagnosisGroups.reduce((sum, g) => sum + g.documents.length, 0);
export const getAI5Records = () => diagnosisGroups.reduce((sum, g) => sum + g.documents.filter(d => d.aiRating === 5).length, 0);
export const getDocsByDomain = () => {
  const map: Record<string, number> = {};
  diagnosisGroups.forEach(g => {
    map[g.domain] = (map[g.domain] || 0) + g.documents.length;
  });
  return Object.entries(map).map(([domain, count]) => ({ domain, count })).sort((a, b) => b.count - a.count);
};
export const getTop15Diagnoses = () => {
  return [...diagnosisGroups]
    .sort((a, b) => b.documents.length - a.documents.length)
    .slice(0, 15)
    .map(g => ({ name: g.name, count: g.documents.length }));
};
export const getMVPDiagnoses = () => {
  const mvpNames = ['כאבי גב', 'מחלת לב איסכמית', 'תסמונת התעלה הקרפלית', 'סוכרת', 'COPD'];
  return diagnosisGroups.filter(g => mvpNames.includes(g.name));
};

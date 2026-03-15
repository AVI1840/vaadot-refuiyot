import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getMVPDiagnoses, getTotalDocRecords, getAI5Records, diagnosisGroups } from '@/data/diagnoses';

export default function AboutTab() {
  const mvp = getMVPDiagnoses();
  const totalRecords = getTotalDocRecords();
  const ai5Count = getAI5Records();
  const totalGroups = diagnosisGroups.length;
  const domains = [...new Set(diagnosisGroups.map(g => g.domain))];

  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-extrabold text-primary">🏥 צ׳קליסט מסמכים חכם לוועדות רפואיות</h2>
        <p className="text-muted-foreground text-lg">שקיפות לאזרח. יעילות למערכת. מוכנות לוועדה.</p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge className="bg-secondary text-secondary-foreground">POC — אב טיפוס</Badge>
          <Badge className="bg-accent text-accent-foreground">מבוסס ניתוח נתונים</Badge>
          <Badge variant="outline">מרץ 2026</Badge>
        </div>
      </div>

      {/* Problem → Need → Solution → Value */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="border-r-4 border-r-destructive">
          <CardContent className="p-5 space-y-2">
            <div className="text-2xl">🔴</div>
            <h3 className="font-bold text-lg text-destructive">הבעיה</h3>
            <p className="text-sm leading-relaxed">
              אזרחים מגיעים לוועדות רפואיות בלי מספיק מסמכים.
              התוצאה: דחיות, ועדות חוזרות, עיכובים ותסכול — גם לאזרח וגם למערכת.
              אין כלי אחיד שמגדיר מה בדיוק צריך להביא לכל אבחנה.
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-warning">
          <CardContent className="p-5 space-y-2">
            <div className="text-2xl">🟡</div>
            <h3 className="font-bold text-lg text-warning">הצורך</h3>
            <p className="text-sm leading-relaxed">
              רשימה ברורה ומותאמת לכל אבחנה — מה חובה, מה מומלץ, ומה אופציונלי.
              שקיפות מלאה לאזרח, ובמקביל כלי לפקיד לבדוק מוכנות התיק לפני כינוס ועדה.
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-success">
          <CardContent className="p-5 space-y-2">
            <div className="text-2xl">🟢</div>
            <h3 className="font-bold text-lg text-success">הפתרון</h3>
            <p className="text-sm leading-relaxed">
              צ׳קליסט חכם המבוסס על ניתוח נתוני אבחנה-מסמך מרופאי הוועדות.
              האזרח בוחר אבחנה ומקבל רשימה מדורגת (חובה 🔴 / מומלץ 🟡 / אופציונלי 🔵).
              המערכת מחשבת ציון מוכנות (1-10) — מ-5 ומעלה ניתן לכנס ועדה.
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-secondary">
          <CardContent className="p-5 space-y-2">
            <div className="text-2xl">💎</div>
            <h3 className="font-bold text-lg text-secondary">הערך</h3>
            <p className="text-sm leading-relaxed">
              צמצום ועדות חוזרות ודחיות. קיצור זמני המתנה.
              שיפור חוויית האזרח — שקיפות ובהירות.
              אפשרות לאישור מהיר תוך יום לאבחנות שמזכות ב-~80% מהמקרים.
              בסיס לשילוב OCR אוטומטי בעתיד.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fast-track concept */}
      <Card className="border-2 border-accent/40 bg-accent/5">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-accent">⚡ מסלול מהיר — אישור תוך יום</h3>
          <p className="text-sm leading-relaxed">
            ניתוח הנתונים מראה שיש אבחנות שמזכות בכ-80% מהמקרים.
            עבור אבחנות אלו, כשכל מסמכי החובה נמצאים בתיק (ציון מוכנות גבוה),
            ניתן לייצר מסלול מקוצר — אישור ועדה תוך יום עבודה אחד.
          </p>
          <p className="text-sm leading-relaxed">
            זה חוסך זמן לאזרח, לפקיד ולרופא — ומפנה משאבים לטיפול בתיקים מורכבים יותר.
          </p>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-lg text-primary">⚙️ איך זה עובד</h3>
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-3xl mb-2">1️⃣</div>
              <div className="font-bold">בחירת בעיה</div>
              <p className="text-sm text-muted-foreground mt-1">האזרח מציין את הבעיה הרפואית ובוחר אבחנה</p>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-3xl mb-2">2️⃣</div>
              <div className="font-bold">צ׳קליסט מותאם</div>
              <p className="text-sm text-muted-foreground mt-1">רשימת מסמכים: חובה 🔴 מומלץ 🟡 אופציונלי 🔵</p>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-3xl mb-2">3️⃣</div>
              <div className="font-bold">ציון מוכנות</div>
              <p className="text-sm text-muted-foreground mt-1">ציון 1-10 — מ-5 ומעלה ניתן לכנס ועדה</p>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-3xl mb-2">4️⃣</div>
              <div className="font-bold">סיוע ממוקד</div>
              <p className="text-sm text-muted-foreground mt-1">הודעה לאזרח עם מסמכים חסרים + סיוע בהשלמה</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two tracks */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="border-2 border-secondary/30">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold text-lg">👤 מה האזרח מקבל</h3>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>רשימה ברורה — מה בדיוק צריך להביא</li>
              <li>הסבר פשוט על כל מסמך ואיפה להשיג אותו</li>
              <li>ציון מוכנות — לדעת אם מוכן לוועדה</li>
              <li>הודעה עם מסמכים חסרים (WhatsApp / מייל / הדפסה)</li>
              <li>ברגע ההגשה — נרשם ונכנס להכרה מתאריך ההגשה</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/30">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold text-lg">🏢 מה המערכת מקבלת</h3>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>ציון מוכנות לכל תיק (1-10)</li>
              <li>מ-5 ומעלה — ניתן לכנס ועדה</li>
              <li>זיהוי תיקים למסלול מהיר (אישור תוך יום)</li>
              <li>מעקב — איפה לסייע לאזרח בהשלמת מסמכים</li>
              <li>בעתיד: OCR אוטומטי לבדיקת מסמכים בתיק</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Data analysis section */}
      <Card className="bg-info/10 border-info/30">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-primary">📊 עבודת הניתוח שבוצעה</h3>
          <p className="text-sm leading-relaxed">
            בוצע ניתוח מעמיק של נתונים שהתקבלו מרופאי הוועדות הרפואיות.
            הנתונים כוללים קשרי אבחנה-מסמך ב-{domains.length} תחומי תביעה,
            עם דירוג חשיבות (AI 5/5) למסמכים קריטיים.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white rounded-lg px-4 py-2 border text-center">
              <div className="text-xl font-extrabold text-secondary">{totalRecords.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">רשומות אבחנה-מסמך</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border text-center">
              <div className="text-xl font-extrabold text-secondary">{totalGroups}+</div>
              <div className="text-xs text-muted-foreground">קבוצות אבחנות</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border text-center">
              <div className="text-xl font-extrabold text-secondary">{domains.length}</div>
              <div className="text-xs text-muted-foreground">תחומי תביעה</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border text-center">
              <div className="text-xl font-extrabold text-accent">{ai5Count}</div>
              <div className="text-xs text-muted-foreground">מסמכים קריטיים (AI 5/5)</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            הניתוח זיהה דפוסים ברורים: לכל אבחנה יש מסמכים שחוזרים כחובה ברוב המקרים.
            על בסיס זה נבנה הצ׳קליסט המדורג.
          </p>
        </CardContent>
      </Card>

      {/* MVP Diagnoses — expandable */}
      <Card className="border-2 border-secondary/30">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-lg text-primary">🎯 המלצה לפיילוט — 5 אבחנות מובילות</h3>
            <Badge className="bg-warning text-warning-foreground">נכות כללית + ילד נכה</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            על בסיס הניתוח, ממליצים להתחיל פיילוט ממוקד ב-5 אבחנות נפוצות.
            לחץ על כל אבחנה לצפייה ברשימת המסמכים הנדרשים:
          </p>

          <Accordion type="multiple" className="space-y-2">
            {mvp.map((group, idx) => {
              const required = group.documents.filter(d => d.priority === 'required');
              const recommended = group.documents.filter(d => d.priority === 'recommended');
              const optional = group.documents.filter(d => d.priority === 'optional');
              return (
                <AccordionItem key={group.id} value={group.id} className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="min-h-[44px] hover:no-underline">
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-lg font-bold">{idx + 1}.</span>
                      <div>
                        <span className="font-bold text-base">{group.name}</span>
                        <span className="text-xs text-muted-foreground mr-2">
                          ({group.domain} • {group.documents.length} מסמכים)
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-3">
                    {required.length > 0 && (
                      <div>
                        <div className="text-sm font-bold text-destructive mb-1">🔴 חובה ({required.length})</div>
                        <ul className="space-y-1">
                          {required.map(d => (
                            <li key={d.id} className="text-sm flex items-start gap-2 p-2 bg-destructive/5 rounded">
                              <span className="shrink-0">•</span>
                              <div>
                                <span className="font-semibold">{d.name}</span>
                                {d.aiRating && <Badge className="mr-1 text-[9px] bg-accent text-accent-foreground">AI {d.aiRating}/5</Badge>}
                                {d.description && <p className="text-xs text-muted-foreground">{d.description}</p>}
                                {d.whereToGet && <p className="text-xs text-tertiary">📍 {d.whereToGet}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {recommended.length > 0 && (
                      <div>
                        <div className="text-sm font-bold text-warning mb-1">🟡 מומלץ ({recommended.length})</div>
                        <ul className="space-y-1">
                          {recommended.map(d => (
                            <li key={d.id} className="text-sm flex items-start gap-2 p-2 bg-warning/5 rounded">
                              <span className="shrink-0">•</span>
                              <div>
                                <span className="font-semibold">{d.name}</span>
                                {d.description && <p className="text-xs text-muted-foreground">{d.description}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {optional.length > 0 && (
                      <div>
                        <div className="text-sm font-bold text-secondary mb-1">🔵 אופציונלי ({optional.length})</div>
                        <ul className="space-y-1">
                          {optional.map(d => (
                            <li key={d.id} className="text-sm flex items-start gap-2 p-2 bg-secondary/5 rounded">
                              <span className="shrink-0">•</span>
                              <span className="font-semibold">{d.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Pilot plan */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-primary">🚀 תכנית פיילוט</h3>
          <p className="text-sm text-muted-foreground mb-2">פיילוט ממוקד בנכות כללית וילד נכה — 5 אבחנות MVP</p>
          <div className="grid sm:grid-cols-4 gap-3">
            <div className="border rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-accent">שלב 1</div>
              <div className="text-sm font-semibold mt-1">POC</div>
              <p className="text-xs text-muted-foreground mt-1">ניתוח נתונים + אב טיפוס עם 5 אבחנות</p>
              <Badge className="mt-2 bg-success text-success-foreground">✓ הושלם</Badge>
            </div>
            <div className="border rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-accent">שלב 2</div>
              <div className="text-sm font-semibold mt-1">תיקוף</div>
              <p className="text-xs text-muted-foreground mt-1">בדיקה עם פקידים ורופאי ועדות — דיוק הנתונים</p>
              <Badge className="mt-2 bg-warning text-warning-foreground">הבא</Badge>
            </div>
            <div className="border rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-accent">שלב 3</div>
              <div className="text-sm font-semibold mt-1">פיילוט פנימי</div>
              <p className="text-xs text-muted-foreground mt-1">הרצה עם תיקים אמיתיים + מסלול מהיר</p>
              <Badge variant="outline" className="mt-2">עתידי</Badge>
            </div>
            <div className="border rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-accent">שלב 4</div>
              <div className="text-sm font-semibold mt-1">הפצה</div>
              <p className="text-xs text-muted-foreground mt-1">הנגשה לאזרחים + חיבור OCR + DWH</p>
              <Badge variant="outline" className="mt-2">עתידי</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit */}
      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        <p>אביעד יצחקי | מינהל גמלאות | ביטוח לאומי | מרץ 2026</p>
      </div>
    </div>
  );
}

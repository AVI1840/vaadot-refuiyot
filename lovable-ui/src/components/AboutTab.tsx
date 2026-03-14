import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function InfoTab() {
  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-extrabold text-primary">🏥 פרויקט DD — צ׳קליסט מסמכים חכם לוועדות רפואיות</h2>
        <p className="text-muted-foreground text-lg">שקיפות מלאה לאזרח. מוכנות מלאה לוועדה.</p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge className="bg-secondary text-secondary-foreground">POC — אב טיפוס</Badge>
          <Badge className="bg-accent text-accent-foreground">מבוסס מחקר נתונים</Badge>
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
              אזרחים מגיעים לוועדות רפואיות בביטוח לאומי ללא מסמכים מספיקים.
              התוצאה: דחיות, עיכובים, ועדות חוזרות, ותסכול — גם לאזרח וגם למערכת.
              אין כלי אחיד שמגדיר מה בדיוק נדרש לכל אבחנה ותחום תביעה.
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-warning">
          <CardContent className="p-5 space-y-2">
            <div className="text-2xl">🟡</div>
            <h3 className="font-bold text-lg text-warning">הצורך</h3>
            <p className="text-sm leading-relaxed">
              צ׳קליסט ברור ומותאם אישית לכל אבחנה — מה חובה להביא, מה מומלץ, ומה אופציונלי.
              שקיפות מלאה לאזרח על מה נדרש ממנו, ובמקביל — כלי לפקיד ולמערכת לבדוק רמת מוכנות לפני כינוס הוועדה.
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-success">
          <CardContent className="p-5 space-y-2">
            <div className="text-2xl">🟢</div>
            <h3 className="font-bold text-lg text-success">הפתרון</h3>
            <p className="text-sm leading-relaxed">
              מערכת צ׳קליסט חכמה המבוססת על ניתוח נתונים של קשרי אבחנה-מסמך שהתקבלו מרופאי הוועדות.
              האזרח בוחר תחום ואבחנה ומקבל רשימה מדורגת (חובה 🔴 / מומלץ 🟡 / אופציונלי 🔵).
              המערכת מחשבת ציון מוכנות (1-10) — מ-5 ומעלה ניתן לכנס ועדה.
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-secondary">
          <CardContent className="p-5 space-y-2">
            <div className="text-2xl">💎</div>
            <h3 className="font-bold text-lg text-secondary">הערך</h3>
            <p className="text-sm leading-relaxed">
              צמצום ועדות חוזרות ודחיות מיותרות. קיצור זמני המתנה.
              שיפור חוויית האזרח — שקיפות ובהירות.
              חיסכון בזמן פקיד ורופא. בסיס לשילוב OCR אוטומטי בעתיד.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-lg text-primary">⚙️ איך זה עובד</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-3xl mb-2">1️⃣</div>
              <div className="font-bold">האזרח בוחר</div>
              <p className="text-sm text-muted-foreground mt-1">סוג ועדה, תחום תביעה ואבחנה</p>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-3xl mb-2">2️⃣</div>
              <div className="font-bold">מקבל צ׳קליסט</div>
              <p className="text-sm text-muted-foreground mt-1">רשימת מסמכים מדורגת: חובה 🔴 מומלץ 🟡 אופציונלי 🔵</p>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-3xl mb-2">3️⃣</div>
              <div className="font-bold">ציון מוכנות</div>
              <p className="text-sm text-muted-foreground mt-1">ציון 1-10 — מ-5 ומעלה ניתן לכנס ועדה</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two tracks */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="border-2 border-secondary/30">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold text-lg">👤 מסלול האזרח</h3>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>בוחר סוג ועדה ואבחנה</li>
              <li>מקבל רשימת מסמכים ברורה עם הסברים</li>
              <li>מסמן מה הכין — רואה ציון מוכנות</li>
              <li>מקבל הודעה עם מסמכים חסרים (WhatsApp / מייל / הדפסה)</li>
              <li>ברגע ההגשה — נרשם ונכנס להכרה בתאריך ההגשה</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/30">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold text-lg">🏢 מסלול הפקיד / המערכת</h3>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>רואה ציון מוכנות לכל תיק (1-10)</li>
              <li>מ-5 ומעלה — ניתן לכנס ועדה</li>
              <li>בעתיד: OCR אוטומטי יבדוק אם המסמכים נמצאים בתיק</li>
              <li>מעקב תיקים — סטטוס שלמות לכל אבחנה</li>
              <li>יצירת הודעה אוטומטית לתובע עם מסמכים חסרים</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Data basis */}
      <Card className="bg-info/10 border-info/30">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-primary">📊 בסיס הנתונים</h3>
          <p className="text-sm leading-relaxed">
            המערכת מבוססת על ניתוח נתונים שהתקבלו מרופאי הוועדות הרפואיות.
            הנתונים כוללים קשרי אבחנה-מסמך ב-7 תחומי תביעה, עם דירוג חשיבות (AI 5/5) למסמכים קריטיים.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white rounded-lg px-4 py-2 border text-center">
              <div className="text-xl font-extrabold text-secondary">3,934</div>
              <div className="text-xs text-muted-foreground">רשומות אבחנה-מסמך</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border text-center">
              <div className="text-xl font-extrabold text-secondary">140+</div>
              <div className="text-xs text-muted-foreground">קבוצות אבחנות</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border text-center">
              <div className="text-xl font-extrabold text-secondary">7</div>
              <div className="text-xs text-muted-foreground">תחומי תביעה</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border text-center">
              <div className="text-xl font-extrabold text-accent">286</div>
              <div className="text-xs text-muted-foreground">רשומות AI 5/5</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pilot plan */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-primary">🚀 תכנית פיילוט</h3>
          <div className="grid sm:grid-cols-4 gap-3">
            <div className="border rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-accent">שלב 1</div>
              <div className="text-sm font-semibold mt-1">POC</div>
              <p className="text-xs text-muted-foreground mt-1">אב טיפוס עם נתוני מחקר — 5 אבחנות MVP</p>
              <Badge className="mt-2 bg-success text-success-foreground">✓ הושלם</Badge>
            </div>
            <div className="border rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-accent">שלב 2</div>
              <div className="text-sm font-semibold mt-1">פיילוט פנימי</div>
              <p className="text-xs text-muted-foreground mt-1">בדיקה עם פקידים ורופאי ועדות — תיקוף נתונים</p>
              <Badge className="mt-2 bg-warning text-warning-foreground">הבא</Badge>
            </div>
            <div className="border rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-accent">שלב 3</div>
              <div className="text-sm font-semibold mt-1">חיבור נתונים</div>
              <p className="text-xs text-muted-foreground mt-1">חיבור ל-DWH + OCR אוטומטי לבדיקת מסמכים</p>
              <Badge variant="outline" className="mt-2">עתידי</Badge>
            </div>
            <div className="border rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-accent">שלב 4</div>
              <div className="text-sm font-semibold mt-1">הפצה</div>
              <p className="text-xs text-muted-foreground mt-1">הנגשה לאזרחים באתר ביטוח לאומי + אפליקציה</p>
              <Badge variant="outline" className="mt-2">עתידי</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Accordion type="multiple" className="space-y-2">
        <AccordionItem value="what" className="border rounded-xl px-4 bg-card">
          <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
            מה זו ועדה רפואית?
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed space-y-2 pb-4">
            <p>ועדה רפואית היא גוף מקצועי של המוסד לביטוח לאומי, המורכב מרופאים מומחים. תפקיד הוועדה לבדוק את מצבך הרפואי ולקבוע את אחוזי הנכות הרפואית שלך.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="readiness" className="border rounded-xl px-4 bg-card">
          <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
            מה זה ציון מוכנות?
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed space-y-2 pb-4">
            <p>ציון המוכנות (1-10) מחושב לפי המסמכים שהוגשו ביחס לנדרש. מסמכי חובה מקבלים משקל גבוה יותר.</p>
            <p>ציון 5 ומעלה — ניתן לכנס ועדה רפואית. מתחת ל-5 — נדרשת השלמת מסמכים.</p>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-destructive text-destructive-foreground">1-4: לא מוכן</Badge>
              <Badge className="bg-warning text-warning-foreground">5-7: ניתן לכנס</Badge>
              <Badge className="bg-success text-success-foreground">8-10: מוכנות מלאה</Badge>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rights" className="border rounded-xl px-4 bg-card">
          <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
            זכויות שלך בוועדה
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed space-y-2 pb-4">
            <ul className="list-disc list-inside space-y-1">
              <li>הזכות להיות מלווה על ידי אדם נוסף</li>
              <li>הזכות לקבל תרגום אם אינך דובר עברית</li>
              <li>הזכות לקבל העתק מפרוטוקול הוועדה</li>
              <li>הזכות לערער על ההחלטה תוך 60 יום</li>
              <li>הזכות להציג מסמכים רפואיים נוספים</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Credit */}
      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        <p>אביעד יצחקי | מינהל גמלאות | ביטוח לאומי | מרץ 2026</p>
      </div>
    </div>
  );
}

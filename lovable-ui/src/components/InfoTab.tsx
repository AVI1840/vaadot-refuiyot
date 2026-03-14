import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function InfoTab() {
  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-extrabold text-primary">ℹ️ מידע למבוטח — ועדות רפואיות בביטוח לאומי</h2>
        <p className="text-muted-foreground text-lg">כל מה שצריך לדעת לפני הוועדה הרפואית</p>
        <Badge className="bg-info text-info-foreground">דף מידע לאזרח</Badge>
      </div>

      {/* What is a medical committee */}
      <Card className="border-r-4 border-r-primary">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-primary">🏥 מהי ועדה רפואית?</h3>
          <p className="text-sm leading-relaxed">
            ועדה רפואית היא גוף מקצועי של המוסד לביטוח לאומי, המורכב מרופאים מומחים.
            תפקיד הוועדה לבדוק את מצבך הרפואי ולקבוע את אחוזי הנכות הרפואית שלך.
          </p>
          <p className="text-sm leading-relaxed">
            הוועדה מתכנסת לאחר שהוגשה תביעה ונבדקה מוכנות התיק — כלומר, שכל המסמכים הנדרשים נמצאים.
          </p>
        </CardContent>
      </Card>

      {/* Types of committees */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-primary">📋 סוגי ועדות</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: '🏥', title: 'ועדה לנכות כללית', desc: 'קביעת אחוזי נכות רפואית לזכאות לקצבת נכות' },
              { icon: '⚒️', title: 'ועדה לנפגעי עבודה', desc: 'קביעת נכות מתאונת עבודה או מחלת מקצוע' },
              { icon: '🚗', title: 'ועדה לניידות', desc: 'קביעת זכאות לקצבת ניידות ורכב רפואי' },
              { icon: '👴', title: 'ועדה לסיעוד', desc: 'קביעת רמת תלות וזכאות לגמלת סיעוד' },
              { icon: '⚖️', title: 'ועדת ערר', desc: 'ערעור על החלטת ועדה רפואית קודמת' },
              { icon: '👶', title: 'ועדה לילד נכה', desc: 'קביעת זכאות לגמלת ילד נכה' },
            ].map((ct, i) => (
              <div key={i} className="p-3 border rounded-xl bg-muted/10">
                <div className="text-2xl mb-1">{ct.icon}</div>
                <div className="font-bold text-sm">{ct.title}</div>
                <p className="text-xs text-muted-foreground mt-1">{ct.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to prepare */}
      <Card className="border-r-4 border-r-success">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-success">✅ איך להתכונן לוועדה</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-lg">1️⃣</span>
              <div>
                <span className="font-bold">הגש תביעה</span> — ברגע ההגשה אתה נרשם ונכנס להכרה בתאריך ההגשה.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">2️⃣</span>
              <div>
                <span className="font-bold">בדוק מה נדרש</span> — השתמש בצ׳קליסט המסמכים שלנו כדי לדעת בדיוק מה להביא לפי האבחנה שלך.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">3️⃣</span>
              <div>
                <span className="font-bold">אסוף מסמכים</span> — מסמכי חובה 🔴 הם קריטיים. מסמכים מומלצים 🟡 מחזקים את התיק.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">4️⃣</span>
              <div>
                <span className="font-bold">ציון מוכנות</span> — כשהציון שלך 5 ומעלה (מתוך 10), ניתן לכנס ועדה.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">5️⃣</span>
              <div>
                <span className="font-bold">הגע לוועדה</span> — הבא את כל המסמכים המקוריים. מותר להגיע עם מלווה.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readiness score explanation */}
      <Card className="bg-secondary/5 border-secondary/30">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-secondary">📊 מה זה ציון מוכנות?</h3>
          <p className="text-sm leading-relaxed">
            ציון המוכנות (1-10) מחושב לפי המסמכים שהגשת ביחס למה שנדרש.
            מסמכי חובה מקבלים משקל גבוה יותר מהמומלצים והאופציונליים.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="flex items-center gap-2 bg-destructive/10 rounded-lg px-3 py-2">
              <span className="text-xl">🔴</span>
              <div>
                <div className="font-bold text-sm text-destructive">1-4: לא מוכן</div>
                <div className="text-xs text-muted-foreground">נדרשת השלמת מסמכים</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-warning/10 rounded-lg px-3 py-2">
              <span className="text-xl">🟡</span>
              <div>
                <div className="font-bold text-sm text-warning">5-7: ניתן לכנס</div>
                <div className="text-xs text-muted-foreground">מומלץ להשלים עוד</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-success/10 rounded-lg px-3 py-2">
              <span className="text-xl">🟢</span>
              <div>
                <div className="font-bold text-sm text-success">8-10: מוכנות מלאה</div>
                <div className="text-xs text-muted-foreground">מוכן לוועדה</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your rights */}
      <Card className="border-r-4 border-r-accent">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-accent">⚖️ הזכויות שלך בוועדה</h3>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>הזכות להיות מלווה על ידי אדם נוסף (בן משפחה, עו"ד, עו"ס)</li>
            <li>הזכות לקבל תרגום אם אינך דובר עברית</li>
            <li>הזכות לקבל העתק מפרוטוקול הוועדה</li>
            <li>הזכות לערער על ההחלטה תוך 60 יום</li>
            <li>הזכות להציג מסמכים רפואיים נוספים</li>
            <li>הזכות לבקש דחייה אם אינך מוכן</li>
            <li>הזכות לבקש ועדה בשפה שאתה מבין</li>
          </ul>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-info/5 border-info/30">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-primary">💡 טיפים חשובים</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: '📁', text: 'הבא עותק מכל מסמך — אל תמסור מקוריים' },
              { icon: '📝', text: 'רשום מראש את כל התלונות והמגבלות שלך' },
              { icon: '💊', text: 'הבא רשימת תרופות עדכנית עם מינונים' },
              { icon: '🕐', text: 'הגע 15 דקות לפני הזמן' },
              { icon: '👥', text: 'הגע עם מלווה שמכיר את מצבך' },
              { icon: '🗣️', text: 'תאר את המצב הגרוע ביותר — לא את הטוב' },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-muted/10 rounded-lg">
                <span className="text-lg">{tip.icon}</span>
                <span className="text-sm">{tip.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-primary text-center">❓ שאלות נפוצות</h3>
        <Accordion type="multiple" className="space-y-2">
          <AccordionItem value="appeal" className="border rounded-xl px-4 bg-card">
            <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
              איך מגישים ערעור?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed pb-4">
              <p>ניתן להגיש ערעור (ערר) תוך 60 יום מקבלת ההחלטה. הערר מוגש לוועדת ערר עליונה.</p>
              <p className="mt-2">מומלץ לצרף מסמכים רפואיים חדשים או חוות דעת מומחה שתומכים בטענותיך.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="duration" className="border rounded-xl px-4 bg-card">
            <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
              כמה זמן נמשכת ועדה?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed pb-4">
              <p>ועדה רפואית נמשכת בדרך כלל 15-30 דקות. משך הזמן תלוי במורכבות המקרה ובמספר האבחנות.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="result" className="border rounded-xl px-4 bg-card">
            <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
              מתי מקבלים תשובה?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed pb-4">
              <p>החלטת הוועדה נשלחת בדואר תוך 14-21 ימי עבודה. ניתן גם לבדוק באתר ביטוח לאומי באזור האישי.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="missing" className="border rounded-xl px-4 bg-card">
            <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
              מה קורה אם חסרים מסמכים?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed pb-4">
              <p>אם ציון המוכנות שלך מתחת ל-5, תתבקש להשלים מסמכים לפני כינוס הוועדה.</p>
              <p className="mt-2">חשוב: ברגע שהגשת תביעה, אתה כבר מוכר מתאריך ההגשה — גם אם הוועדה מתכנסת מאוחר יותר.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="companion" className="border rounded-xl px-4 bg-card">
            <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
              אפשר להגיע עם מלווה?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed pb-4">
              <p>כן, זו זכות שלך. מומלץ להגיע עם בן משפחה, עובד סוציאלי, או עורך דין שמכיר את מצבך הרפואי.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Dual perspective note */}
      <Card className="border-2 border-dashed border-secondary/40 bg-secondary/5">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-center">🔄 שקיפות הדדית — אזרח ומערכת</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-xl border">
              <div className="font-bold text-sm mb-2">👤 מה האזרח רואה</div>
              <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                <li>רשימת מסמכים ברורה לפי אבחנה</li>
                <li>ציון מוכנות אישי</li>
                <li>הסברים על כל מסמך ואיפה להשיג</li>
                <li>הודעה על מסמכים חסרים</li>
              </ul>
            </div>
            <div className="p-3 bg-white rounded-xl border">
              <div className="font-bold text-sm mb-2">🏢 מה המערכת רואה</div>
              <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                <li>ציון מוכנות לכל תיק (1-10)</li>
                <li>סטטוס שלמות מסמכים</li>
                <li>סף כינוס ועדה (5+)</li>
                <li>בעתיד: OCR אוטומטי לבדיקת מסמכים</li>
              </ul>
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

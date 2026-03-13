import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

export default function InfoTab() {
  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <h2 className="text-center">מידע על ועדות רפואיות</h2>
      <p className="text-center text-muted-foreground">כל מה שצריך לדעת לפני הוועדה הרפואית</p>

      <Accordion type="multiple" className="space-y-2">
        <AccordionItem value="what" className="border rounded-xl px-4 bg-card">
          <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
            מה זו ועדה רפואית?
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed space-y-2 pb-4">
            <p>ועדה רפואית היא גוף מקצועי של המוסד לביטוח לאומי, המורכב מרופאים מומחים. תפקיד הוועדה לבדוק את מצבך הרפואי ולקבוע את אחוזי הנכות הרפואית שלך.</p>
            <p>הוועדה מתכנסת לאחר הגשת תביעה לביטוח לאומי, ומזמנת אותך לבדיקה פיזית ולעיון במסמכים הרפואיים שהגשת. ההחלטה מתבססת על תקנות הנכות ועל הממצאים הרפואיים.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types" className="border rounded-xl px-4 bg-card">
          <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
            סוגי ועדות
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed space-y-3 pb-4">
            <div>
              <strong>🏥 ועדה רפואית לנכות כללית</strong>
              <p>קובעת אחוזי נכות רפואית לפי תקנות הנכות. מתאימה למי שסובל ממחלה או פגיעה שאינה קשורה לעבודה.</p>
            </div>
            <div>
              <strong>⚒️ ועדה רפואית לנפגעי עבודה</strong>
              <p>קובעת נכות כתוצאה מתאונת עבודה או מחלת מקצוע. דורשת תיעוד של הקשר בין הפגיעה לעבודה.</p>
            </div>
            <div>
              <strong>🚗 ועדה רפואית לניידות</strong>
              <p>בוחנת זכאות לקצבת ניידות למי שסובל מליקוי ברגליים המגביל את יכולת ההליכה.</p>
            </div>
            <div>
              <strong>👴 ועדה רפואית לסיעוד</strong>
              <p>קובעת את רמת התלות בעזרת הזולת לפעולות יומיומיות כגון רחצה, הלבשה, אכילה וניידות.</p>
            </div>
            <div>
              <strong>⚖️ ועדת ערר</strong>
              <p>ועדה שבוחנת ערעור על החלטת ועדה רפואית קודמת. ניתן לערער תוך 60 יום מקבלת ההחלטה.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rights" className="border rounded-xl px-4 bg-card">
          <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
            זכויות שלך בוועדה
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed space-y-2 pb-4">
            <ul className="list-disc list-inside space-y-1">
              <li>הזכות להיות מלווה על ידי אדם נוסף (בן משפחה, עו"ד, נציג ארגון)</li>
              <li>הזכות לקבל תרגום אם אינך דובר עברית</li>
              <li>הזכות לקבל העתק מפרוטוקול הוועדה</li>
              <li>הזכות לערער על ההחלטה תוך 60 יום</li>
              <li>הזכות להציג מסמכים רפואיים נוספים</li>
              <li>הזכות לתנאי נגישות מלאים</li>
              <li>הזכות לדחיית מועד הוועדה בנסיבות מיוחדות</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tips" className="border rounded-xl px-4 bg-card">
          <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
            טיפים להצלחה
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed space-y-2 pb-4">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>הגיעו עם כל המסמכים:</strong> השתמשו בצ׳קליסט שלנו כדי לוודא שלא שכחתם דבר</li>
              <li><strong>הגיעו בזמן:</strong> מומלץ להגיע 15 דקות לפני המועד</li>
              <li><strong>תארו את מצבכם בכנות:</strong> אל תגזימו ואל תמעיטו — תארו את היום-יום שלכם</li>
              <li><strong>הביאו מלווה:</strong> בן משפחה או חבר שמכיר את מצבכם</li>
              <li><strong>הכינו רשימת תרופות:</strong> כולל מינון ותדירות</li>
              <li><strong>בקשו העתק מהפרוטוקול:</strong> זכותכם לקבל אותו</li>
              <li><strong>אל תחתמו על מסמך שאתם לא מבינים:</strong> בקשו הסבר</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="appeal" className="border rounded-xl px-4 bg-card">
          <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
            תהליך ערעור
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed space-y-2 pb-4">
            <p>אם אינך מסכים עם החלטת הוועדה הרפואית, יש לך זכות לערער:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>הגש ערר תוך 60 יום מקבלת ההחלטה</li>
              <li>הערר מוגש בכתב למוסד לביטוח לאומי</li>
              <li>ועדת ערר תזומן לבחינה מחדש</li>
              <li>אם גם ועדת הערר דחתה — ניתן לערער לבית הדין לעבודה</li>
            </ol>
            <p className="mt-2"><strong>חשוב:</strong> מומלץ להתייעץ עם עורך דין המתמחה בביטוח לאומי לפני הגשת ערר.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq" className="border rounded-xl px-4 bg-card">
          <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
            שאלות נפוצות
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed space-y-3 pb-4">
            <div>
              <strong>כמה זמן נמשכת ועדה רפואית?</strong>
              <p>בדרך כלל 15-30 דקות, תלוי במורכבות המקרה.</p>
            </div>
            <div>
              <strong>מתי אקבל את ההחלטה?</strong>
              <p>החלטת הוועדה נשלחת בדואר תוך 14 יום עבודה.</p>
            </div>
            <div>
              <strong>האם אפשר לדחות את המועד?</strong>
              <p>כן, ניתן לבקש דחייה בנסיבות מוצדקות. יש לפנות לסניף בהקדם.</p>
            </div>
            <div>
              <strong>האם חייבים להגיע פיזית?</strong>
              <p>בדרך כלל כן. במקרים מיוחדים ניתן לבקש ועדה על סמך מסמכים בלבד.</p>
            </div>
            <div>
              <strong>מה קורה אם לא מגיעים?</strong>
              <p>אי-הגעה ללא הודעה מראש עלולה לגרום לדחיית התביעה. יש להודיע מראש.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact" className="border rounded-xl px-4 bg-card">
          <AccordionTrigger className="min-h-[44px] font-bold text-base hover:no-underline">
            יצירת קשר
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed space-y-2 pb-4">
            <Card className="bg-info/30">
              <CardContent className="p-4 space-y-2">
                <p><strong>מוקד טלפוני:</strong> *6050 או 04-8812345</p>
                <p><strong>שעות פעילות:</strong> ימים א׳-ה׳, 08:00-16:00</p>
                <p><strong>אתר המוסד:</strong> www.btl.gov.il</p>
                <p><strong>דואר אלקטרוני:</strong> info@btl.gov.il</p>
                <p><strong>סניפים:</strong> ניתן לאתר את הסניף הקרוב באתר המוסד</p>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

# מגה-פרומפט — "תביעה ביום" Full Product Build

> פרומפט זה מיועד לבניית המערכת המלאה ב-V0 / Lovable / Claude Artifacts
> כולל את כל 16 המסכים, ה-design system, וה-product logic

---

## System Prompt לסוכן AI (לשימוש עם Bedrock / Claude API)

```
אתה "מדריך התביעה" — סוכן AI של ביטוח לאומי.
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
2. "דבר על יום-יום — לא אבחנות"
3. מה להביא + זכויות
4. סימולציה: "הרופא ישאל '...?' — ענה: [דוגמה]"
5. "בהצלחה! 🌟"

== חובה בכל הודעה ==
הוסף בסוף:
<meta>{"step":1,"readiness":0,"conditions":[],"documents":[]}</meta>
שדות: step(1-7), readiness(0-100), conditions(מערך), documents(מערך: {name,priority:"red"/"yellow"/"blue",have:false,where})
```

---

## Quick Replies לפי שלב

```json
{
  "1": ["סוכרת", "כאבי גב", "דיכאון / חרדה", "בעיות לב", "בעיה אורתופדית", "ילד נכה", "נפגע איבה"],
  "2": ["יש לי כמה מסמכים", "אין לי כמעט כלום", "אראה ואגיד"],
  "3": ["הבנתי, אצא להשיג", "שאלה על מסמך ספציפי", "מוכן לשלב הבא"],
  "4": ["יש לי מסמכים מוכנים", "מוכן להמשיך"],
  "5": ["בוא נתחיל", "יש לי שאלה"],
  "6": ["רוצה לשפר את הציון", "מוכן — קדימה לשלב הבא"],
  "7": ["תודה, הכל ברור!", "יש לי עוד שאלה"]
}
```

---

## Design System

```
Primary: #003B7A
Secondary: #0063CC
Accent: #E8A020
Success: #10B981
Warning: #F59E0B
Error: #EF4444
Background: #EFF3F8
Surface: white
Font: Heebo
Radius: 16px
Direction: RTL
```

---

## ארכיטקטורת המסכים (16 מסכים)

1. Landing Page — hero + value + CTA
2. Onboarding — AI greeting + condition selection
3. Checklist — חובה/כדאי/רשות + progress
4. Doc Acquisition — timeline + HMO links
5. Upload + OCR — drag/drop + scan + validate
6. Form BL/283 — conversational fill
7. Readiness Score — gauge + recommendations
8. Committee Prep — timeline + simulation
9. Sidebar — persistent doc panel
10. Mobile — bottom nav + thumb-friendly
11. AI Control Center — agent activity feed
12. Digital Twin — before/after simulation
13. Org ROI Dashboard — executive metrics
14. Architecture Slide — AWS diagram
15. Demo Mode — guided story
16. Success/Submit — celebration + next steps

---

*מוכן לשימוש ב-V0.dev / Lovable / Claude Artifacts*
*האקתון AWS "Accelerate Your AI Journey" #3 | 23.06.2026*

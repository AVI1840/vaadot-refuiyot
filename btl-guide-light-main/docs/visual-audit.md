# Visual Audit — Screenshots vs Current Implementation

## Key Design Patterns Extracted from Screenshots

### 1. GLOBAL APP SHELL (every screen)
- **Header:** Logo (ב"ל rounded square) + step bar (numbered circles 1-7, LTR) + "מופעל ע״י Amazon Bedrock" badge (top-left)
- **Left Sidebar (dark blue #003B7A):**
  - Score gauge: large 42/100 circle with colored ring
  - "בינוני" badge below score
  - "סיכי טוב לשיפור משמעותי!" text
  - Progress: "התקדמות כוללת" bar
  - "X מתוך Y שלבים"
  - Missing docs section: red dots + doc names
  - "מסלול ירוק" green card: "אתה מתאים למסלול ירוק! / השלם את 3 המסמכים..."
  - "AI Agent" section: "הסוכן שלך עבד בשבילך / 7 פעולות השלימו היום"
  - "צריך עזרה?" bottom section with green button "שאל נועם"

### 2. DIGITAL TWIN (WOW screen)
- Title: "הדיגיטל טוין שלך — סימולציית סיכויי אישור"
- Subtitle: "מודל AI מתקדם שנבנה על בסיס אלפי תיקים אישיים דומים לשלך"
- "92% דיוק המודל" badge
- **Center visualization:** 42% → 61% → 73% → 81% progression with circular gauges
- Each step shows: document name + percentage jump
- Green 81% large gauge with "סיכוי גבוה לאישור" badge
- "+39% שיפור כולל בסיכויי האישור"
- **Bottom:** "מדדי השפעה משוערים" — before/after metrics table
- **Right panel:** "למה זה ישפר את הסיכוי שלך?" explanation cards

### 3. AI CONTROL CENTER
- Title: "AI Agent Control Center"
- Subtitle: "הסוכן החכם שלך פועל, מנתח, מפשט ומכין את התביעה שלך לאישור"
- "סטטוס הסוכן בזמן אמת" — green dot + "הסוכן פעיל כעת"
- Progress bar: "7/10 פעולות הושלמו / 70%"
- AWS services badges: Claude 3.5, Textract OCR, OpenSearch, Lambda, Bedrock
- "יומן פעולות הסוכן" — timeline with timestamps (11:24:07, etc.)
- Each entry: status badge (הושלם/פעיל) + description
- "הפעולות הבאות המומלצות" — action cards at bottom

### 4. ROI DASHBOARD
- Title: "מרכז תובנות ויעילות לארגון"
- Top KPIs: "חיסכון שנתי 42,000,000 ₪" | "ROI 342%" | "ירידה בעומס 41%" | "שביעות רצון 89%"
- "מדדי ביצוע מרכזיים — לפני ואחרי" grid (blue before, green after)
- "גרף השוואה" line chart
- "התפלגות סוגי תביעות" donut chart
- "תובנות מרכזיות" insight cards
- Citizen testimonials section with avatars

### 5. ARCHITECTURE
- Title: "ארכיטקטורה טכנולוגית"
- Subtitle: "תביעה ביום — AI Agent עבור ביטוח לאומי"
- Flow diagram: אזרח → React Frontend → API Gateway → AI Agent Orchestration Layer
- AI layer contains: זיהוי לקות, צ'קליסט חכם, ניתוח מסמכים, הערכת סיכויים, BL/283, הכנה לוועדה
- AWS services: Bedrock, Textract, OpenSearch — each with description
- Lambda functions: Secure Auth, S3, SNS/SES, EventBridge, CloudWatch, IAM
- Bottom: "מערכות ביטוח לאומי" integration layer
- "Built on AWS" badge top-right
- Impact metrics at bottom
- "שירותי AWS מרכזיים" grid with service descriptions

### 6. MOBILE
- Top bar: logo + step indicator (small)
- Large gauge (84/100) center
- "+39% שיפור ציון" badge
- "השלב הבא שלך" card
- "פעילות אחרונה" feed
- Bottom nav: בית, תמיכה, צ'קליסט, מסמכים, פרופיל
- Chat view: full-width messages
- Documents list view with tabs (חסרים, מוכנים, הועלו)

### 7. CHECKLIST (Mobile)
- Title: "הצ'קליסט שלך — סוכרת (נכות כללית)"
- "על בסיס ניתוח 778 תיקים דומים"
- Circular progress: 42% with "3 מתוך 7 מסמכי חובה"
- Legend: "2 חסרים 🔴 | 3 הועלו/סומנו 🟠 | 2 בתהליך 🟡"
- Sections: "5 חובה — בלי זה לא יטפלו" (red header)
- Each item: chevron + name + description + location icon + checkbox
- "3 מומלץ — מחזק משמעותית" (orange header)
- "2 רשות — יכול לסייע" (blue header)
- Bottom sticky: score + "איך משיגים?" + "העלאת מסמך" + "מילוי טופס"

### 8. DOC ACQUISITION
- Title: "תוכנית פעולה להשגת מסמכים"
- Subtitle: "הנחיות אישיות: איפה, מה ומתי להשיג"
- Alert: "⚠️ חסרים לך 4 מסמכי חובה"
- Timeline with numbered circles (1, 2, 3):
  - 1. רופא משפחה (with doctor illustration)
  - 2. רופא מומחה (with specialist illustration)
  - 3. בדיקות מעבדה (with microscope illustration)
- Each has: time estimate, action chips, tips, "קבע תור" button
- Right panel: "קישורי קופות חולים" — כללית, מכבי, מאוחדת, לאומית
- Right panel: "טיפים חשובים" cards
- Bottom: "לוח זמנים מומלץ" — 4 weeks timeline

### 9. FORM BL/283
- **3-column layout:** Left sidebar (docs) | Center (chat) | Right (form preview)
- Left sidebar: "42/100 ציון מוכנות" gauge + document status list
- Center: Chat bubbles with "נועם" avatar (robot face)
- Agent messages: white bubbles with blue border
- User messages: filled blue bubbles
- "טיפ חשוב" yellow card inline
- Progress bar: "שלב 7 מתוך 12 | 58%"
- Right: "תצוגה מקדימה BL/283" form sections (accordions)
- Bottom: "← חזור" + "→ המשך לשאלה הבאה"
- Footer banner: "כל הכבוד! הגעת ל-58% מהטופס!"

### 10. READINESS DASHBOARD
- Title: "הערכת סיכויים והמלצות אישיות"
- "על בסיס ניתוח 3,934 תיקים דומים במאגר ביטוח לאומי"
- Left: Large gauge 42/100 (semi-circle, colored gradient)
- Center: "שפר את הציון שלך" card — shows potential 84/100
- Document impact list: HbA1c +18, סיכום אנדוקרינולוג +15, בדיקת עיניים +9...
- "הסיכוי המשוער לקבלת נכות" — tabs: נמוך/בינוני/גבוה
- "המלצות חכמות עבורך" — 4 tip cards
- "השוואה למבוטחים דומים" — 72% (80-100) vs 41% (40-60)
- "פילוח תוצאות במאגר" — pie chart
- "הנתונים שמאחורי ההערכה" — 3,934 / 140 / 286 / 92%
- Bottom buttons: "חזרה לטופס" | "שמור דוח" | "→ המשך להכנה לוועדה"

---

## IMPLEMENTATION GAP SUMMARY

| Screenshot Element | Current | Priority |
|---|---|---|
| 3-column layout (sidebar + content + right panel) | ❌ Only sidebar + content | HIGH |
| Right panel (form preview / recommendations / HMO links) | ❌ Missing | HIGH |
| Illustrations (doctor, microscope, robot avatar) | ❌ Using emoji only | MEDIUM |
| Timeline with circles + dotted lines | ⚠️ Basic | HIGH |
| "מסלול ירוק" prominent card in sidebar | ✅ Exists | OK |
| AWS services badges row | ⚠️ In AI center only | LOW |
| Document impact list with +points | ✅ In DigitalTwin | OK |
| Semi-circle gauge (Readiness) | ⚠️ Full circle used | MEDIUM |
| "92% דיוק המודל" badge | ❌ Missing | LOW |
| Bottom action bar (sticky CTA) | ❌ Missing | MEDIUM |
| Chat with timestamps | ⚠️ No timestamps | LOW |
| Form preview panel (right side) | ❌ Missing | MEDIUM |
| Weekly timeline (שבוע 1-4) | ❌ Missing | LOW |

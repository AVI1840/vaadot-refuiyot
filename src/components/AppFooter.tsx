export default function AppFooter() {
  return (
    <footer className="bg-primary text-primary-foreground/80 text-sm py-4 no-print" role="contentinfo">
      <div className="max-w-[1200px] mx-auto px-4 text-center">
        <p>פרויקט DD — מערכת צ׳קליסט מסמכים חכמה | ועדות רפואיות | אביעד יצחקי, מינהל גמלאות | v2.1 | מרץ 2026</p>
        <p className="text-xs opacity-50 mt-1">עדכון אחרון: 24.03.2026</p>
        <button
          className="underline hover:text-primary-foreground mt-1 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="הצהרת נגישות"
          onClick={() => alert('הצהרת נגישות — ביטוח לאומי מחויב לנגישות מלאה לכלל האזרחים.')}
        >
          הצהרת נגישות
        </button>
      </div>
    </footer>
  );
}

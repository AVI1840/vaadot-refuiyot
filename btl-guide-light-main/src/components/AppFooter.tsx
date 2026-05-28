export default function AppFooter() {
  return (
    <footer className="bg-primary text-primary-foreground/80 text-sm py-4 no-print" role="contentinfo">
      <div className="max-w-[1200px] mx-auto px-4 text-center space-y-1">
        <p className="font-semibold">תביעה ביום — סוכן AI לוועדות רפואיות | מופעל ע״י Amazon Bedrock</p>
        <p className="text-primary-foreground/60 text-xs">
          אביעד יצחקי, מוביל פיתוח ו-AI, מינהל גמלאות | ביטוח לאומי | AWS Hackathon 2026
        </p>
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

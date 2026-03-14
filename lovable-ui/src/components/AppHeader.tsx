import { useAccessibility } from '@/hooks/useAccessibility';
import { Button } from '@/components/ui/button';
import { Eye, Type } from 'lucide-react';

interface AppHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'about', label: '📌 אודות הפרויקט', ariaLabel: 'אודות הפרויקט' },
  { id: 'checklist', label: '📋 הכנת צ\'קליסט', ariaLabel: 'הכנת צ\'קליסט מסמכים' },
  { id: 'dashboard', label: '📊 דשבורד ניהולי', ariaLabel: 'דשבורד סטטיסטי' },
  { id: 'tracking', label: '📈 מעקב תיקים', ariaLabel: 'מעקב תיקים' },
  { id: 'info', label: 'ℹ️ מידע למבוטח', ariaLabel: 'מידע למבוטח על ועדות רפואיות' },
];

export default function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  const { fontSizeLabel, cycleFontSize, highContrast, setHighContrast } = useAccessibility();

  return (
    <header className="bg-primary text-primary-foreground no-print" role="banner">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full bg-primary-foreground/20 border-2 border-primary-foreground/40 flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <span className="text-sm font-bold leading-none">ב&quot;ל</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold leading-tight">
                ועדות רפואיות — צ׳קליסט מסמכים חכם
              </h1>
              <p className="text-primary-foreground/70 text-sm">
                הכנה מושלמת לוועדה רפואית — דע מה להביא
              </p>
            </div>
          </div>

          {/* Accessibility toolbar */}
          <div className="flex items-center gap-2" role="toolbar" aria-label="כלי נגישות">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleFontSize}
              className="text-primary-foreground hover:bg-primary-foreground/20 min-w-[44px] min-h-[44px]"
              aria-label={`גודל גופן: ${fontSizeLabel}. לחץ לשינוי`}
            >
              <Type className="h-4 w-4 ml-1" />
              <span className="text-xs">{fontSizeLabel}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHighContrast(!highContrast)}
              className="text-primary-foreground hover:bg-primary-foreground/20 min-w-[44px] min-h-[44px]"
              aria-label={highContrast ? 'ניגודיות גבוהה: פעיל' : 'ניגודיות גבוהה: כבוי'}
              aria-pressed={highContrast}
            >
              <Eye className="h-4 w-4 ml-1" />
              <span className="text-xs">ניגודיות</span>
            </Button>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="mt-4 flex gap-1 flex-wrap" role="tablist" aria-label="ניווט ראשי">
          {tabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-label={tab.ariaLabel}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2.5 rounded-t-lg font-semibold text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeTab === tab.id
                  ? 'bg-background text-foreground'
                  : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

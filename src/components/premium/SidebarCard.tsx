import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function SidebarCard({
  children,
  className,
  variant = 'default',
}: {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'success';
}) {
  return (
    <div
      className={cn(
        'rounded-2xl p-4 border transition-all',
        variant === 'default' && 'bg-sidebar-accent/40 border-white/10 hairline-dark text-white',
        variant === 'accent'  && 'bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 text-white',
        variant === 'success' && 'bg-gradient-to-br from-success/20 to-success/5 border-success/30 text-white',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SidebarStat({ label, value, hint, variant = 'green' }: { label: string; value: string; hint?: string; variant?: 'green' | 'red' | 'gold' }) {
  const color = variant === 'green' ? 'text-emerald-400' : variant === 'red' ? 'text-rose-400' : 'text-amber-400';
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div>
        <div className="text-[11px] text-white/55 font-semibold">{label}</div>
        {hint && <div className="text-[10px] text-white/40 mt-0.5">{hint}</div>}
      </div>
      <div className={cn('text-lg font-bold text-num', color)}>{value}</div>
    </div>
  );
}

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Step = { id: string; label: string };

type Props = {
  steps: Step[];
  activeId: string;
  onSelect: (id: string) => void;
  completedIds?: string[];
};

export default function StepperHeader({ steps, activeId, onSelect, completedIds = [] }: Props) {
  return (
    <div
      className="relative flex items-center overflow-x-auto scrollbar-hide px-2"
      dir="rtl"
    >
      {/* Connecting line — desktop only, sits behind the step pills */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1/2 start-4 end-4 hidden h-px -translate-y-1/2 bg-border md:block"
        style={{ zIndex: 0 }}
      />

      <div className="relative flex items-center gap-1.5 lg:gap-2 w-full" style={{ zIndex: 1 }}>
        {steps.map((s, i) => {
          const isActive = s.id === activeId;
          const isDone = completedIds.includes(s.id);
          const isFuture = !isActive && !isDone;

          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                // Base pill styles
                'group flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold',
                'transition-all duration-200 ease-out flex-shrink-0 focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                // Default: white card with hairline border
                'border bg-white shadow-soft',
                // Active step
                isActive && [
                  'bg-primary text-white border-primary',
                  'shadow-card scale-[1.03]',
                ],
                // Completed step
                isDone && !isActive && [
                  'text-success border-success/40 bg-success/5',
                  'hover:bg-success/10 hover:border-success/60',
                ],
                // Future step
                isFuture && [
                  'text-muted-foreground border-border',
                  'hover:bg-slate-50 hover:border-slate-300',
                ],
              )}
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Number / check circle */}
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-num',
                  'transition-colors duration-200 flex-shrink-0',
                  // Active: gold accent circle
                  isActive && 'bg-accent text-accent-foreground',
                  // Completed: green circle with check
                  isDone && !isActive && 'bg-success text-white',
                  // Future: muted grey circle
                  isFuture && 'bg-slate-100 text-slate-500 group-hover:bg-slate-200',
                )}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </span>

              {/* Label — hidden on mobile (xs/sm), visible md+ */}
              <span className="hidden md:inline leading-tight">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type Variant = 'default' | 'elevated' | 'flat' | 'gradient' | 'dark' | 'success';

type Props = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  hover?: boolean;
};

export default function PremiumCard({ children, className, variant = 'default', hover = false }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        // default — clean white card with hairline border
        variant === 'default'  && 'bg-card text-card-foreground border hairline shadow-card',
        // elevated — stronger floating shadow
        variant === 'elevated' && 'bg-card text-card-foreground border hairline shadow-[0_12px_40px_rgba(15,23,42,0.13),0_4px_10px_rgba(15,23,42,0.07)]',
        // flat — translucent glass-style
        variant === 'flat'     && 'bg-white/60 backdrop-blur border hairline',
        // gradient — subtle blue wash
        variant === 'gradient' && 'bg-gradient-to-br from-white via-white to-blue-50/60 border hairline shadow-card',
        // dark — deep navy with inner glow on the border edge
        variant === 'dark'     && [
          'bg-primary text-white premium-border',
          'shadow-[0_8px_32px_rgba(15,23,42,0.30),inset_0_0_0_1px_rgba(255,255,255,0.10),inset_0_1px_0_rgba(255,255,255,0.16)]',
        ],
        // success — light success tint, slightly stronger border
        variant === 'success'  && 'bg-success/8 text-card-foreground border border-success/20 shadow-card',
        hover && 'hover:-translate-y-0.5 hover:shadow-floating cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* -----------------------------------------------------------------------
 * CardEyebrow — small label badge above card titles
 * ----------------------------------------------------------------------- */
type EyebrowColor = 'blue' | 'gold' | 'green' | 'red' | 'slate';

const eyebrowStyles: Record<EyebrowColor, string> = {
  blue:  'text-secondary bg-secondary/10 ring-1 ring-secondary/20',
  gold:  'text-amber-700 bg-amber-100 ring-1 ring-amber-200',
  green: 'text-success bg-success/10 ring-1 ring-success/20',
  red:   'text-destructive bg-destructive/10 ring-1 ring-destructive/20',
  // slate: muted text on a neutral background — clearly readable without strong color
  slate: 'text-slate-600 bg-slate-100 ring-1 ring-slate-200',
};

export function CardEyebrow({
  children,
  color = 'blue',
}: {
  children: ReactNode;
  color?: EyebrowColor;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md',
        eyebrowStyles[color],
      )}
    >
      {children}
    </span>
  );
}

/* -----------------------------------------------------------------------
 * StatTile — metric tile used inside dashboard grids
 * ----------------------------------------------------------------------- */
const deltaCls: Record<'green' | 'red' | 'blue', string> = {
  green: 'text-success bg-success/12 ring-1 ring-success/25',
  red:   'text-destructive bg-destructive/10 ring-1 ring-destructive/20',
  blue:  'text-secondary bg-secondary/10 ring-1 ring-secondary/20',
};

export function StatTile({
  label,
  value,
  delta,
  deltaColor = 'green',
  sublabel,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: 'green' | 'red' | 'blue';
  sublabel?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 p-4 rounded-xl border hairline bg-white shadow-soft">
      <div className="min-w-0">
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
        {/* value: promoted to text-3xl for stronger visual hierarchy */}
        <div className="mt-1 text-3xl font-extrabold text-num tracking-tight leading-none">{value}</div>
        {sublabel && <div className="text-xs text-muted-foreground mt-1.5">{sublabel}</div>}
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        {icon && <div className="opacity-75">{icon}</div>}
        {delta && (
          <span
            className={cn(
              'text-[11px] font-bold px-2.5 py-1 rounded-lg text-num',
              deltaCls[deltaColor],
            )}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

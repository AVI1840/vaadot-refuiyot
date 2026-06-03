import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  value: number;            // 0-100
  size?: number;             // px
  stroke?: number;           // px
  label?: string;
  sublabel?: string;
  variant?: 'gold' | 'green' | 'blue' | 'red';
  animate?: boolean;
  className?: string;
  /** When set, renders as a half-arc (top semicircle), like the sidebar gauge. */
  half?: boolean;
  showNumber?: boolean;
};

// Color tokens per variant
const VARIANT: Record<
  NonNullable<Props['variant']>,
  {
    stroke: string;
    strokeEnd: string;    // gradient end color
    track: string;
    trackShadow: string;  // darker track for inner shadow ring
    text: string;
    glow: string;
    outerGlow: string;    // stronger glow for green >= 75
  }
> = {
  gold: {
    stroke:      'hsl(38 92% 50%)',
    strokeEnd:   'hsl(38 92% 72%)',
    track:       'hsl(38 92% 50% / 0.15)',
    trackShadow: 'hsl(38 92% 28% / 0.22)',
    text:        'hsl(38 92% 38%)',
    glow:        'drop-shadow(0 0 10px rgba(245,158,11,0.40))',
    outerGlow:   'drop-shadow(0 0 18px rgba(245,158,11,0.55))',
  },
  green: {
    stroke:      'hsl(152 76% 36%)',
    strokeEnd:   'hsl(152 76% 60%)',
    track:       'hsl(152 76% 36% / 0.15)',
    trackShadow: 'hsl(152 76% 20% / 0.22)',
    text:        'hsl(152 76% 28%)',
    glow:        'drop-shadow(0 0 10px rgba(34,197,94,0.40))',
    outerGlow:   'drop-shadow(0 0 22px rgba(34,197,94,0.65))',
  },
  blue: {
    stroke:      'hsl(217 91% 56%)',
    strokeEnd:   'hsl(217 91% 76%)',
    track:       'hsl(217 91% 56% / 0.15)',
    trackShadow: 'hsl(217 91% 32% / 0.22)',
    text:        'hsl(217 91% 40%)',
    glow:        'drop-shadow(0 0 10px rgba(59,130,246,0.40))',
    outerGlow:   'drop-shadow(0 0 18px rgba(59,130,246,0.55))',
  },
  red: {
    stroke:      'hsl(0 84% 60%)',
    strokeEnd:   'hsl(0 84% 78%)',
    track:       'hsl(0 84% 60% / 0.15)',
    trackShadow: 'hsl(0 84% 36% / 0.22)',
    text:        'hsl(0 84% 48%)',
    glow:        'drop-shadow(0 0 10px rgba(239,68,68,0.40))',
    outerGlow:   'drop-shadow(0 0 18px rgba(239,68,68,0.55))',
  },
};

// Corrected thresholds: red <35, gold 35-65, blue 65-80, green >80
function autoVariant(v: number): NonNullable<Props['variant']> {
  if (v > 80) return 'green';
  if (v > 65) return 'blue';
  if (v >= 35) return 'gold';
  return 'red';
}

export default function ScoreGauge({
  value,
  size = 180,
  stroke = 14,
  label,
  sublabel,
  variant,
  animate = true,
  className,
  half = false,
  showNumber = true,
}: Props) {
  const v = Math.max(0, Math.min(100, value));
  const variantKey: NonNullable<Props['variant']> = variant ?? autoVariant(v);
  const colors = VARIANT[variantKey];

  // Outer glow active only for green variant at final value >= 75
  const useOuterGlow = variantKey === 'green' && v >= 75;

  const [progress, setProgress] = useState(animate ? 0 : v);

  useEffect(() => {
    if (!animate) { setProgress(v); return; }
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased * v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v, animate]);

  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // ── HALF (semicircle) mode ──────────────────────────────────────────────
  if (half) {
    const sweep = Math.PI * r;
    const offset = sweep - (progress / 100) * sweep;
    const gradId = `half-grad-${variantKey}-${size}`;
    const shadowId = `half-shadow-${variantKey}-${size}`;

    return (
      <div className={cn('inline-flex flex-col items-center', className)}>
        <svg
          width={size}
          height={size / 2 + stroke}
          viewBox={`0 0 ${size} ${size / 2 + stroke}`}
          className="overflow-visible"
        >
          <defs>
            {/* gradient along the arc (left→right maps to start→end of arc) */}
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={colors.stroke} stopOpacity="0.7" />
              <stop offset="100%" stopColor={colors.strokeEnd} stopOpacity="1" />
            </linearGradient>
            {/* inner shadow ring gradient */}
            <linearGradient id={shadowId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={colors.trackShadow} />
              <stop offset="100%" stopColor={colors.trackShadow} />
            </linearGradient>
          </defs>

          {/* track */}
          <path
            d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
            fill="none"
            stroke={colors.track}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* inner shadow ring — slightly narrower, darker */}
          <path
            d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
            fill="none"
            stroke={colors.trackShadow}
            strokeWidth={stroke * 0.35}
            strokeLinecap="round"
          />
          {/* progress arc */}
          <path
            d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={sweep}
            strokeDashoffset={offset}
            style={{ filter: useOuterGlow ? colors.outerGlow : colors.glow }}
          />
        </svg>

        {showNumber && (
          <div className="-mt-6 text-center">
            <div
              className="text-num font-extrabold"
              style={{ fontSize: size * 0.22, lineHeight: 1, color: colors.text }}
            >
              {Math.round(progress)}
              <span className="font-bold text-muted-foreground" style={{ fontSize: size * 0.10 }}>/100</span>
            </div>
            {label && (
              <div className="text-xs font-semibold text-muted-foreground mt-1">{label}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── FULL circle mode ────────────────────────────────────────────────────
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (progress / 100) * circumference;
  const gradId = `circ-grad-${variantKey}-${size}`;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <defs>
          {/*
            The SVG is rotated -90° so the arc starts at 12 o'clock.
            We define the gradient in the un-rotated coordinate space;
            userSpaceOnUse with coordinates matching the circle centre gives
            a smooth start→end sweep around the arc.
          */}
          <linearGradient id={gradId} x1={cx} y1={cy - r} x2={cx} y2={cy + r} gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={colors.strokeEnd} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.stroke}    stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* track ring */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={colors.track}
          strokeWidth={stroke}
        />

        {/* inner shadow ring — centered on the track, slightly narrower */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={colors.trackShadow}
          strokeWidth={stroke * 0.35}
        />

        {/* progress arc with gradient */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            filter: useOuterGlow ? colors.outerGlow : colors.glow,
          }}
        />
      </svg>

      {showNumber && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-num font-extrabold"
            style={{ fontSize: size * 0.30, color: colors.text, lineHeight: 1 }}
          >
            {Math.round(progress)}
            <span className="text-muted-foreground" style={{ fontSize: size * 0.11 }}>%</span>
          </div>
          {label && (
            <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mt-1">
              {label}
            </div>
          )}
          {sublabel && (
            <div className="text-[10px] text-muted-foreground mt-0.5">{sublabel}</div>
          )}
        </div>
      )}
    </div>
  );
}

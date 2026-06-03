import { cn } from '@/lib/utils';

/**
 * Animated "live" dot — opacity-only pulse stays on compositor thread.
 * Will-change: opacity avoids paint overhead that caused screenshot tool timeouts.
 */
export function AIPulseDot({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex h-2.5 w-2.5 rounded-full bg-success', className)}
      style={{
        willChange: 'opacity',
        animation: 'aipulse 1.8s ease-in-out 5',   /* 5× then stops */
      }}
    />
  );
}

export function AIBadge({ label = 'AI Agent', online = true }: { label?: string; online?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-sidebar-accent/60 border border-white/10 px-3 py-1.5">
      <AIPulseDot />
      <span className="text-xs font-bold tracking-wider uppercase text-white/90">{label}</span>
      {online && <span className="text-[10px] text-white/60 font-semibold">Online</span>}
    </div>
  );
}

// Kept for backward compat (Architecture etc.) but simplified
export function AIPulseRing({ size = 96, color = 'rgba(245,158,11,0.6)' }: {
  size?: number; color?: string;
}) {
  return (
    <div
      className="rounded-full"
      style={{
        width: size, height: size, background: color,
        willChange: 'opacity',
        animation: 'aipulse 2s ease-in-out 4',   /* 4× then stops */
      }}
    />
  );
}

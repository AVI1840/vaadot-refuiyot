import { useState, useEffect } from 'react';
import { Smartphone, Globe2, Bot, Database, FileSearch, Brain, Shield, Cloud, Zap, FileText, Server, Lock, Activity, CheckCircle2, ShieldCheck } from 'lucide-react';
import PremiumCard, { CardEyebrow, StatTile } from '@/components/premium/PremiumCard';
import { AwsBadge } from '@/components/premium/AppShell';
import { AIPulseDot } from '@/components/premium/AIPulse';
import { cn } from '@/lib/utils';

// ─── Layer palette ────────────────────────────────────────────────────────────
const LAYER_PALETTES = {
  client: {
    border:   'border-blue-400/50',
    badge:    'bg-blue-500/15 text-blue-700 border-blue-300/60',
    tile:     'border-blue-300/50 bg-gradient-to-br from-blue-50/80 to-white',
    iconBg:   'bg-blue-500/12 text-blue-700',
    label:    'text-blue-700',
    connector:'bg-blue-300',
    dot:      'bg-blue-400',
  },
  edge: {
    border:   'border-amber-400/50',
    badge:    'bg-amber-500/15 text-amber-700 border-amber-300/60',
    tile:     'border-amber-300/50 bg-gradient-to-br from-amber-50/80 to-white',
    iconBg:   'bg-amber-500/12 text-amber-700',
    label:    'text-amber-700',
    connector:'bg-amber-300',
    dot:      'bg-amber-400',
  },
  agent: {
    border:   'border-purple-400/50',
    badge:    'bg-purple-500/15 text-purple-700 border-purple-300/60',
    tile:     'border-purple-300/50 bg-gradient-to-br from-purple-50/80 to-white',
    iconBg:   'bg-purple-500/12 text-purple-700',
    label:    'text-purple-700',
    connector:'bg-purple-300',
    dot:      'bg-purple-400',
  },
  data: {
    border:   'border-green-400/50',
    badge:    'bg-green-500/15 text-green-700 border-green-300/60',
    tile:     'border-green-300/50 bg-gradient-to-br from-green-50/80 to-white',
    iconBg:   'bg-green-500/12 text-green-700',
    label:    'text-green-700',
    connector:'bg-green-300',
    dot:      'bg-green-400',
  },
} as const;

type PaletteKey = keyof typeof LAYER_PALETTES;

const LAYERS: {
  id: PaletteKey;
  n: number;
  label: string;
  sub: string;
  items: { icon: React.ElementType; name: string; sub: string }[];
}[] = [
  {
    id: 'client', n: 1, label: 'Client Layer', sub: 'ממשקי משתמש',
    items: [
      { icon: Smartphone, name: 'React Native',  sub: 'iOS · Android · RTL' },
      { icon: Globe2,     name: 'React + Vite',  sub: 'Web SPA · Heebo font' },
    ],
  },
  {
    id: 'edge', n: 2, label: 'Edge & Security', sub: 'אבטחה ו-API',
    items: [
      { icon: Shield,  name: 'CloudFront + WAF', sub: 'TLS 1.3 · OWASP rules' },
      { icon: Lock,    name: 'Cognito + KMS',    sub: 'Auth · הצפנת נתונים' },
      { icon: Cloud,   name: 'API Gateway',      sub: 'REST · Rate limiting' },
    ],
  },
  {
    id: 'agent', n: 3, label: 'AI Orchestration', sub: 'ליבת ה-Copilot',
    items: [
      { icon: Brain,      name: 'AI Agent (LangGraph)', sub: 'planner · router · critic' },
      { icon: Bot,        name: 'Amazon Bedrock',        sub: 'Claude Sonnet · Titan' },
      { icon: FileSearch, name: 'Amazon Textract',       sub: 'OCR · Medical layout' },
    ],
  },
  {
    id: 'data', n: 4, label: 'Data & Knowledge', sub: 'שכבת הנתונים',
    items: [
      { icon: Database, name: 'Amazon OpenSearch', sub: 'Knowledge graph · semantic' },
      { icon: Server,   name: 'Aurora PostgreSQL', sub: 'Case state · audit trail' },
      { icon: FileText, name: 'S3 + KMS',          sub: 'Document vault · encrypted' },
    ],
  },
];

const CAPABILITIES = [
  {
    icon: Brain,
    title: 'AI Agent Orchestrator',
    badge: 'LangGraph',
    body: 'planner מפרק בקשות, router מנתב ל-skills, critic מאמת תוצאות — שקיפות מלאה, אין קופסה שחורה.',
  },
  {
    icon: FileSearch,
    title: 'Document Intelligence',
    badge: 'Textract',
    body: 'Textract → Layout parser → Medical entity extraction → Knowledge graph matching → Gap detection.',
  },
  {
    icon: ShieldCheck,
    title: 'Security & Compliance',
    badge: 'תקן 5568',
    body: 'הצפנת KMS end-to-end, audit log מלא, הפרדת PII. תאימות תקן 5568 ורגולציית ביטוח לאומי.',
  },
];

const METRICS = [
  { label: 'זמן תגובה', value: '420ms',  sub: 'API P95 latency',    color: 'text-blue-600' },
  { label: 'עלות לתיק',  value: '$0.04', sub: 'token cost per case', color: 'text-amber-600' },
  { label: 'זמינות',     value: '99.95%',sub: 'uptime SLA',          color: 'text-green-600' },
  { label: 'תיקים/יום',  value: '4,200', sub: 'Q2 peak capacity',    color: 'text-purple-600' },
];

// Animated data-flow dot traveling through layers
function FlowConnector({ palette }: { palette: typeof LAYER_PALETTES[PaletteKey] }) {
  return (
    <div className="flex justify-center items-center py-1 relative">
      {/* vertical line */}
      <div className={cn('w-px h-8', palette.connector, 'opacity-50')} />
      {/* arrow head */}
      <div className="absolute bottom-0 translate-y-0">
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none" className="opacity-50">
          <path d="M5 7L0 0H10L5 7Z" className={palette.connector.replace('bg-', 'fill-')} />
        </svg>
      </div>
    </div>
  );
}

export default function ArchitectureScreen() {
  const [flowStep, setFlowStep] = useState(0);

  // Cycle the flow dot through layers — stops after 2 full cycles (8 steps)
  useEffect(() => {
    let count = 0;
    const id = setInterval(() => {
      count++;
      setFlowStep(s => (s + 1) % LAYERS.length);
      if (count >= LAYERS.length * 2) clearInterval(id);
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">

      {/* ── DARK HERO ──────────────────────────────────────────────────────── */}
      <PremiumCard variant="dark" className="relative overflow-hidden p-0">
        <div className="absolute inset-0 grid-bg opacity-[0.07] pointer-events-none" />
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="relative px-6 py-7 lg:px-10 lg:py-9 flex items-start justify-between gap-6 flex-wrap">
          {/* Left: text */}
          <div>
            <CardEyebrow color="blue">Reference Architecture</CardEyebrow>
            <h1 className="mt-2 text-hero text-white font-extrabold tracking-tight">
              ארכיטקטורה טכנולוגית
            </h1>
            <p className="mt-2 text-white/60 text-base max-w-lg leading-relaxed">
              4 שכבות: Client · Edge · AI Orchestration · Data —
              AWS, region אירופה, הצפנת KMS, audit trail מלא.
            </p>

            {/* Compliance badges row */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['תקן 5568', 'SOC 2 Type II', 'ISO 27001', 'IL-Cloud region'].map(b => (
                <span key={b} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 border border-white/15">
                  <CheckCircle2 className="h-3 w-3 text-green-400" /> {b}
                </span>
              ))}
            </div>
          </div>

          {/* Right: AWS badge + service list */}
          <div className="flex flex-col items-start gap-3 shrink-0" dir="ltr">
            <AwsBadge />
            <div className="space-y-1 text-xs text-white/50 text-left leading-relaxed">
              <div className="text-white/70 font-semibold text-xs uppercase tracking-wide mb-1">AWS Services</div>
              <div>Amazon Bedrock · Claude Sonnet</div>
              <div>Amazon Textract · OpenSearch</div>
              <div>Aurora PostgreSQL · S3 · KMS</div>
              <div>CloudFront · WAF · API Gateway</div>
              <div>Cognito · CloudTrail · GuardDuty</div>
            </div>
          </div>
        </div>
      </PremiumCard>

      {/* ── ARCHITECTURE DIAGRAM ───────────────────────────────────────────── */}
      <PremiumCard className="p-6 lg:p-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <CardEyebrow color="default">System Architecture</CardEyebrow>
            <h2 className="mt-1 text-slate-800">תרשים שכבות — data flow</h2>
          </div>
          {/* Animated live indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 border hairline rounded-full px-3 py-1.5">
            <AIPulseDot size="sm" />
            <span>Live data flow</span>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left flow indicator strip */}
          <div className="hidden md:flex flex-col items-center pt-3 shrink-0" aria-hidden="true">
            {LAYERS.map((layer, i) => {
              const p = LAYER_PALETTES[layer.id];
              const active = flowStep === i;
              return (
                <div key={layer.id} className="flex flex-col items-center">
                  <div className={cn(
                    'h-3 w-3 rounded-full border-2 transition-all duration-300',
                    active ? `${p.dot} border-transparent scale-125 shadow-md` : 'bg-slate-200 border-slate-200',
                  )} />
                  {i < LAYERS.length - 1 && (
                    <div className={cn(
                      'w-0.5 flex-1 min-h-[60px] transition-all duration-300',
                      flowStep > i ? p.connector : 'bg-slate-200',
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Main layers */}
          <div className="flex-1 space-y-0">
            {LAYERS.map((layer, i) => {
              const p = LAYER_PALETTES[layer.id];
              const isActive = flowStep === i;
              return (
                <div key={layer.id}>
                  {/* Layer row */}
                  <div className={cn(
                    'rounded-2xl border-2 p-4 transition-all duration-300',
                    p.border,
                    isActive ? 'shadow-card bg-white' : 'bg-slate-50/60',
                  )}>
                    {/* Layer header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        'h-8 w-8 rounded-lg grid place-items-center text-sm font-extrabold border text-num shrink-0',
                        p.badge,
                      )}>
                        {layer.n}
                      </div>
                      <div>
                        <span className={cn('font-extrabold text-sm', p.label)}>{layer.label}</span>
                        <span className="text-xs text-muted-foreground mr-2">— {layer.sub}</span>
                      </div>
                      {isActive && (
                        <div className="mr-auto">
                          <AIPulseDot size="sm" />
                        </div>
                      )}
                    </div>

                    {/* Service tiles */}
                    <div className={cn(
                      'grid gap-3',
                      layer.items.length === 2 && 'grid-cols-2',
                      layer.items.length === 3 && 'grid-cols-1 sm:grid-cols-3',
                    )}>
                      {layer.items.map((item) => (
                        <div
                          key={item.name}
                          className={cn(
                            'rounded-xl border p-3 flex items-center gap-3',
                            'hover:shadow-soft hover:-translate-y-0.5 transition-all cursor-default bg-white',
                            p.tile,
                          )}
                        >
                          <div className={cn('h-9 w-9 rounded-lg grid place-items-center shrink-0', p.iconBg)}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-800 leading-tight">{item.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{item.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connector arrow between layers */}
                  {i < LAYERS.length - 1 && (
                    <div className="flex justify-center py-1.5 relative" aria-hidden="true">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className={cn(
                          'w-px h-5 transition-colors duration-300',
                          flowStep > i ? LAYER_PALETTES[LAYERS[i + 1].id].connector : 'bg-slate-200',
                        )} />
                        {/* Arrow chevron */}
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path
                            d="M6 8L0.803848 0.5H11.1962L6 8Z"
                            className={cn(
                              'transition-colors duration-300',
                              flowStep > i
                                ? LAYER_PALETTES[LAYERS[i + 1].id].connector.replace('bg-', 'fill-')
                                : 'fill-slate-200',
                            )}
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PremiumCard>

      {/* ── OPERATIONAL METRICS — hero treatment ──────────────────────────── */}
      <PremiumCard variant="dark" className="relative overflow-hidden p-0">
        <div className="absolute inset-0 grid-bg opacity-[0.05] pointer-events-none" />
        <div className="relative px-6 py-6 lg:px-8 lg:py-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <CardEyebrow color="green">Operational Metrics</CardEyebrow>
              <h2 className="mt-1 text-white">מדדי תפעול — production-ready</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Activity className="h-3.5 w-3.5" /> last 30 days
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl bg-white/08 border border-white/12 p-5 text-center hover:bg-white/12 transition-colors"
              >
                <div className={cn('text-3xl font-extrabold text-num', m.color)}>{m.value}</div>
                <div className="mt-1.5 text-sm font-semibold text-white/80">{m.label}</div>
                <div className="mt-0.5 text-xs text-white/40">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </PremiumCard>

      {/* ── CAPABILITY CARDS ───────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CAPABILITIES.map((c) => (
          <PremiumCard key={c.title} className="p-5 hover:-translate-y-1 transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className="h-11 w-11 rounded-xl bg-accent/12 text-amber-700 grid place-items-center">
                <c.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full px-2.5 py-1">
                {c.badge}
              </span>
            </div>
            <h3 className="text-slate-800 font-bold mb-2">{c.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{c.body}</p>
          </PremiumCard>
        ))}
      </section>

    </div>
  );
}

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE VIEW — JUDGE-FACING PITCH SCREEN
// Why AWS? Why AI? Why now?
// ═══════════════════════════════════════════════════════════════════════════════

export default function ArchitectureView() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge className="bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/30 text-xs">AWS Architecture</Badge>
        <h2 className="text-2xl font-extrabold text-foreground">ארכיטקטורה — Amazon Bedrock Agent</h2>
        <p className="text-muted-foreground text-sm">פתרון מבוסס AI מקצה לקצה · מוכן לפריסה · Serverless</p>
      </div>

      {/* Architecture Diagram */}
      <Card className="overflow-hidden border-2 border-[#003B7A]/10">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Layer 1: User */}
            <ArchLayer
              color="#10B981"
              label="שכבת המשתמש"
              items={[
                { name: 'אזרח / מבוטח', desc: 'ממשק שיחה חכם', icon: '👤' },
                { name: 'React + TypeScript', desc: 'Vite · Tailwind · shadcn/ui', icon: '⚛️' },
                { name: 'Mobile Responsive', desc: 'PWA-ready', icon: '📱' },
              ]}
            />

            {/* Arrow */}
            <FlowArrow />

            {/* Layer 2: API */}
            <ArchLayer
              color="#F59E0B"
              label="שכבת ה-API"
              items={[
                { name: 'Amazon API Gateway', desc: 'REST / WebSocket', icon: '🌐' },
                { name: 'AWS Lambda', desc: 'Action Groups', icon: '⚡' },
                { name: 'Amazon Cognito', desc: 'Authentication', icon: '🔐' },
              ]}
            />

            {/* Arrow */}
            <FlowArrow />

            {/* Layer 3: AI */}
            <ArchLayer
              color="#0063CC"
              label="שכבת ה-AI (הליבה)"
              items={[
                { name: 'Amazon Bedrock Agent', desc: 'Claude · Orchestration', icon: '🧠' },
                { name: 'Knowledge Base', desc: '3,934 רשומות · RAG', icon: '📚' },
                { name: 'Amazon Textract', desc: 'OCR · מסלול ירוק', icon: '📄' },
              ]}
            />

            {/* Arrow */}
            <FlowArrow />

            {/* Layer 4: Data */}
            <ArchLayer
              color="#003B7A"
              label="שכבת הנתונים"
              items={[
                { name: 'Amazon S3', desc: 'מסמכים · Knowledge', icon: '🗄️' },
                { name: 'OpenSearch Serverless', desc: 'Vector Search · RAG', icon: '🔍' },
                { name: 'DynamoDB', desc: 'State · Tracking', icon: '💾' },
              ]}
            />

            {/* Arrow */}
            <FlowArrow />

            {/* Layer 5: Output */}
            <ArchLayer
              color="#10B981"
              label="שכבת התוצר"
              items={[
                { name: 'צ\'קליסט מותאם', desc: 'חובה / כדאי / רשות', icon: '📋' },
                { name: 'טופס BL/283', desc: 'מילוי אוטומטי', icon: '✍️' },
                { name: 'ציון מוכנות', desc: '42% → 81%', icon: '📊' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Differentiators */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-[#FF9900]/20 bg-[#FF9900]/[0.02]">
          <CardContent className="p-5 text-center">
            <div className="text-2xl mb-2">☁️</div>
            <div className="text-sm font-bold">Fully Serverless</div>
            <div className="text-xs text-muted-foreground mt-1">אין שרתים לנהל. Scales to zero.</div>
          </CardContent>
        </Card>
        <Card className="border-[#0063CC]/20 bg-[#0063CC]/[0.02]">
          <CardContent className="p-5 text-center">
            <div className="text-2xl mb-2">🧠</div>
            <div className="text-sm font-bold">AI-Native</div>
            <div className="text-xs text-muted-foreground mt-1">Bedrock Agent + Knowledge Base + Textract</div>
          </CardContent>
        </Card>
        <Card className="border-[#10B981]/20 bg-[#10B981]/[0.02]">
          <CardContent className="p-5 text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-bold">Data-Driven</div>
            <div className="text-xs text-muted-foreground mt-1">3,934 רשומות · 286 מסלול ירוק AI 5/5</div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-muted-foreground pt-4">
        <p>ביטוח לאומי · צוות: אביעד יצחקי, שאולי מזרחי, ליאור אילוז · AWS Hackathon 2026</p>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ArchLayer({ color, label, items }: { color: string; label: string; items: { name: string; desc: string; icon: string }[] }) {
  return (
    <div className="rounded-xl border-2 p-4" style={{ borderColor: `${color}30`, backgroundColor: `${color}05` }}>
      <div className="text-xs font-bold mb-3 text-center" style={{ color }}>{label}</div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-lg p-3 text-center shadow-sm border">
            <div className="text-xl mb-1">{item.icon}</div>
            <div className="text-xs font-bold text-foreground">{item.name}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center">
      <div className="w-0.5 h-6 bg-[#003B7A]/20 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 border-b-2 border-r-2 border-[#003B7A]/30" />
      </div>
    </div>
  );
}

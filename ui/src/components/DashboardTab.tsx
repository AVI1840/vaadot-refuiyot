import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { diagnosisGroups, getTotalDocRecords, getAI5Records, getDocsByDomain, getTop15Diagnoses, getMVPDiagnoses, DOMAINS } from '@/data/diagnoses';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardTab() {
  const totalDocs = useMemo(() => getTotalDocRecords(), []);
  const ai5Count = useMemo(() => getAI5Records(), []);
  const domainData = useMemo(() => getDocsByDomain(), []);
  const top15 = useMemo(() => getTop15Diagnoses(), []);
  const mvp = useMemo(() => getMVPDiagnoses(), []);

  const stats = [
    { label: 'רשומות אבחנה-מסמך', value: totalDocs.toLocaleString() },
    { label: 'רשומות AI 5/5', value: ai5Count.toLocaleString() },
    { label: 'קבוצות אבחנות', value: diagnosisGroups.length.toLocaleString() },
    { label: 'תחומי תביעה', value: DOMAINS.length.toLocaleString() },
  ];

  const barColors = ['#0368b0', '#266794', '#0c3058', '#e8a020', '#1a7a4e', '#cc7a00', '#c0392b'];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-extrabold text-secondary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>פילוח לפי תחום תביעה</CardTitle></CardHeader>
          <CardContent className="-mx-2 sm:mx-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={domainData} layout="vertical" margin={{ right: 10, left: 0 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="domain" width={90} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {domainData.map((_, i) => (
                    <Cell key={i} fill={barColors[i % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>15 אבחנות מובילות</CardTitle></CardHeader>
          <CardContent className="-mx-2 sm:mx-0">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={top15} layout="vertical" margin={{ right: 10, left: 0 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0368b0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* MVP */}
      <Card>
        <CardHeader><CardTitle>5 אבחנות MVP לפיילוט</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {mvp.map((g, i) => (
              <div key={g.id} className="border-2 border-accent rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">{i + 1}</div>
                <div className="font-bold text-foreground">{g.name}</div>
                <Badge variant="outline" className="mt-2">{g.documents.length} מסמכים</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

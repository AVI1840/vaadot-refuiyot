import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { initialCases, type TrackedCase } from '@/data/cases';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function CaseTrackingTab() {
  const [cases, setCases] = useState<TrackedCase[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('btl-tracked-cases');
    if (saved) {
      setCases([...initialCases, ...JSON.parse(saved)]);
    } else {
      setCases(initialCases);
    }
  }, []);

  const filtered = useMemo(() => {
    if (!search) return cases;
    return cases.filter(c =>
      c.diagnosis.includes(search) || c.caseNumber.includes(search) || c.domain.includes(search)
    );
  }, [cases, search]);

  const stats = useMemo(() => {
    const total = cases.length;
    const completed = cases.filter(c => c.status === 'הושלם').length;
    const partial = cases.filter(c => c.status === 'חלקי').length;
    const avg = total > 0 ? Math.round(cases.reduce((s, c) => s + c.completeness, 0) / total) : 0;
    return { total, completed, partial, avg };
  }, [cases]);

  const exportCSV = () => {
    const headers = ['תאריך', 'מס\' תיק', 'אבחנה', 'תחום', 'הוגשו', 'חסרים', 'שלמות %', 'סטטוס'];
    const rows = cases.map(c => [c.date, c.caseNumber, c.diagnosis, c.domain, c.submittedDocs, c.missingDocs, c.completeness, c.status]);
    const csv = '\uFEFF' + [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tracked-cases.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('הקובץ הורד');
  };

  const statusBadge = (status: string) => {
    const cls = status === 'הושלם' ? 'bg-success text-success-foreground' :
                status === 'חלקי' ? 'bg-warning text-warning-foreground' :
                'bg-destructive text-destructive-foreground';
    return <Badge className={cls}>{status}</Badge>;
  };

  const compColor = (v: number) => v >= 80 ? 'text-success' : v >= 50 ? 'text-warning' : 'text-destructive';

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'סה"כ תיקים', value: stats.total },
          { label: 'הושלמו', value: stats.completed },
          { label: 'חלקיים', value: stats.partial },
          { label: 'ממוצע שלמות', value: `${stats.avg}%` },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-extrabold text-secondary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle>מעקב תיקים</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="חפש תיק..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full sm:w-60 min-h-[44px]"
                aria-label="חיפוש תיק"
              />
              <Button variant="outline" onClick={exportCSV} className="min-h-[44px]">
                <Download className="h-4 w-4 ml-1" /> ייצוא CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>תאריך</TableHead>
                  <TableHead>מס' תיק</TableHead>
                  <TableHead>אבחנה</TableHead>
                  <TableHead>תחום</TableHead>
                  <TableHead>הוגשו</TableHead>
                  <TableHead>חסרים</TableHead>
                  <TableHead>שלמות</TableHead>
                  <TableHead>סטטוס</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.date}</TableCell>
                    <TableCell className="font-mono">{c.caseNumber}</TableCell>
                    <TableCell className="font-semibold">{c.diagnosis}</TableCell>
                    <TableCell>{c.domain}</TableCell>
                    <TableCell>{c.submittedDocs}</TableCell>
                    <TableCell>{c.missingDocs}</TableCell>
                    <TableCell className={`font-bold ${compColor(c.completeness)}`}>{c.completeness}%</TableCell>
                    <TableCell>{statusBadge(c.status)}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      לא נמצאו תיקים
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

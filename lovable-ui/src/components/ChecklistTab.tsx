import { useState, useMemo } from 'react';
import { diagnosisGroups, type DiagnosisGroup, type DocumentItem } from '@/data/diagnoses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Printer, Send, Save, ArrowRight, ArrowLeft, Check, Mail, Info, MapPin, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

const COMMITTEE_TYPES = [
  { id: 'general', icon: '🏥', title: 'ועדה רפואית לנכות כללית', desc: 'קביעת אחוזי נכות רפואית' },
  { id: 'work', icon: '⚒️', title: 'ועדה רפואית לנפגעי עבודה', desc: 'נכות מתאונת עבודה או מחלת מקצוע' },
  { id: 'mobility', icon: '🚗', title: 'ועדה רפואית לניידות', desc: 'זכאות לקצבת ניידות' },
  { id: 'nursing', icon: '👴', title: 'ועדה רפואית לסיעוד', desc: 'קביעת רמת תלות' },
  { id: 'appeal', icon: '⚖️', title: 'ועדת ערר', desc: 'ערעור על החלטת ועדה קודמת' },
];

export default function ChecklistTab() {
  const [step, setStep] = useState(1);
  const [selectedCommittee, setSelectedCommittee] = useState<string>('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [claimantName, setClaimantName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDiagnosis = (id: string) => {
    setSelectedDiagnoses(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const loadedGroups = useMemo(() =>
    diagnosisGroups.filter(g => selectedDiagnoses.includes(g.id)),
    [selectedDiagnoses]
  );

  const allDocs = useMemo(() => loadedGroups.flatMap(g => g.documents), [loadedGroups]);
  const checkedCount = useMemo(() => allDocs.filter(d => checkedDocs[d.id]).length, [allDocs, checkedDocs]);
  const totalDocs = allDocs.length;

  // Deduplicate docs by name for display
  const deduplicatedDocs = useMemo(() => {
    const seen = new Map<string, DocumentItem>();
    allDocs.forEach(d => {
      if (!seen.has(d.name)) seen.set(d.name, d);
    });
    return Array.from(seen.values());
  }, [allDocs]);

  const requiredDocs = useMemo(() => deduplicatedDocs.filter(d => d.priority === 'required'), [deduplicatedDocs]);
  const recommendedDocs = useMemo(() => deduplicatedDocs.filter(d => d.priority === 'recommended'), [deduplicatedDocs]);
  const optionalDocs = useMemo(() => deduplicatedDocs.filter(d => d.priority === 'optional'), [deduplicatedDocs]);

  const allRequiredChecked = useMemo(() =>
    requiredDocs.length > 0 && requiredDocs.every(d => checkedDocs[d.id]),
    [requiredDocs, checkedDocs]
  );

  // Readiness score (1-10): required docs = 3 points each, recommended = 2, optional = 1
  const readinessScore = useMemo(() => {
    if (deduplicatedDocs.length === 0) return 0;
    const weights = { required: 3, recommended: 2, optional: 1 };
    const maxScore = deduplicatedDocs.reduce((sum, d) => sum + weights[d.priority], 0);
    const currentScore = deduplicatedDocs.filter(d => checkedDocs[d.id]).reduce((sum, d) => sum + weights[d.priority], 0);
    return maxScore > 0 ? Math.round((currentScore / maxScore) * 10) : 0;
  }, [deduplicatedDocs, checkedDocs]);

  const readinessLabel = readinessScore >= 8 ? 'מוכנות מלאה' : readinessScore >= 5 ? 'ניתן לכנס ועדה' : 'לא מוכן לכינוס ועדה';
  const readinessColor = readinessScore >= 8 ? 'text-success' : readinessScore >= 5 ? 'text-warning' : 'text-destructive';
  const readinessBg = readinessScore >= 8 ? 'bg-success/10 border-success' : readinessScore >= 5 ? 'bg-warning/10 border-warning' : 'bg-destructive/10 border-destructive';
  const readinessIcon = readinessScore >= 8 ? '🟢' : readinessScore >= 5 ? '🟡' : '🔴';

  const toggleDoc = (docId: string) => {
    setCheckedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const filteredDiagnosisGroups = useMemo(() => {
    if (!searchTerm) return diagnosisGroups;
    return diagnosisGroups.filter(g => g.name.includes(searchTerm));
  }, [searchTerm]);

  const groupedByDomain = useMemo(() => {
    const map: Record<string, DiagnosisGroup[]> = {};
    filteredDiagnosisGroups.forEach(g => {
      if (!map[g.domain]) map[g.domain] = [];
      map[g.domain].push(g);
    });
    return map;
  }, [filteredDiagnosisGroups]);

  const generateMessage = () => {
    const name = claimantName || '[שם]';
    const unchecked = deduplicatedDocs.filter(d => !checkedDocs[d.id]);
    if (unchecked.length === 0) return `שלום ${name},\nכל המסמכים הוגשו. תודה!`;
    const docList = unchecked.map((d, i) => `  ${i + 1}. ${d.name}`).join('\n');
    const diagNames = loadedGroups.map(g => g.name).join(', ');
    return `שלום ${name},\nבהמשך לפנייתך בנושא ${diagNames},\nלהשלמת הטיפול בתיקך, נדרשים המסמכים הבאים:\n${docList}\n\nנא להגיש את המסמכים בהקדם האפשרי.\nבברכה, ועדות רפואיות`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMessage());
    toast.success('ההודעה הועתקה');
  };
  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(generateMessage())}`, '_blank');
  };
  const handleEmail = () => {
    const subject = encodeURIComponent('מסמכים נדרשים לוועדה רפואית');
    const body = encodeURIComponent(generateMessage());
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  const handlePrint = () => window.print();
  const handleSave = () => {
    const data = { selectedCommittee, selectedDiagnoses, checkedDocs, claimantName, savedAt: new Date().toISOString() };
    localStorage.setItem('btl-checklist-save', JSON.stringify(data));
    toast.success('הצ׳קליסט נשמר בהצלחה');
  };

  const handleSaveCase = (group: DiagnosisGroup) => {
    const cases = JSON.parse(localStorage.getItem('btl-tracked-cases') || '[]');
    const total = group.documents.length;
    const submitted = group.documents.filter(d => checkedDocs[d.id]).length;
    const comp = total > 0 ? Math.round((submitted / total) * 100) : 0;
    const newCase = {
      id: String(Date.now()),
      date: new Date().toISOString().split('T')[0],
      caseNumber: `T-${String(10239 + cases.length).padStart(5, '0')}`,
      diagnosis: group.name,
      domain: group.domain,
      submittedDocs: submitted,
      missingDocs: total - submitted,
      completeness: comp,
      status: comp === 100 ? 'הושלם' : comp >= 50 ? 'חלקי' : 'חסר',
    };
    cases.push(newCase);
    localStorage.setItem('btl-tracked-cases', JSON.stringify(cases));
    toast.success(`תיק ${newCase.caseNumber} נשמר`);
  };

  const priorityConfig = {
    required: { label: 'חובה', borderClass: 'border-r-4 border-r-destructive', badgeClass: 'bg-destructive text-destructive-foreground' },
    recommended: { label: 'מומלץ', borderClass: 'border-r-4 border-r-warning', badgeClass: 'bg-warning text-warning-foreground' },
    optional: { label: 'אופציונלי', borderClass: 'border-r-4 border-r-secondary', badgeClass: 'bg-secondary text-secondary-foreground' },
  };

  const renderDocCard = (doc: DocumentItem) => (
    <div
      key={doc.id}
      className={`p-4 rounded-lg border transition-colors ${priorityConfig[doc.priority].borderClass} ${checkedDocs[doc.id] ? 'bg-success/10' : 'bg-card'}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          id={doc.id}
          checked={!!checkedDocs[doc.id]}
          onCheckedChange={() => toggleDoc(doc.id)}
          className="h-6 w-6 min-w-[44px] min-h-[44px] flex items-center justify-center mt-0.5"
          aria-label={`${doc.name} - ${priorityConfig[doc.priority].label}`}
        />
        <label htmlFor={doc.id} className="flex-1 cursor-pointer space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold ${checkedDocs[doc.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {doc.name}
            </span>
            <Badge className={`text-[10px] ${priorityConfig[doc.priority].badgeClass}`}>
              {priorityConfig[doc.priority].label}
            </Badge>
            {doc.aiRating && (
              <Badge className="bg-accent text-accent-foreground text-[10px]">
                AI {doc.aiRating}/5
              </Badge>
            )}
          </div>
          {doc.description && (
            <p className="text-sm text-muted-foreground">{doc.description}</p>
          )}
        </label>
      </div>

      {(doc.whereToGet || doc.tip) && (
        <div className="mr-[56px] mt-2 space-y-1.5">
          {doc.whereToGet && (
            <div className="flex items-center gap-1.5 text-xs text-tertiary">
              <MapPin className="h-3 w-3 shrink-0" />
              <span><strong>איפה להשיג:</strong> {doc.whereToGet}</span>
            </div>
          )}
          {doc.tip && (
            <div className="flex items-start gap-1.5 text-xs bg-info/50 text-info-foreground rounded-md p-2">
              <Lightbulb className="h-3 w-3 shrink-0 mt-0.5" />
              <span>{doc.tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2" role="group" aria-label="שלבי הוויזארד">
        {[
          { num: 1, label: 'סוג ועדה' },
          { num: 2, label: 'אבחנות' },
          { num: 3, label: 'צ׳קליסט' },
        ].map(s => (
          <div key={s.num} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => {
                  if (s.num === 1) setStep(1);
                  else if (s.num === 2 && selectedCommittee) setStep(2);
                  else if (s.num === 3 && selectedDiagnoses.length > 0) setStep(3);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  step === s.num ? 'bg-secondary text-secondary-foreground' :
                  step > s.num ? 'bg-success text-success-foreground' :
                  'bg-muted/30 text-muted-foreground'
                }`}
                aria-label={`שלב ${s.num} — ${s.label}`}
                aria-current={step === s.num ? 'step' : undefined}
              >
                {step > s.num ? <Check className="h-5 w-5" /> : s.num}
              </button>
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
            </div>
            {s.num < 3 && <div className={`w-12 h-1 rounded mb-5 ${step > s.num ? 'bg-success' : 'bg-muted/30'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-center">שלב 1 — סוג הוועדה</h2>
          <p className="text-center text-muted-foreground">בחר את סוג הוועדה הרפואית שאליה אתה מוזמן</p>
          <div className="grid md:grid-cols-2 gap-4 max-w-[800px] mx-auto">
            {COMMITTEE_TYPES.map(ct => (
              <button
                key={ct.id}
                onClick={() => { setSelectedCommittee(ct.id); setStep(2); }}
                className={`text-right p-5 rounded-xl border-2 transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:shadow-md ${
                  selectedCommittee === ct.id
                    ? 'border-accent bg-accent/10 shadow-md'
                    : 'border-border bg-card hover:border-secondary/50'
                }`}
                aria-label={ct.title}
                aria-pressed={selectedCommittee === ct.id}
              >
                <div className="text-3xl mb-2">{ct.icon}</div>
                <div className="font-bold text-foreground text-lg">{ct.title}</div>
                <div className="text-muted-foreground text-sm mt-1">{ct.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2>שלב 2 — בחירת תחום רפואי ואבחנות</h2>
            <Button variant="ghost" onClick={() => setStep(1)} className="min-h-[44px]" aria-label="חזור לשלב 1">
              <ArrowRight className="h-4 w-4 ml-1" />
              חזרה
            </Button>
          </div>
          <p className="text-muted-foreground">בחר אבחנה אחת או יותר. ניתן לבחור ממספר תחומים.</p>

          <Input
            placeholder="🔍 חפש אבחנה..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-md min-h-[44px]"
            aria-label="חיפוש אבחנה"
          />

          {selectedDiagnoses.length > 0 && (
            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="p-3">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-bold text-accent-foreground">נבחרו {selectedDiagnoses.length}:</span>
                  {selectedDiagnoses.map(id => {
                    const g = diagnosisGroups.find(x => x.id === id);
                    return g ? (
                      <Badge
                        key={id}
                        className="bg-secondary text-secondary-foreground cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => toggleDiagnosis(id)}
                        role="button"
                        aria-label={`הסר ${g.name}`}
                      >
                        {g.name} ✕
                      </Badge>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {Object.entries(groupedByDomain).map(([domain, groups]) => (
              <Card key={domain}>
                <CardHeader className="py-3 pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {domain}
                    <Badge variant="outline" className="text-[10px]">{groups.length} אבחנות</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 pb-4">
                  {groups.map(g => (
                    <button
                      key={g.id}
                      onClick={() => toggleDiagnosis(g.id)}
                      className={`px-3 py-2 rounded-full text-sm font-medium border transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        selectedDiagnoses.includes(g.id)
                          ? 'bg-secondary text-secondary-foreground border-secondary shadow-sm'
                          : 'bg-card text-foreground border-border hover:border-secondary/50 hover:bg-secondary/5'
                      }`}
                      aria-pressed={selectedDiagnoses.includes(g.id)}
                      aria-label={`${g.name} — ${g.documents.length} מסמכים`}
                    >
                      {g.name}
                      <span className="mr-1 text-xs opacity-70">({g.documents.length})</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedDiagnoses.length > 0 && (
            <div className="flex justify-center sticky bottom-4">
              <Button
                onClick={() => setStep(3)}
                className="min-h-[48px] bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 shadow-lg text-base"
              >
                <ArrowLeft className="h-5 w-5 ml-2" />
                המשך לצ׳קליסט ({selectedDiagnoses.length} אבחנות, {deduplicatedDocs.length} מסמכים)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2>שלב 3 — הצ׳קליסט שלך</h2>
            <Button variant="ghost" onClick={() => setStep(2)} className="min-h-[44px]" aria-label="חזור לשלב 2">
              <ArrowRight className="h-4 w-4 ml-1" />
              חזרה
            </Button>
          </div>

          {/* Progress */}
          <Card className="border-secondary/20">
            <CardContent className="p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">הכנת {checkedCount} מתוך {totalDocs} מסמכים</span>
                <span className="font-bold text-lg">{totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0}%</span>
              </div>
              <Progress
                value={totalDocs > 0 ? (checkedCount / totalDocs) * 100 : 0}
                className={`h-4 rounded-full ${checkedCount === totalDocs && totalDocs > 0 ? '[&>div]:bg-success' : checkedCount >= totalDocs * 0.5 ? '[&>div]:bg-warning' : '[&>div]:bg-destructive'}`}
              />
            </CardContent>
          </Card>

          {/* Readiness Score */}
          <Card className={`border-2 ${readinessBg}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`text-5xl font-extrabold ${readinessColor}`}>
                    {readinessScore}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">ציון מוכנות</div>
                    <div className={`font-bold text-lg ${readinessColor}`}>
                      {readinessIcon} {readinessLabel}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-8 rounded-sm transition-colors ${
                        i < readinessScore
                          ? readinessScore >= 8 ? 'bg-success' : readinessScore >= 5 ? 'bg-warning' : 'bg-destructive'
                          : 'bg-muted/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {readinessScore < 5 && (
                <p className="text-sm text-destructive mt-3 font-semibold">
                  ⚠️ נדרשת השלמת מסמכים — לא ניתן לכנס ועדה מתחת לציון 5
                </p>
              )}
              {readinessScore >= 5 && readinessScore < 8 && (
                <p className="text-sm text-warning mt-3">
                  ✅ ניתן לכנס ועדה — מומלץ להשלים מסמכים נוספים לחיזוק התיק
                </p>
              )}
            </CardContent>
          </Card>

          {/* Success */}
          {allRequiredChecked && (
            <Card className="border-2 border-success bg-success/10">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-success font-bold text-xl">כל מסמכי החובה מוכנים!</h3>
                <p className="text-muted-foreground mt-2">אתה מוכן לוועדה הרפואית. בהצלחה!</p>
              </CardContent>
            </Card>
          )}

          {/* Required */}
          {requiredDocs.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-destructive">
                🔴 חובה ({requiredDocs.length})
              </h3>
              {requiredDocs.map(renderDocCard)}
            </div>
          )}

          {/* Recommended */}
          {recommendedDocs.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-warning">
                🟡 מומלץ ({recommendedDocs.length})
              </h3>
              {recommendedDocs.map(renderDocCard)}
            </div>
          )}

          {/* Optional */}
          {optionalDocs.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-secondary">
                🔵 אופציונלי ({optionalDocs.length})
              </h3>
              {optionalDocs.map(renderDocCard)}
            </div>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={handlePrint} variant="outline" className="min-h-[44px]">
                  <Printer className="h-4 w-4 ml-1" /> 🖨️ הדפס צ׳קליסט
                </Button>
                <Button onClick={handleWhatsApp} variant="outline" className="min-h-[44px]">
                  <Send className="h-4 w-4 ml-1" /> 📱 שלח ב-WhatsApp
                </Button>
                <Button onClick={handleEmail} variant="outline" className="min-h-[44px]">
                  <Mail className="h-4 w-4 ml-1" /> 📧 שלח במייל
                </Button>
                <Button onClick={handleSave} className="min-h-[44px] bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Save className="h-4 w-4 ml-1" /> 💾 שמור
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Per-group tracking */}
          {loadedGroups.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">שמירת מעקב לפי אבחנה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {loadedGroups.map(group => {
                  const total = group.documents.length;
                  const submitted = group.documents.filter(d => checkedDocs[d.id]).length;
                  const comp = total > 0 ? Math.round((submitted / total) * 100) : 0;
                  return (
                    <div key={group.id} className="flex items-center justify-between flex-wrap gap-2 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{group.name}</span>
                        <Badge variant="outline" className="text-[10px]">{comp}%</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleSaveCase(group)} className="min-h-[44px]">
                        <Save className="h-4 w-4 ml-1" /> שמור מעקב
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {loadedGroups.length === 1 && (
            <Button variant="outline" onClick={() => handleSaveCase(loadedGroups[0])} className="min-h-[44px]">
              <Save className="h-4 w-4 ml-1" /> 💾 שמור מעקב לתיק
            </Button>
          )}

          {/* Message generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                יצירת הודעה לתובע
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label htmlFor="claimant-name" className="block font-semibold mb-1">שם התובע</label>
                <Input
                  id="claimant-name"
                  value={claimantName}
                  onChange={e => setClaimantName(e.target.value)}
                  placeholder="הזן שם..."
                  className="min-h-[44px] max-w-sm"
                  aria-label="שם התובע"
                />
              </div>
              <Textarea
                value={generateMessage()}
                readOnly
                className="min-h-[140px] text-sm font-mono"
                aria-label="הודעה שנוצרה"
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopy} variant="outline" className="min-h-[44px]">
                  <Copy className="h-4 w-4 ml-1" /> 📋 העתק
                </Button>
                <Button onClick={handleWhatsApp} variant="outline" className="min-h-[44px]">
                  <Send className="h-4 w-4 ml-1" /> 📱 WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

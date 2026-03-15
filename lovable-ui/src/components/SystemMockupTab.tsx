import { useState, useMemo } from 'react';
import { diagnosisGroups, getMVPDiagnoses } from '@/data/diagnoses';
import type { DocumentItem, DiagnosisGroup } from '@/data/diagnoses';
import { Check, Upload, FileText, AlertCircle, Info, ChevronDown, ChevronUp, Search, X, User, Phone } from 'lucide-react';

/* BTL Design System — NO GREEN anywhere */
const C = {
  navy: '#0c3058',
  blue: '#0368b0',
  blueH: '#025a8f',
  act: '#0068f5',
  sec: '#266794',
  lBg: '#e8f3ff',
  pBg: '#f5f9ff',
  w: '#fff',
  g1: '#f3f4f6',
  g2: '#e5e7eb',
  g3: '#d1d5db',
  g5: '#6b7280',
  g7: '#374151',
  g9: '#111827',
  wn: '#c2410c',
  er: '#b91c1c',
};

const FR = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068f5] focus-visible:ring-offset-2';

/* Circular progress SVG */
function CircleProgress({ pct, size = 72, stroke = 6 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  // Color: red < 50%, orange 50-79%, blue >= 80%
  const color = pct >= 80 ? C.blue : pct >= 50 ? C.wn : C.er;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.g2} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }} />
    </svg>
  );
}

const CLAIMS = [
  { id: 'child' as const, label: 'ילד נכה', icon: '👶', domain: 'ילד נכה' },
  { id: 'general' as const, label: 'נכות כללית', icon: '🏥', domain: 'נכות' },
];

const MAX_SEL = 4;
const PILL_BG = [C.navy, C.blue, C.sec, C.act];

export default function SystemMockupTab() {
  const mvp = getMVPDiagnoses();
  const [claim, setClaim] = useState<'child' | 'general'>('child');
  const [selIds, setSelIds] = useState<string[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<'clerk' | 'citizen'>('clerk');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  const dom = CLAIMS.find(c => c.id === claim)!.domain;
  const available = useMemo(() => mvp.filter(g => g.domain === dom), [dom, mvp]);

  // All diagnoses in this domain for search
  const allInDomain = useMemo(() => diagnosisGroups.filter(g => g.domain === dom), [dom]);
  const searchResults = useMemo(() => {
    if (!searchQ.trim()) return allInDomain.filter(g => !selIds.includes(g.id));
    return allInDomain.filter(g => !selIds.includes(g.id) && g.name.includes(searchQ));
  }, [allInDomain, selIds, searchQ]);

  const selGroups = useMemo(() =>
    selIds.map(id => diagnosisGroups.find(x => x.id === id)).filter(Boolean) as DiagnosisGroup[],
    [selIds]);

  /* Merge & deduplicate documents across selected diagnoses by name */
  const merged = useMemo(() => {
    const seen = new Map<string, { doc: DocumentItem; from: string[] }>();
    for (const g of selGroups) {
      for (const d of g.documents) {
        const ex = seen.get(d.name);
        if (ex) {
          if (!ex.from.includes(g.name)) ex.from.push(g.name);
          const p: Record<string, number> = { required: 3, recommended: 2, optional: 1 };
          if (p[d.priority] > p[ex.doc.priority]) ex.doc = { ...d };
        } else {
          seen.set(d.name, { doc: d, from: [g.name] });
        }
      }
    }
    return Array.from(seen.values());
  }, [selGroups]);

  const reqDocs = useMemo(() => merged.filter(m => m.doc.priority === 'required'), [merged]);
  const recDocs = useMemo(() => merged.filter(m => m.doc.priority !== 'required'), [merged]);
  const reqDone = reqDocs.filter(m => checked[m.doc.id]).length;
  const reqPct = reqDocs.length > 0 ? Math.round((reqDone / reqDocs.length) * 100) : 0;
  const sharedCount = merged.filter(m => m.from.length > 1).length;

  const toggle = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const pickClaim = (id: 'child' | 'general') => { setClaim(id); setSelIds([]); setChecked({}); };
  const addDiag = (id: string) => {
    if (selIds.length >= MAX_SEL || selIds.includes(id)) return;
    setSelIds(p => [...p, id]); setChecked({}); setSearchOpen(false); setSearchQ('');
  };
  const removeDiag = (id: string) => { setSelIds(p => p.filter(x => x !== id)); setChecked({}); };

  return (
    <div className="max-w-[1100px] mx-auto space-y-4" dir="rtl" lang="he">
      {/* View toggle + claim type */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: C.g1 }} role="tablist">
          {(['clerk', 'citizen'] as const).map(v => (
            <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-md text-xs font-bold min-h-[44px] transition ${FR} ${view === v ? 'bg-white shadow-sm' : ''}`}
              style={{ color: view === v ? C.navy : C.g5 }}>
              {v === 'clerk' ? '🏢 מסך פקיד (DocClaim)' : '👤 מסך אזרח (btl.gov.il)'}
            </button>
          ))}
        </div>
        <div className="flex gap-1" role="radiogroup" aria-label="סוג תביעה">
          {CLAIMS.map(ct => (
            <button key={ct.id} role="radio" aria-checked={claim === ct.id} onClick={() => pickClaim(ct.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border min-h-[44px] transition ${FR}`}
              style={claim === ct.id ? { background: C.navy, borderColor: C.navy, color: C.w } : { borderColor: C.g3, color: C.g5, background: C.w }}>
              {ct.icon} {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ CLERK VIEW ═══ */}
      {view === 'clerk' && (
        <section className="rounded-lg overflow-hidden shadow-lg text-sm" style={{ border: `1px solid ${C.g2}`, boxShadow: '0 2px 8px rgba(6,77,173,0.1)' }}>
          {/* System chrome */}
          <div className="flex items-center justify-between px-3 py-1.5" style={{ background: '#1a2332', color: '#7b8fa3', fontSize: '10px' }}>
            <div className="flex items-center gap-2"><span className="opacity-50">⚙</span><span>DocClaim v4.2</span><span className="opacity-30">|</span><span>מערכת תביעות</span></div>
            <span className="px-2 py-0.5 rounded text-[9px]" style={{ background: '#2a3a4e' }}>שרה כ. | סניף ירושלים</span>
          </div>
          {/* Navy header */}
          <header style={{ background: C.navy }} className="px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow">
                <span style={{ color: C.navy }} className="text-[12px] font-extrabold">ב״ל</span>
              </div>
              <div className="text-white">
                <h2 className="font-bold text-sm sm:text-base">תביעה לגמלת {dom}</h2>
                <p className="text-white/50 text-[11px]">המוסד לביטוח לאומי • בקשה 2401-4287</p>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="p-4 sm:p-6 space-y-5" style={{ background: C.pBg }}>
            {/* Diagnosis selector */}
            <div className="rounded-lg border p-4" style={{ background: C.w, borderColor: C.g2 }}>
              <label className="text-[11px] font-semibold block mb-2" style={{ color: C.sec }}>
                בחר ליקויים (עד {MAX_SEL}) <span style={{ color: C.er }}>*</span>
              </label>

              {/* Selected pills */}
              <div className="flex items-center gap-2 flex-wrap min-h-[44px] p-2 rounded-lg border" style={{ borderColor: selIds.length ? C.blue : C.g3, background: selIds.length ? C.lBg : C.w }}>
                {selGroups.map((g, idx) => (
                  <span key={g.id} className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                    style={{ background: PILL_BG[idx % PILL_BG.length] }}>
                    {g.name}
                    <button onClick={() => removeDiag(g.id)} className={`opacity-70 hover:opacity-100 ${FR}`} aria-label={`הסר ${g.name}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {selIds.length < MAX_SEL && (
                  <button onClick={() => setSearchOpen(!searchOpen)} className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded ${FR}`} style={{ color: C.sec }}>
                    <Search className="h-3 w-3" /> {selIds.length === 0 ? 'בחר ליקוי...' : 'הוסף ליקוי...'}
                  </button>
                )}
              </div>

              {/* Search dropdown */}
              {searchOpen && selIds.length < MAX_SEL && (
                <div className="mt-2 rounded-lg border shadow-lg max-h-60 overflow-y-auto" style={{ borderColor: C.g2, background: C.w }}>
                  <div className="sticky top-0 p-2" style={{ background: C.w, borderBottom: `1px solid ${C.g2}` }}>
                    <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="חפש ליקוי..."
                      className={`w-full px-3 py-2 rounded border text-xs ${FR}`} style={{ borderColor: C.g3 }} autoFocus />
                  </div>
                  {searchResults.length === 0 && <div className="p-3 text-center text-xs" style={{ color: C.g5 }}>לא נמצאו תוצאות</div>}
                  {searchResults.map(g => (
                    <button key={g.id} onClick={() => addDiag(g.id)}
                      className={`w-full text-right px-3 py-2.5 text-xs hover:bg-[#e8f3ff] transition flex items-center justify-between ${FR}`}
                      style={{ color: C.navy, borderBottom: `1px solid ${C.g1}` }}>
                      <span className="font-medium">{g.name}</span>
                      <span className="text-[10px]" style={{ color: C.g5 }}>{g.documents.length} מסמכים</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick picks from MVP */}
              {selIds.length === 0 && !searchOpen && (
                <div className="mt-3">
                  <p className="text-[10px] mb-1.5" style={{ color: C.g5 }}>ליקויים נפוצים:</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {available.map(g => (
                      <button key={g.id} onClick={() => addDiag(g.id)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition hover:border-[#0368b0] ${FR}`}
                        style={{ borderColor: C.g3, color: C.sec, background: C.w }}>
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results — only show when diagnoses selected */}
            {selIds.length > 0 && (
              <>
                {/* Summary bar with circular progress */}
                <div className="rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4" style={{ background: C.lBg, border: `1px solid ${C.blue}30` }}>
                  <div className="relative w-[72px] h-[72px] shrink-0">
                    <CircleProgress pct={reqPct} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-extrabold" style={{ color: reqPct >= 80 ? C.blue : reqPct >= 50 ? C.wn : C.er }}>{reqPct}%</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-right">
                    <div className="text-sm font-bold" style={{ color: C.navy }}>
                      {reqPct === 100 ? '✓ כל מסמכי החובה הוגשו' : reqPct >= 80 ? 'כמעט שם — חסרים מעט מסמכים' : reqPct >= 50 ? 'ניתן לכנס ועדה — מומלץ להשלים' : 'חסרים מסמכי חובה'}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: C.sec }}>
                      {reqDone}/{reqDocs.length} מסמכי חובה • {merged.length} מסמכים ייחודיים סה"כ
                      {sharedCount > 0 && <span style={{ color: C.blue }}> • {sharedCount} משותפים</span>}
                    </div>
                    {reqPct === 100 && reqDocs.length > 0 && (
                      <div className="text-[11px] font-bold mt-1 px-3 py-1 rounded-full inline-block text-white" style={{ background: C.blue }}>
                        ⚡ מסלול מהיר — אישור תוך יום
                      </div>
                    )}
                  </div>
                </div>

                {/* Two-column doc tables */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Right: חובה */}
                  <div className="rounded-lg overflow-hidden border" style={{ borderColor: C.g2 }}>
                    <div className="font-bold text-xs px-4 py-2.5 flex items-center justify-between text-white" style={{ background: C.navy }}>
                      <span>📋 מסמכי חובה ({reqDone}/{reqDocs.length})</span>
                    </div>
                    <div className="bg-white divide-y" style={{ borderColor: C.g1 }}>
                      {reqDocs.map((m, i) => (
                        <DocRow key={m.doc.id} d={m.doc} i={i + 1} on={!!checked[m.doc.id]} toggle={() => toggle(m.doc.id)}
                          accent={C.navy} from={m.from} multi={selGroups.length > 1} />
                      ))}
                      {reqDocs.length === 0 && <Empty />}
                    </div>
                  </div>
                  {/* Left: מומלץ + אופציונלי */}
                  <div className="rounded-lg overflow-hidden border" style={{ borderColor: C.g2 }}>
                    <div className="font-bold text-xs px-4 py-2.5 flex items-center justify-between text-white" style={{ background: C.blue }}>
                      <span>📎 מומלץ / אופציונלי ({recDocs.filter(m => checked[m.doc.id]).length}/{recDocs.length})</span>
                    </div>
                    <div className="bg-white divide-y" style={{ borderColor: C.g1 }}>
                      {recDocs.map((m, i) => (
                        <DocRow key={m.doc.id} d={m.doc} i={i + 1} on={!!checked[m.doc.id]} toggle={() => toggle(m.doc.id)}
                          accent={C.blue} from={m.from} multi={selGroups.length > 1} />
                      ))}
                      {recDocs.length === 0 && <Empty />}
                    </div>
                  </div>
                </div>
              </>
            )}

            {selIds.length === 0 && (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto mb-3" style={{ color: C.g3 }} />
                <p className="text-sm font-medium" style={{ color: C.g5 }}>בחר ליקוי אחד או יותר כדי לראות את המסמכים הנדרשים</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══ CITIZEN VIEW ═══ */}
      {view === 'citizen' && (
        <section className="rounded-lg overflow-hidden shadow-lg text-sm" style={{ border: `1px solid ${C.g2}` }}>
          {/* Gov.il bar */}
          <div className="flex items-center justify-between px-4 py-1.5 text-white" style={{ background: C.navy, fontSize: '10px' }}>
            <div className="flex items-center gap-3"><span className="font-bold">gov.il</span><span className="opacity-30">|</span><span className="opacity-60">שירותי ממשלה</span></div>
            <div className="flex items-center gap-3 opacity-60"><span>נגישות</span><span>עברית</span></div>
          </div>
          {/* NII header */}
          <header style={{ background: C.navy }} className="px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg">
                <span style={{ color: C.navy }} className="text-[13px] font-extrabold">ב״ל</span>
              </div>
              <div className="text-white">
                <h2 className="font-bold text-base sm:text-lg">המוסד לביטוח לאומי</h2>
                <p className="text-white/60 text-xs">הכנה לוועדה רפואית — בדוק מה צריך להביא</p>
              </div>
            </div>
          </header>
          <nav className="px-4 sm:px-6 py-2 text-[10px]" style={{ background: C.g1, borderBottom: `1px solid ${C.g2}`, color: C.g5 }}>
            דף הבית › {dom} › <span className="font-semibold" style={{ color: C.blue }}>הכנה לוועדה רפואית</span>
          </nav>

          <div className="bg-white p-4 sm:p-6 space-y-5">
            {/* Diagnosis selector — same logic */}
            <div className="rounded-lg border p-4" style={{ background: C.lBg, borderColor: `${C.blue}30` }}>
              <label className="text-xs font-bold block mb-2" style={{ color: C.navy }}>מה הבעיה הרפואית שלך?</label>
              <div className="flex items-center gap-2 flex-wrap min-h-[44px] p-2 rounded-lg border bg-white" style={{ borderColor: selIds.length ? C.blue : C.g3 }}>
                {selGroups.map((g, idx) => (
                  <span key={g.id} className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                    style={{ background: PILL_BG[idx % PILL_BG.length] }}>
                    {g.name}
                    <button onClick={() => removeDiag(g.id)} className={`opacity-70 hover:opacity-100 ${FR}`} aria-label={`הסר ${g.name}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {selIds.length < MAX_SEL && (
                  <button onClick={() => setSearchOpen(!searchOpen)} className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded ${FR}`} style={{ color: C.sec }}>
                    <Search className="h-3 w-3" /> {selIds.length === 0 ? 'בחר ליקוי...' : 'הוסף ליקוי...'}
                  </button>
                )}
              </div>
              {searchOpen && selIds.length < MAX_SEL && (
                <div className="mt-2 rounded-lg border shadow-lg max-h-60 overflow-y-auto bg-white" style={{ borderColor: C.g2 }}>
                  <div className="sticky top-0 p-2 bg-white" style={{ borderBottom: `1px solid ${C.g2}` }}>
                    <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="חפש ליקוי..."
                      className={`w-full px-3 py-2 rounded border text-xs ${FR}`} style={{ borderColor: C.g3 }} autoFocus />
                  </div>
                  {searchResults.length === 0 && <div className="p-3 text-center text-xs" style={{ color: C.g5 }}>לא נמצאו תוצאות</div>}
                  {searchResults.map(g => (
                    <button key={g.id} onClick={() => addDiag(g.id)}
                      className={`w-full text-right px-3 py-2.5 text-xs hover:bg-[#e8f3ff] transition ${FR}`}
                      style={{ color: C.navy, borderBottom: `1px solid ${C.g1}` }}>
                      {g.name}
                    </button>
                  ))}
                </div>
              )}
              {selIds.length === 0 && !searchOpen && (
                <div className="mt-3">
                  <p className="text-[10px] mb-1.5" style={{ color: C.g5 }}>ליקויים נפוצים:</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {available.map(g => (
                      <button key={g.id} onClick={() => addDiag(g.id)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition hover:border-[#0368b0] bg-white ${FR}`}
                        style={{ borderColor: C.g3, color: C.sec }}>
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selIds.length > 0 && (
              <>
                {/* Circular progress */}
                <div className="rounded-lg p-5 text-center" style={{ background: C.pBg, border: `1px solid ${C.g2}` }}>
                  <div className="relative w-24 h-24 mx-auto">
                    <CircleProgress pct={reqPct} size={96} stroke={8} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold" style={{ color: reqPct >= 80 ? C.blue : reqPct >= 50 ? C.wn : C.er }}>{reqPct}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold mt-2" style={{ color: C.navy }}>
                    {reqPct === 100 ? '✓ מוכן לוועדה' : reqPct >= 50 ? 'בדרך הנכונה' : 'צריך להשלים מסמכים'}
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: C.sec }}>{reqDone} מתוך {reqDocs.length} מסמכי חובה</p>
                  {reqPct === 100 && reqDocs.length > 0 && (
                    <p className="text-[11px] font-bold mt-2 px-3 py-1 rounded-full inline-block text-white" style={{ background: C.blue }}>⚡ ייתכן אישור מהיר תוך יום</p>
                  )}
                </div>

                {/* Required docs */}
                <div>
                  <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5" style={{ color: C.er }}>
                    <AlertCircle className="h-3.5 w-3.5" /> חובה להביא ({reqDone}/{reqDocs.length})
                  </h4>
                  <div className="space-y-2">
                    {reqDocs.map(m => <CitizenCard key={m.doc.id} d={m.doc} on={!!checked[m.doc.id]} toggle={() => toggle(m.doc.id)} from={m.from} multi={selGroups.length > 1} />)}
                  </div>
                </div>

                {recDocs.length > 0 && (
                  <div>
                    <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5" style={{ color: C.wn }}>
                      <Info className="h-3.5 w-3.5" /> מומלץ / אופציונלי ({recDocs.filter(m => checked[m.doc.id]).length}/{recDocs.length})
                    </h4>
                    <div className="space-y-2">
                      {recDocs.map(m => <CitizenCard key={m.doc.id} d={m.doc} on={!!checked[m.doc.id]} toggle={() => toggle(m.doc.id)} from={m.from} multi={selGroups.length > 1} />)}
                    </div>
                  </div>
                )}
              </>
            )}

            {selIds.length === 0 && (
              <div className="text-center py-10">
                <User className="h-12 w-12 mx-auto mb-3" style={{ color: C.g3 }} />
                <p className="text-sm font-medium" style={{ color: C.g5 }}>בחר את הליקוי הרפואי שלך כדי לראות מה צריך להביא לוועדה</p>
              </div>
            )}

            {/* Help */}
            <div className="rounded-lg p-4 border" style={{ background: C.g1, borderColor: C.g2 }}>
              <div className="flex items-center gap-2 text-xs font-bold mb-2" style={{ color: C.navy }}>
                <Phone className="h-3.5 w-3.5" /> צריך עזרה?
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]" style={{ color: C.sec }}>
                <div>📞 מוקד: *6050</div><div>💬 צ׳אט: btl.gov.il</div>
                <div>🏢 סניף קרוב: btl.gov.il/snifim</div><div>📧 פנייה מקוונת באתר</div>
              </div>
            </div>
            <footer className="text-center text-[10px] pt-3" style={{ color: C.g5, borderTop: `1px solid ${C.g2}` }}>
              המוסד לביטוח לאומי • כל הזכויות שמורות © 2026
            </footer>
          </div>
        </section>
      )}

      <footer className="text-center text-[11px] text-muted-foreground mt-2 space-y-0.5">
        <p className="font-semibold" style={{ color: C.sec }}>💡 הלוגיקה מוכנה ועובדת. נדרש: חיבור API לטבלת אבחנה-מסמך + הטמעה במסך DocClaim.</p>
        <p style={{ color: C.g5 }}>אביעד יצחקי | מינהל גמלאות | מרץ 2026</p>
      </footer>
    </div>
  );
}

/* ═══ Sub-components ═══ */

function Empty() {
  return <div className="p-4 text-center text-xs" style={{ color: C.g5 }}>אין מסמכים</div>;
}

function DocRow({ d, i, on, toggle, accent, from, multi }: { d: DocumentItem; i: number; on: boolean; toggle: () => void; accent: string; from: string[]; multi: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition-colors ${on ? '' : 'hover:bg-[#f5f9ff]'}`}
      style={on ? { background: C.lBg } : {}}>
      <span className="font-bold w-5 text-center shrink-0 text-xs" style={{ color: accent }}>{i}</span>
      <div className="flex-1 min-w-0">
        {from.length > 0 && <div className="text-[9px] font-semibold mb-0.5 px-1.5 py-0.5 rounded inline-block" style={{ color: C.blue, background: `${C.blue}10` }}>🏥 הוכחה עבור: {from.join(', ')}</div>}
        <div className={`font-semibold text-xs ${on ? 'line-through' : ''}`} style={{ color: on ? C.g3 : C.navy }}>{d.name}</div>
        {d.description && <div className="text-[10px] truncate" style={{ color: C.sec }}>{d.description}</div>}
      </div>
      <button onClick={toggle} aria-label={on ? `${d.name} הועלה` : `העלה ${d.name}`}
        className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold min-h-[44px] transition flex items-center gap-1 border ${FR}`}
        style={on ? { background: C.lBg, color: C.blue, borderColor: C.blue } : { borderColor: C.g3, color: C.sec, background: C.w }}>
        {on ? <><Check className="h-3 w-3" /> הועלה</> : <><Upload className="h-3 w-3" /> העלה</>}
      </button>
    </div>
  );
}

function CitizenCard({ d, on, toggle, from, multi }: { d: DocumentItem; on: boolean; toggle: () => void; from: string[]; multi: boolean }) {
  return (
    <div className={`rounded-lg border p-3 flex items-start gap-3 transition-all ${on ? 'shadow-sm' : 'hover:shadow-sm'}`}
      style={on ? { background: C.lBg, borderColor: C.blue } : { background: C.w, borderColor: C.g2 }}>
      <button onClick={toggle} aria-label={on ? `${d.name} סומן` : `סמן ${d.name}`}
        className={`mt-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition ${FR} ${on ? 'text-white' : ''}`}
        style={on ? { background: C.blue, borderColor: C.blue } : { borderColor: C.g3 }}>
        {on && <Check className="h-3.5 w-3.5" />}
      </button>
      <div className="flex-1 min-w-0">
        {from.length > 0 && <div className="text-[9px] font-semibold mb-1 px-1.5 py-0.5 rounded inline-block" style={{ color: C.blue, background: `${C.blue}10` }}>🏥 הוכחה עבור: {from.join(', ')}</div>}
        <div className={`font-semibold text-xs ${on ? 'line-through' : ''}`} style={{ color: on ? C.g3 : C.navy }}>{d.name}</div>
        {d.description && <div className="text-[10px] mt-0.5" style={{ color: C.sec }}>{d.description}</div>}
        {d.whereToGet && <div className="text-[10px] mt-1 font-medium" style={{ color: C.blue }}>📍 {d.whereToGet}</div>}
        {d.tip && <div className="text-[10px] mt-0.5 rounded px-1.5 py-0.5 inline-block" style={{ color: C.navy, background: '#fff7ed' }}>💡 {d.tip}</div>}
      </div>
    </div>
  );
}

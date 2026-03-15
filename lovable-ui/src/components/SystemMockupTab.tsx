import { useState, useMemo } from 'react';
import { diagnosisGroups, getMVPDiagnoses } from '@/data/diagnoses';
import type { DocumentItem } from '@/data/diagnoses';
import { Check, Upload, CheckCircle2, AlertCircle, Info, HelpCircle, User, Phone, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/* [BTL-ADAPTED] Official BTL Design System palette — NO GREEN */
const B = {
  navy: '#0c3058',
  blue: '#0368b0',
  blueH: '#025a8f',
  act: '#0068f5',
  sec: '#266794',
  lBg: '#e8f3ff',
  pBg: '#f5f9ff',
  cBrd: 'rgba(0,0,0,0.1)',
  cShd: '0 2px 8px rgba(6,77,173,0.1)',
  w: '#fff',
  g1: '#f3f4f6',
  g2: '#e5e7eb',
  g3: '#d1d5db',
  g5: '#6b7280',
  g7: '#374151',
  ok: '#0368b0', okBg: '#e8f3ff',       /* was green — now BTL blue */
  wn: '#c2410c', wnBg: '#fff7ed',
  er: '#b91c1c', erBg: '#fef2f2',
};

/* Pill colors for multi-diagnosis tags */
const PILL_COLORS = [
  { bg: '#0c3058', text: '#fff' },
  { bg: '#0368b0', text: '#fff' },
  { bg: '#266794', text: '#fff' },
  { bg: '#0068f5', text: '#fff' },
];

const STEPS = [
  { n: 1, label: 'פרטי התובע', s: 'done' },
  { n: 2, label: 'פרטי הנכות', s: 'done' },
  { n: 3, label: 'מסמכים רפואיים', s: 'active' },
  { n: 4, label: 'תצהיר ומידע', s: '' },
  { n: 5, label: 'הצהרות ושליחה', s: '' },
];

const CLAIMS = [
  { id: 'child' as const, label: 'ילד נכה', icon: '👶', domain: 'ילד נכה' },
  { id: 'general' as const, label: 'נכות כללית', icon: '🏥', domain: 'נכות' },
];

const MAX_DIAG = 4;

export default function SystemMockupTab() {
  const mvp = getMVPDiagnoses();
  const [claim, setClaim] = useState<'child'|'general'>('child');
  const [selIds, setSelIds] = useState<string[]>(() => {
    const first = mvp.find(g => g.name === 'אוטיזם');
    return first ? [first.id] : mvp.length ? [mvp[0].id] : [];
  });
  const [docs, setDocs] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<'clerk'|'citizen'>('clerk');

  const dom = CLAIMS.find(c => c.id === claim)!.domain;
  const filt = useMemo(() => mvp.filter(g => g.domain === dom), [dom, mvp]);
  const selGroups = useMemo(() => selIds.map(id => diagnosisGroups.find(x => x.id === id)).filter(Boolean) as typeof diagnosisGroups, [selIds]);

  /* Merge & deduplicate documents across all selected diagnoses by name */
  const merged = useMemo(() => {
    const seen = new Map<string, { doc: DocumentItem; fromGroups: string[] }>();
    for (const g of selGroups) {
      for (const d of g.documents) {
        const existing = seen.get(d.name);
        if (existing) {
          existing.fromGroups.push(g.name);
          // Upgrade priority: required > recommended > optional
          const prio: Record<string, number> = { required: 3, recommended: 2, optional: 1 };
          if (prio[d.priority] > prio[existing.doc.priority]) {
            existing.doc = { ...d, priority: d.priority };
          }
        } else {
          seen.set(d.name, { doc: d, fromGroups: [g.name] });
        }
      }
    }
    return Array.from(seen.values());
  }, [selGroups]);

  const req = useMemo(() => merged.filter(m => m.doc.priority === 'required'), [merged]);
  const recOpt = useMemo(() => merged.filter(m => m.doc.priority !== 'required'), [merged]);

  const wt: Record<string, number> = { required: 3, recommended: 2, optional: 1 };
  const mx = merged.reduce((s, m) => s + wt[m.doc.priority], 0);
  const cr = merged.filter(m => docs[m.doc.id]).reduce((s, m) => s + wt[m.doc.priority], 0);
  const score = mx > 0 ? Math.round((cr / mx) * 10) : 0;
  const rDone = req.filter(m => docs[m.doc.id]).length;

  const toggle = (id: string) => setDocs(p => ({ ...p, [id]: !p[id] }));
  const sCol = score >= 8 ? B.ok : score >= 5 ? B.wn : B.er;
  const sBg = score >= 8 ? B.okBg : score >= 5 ? B.wnBg : B.erBg;
  const sLbl = score >= 8 ? 'מוכנות מלאה' : score >= 5 ? 'ניתן לכנס ועדה' : 'חסרים מסמכים';

  const pickClaim = (id: 'child'|'general') => {
    setClaim(id); setDocs({}); setSelIds([]);
  };

  const toggleDiag = (id: string) => {
    setDocs({});
    setSelIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_DIAG) return prev;
      return [...prev, id];
    });
  };

  const removeDiag = (id: string) => {
    setDocs({});
    setSelIds(prev => prev.filter(x => x !== id));
  };

  const fRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068f5] focus-visible:ring-offset-2';

  const sharedCount = merged.filter(m => m.fromGroups.length > 1).length;

  return (
    <div className="max-w-[1100px] mx-auto space-y-3" dir="rtl" lang="he">
      {/* Header badge */}
      <div className="text-center" role="status">
        <Badge className="text-sm px-4 py-1" style={{background:B.lBg,color:B.navy}}>🖥️ אב טיפוס מבצעי — הלוגיקה בתוך ה-UI הארגוני</Badge>
        <p className="text-xs mt-1" style={{color:B.sec}}>בחר סוג תביעה → עד {MAX_DIAG} ליקויים → מסמכים ממוזגים → ציון מוכנות בזמן אמת</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex gap-1 rounded-lg p-0.5" style={{background:B.g1}} role="tablist" aria-label="תצוגה">
          {(['clerk','citizen'] as const).map(v=>(
            <button key={v} role="tab" aria-selected={view===v} onClick={()=>setView(v)}
              className={`px-4 py-2 rounded-md text-xs font-bold min-h-[44px] transition-all ${fRing} ${view===v?'bg-white shadow-sm':''}`}
              style={{color:view===v?B.navy:B.g5}}>
              {v==='clerk'?'🏢 מסך פקיד (DocClaim)':'👤 מסך אזרח (btl.gov.il)'}
            </button>
          ))}
        </div>
        <div className="flex gap-1" role="radiogroup" aria-label="סוג תביעה">
          {CLAIMS.map(ct=>(
            <button key={ct.id} role="radio" aria-checked={claim===ct.id} onClick={()=>pickClaim(ct.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border min-h-[44px] transition ${fRing} ${claim===ct.id?'text-white':'bg-white hover:border-[#0368b0]'}`}
              style={claim===ct.id?{background:B.navy,borderColor:B.navy}:{borderColor:B.g3,color:B.g5}}>
              {ct.icon} {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-select diagnosis toggles */}
      <div className="flex gap-1.5 flex-wrap justify-center" role="group" aria-label="בחירת ליקויים (עד 4)">
        {filt.map(x => {
          const isOn = selIds.includes(x.id);
          const idx = selIds.indexOf(x.id);
          const pill = idx >= 0 ? PILL_COLORS[idx % PILL_COLORS.length] : null;
          return (
            <button key={x.id} onClick={()=>toggleDiag(x.id)}
              aria-pressed={isOn}
              disabled={!isOn && selIds.length >= MAX_DIAG}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border min-h-[36px] transition ${fRing} ${
                !isOn && selIds.length >= MAX_DIAG ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={isOn && pill
                ? {background:pill.bg,borderColor:pill.bg,color:pill.text}
                : {borderColor:B.g3,color:B.g5,background:B.w}}>
              {isOn && <span className="ml-1">✓</span>}{x.name}
            </button>
          );
        })}
      </div>
      {selIds.length === 0 && (
        <p className="text-center text-xs" style={{color:B.wn}}>⚠️ בחר לפחות ליקוי אחד</p>
      )}

      {/* ═══ CLERK VIEW ═══ */}
      {view === 'clerk' && selIds.length > 0 && (
        <section className="rounded-lg overflow-hidden shadow-lg text-sm" style={{border:`1px solid ${B.cBrd}`,boxShadow:B.cShd}} aria-label="תצוגת מערכת פנימית">
          {/* Dark system chrome */}
          <div className="flex items-center justify-between px-3 py-1.5" style={{background:'#1a2332',color:'#7b8fa3',fontSize:'10px'}}>
            <div className="flex items-center gap-2">
              <span className="opacity-50">⚙</span><span>DocClaim v4.2</span>
              <span className="opacity-30">|</span><span>מערכת תביעות</span>
            </div>
            <div className="flex gap-3 items-center">
              <span>Power BI</span><span>SAP</span><span>BI מרכזי</span>
              <span className="px-2 py-0.5 rounded text-[9px]" style={{background:'#2a3a4e'}}>שרה כ. | סניף ירושלים</span>
            </div>
          </div>
          {/* Navy header */}
          <header style={{background:B.navy}} className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0" style={{boxShadow:'0 2px 6px rgba(0,0,0,0.15)'}}>
                  <span style={{color:B.navy}} className="text-[12px] font-extrabold">ב״ל</span>
                </div>
                <div className="text-white">
                  <h2 className="font-bold text-sm sm:text-base">תביעה לגמלת {dom}</h2>
                  <p className="text-white/50 text-[11px]">המוסד לביטוח לאומי • בקשה 2401-4287 • סניף ירושלים</p>
                </div>
              </div>
              <div className="flex gap-2 text-[11px]">
                {['📎 קבצים','🖨️ הדפסה','💾 שמירה'].map(t=>(
                  <span key={t} className="bg-white/15 px-2.5 py-1.5 rounded text-white/70 cursor-pointer hover:bg-white/25 transition">{t}</span>
                ))}
              </div>
            </div>
          </header>

          {/* Steps wizard */}
          <nav className="px-3 py-3 overflow-x-auto scrollbar-hide" style={{background:B.lBg,borderBottom:`2px solid ${B.blue}`}} aria-label="שלבי התביעה">
            <ol className="flex items-center justify-center gap-1 sm:gap-2 min-w-max list-none p-0 m-0">
              {STEPS.map((st,i)=>(
                <li key={st.n} className="flex items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    st.s==='done'?'text-white':st.s==='active'?'text-white ring-2 ring-offset-2 shadow-md':'border-2'}`}
                    style={st.s==='done'?{background:B.blue}:st.s==='active'?{background:B.blue,ringColor:B.act}:{borderColor:B.g3,background:B.w,color:B.g5}}
                    aria-current={st.s==='active'?'step':undefined}>
                    {st.s==='done'?<Check className="h-3.5 w-3.5"/>:st.n}
                  </div>
                  <span className="text-[10px] whitespace-nowrap" style={{color:st.s?B.blue:B.g5,fontWeight:st.s==='active'?700:400}}>{st.label}</span>
                  {i<STEPS.length-1&&<div className="w-6 sm:w-10 h-0.5" style={{background:i<2?B.blue:B.g3}}/>}
                </li>
              ))}
            </ol>
          </nav>

          {/* Main content */}
          <div className="p-4 sm:p-6 space-y-5" style={{background:B.pBg}}>
            <div className="pr-3" style={{borderRight:`4px solid ${B.blue}`}}>
              <h3 className="font-bold text-base" style={{color:B.navy}}>שלב 3: מסמכים רפואיים</h3>
              <p className="text-[11px]" style={{color:B.sec}}>
                המערכת ממפה אוטומטית את המסמכים הנדרשים לפי {selGroups.length} ליקויים שנבחרו
              </p>
            </div>

            {/* Multi-diagnosis field with pills */}
            <div className="rounded-lg border p-4" style={{background:B.w,borderColor:B.cBrd,boxShadow:B.cShd}}>
              <label className="text-[11px] font-semibold block mb-2" style={{color:B.sec}} id="diag-label">
                ליקויים נבחרים ({selGroups.length}/{MAX_DIAG}) <span style={{color:B.er}}>*</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap p-2.5 rounded-lg border-2 min-h-[44px]" style={{borderColor:B.blue,background:B.lBg}} aria-labelledby="diag-label">
                {selGroups.map((g, idx) => {
                  const pill = PILL_COLORS[idx % PILL_COLORS.length];
                  return (
                    <span key={g.id} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
                      style={{background:pill.bg,color:pill.text}}>
                      {g.name}
                      <button onClick={()=>removeDiag(g.id)} className={`opacity-60 hover:opacity-100 mr-1 ${fRing}`} aria-label={`הסר ${g.name}`}>
                        <X className="h-3 w-3"/>
                      </button>
                    </span>
                  );
                })}
                {selGroups.length < MAX_DIAG && (
                  <div className="flex items-center gap-1 text-[10px]" style={{color:B.g5}}>
                    <Search className="h-3 w-3" aria-hidden="true"/> הוסף ליקוי...
                  </div>
                )}
              </div>
              <p className="text-[10px] mt-1.5" style={{color:B.sec}}>
                💡 זוהו {merged.length} מסמכים ייחודיים — {req.length} חובה, {recOpt.length} מומלץ/אופציונלי
                {sharedCount > 0 && <span style={{color:B.blue}}> • {sharedCount} מסמכים משותפים לכמה ליקויים</span>}
              </p>
            </div>

            {/* Readiness score */}
            <div className="rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3" style={{background:sBg,border:`2px solid ${sCol}33`,boxShadow:B.cShd}} role="status" aria-label={`ציון מוכנות: ${score} מתוך 10`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{background:`${sCol}12`,border:`3px solid ${sCol}`}}>
                  <span className="text-2xl font-extrabold" style={{color:sCol}} aria-hidden="true">{score}</span>
                </div>
                <div>
                  <div className="text-xs" style={{color:B.sec}}>ציון מוכנות תיק</div>
                  <div className="text-sm font-bold" style={{color:sCol}}>{sLbl}</div>
                  <div className="text-[10px] mt-0.5" style={{color:B.sec}}>{rDone}/{req.length} מסמכי חובה הוגשו</div>
                </div>
              </div>
              <div className="flex gap-0.5" aria-hidden="true">{Array.from({length:10},(_,i)=>(
                <div key={i} className="w-3.5 h-6 rounded-sm transition-all" style={{background:i<score?sCol:B.g2}}/>
              ))}</div>
              {score>=8&&<div className="text-white text-[11px] font-bold px-3 py-1.5 rounded-lg animate-pulse" style={{background:B.blue}}>⚡ מסלול מהיר — אישור תוך יום</div>}
            </div>

            {/* Two-column doc tables: right=חובה, left=מומלץ+אופציונלי */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden" style={{border:`1px solid ${B.cBrd}`,boxShadow:B.cShd}}>
                <div className="font-bold text-xs px-4 py-2.5 flex items-center justify-between text-white" style={{background:B.navy}}>
                  <span>📋 מסמכי חובה ({rDone}/{req.length})</span>
                  {rDone===req.length&&req.length>0&&<CheckCircle2 className="h-4 w-4" aria-hidden="true"/>}
                </div>
                <div className="bg-white divide-y divide-gray-100" role="list" aria-label="מסמכי חובה">
                  {req.map((m,i)=><DocRow key={m.doc.id} d={m.doc} i={i+1} on={!!docs[m.doc.id]} toggle={()=>toggle(m.doc.id)} accent={B.navy} fr={fRing} fromGroups={m.fromGroups} multiDiag={selGroups.length>1}/>)}
                  {req.length===0&&<div className="p-4 text-center text-xs" style={{color:B.g5}}>אין מסמכי חובה</div>}
                </div>
              </div>
              <div className="rounded-lg overflow-hidden" style={{border:`1px solid ${B.cBrd}`,boxShadow:B.cShd}}>
                <div className="font-bold text-xs px-4 py-2.5 flex items-center justify-between text-white" style={{background:B.blue}}>
                  <span>📎 מומלץ / אופציונלי ({recOpt.filter(m=>docs[m.doc.id]).length}/{recOpt.length})</span>
                </div>
                <div className="bg-white divide-y divide-gray-100" role="list" aria-label="מסמכי המלצה">
                  {recOpt.map((m,i)=><DocRow key={m.doc.id} d={m.doc} i={i+1} on={!!docs[m.doc.id]} toggle={()=>toggle(m.doc.id)} accent={B.blue} fr={fRing} fromGroups={m.fromGroups} multiDiag={selGroups.length>1}/>)}
                  {recOpt.length===0&&<div className="p-4 text-center text-xs" style={{color:B.g5}}>אין מסמכי המלצה</div>}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-3" style={{borderTop:`1px solid ${B.g2}`}}>
              <button className={`text-[11px] min-h-[44px] px-2 ${fRing}`} style={{color:B.sec}}>← חזרה לשלב הקודם</button>
              <div className="flex gap-2">
                <button className={`px-4 py-2 rounded-lg text-[11px] font-semibold border min-h-[44px] ${fRing}`} style={{borderColor:B.g3,color:B.sec}}>שמור טיוטה</button>
                <button className={`px-5 py-2 rounded-lg text-[11px] font-bold text-white min-h-[44px] transition ${fRing}`}
                  style={{background:score>=5?B.blue:B.g3,cursor:score>=5?'pointer':'not-allowed'}}
                  disabled={score<5} aria-label={score>=5?'המשך לשלב הבא':'יש להשלים מסמכי חובה'}>
                  המשך לשלב הבא →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CITIZEN VIEW ═══ */}
      {view === 'citizen' && selIds.length > 0 && (
        <section className="rounded-lg overflow-hidden shadow-lg text-sm" style={{border:`1px solid ${B.cBrd}`,boxShadow:B.cShd}} aria-label="תצוגת אתר ציבורי">
          {/* Gov.il bar */}
          <div className="flex items-center justify-between px-4 py-1.5 text-white" style={{background:B.navy,fontSize:'10px'}}>
            <div className="flex items-center gap-3"><span className="font-bold">gov.il</span><span className="opacity-30">|</span><span className="opacity-60">שירותי ממשלה</span></div>
            <div className="flex items-center gap-3 opacity-60"><span>נגישות</span><span>עברית</span></div>
          </div>
          {/* NII header */}
          <header style={{background:B.navy}} className="px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg">
                <span style={{color:B.navy}} className="text-[13px] font-extrabold" aria-hidden="true">ב״ל</span>
              </div>
              <div className="text-white">
                <h2 className="font-bold text-base sm:text-lg">המוסד לביטוח לאומי</h2>
                <p className="text-white/60 text-xs">הכנה לוועדה רפואית — בדוק מה צריך להביא</p>
              </div>
            </div>
          </header>
          {/* Breadcrumb */}
          <nav className="px-4 sm:px-6 py-2 text-[10px]" style={{background:B.g1,borderBottom:`1px solid ${B.g2}`,color:B.g5}} aria-label="ניווט">
            דף הבית › {dom} › <span className="font-semibold" style={{color:B.blue}}>הכנה לוועדה רפואית</span>
          </nav>

          <div className="bg-white p-4 sm:p-6 space-y-5">
            {/* Greeting card */}
            <div className="rounded-lg p-4 border" style={{background:B.lBg,borderColor:`${B.blue}30`}}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white" style={{background:B.blue}}>
                  <User className="h-5 w-5" aria-hidden="true"/>
                </div>
                <div>
                  <p className="font-bold text-sm" style={{color:B.navy}}>שלום, הנה הרשימה שלך</p>
                  <p className="text-xs mt-1" style={{color:B.g7}}>
                    בחרת: {selGroups.map((g, idx) => (
                      <span key={g.id}>
                        {idx > 0 && ', '}
                        <b style={{color:PILL_COLORS[idx % PILL_COLORS.length].bg}}>{g.name}</b>
                      </span>
                    ))} ({dom})
                  </p>
                  <p className="text-[11px] mt-1" style={{color:B.sec}}>ברגע שתגיש תביעה — אתה מוכר מתאריך ההגשה. המסמכים עוזרים לזרז.</p>
                  {sharedCount > 0 && (
                    <p className="text-[11px] mt-1 font-semibold" style={{color:B.blue}}>
                      📌 {sharedCount} מסמכים משותפים לכמה ליקויים — מופיעים פעם אחת
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="rounded-lg p-5 text-center" style={{background:sBg,border:`2px solid ${sCol}33`,boxShadow:B.cShd}} role="status" aria-label={`ציון מוכנות: ${score} מתוך 10`}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{background:`${sCol}12`,border:`4px solid ${sCol}`}}>
                <span className="text-3xl font-extrabold" style={{color:sCol}} aria-hidden="true">{score}</span>
              </div>
              <p className="text-sm font-bold mt-2" style={{color:sCol}}>{sLbl}</p>
              <div className="flex justify-center gap-0.5 mt-2" aria-hidden="true">{Array.from({length:10},(_,i)=>(
                <div key={i} className="w-4 h-3 rounded-sm" style={{background:i<score?sCol:B.g2}}/>
              ))}</div>
              <p className="text-[11px] mt-2" style={{color:B.sec}}>
                {score<5?'צריך להשלים מסמכים כדי שנוכל לקבוע ועדה':score>=8?'⚡ ייתכן אישור מהיר תוך יום!':'אפשר לקבוע ועדה — מסמכים נוספים יחזקו את התיק'}
              </p>
            </div>

            {/* Document lists */}
            <div role="list" aria-label="מסמכי חובה">
              <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5" style={{color:B.er}}>
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true"/> חובה להביא ({rDone}/{req.length})
              </h4>
              <div className="space-y-2">{req.map(m=><CitizenCard key={m.doc.id} d={m.doc} on={!!docs[m.doc.id]} toggle={()=>toggle(m.doc.id)} fr={fRing} fromGroups={m.fromGroups} multiDiag={selGroups.length>1}/>)}</div>
            </div>
            {recOpt.length>0&&<div role="list" aria-label="מסמכים מומלצים ואופציונליים">
              <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5" style={{color:B.wn}}>
                <Info className="h-3.5 w-3.5" aria-hidden="true"/> מומלץ / אופציונלי ({recOpt.filter(m=>docs[m.doc.id]).length}/{recOpt.length})
              </h4>
              <div className="space-y-2">{recOpt.map(m=><CitizenCard key={m.doc.id} d={m.doc} on={!!docs[m.doc.id]} toggle={()=>toggle(m.doc.id)} fr={fRing} fromGroups={m.fromGroups} multiDiag={selGroups.length>1}/>)}</div>
            </div>}

            {/* Help section */}
            <div className="rounded-lg p-4 border" style={{background:B.g1,borderColor:B.g2}}>
              <div className="flex items-center gap-2 text-xs font-bold mb-2" style={{color:B.navy}}>
                <Phone className="h-3.5 w-3.5" aria-hidden="true"/> צריך עזרה?
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]" style={{color:B.sec}}>
                <div>📞 מוקד: *6050</div><div>💬 צ׳אט: btl.gov.il</div>
                <div>🏢 סניף קרוב: btl.gov.il/snifim</div><div>📧 פנייה מקוונת באתר</div>
              </div>
            </div>
            <footer className="text-center text-[10px] pt-3" style={{color:B.g5,borderTop:`1px solid ${B.g2}`}}>
              המוסד לביטוח לאומי • כל הזכויות שמורות © 2026
            </footer>
          </div>
        </section>
      )}

      {/* Footer credit */}
      <footer className="text-center text-[11px] text-muted-foreground mt-2 space-y-0.5">
        <p className="font-semibold" style={{color:B.sec}}>💡 הלוגיקה מוכנה ועובדת. נדרש: חיבור API לטבלת אבחנה-מסמך + הטמעה במסך DocClaim.</p>
        <p style={{color:B.g5}}>אביעד יצחקי | מינהל גמלאות | מרץ 2026</p>
      </footer>
    </div>
  );
}

/* ═══ Sub-components ═══ */

/* DocRow — clerk table row with shared-diagnosis indicator */
function DocRow({d,i,on,toggle,accent,fr,fromGroups,multiDiag}:{d:DocumentItem;i:number;on:boolean;toggle:()=>void;accent:string;fr:string;fromGroups:string[];multiDiag:boolean}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition-colors ${on?'':'hover:bg-[#f5f9ff]'}`} role="listitem"
      style={on?{background:'#e8f3ff'}:{}}>
      <span className="font-bold w-5 text-center shrink-0 text-xs" style={{color:accent}} aria-hidden="true">{i}</span>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-xs ${on?'line-through':''}`} style={{color:on?'#9ca3af':'#0c3058'}}>{d.name}</div>
        {d.description&&<div className="text-[10px] truncate" style={{color:'#266794'}}>{d.description}</div>}
        {multiDiag && fromGroups.length > 1 && (
          <div className="text-[9px] mt-0.5 flex items-center gap-1" style={{color:'#0368b0'}}>
            🔗 משותף: {fromGroups.join(', ')}
          </div>
        )}
      </div>
      <button onClick={toggle} aria-label={on?`${d.name} הועלה`:`העלה ${d.name}`}
        className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold min-h-[44px] transition-all flex items-center gap-1 ${fr} ${
          on?'border':'bg-white border'}`}
        style={on?{background:'#e8f3ff',color:'#0368b0',borderColor:'#0368b0'}:{borderColor:'#d1d5db',color:'#266794'}}>
        {on?<><CheckCircle2 className="h-3 w-3" aria-hidden="true"/> הועלה</>:<><Upload className="h-3 w-3" aria-hidden="true"/> העלה</>}
      </button>
    </div>
  );
}

/* CitizenCard — citizen doc card with shared-diagnosis indicator */
function CitizenCard({d,on,toggle,fr,fromGroups,multiDiag}:{d:DocumentItem;on:boolean;toggle:()=>void;fr:string;fromGroups:string[];multiDiag:boolean}) {
  return (
    <div className={`rounded-lg border p-3 flex items-start gap-3 transition-all ${on?'shadow-sm':'hover:shadow-sm'}`} role="listitem"
      style={on?{background:'#e8f3ff',borderColor:'#0368b0'}:{background:'#fff',borderColor:'rgba(0,0,0,0.1)'}}>
      <button onClick={toggle} aria-label={on?`${d.name} סומן`:`סמן ${d.name}`}
        className={`mt-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${fr} ${
          on?'text-white scale-110':''}`}
        style={on?{background:'#0368b0',borderColor:'#0368b0'}:{borderColor:'#d1d5db'}}>
        {on&&<Check className="h-3.5 w-3.5" aria-hidden="true"/>}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-xs ${on?'line-through':''}`} style={{color:on?'#9ca3af':'#0c3058'}}>{d.name}</div>
        {d.description&&<div className="text-[10px] mt-0.5" style={{color:'#266794'}}>{d.description}</div>}
        {multiDiag && fromGroups.length > 1 && (
          <div className="text-[9px] mt-0.5 font-medium" style={{color:'#0368b0'}}>
            🔗 רלוונטי ל: {fromGroups.join(', ')}
          </div>
        )}
        {d.whereToGet&&<div className="text-[10px] mt-1 font-medium" style={{color:'#0368b0'}}>📍 {d.whereToGet}</div>}
        {d.tip&&<div className="text-[10px] mt-0.5 rounded px-1.5 py-0.5 inline-block" style={{color:'#0c3058',background:'#fff7ed'}}>💡 {d.tip}</div>}
      </div>
    </div>
  );
}

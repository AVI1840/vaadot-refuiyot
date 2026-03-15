import { useState, useMemo } from 'react';
import { diagnosisGroups, getMVPDiagnoses } from '@/data/diagnoses';
import type { DocumentItem } from '@/data/diagnoses';
import { Check, Upload, ChevronDown, FileText, AlertCircle, CheckCircle2, Info, User, Phone, HelpCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const STEPS = [
  { n: 1, label: 'פרטי התובע', s: 'done' },
  { n: 2, label: 'פרטי הנכות', s: 'active' },
  { n: 3, label: 'מסמכים רפואיים', s: '' },
  { n: 4, label: 'תצהיר ומידע', s: '' },
  { n: 5, label: 'הצהרות ושליחה', s: '' },
];

export default function SystemMockupTab() {
  const mvp = getMVPDiagnoses();
  const [selId, setSelId] = useState(mvp.find(g => g.name === 'אוטיזם')?.id || mvp[0]?.id);
  const [docs, setDocs] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<'clerk' | 'citizen'>('clerk');

  const g = diagnosisGroups.find(x => x.id === selId) || mvp[0];
  const req = useMemo(() => g.documents.filter(d => d.priority === 'required'), [g]);
  const rec = useMemo(() => g.documents.filter(d => d.priority === 'recommended'), [g]);
  const opt = useMemo(() => g.documents.filter(d => d.priority === 'optional'), [g]);

  const wt: Record<string, number> = { required: 3, recommended: 2, optional: 1 };
  const mx = g.documents.reduce((s, d) => s + wt[d.priority], 0);
  const cr = g.documents.filter(d => docs[d.id]).reduce((s, d) => s + wt[d.priority], 0);
  const score = mx > 0 ? Math.round((cr / mx) * 10) : 0;
  const rDone = req.filter(d => docs[d.id]).length;

  const toggle = (id: string) => setDocs(p => ({ ...p, [id]: !p[id] }));
  const sCol = score >= 8 ? '#2e7d32' : score >= 5 ? '#e65100' : '#c62828';
  const sBg = score >= 8 ? '#e8f5e9' : score >= 5 ? '#fff3e0' : '#ffebee';
  const sLbl = score >= 8 ? 'מוכנות מלאה — ניתן לאשר' : score >= 5 ? 'ניתן לכנס ועדה' : 'חסרים מסמכים — לא מוכן';

  return (
    <div className="max-w-[1100px] mx-auto space-y-3">
      <div className="text-center">
        <Badge className="bg-accent text-accent-foreground text-sm px-4 py-1">🖥️ אב טיפוס — הלוגיקה בתוך ה-UI הארגוני</Badge>
        <p className="text-xs text-muted-foreground mt-1">פונקציונלי ועובד — בחר אבחנה, סמן מסמכים, ראה ציון מוכנות בזמן אמת</p>
      </div>

      {/* View toggle + diagnosis selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          {(['clerk', 'citizen'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-md text-xs font-bold min-h-[36px] transition-all ${view === v ? 'bg-white text-[#00875a] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {v === 'clerk' ? '🏢 מסך פקיד — מערכת פנימית' : '👤 מסך אזרח — אתר ציבורי'}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap justify-center">
          {mvp.map(x => (
            <button key={x.id} onClick={() => { setSelId(x.id); setDocs({}); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border min-h-[28px] transition ${selId === x.id ? 'bg-[#00875a] text-white border-[#00875a]' : 'bg-white text-gray-500 border-gray-300 hover:border-[#00875a]'}`}>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════ CLERK VIEW — NII Internal System ═══════════ */}
      {view === 'clerk' && (
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-2xl text-sm" dir="rtl">
          {/* ── Top system bar (dark) ── */}
          <div className="flex items-center justify-between px-3 py-1.5" style={{ background: '#1e293b', color: '#94a3b8', fontSize: '10px' }}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] opacity-60">⚙</span>
              <span>DocClaim v4.2</span>
              <span className="opacity-40">|</span>
              <span>מערכת תביעות</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="opacity-60">🔔</span>
              <span>Power BI</span>
              <span>SAP</span>
              <span>BI מרכזי</span>
              <span className="bg-slate-700 px-2 py-0.5 rounded text-[9px]">שרה כ. | סניף ירושלים</span>
            </div>
          </div>

          {/* ── Green NII header bar ── */}
          <div style={{ background: 'linear-gradient(135deg, #00875a 0%, #006644 100%)' }} className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-[#00875a] text-[12px] font-extrabold leading-none">ב״ל</span>
                </div>
                <div className="text-white">
                  <div className="font-bold text-sm sm:text-base">תביעה לגמלת {g.domain === 'ילד נכה' ? 'ילד נכה' : 'נכות כללית'}</div>
                  <div className="text-white/60 text-[11px]">המוסד לביטוח לאומי • מספר בקשה: 2401-4287 • סניף ירושלים</div>
                </div>
              </div>
              <div className="flex gap-2 text-[11px]">
                <span className="bg-white/20 px-2.5 py-1.5 rounded text-white cursor-pointer hover:bg-white/30 transition">📎 קבצים (3)</span>
                <span className="bg-white/20 px-2.5 py-1.5 rounded text-white cursor-pointer hover:bg-white/30 transition">🖨️ הדפסה</span>
                <span className="bg-white/20 px-2.5 py-1.5 rounded text-white cursor-pointer hover:bg-white/30 transition">💾 שמירה</span>
              </div>
            </div>
          </div>

          {/* ── Steps wizard ── */}
          <div className="px-3 py-3 overflow-x-auto scrollbar-hide" style={{ background: '#f0faf5', borderBottom: '2px solid #00875a' }}>
            <div className="flex items-center justify-center gap-1 sm:gap-2 min-w-max">
              {STEPS.map((st, i) => (
                <div key={st.n} className="flex items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${st.s === 'done' ? 'bg-[#00875a] text-white' : st.s === 'active' ? 'bg-[#00875a] text-white ring-2 ring-offset-2 ring-[#00875a] shadow-md' : 'bg-white text-gray-400 border-2 border-gray-300'}`}>
                    {st.s === 'done' ? <Check className="h-3.5 w-3.5" /> : st.n}
                  </div>
                  <span className={`text-[10px] whitespace-nowrap ${st.s === 'active' ? 'font-bold text-[#00875a]' : st.s === 'done' ? 'text-[#00875a]' : 'text-gray-400'}`}>{st.label}</span>
                  {i < STEPS.length - 1 && <div className={`w-6 sm:w-10 h-0.5 ${i < 1 ? 'bg-[#00875a]' : 'bg-gray-300'}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* ── Main content area ── */}
          <div className="bg-[#fafbfc] p-4 sm:p-6 space-y-5">
            {/* Section header */}
            <div className="border-r-4 border-[#00875a] pr-3">
              <h3 className="font-bold text-base text-gray-800">שלב 2: פרטי הנכות והמסמכים</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">המערכת ממפה אוטומטית את המסמכים הנדרשים לפי האבחנה שנבחרה</p>
            </div>

            {/* Diagnosis field */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <label className="text-[11px] font-semibold text-gray-600 block mb-2">פרטי הליקוי הרפואי או המחלה *</label>
              <div className="flex items-center gap-2 flex-wrap p-2.5 rounded-lg border-2 border-[#00875a] bg-[#f0faf5] min-h-[42px]">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-[#00875a] text-white">
                  {g.name} <span className="opacity-60 cursor-pointer hover:opacity-100 mr-1">✕</span>
                </span>
                <div className="flex items-center gap-1 text-gray-400 text-[10px] cursor-pointer">
                  <Search className="h-3 w-3" />
                  <span>הוסף אבחנה...</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">💡 המערכת מזהה אוטומטית את המסמכים הנדרשים לפי האבחנה</p>
            </div>

            {/* ── Readiness score — integrated into the flow ── */}
            <div className="rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm" style={{ background: sBg, border: `2px solid ${sCol}44` }}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `${sCol}15`, border: `3px solid ${sCol}` }}>
                    <span className="text-2xl font-extrabold" style={{ color: sCol }}>{score}</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-lg">{score >= 8 ? '✅' : score >= 5 ? '⚠️' : '🔴'}</span>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ציון מוכנות תיק</div>
                  <div className="text-sm font-bold" style={{ color: sCol }}>{sLbl}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{rDone}/{req.length} מסמכי חובה הוגשו</div>
                </div>
              </div>
              <div className="flex gap-0.5">{Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="w-3.5 h-6 rounded-sm transition-all" style={{ background: i < score ? sCol : '#e0e0e0' }} />
              ))}</div>
              {score >= 8 && (
                <div className="bg-green-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg animate-pulse">
                  ⚡ מסלול מהיר — אישור תוך יום
                </div>
              )}
            </div>

            {/* ── Two columns: חובה / המלצה ── */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Required docs */}
              <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="font-bold text-xs px-4 py-2.5 flex items-center justify-between" style={{ background: '#00875a', color: '#fff' }}>
                  <span>📋 מסמכי חובה ({rDone}/{req.length})</span>
                  {rDone === req.length && req.length > 0 && <CheckCircle2 className="h-4 w-4" />}
                </div>
                <div className="bg-white divide-y divide-gray-100">
                  {req.map((d, i) => <DocRow key={d.id} d={d} i={i + 1} on={!!docs[d.id]} toggle={() => toggle(d.id)} c="#00875a" />)}
                  {req.length === 0 && <div className="p-4 text-center text-gray-400 text-xs">אין מסמכי חובה לאבחנה זו</div>}
                </div>
              </div>
              {/* Recommended docs */}
              <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="font-bold text-xs px-4 py-2.5 flex items-center justify-between" style={{ background: '#0077b6', color: '#fff' }}>
                  <span>📎 מסמכי המלצה ({[...rec, ...opt].filter(d => docs[d.id]).length}/{rec.length + opt.length})</span>
                </div>
                <div className="bg-white divide-y divide-gray-100">
                  {[...rec, ...opt].map((d, i) => <DocRow key={d.id} d={d} i={i + 1} on={!!docs[d.id]} toggle={() => toggle(d.id)} c="#0077b6" />)}
                  {rec.length + opt.length === 0 && <div className="p-4 text-center text-gray-400 text-xs">אין מסמכי המלצה</div>}
                </div>
              </div>
            </div>

            {/* Action buttons row */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <button className="text-[11px] text-gray-400 hover:text-gray-600 transition">← חזרה לשלב הקודם</button>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg text-[11px] font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50 transition min-h-[36px]">שמור טיוטה</button>
                <button className={`px-5 py-2 rounded-lg text-[11px] font-bold text-white min-h-[36px] transition ${score >= 5 ? 'bg-[#00875a] hover:bg-[#006644] shadow-md' : 'bg-gray-300 cursor-not-allowed'}`}>
                  המשך לשלב הבא →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ CITIZEN VIEW — NII Public Website ═══════════ */}
      {view === 'citizen' && (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-2xl text-sm" dir="rtl">
          {/* ── Gov.il style top bar ── */}
          <div className="flex items-center justify-between px-4 py-1.5" style={{ background: '#003d6b', color: '#fff', fontSize: '10px' }}>
            <div className="flex items-center gap-3">
              <span className="font-bold">gov.il</span>
              <span className="opacity-50">|</span>
              <span className="opacity-70">שירותי ממשלה</span>
            </div>
            <div className="flex items-center gap-3 opacity-70">
              <span>נגישות</span>
              <span>עברית</span>
            </div>
          </div>

          {/* ── NII green header ── */}
          <div style={{ background: 'linear-gradient(135deg, #00875a 0%, #006644 100%)' }} className="px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg">
                <span className="text-[#00875a] text-[13px] font-extrabold">ב״ל</span>
              </div>
              <div className="text-white">
                <div className="font-bold text-base sm:text-lg">המוסד לביטוח לאומי</div>
                <div className="text-white/70 text-xs">הכנה לוועדה רפואית — בדוק מה צריך להביא</div>
              </div>
            </div>
          </div>

          {/* ── Breadcrumb ── */}
          <div className="px-4 sm:px-6 py-2 bg-[#f5f5f5] border-b border-gray-200 text-[10px] text-gray-500">
            <span>דף הבית</span> <span className="mx-1">›</span>
            <span>נכות</span> <span className="mx-1">›</span>
            <span className="text-[#00875a] font-semibold">הכנה לוועדה רפואית</span>
          </div>

          <div className="bg-white p-4 sm:p-6 space-y-5">
            {/* Greeting card */}
            <div className="rounded-xl p-4 border-2 border-[#00875a]/20" style={{ background: '#f0faf5' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00875a] flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-800">שלום, הנה הרשימה שלך</div>
                  <p className="text-xs text-gray-600 mt-1">בחרת: <b className="text-[#00875a]">{g.name}</b> ({g.domain})</p>
                  <p className="text-[11px] text-gray-500 mt-1">ברגע שתגיש תביעה — אתה מוכר מתאריך ההגשה. המסמכים עוזרים לזרז את הטיפול.</p>
                </div>
              </div>
            </div>

            {/* Score card */}
            <div className="rounded-xl p-5 text-center shadow-sm" style={{ background: sBg, border: `2px solid ${sCol}33` }}>
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: `${sCol}12`, border: `4px solid ${sCol}` }}>
                  <span className="text-3xl font-extrabold" style={{ color: sCol }}>{score}</span>
                </div>
                <span className="absolute -bottom-1 -left-1 text-xl">{score >= 8 ? '✅' : score >= 5 ? '⚠️' : '🔴'}</span>
              </div>
              <div className="text-sm font-bold mt-2" style={{ color: sCol }}>{sLbl}</div>
              <div className="flex justify-center gap-0.5 mt-2">{Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="w-4 h-3 rounded-sm transition-all" style={{ background: i < score ? sCol : '#e0e0e0' }} />
              ))}</div>
              <p className="text-[11px] text-gray-500 mt-2">
                {score < 5 ? 'צריך להשלים מסמכים כדי שנוכל לקבוע ועדה' : score >= 8 ? '⚡ ייתכן שתוכל לקבל אישור מהיר תוך יום!' : 'אפשר לקבוע ועדה — מסמכים נוספים יחזקו את התיק'}
              </p>
            </div>

            {/* Required docs */}
            <div>
              <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5" style={{ color: '#c62828' }}>
                <AlertCircle className="h-3.5 w-3.5" /> חובה להביא ({rDone}/{req.length})
              </h4>
              <div className="space-y-2">{req.map(d => <CitizenCard key={d.id} d={d} on={!!docs[d.id]} toggle={() => toggle(d.id)} />)}</div>
            </div>
            {rec.length > 0 && <div>
              <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5" style={{ color: '#e65100' }}>
                <Info className="h-3.5 w-3.5" /> מומלץ להביא ({rec.filter(d => docs[d.id]).length}/{rec.length})
              </h4>
              <div className="space-y-2">{rec.map(d => <CitizenCard key={d.id} d={d} on={!!docs[d.id]} toggle={() => toggle(d.id)} />)}</div>
            </div>}
            {opt.length > 0 && <div>
              <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5 text-gray-500">
                <HelpCircle className="h-3.5 w-3.5" /> אם יש לך ({opt.length})
              </h4>
              <div className="space-y-2">{opt.map(d => <CitizenCard key={d.id} d={d} on={!!docs[d.id]} toggle={() => toggle(d.id)} />)}</div>
            </div>}

            {/* Help section */}
            <div className="rounded-xl p-4 bg-[#f5f5f5] border border-gray-200">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                <Phone className="h-3.5 w-3.5" /> צריך עזרה?
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                <div>📞 מוקד טלפוני: *6050</div>
                <div>💬 צ׳אט באתר: btl.gov.il</div>
                <div>🏢 סניף קרוב: btl.gov.il/snifim</div>
                <div>📧 פנייה מקוונת באתר</div>
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-400 pt-3 border-t border-gray-200">
              המוסד לביטוח לאומי • כל הזכויות שמורות © 2026
            </div>
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="text-center text-[11px] text-muted-foreground mt-2 space-y-0.5">
        <p className="font-semibold">💡 הלוגיקה מוכנה ועובדת. נדרש: חיבור API לטבלת אבחנה-מסמך + הטמעה במסך DocClaim הקיים.</p>
        <p>אביעד יצחקי | מינהל גמלאות | מרץ 2026</p>
      </div>
    </div>
  );
}

/* ── Citizen card component ── */
function CitizenCard({ d, on, toggle }: { d: DocumentItem; on: boolean; toggle: () => void }) {
  const pCol = d.priority === 'required' ? '#c62828' : d.priority === 'recommended' ? '#e65100' : '#1565c0';
  return (
    <div className={`rounded-lg border p-3 flex items-start gap-3 transition-all ${on ? 'bg-green-50 border-green-300 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
      <button onClick={toggle}
        className={`mt-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${on ? 'bg-[#00875a] border-[#00875a] text-white scale-110' : 'border-gray-300 hover:border-[#00875a]'}`}
        aria-label={on ? 'סומן' : 'סמן'}>
        {on && <Check className="h-3.5 w-3.5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-xs ${on ? 'line-through text-gray-400' : 'text-gray-800'}`}>{d.name}</div>
        {d.description && <div className="text-[10px] text-gray-500 mt-0.5">{d.description}</div>}
        {d.whereToGet && <div className="text-[10px] mt-1 font-medium" style={{ color: '#00875a' }}>📍 איפה להשיג: {d.whereToGet}</div>}
        {d.tip && <div className="text-[10px] text-gray-500 mt-0.5 bg-yellow-50 rounded px-1.5 py-0.5 inline-block">💡 {d.tip}</div>}
      </div>
    </div>
  );
}

/* ── Doc row for clerk table ── */
function DocRow({ d, i, on, toggle, c }: { d: DocumentItem; i: number; on: boolean; toggle: () => void; c: string }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${on ? 'bg-green-50' : 'hover:bg-gray-50'} transition-colors`}>
      <span className="font-bold w-5 text-center shrink-0 text-xs rounded-full" style={{ color: c }}>{i}</span>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-xs ${on ? 'line-through text-gray-400' : 'text-gray-800'}`}>{d.name}</div>
        {d.description && <div className="text-[10px] text-gray-500 truncate">{d.description}</div>}
      </div>
      <button onClick={toggle}
        className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold min-h-[32px] transition-all flex items-center gap-1 ${on
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-white text-gray-600 border border-gray-300 hover:border-[#00875a] hover:text-[#00875a]'
        }`}>
        {on ? <><CheckCircle2 className="h-3 w-3" /> הועלה</> : <><Upload className="h-3 w-3" /> העלה</>}
      </button>
    </div>
  );
}

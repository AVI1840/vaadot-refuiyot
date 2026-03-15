import { useState, useMemo } from 'react';
import { getMVPDiagnoses } from '@/data/diagnoses';
import type { DocumentItem } from '@/data/diagnoses';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle, MapPin } from 'lucide-react';

const MOCK_CASE = { org: 'ביטוח לאומי - ילד נכה', caseNumber: '240142' };

const STEPS = [
  { num: 1, label: 'פרטי התובע', done: true, active: false },
  { num: 2, label: 'פרטי הנכות', done: false, active: true },
  { num: 3, label: 'פרטי הפגיעה באזורה', done: false, active: false },
  { num: 4, label: 'מסמכים ותצהיר מידות', done: false, active: false },
  { num: 5, label: 'הצהרות ושליחה', done: false, active: false },
];

function DocRow({ doc, index, checked, onToggle, color }: { doc: DocumentItem; index: number; checked: boolean; onToggle: () => void; color: string }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 text-sm ${checked ? 'bg-green-50' : 'hover:bg-gray-50'} transition-colors`}>
      <span className="font-bold text-gray-400 w-5 text-center shrink-0" style={{ color }}>{index}</span>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold ${checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>{doc.name}</div>
        {doc.description && <div className="text-xs text-gray-500 truncate">{doc.description}</div>}
      </div>
      <button
        onClick={onToggle}
        className={`shrink-0 px-3 py-1.5 rounded text-xs font-bold min-h-[32px] min-w-[56px] transition-colors ${
          checked
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-[#e6f3fa] text-[#0077b6] border border-[#b3d9f0] hover:bg-[#d0eaf5]'
        }`}
      >
        {checked ? <span className="flex items-center gap-1"><Check className="h-3 w-3" /> נמצא</span> : 'העלה'}
      </button>
    </div>
  );
}

function CitizenDocCard({ doc, index, checked, onToggle }: { doc: DocumentItem; index: number; checked: boolean; onToggle: () => void }) {
  return (
    <div
      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
        checked ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200 hover:border-[#0077b6]'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
          checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
        }`}>
          {checked && <Check className="h-3.5 w-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>{doc.name}</div>
          {doc.description && <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>}
          {doc.whereToGet && (
            <p className="text-xs text-[#0077b6] mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" /> {doc.whereToGet}
            </p>
          )}
          {doc.tip && (
            <p className="text-xs bg-yellow-50 text-yellow-800 rounded px-2 py-1 mt-1">💡 {doc.tip}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SystemMockupTab() {
  const mvp = getMVPDiagnoses();
  const defaultGroup = mvp.find(g => g.name === 'אוטיזם') || mvp[0];
  const [selectedDiag, setSelectedDiag] = useState(defaultGroup?.id || mvp[0]?.id);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<'clerk' | 'citizen'>('clerk');

  const group = mvp.find(g => g.id === selectedDiag) || mvp[0];
  const required = useMemo(() => group.documents.filter(d => d.priority === 'required'), [group]);
  const recommended = useMemo(() => group.documents.filter(d => d.priority === 'recommended'), [group]);
  const optional = useMemo(() => group.documents.filter(d => d.priority === 'optional'), [group]);

  const allDocs = group.documents;
  const weights = { required: 3, recommended: 2, optional: 1 };
  const maxScore = allDocs.reduce((s, d) => s + weights[d.priority], 0);
  const curScore = allDocs.filter(d => checkedDocs[d.id]).reduce((s, d) => s + weights[d.priority], 0);
  const readiness = maxScore > 0 ? Math.round((curScore / maxScore) * 10) : 0;
  const reqChecked = required.filter(d => checkedDocs[d.id]).length;

  const toggle = (id: string) => setCheckedDocs(p => ({ ...p, [id]: !p[id] }));

  const readinessColor = readiness >= 8 ? '#2e7d32' : readiness >= 5 ? '#ef6c00' : '#c62828';
  const readinessLabel = readiness >= 8 ? 'מוכנות מלאה' : readiness >= 5 ? 'ניתן לכנס ועדה' : 'לא מוכן לכינוס';

  return (
    <div className="max-w-[1100px] mx-auto space-y-4">
      {/* Intro banner */}
      <div className="text-center mb-2">
        <Badge className="bg-accent text-accent-foreground text-sm px-4 py-1">
          🖥️ מוקאפ — כך ייראה השילוב במערכת ביטוח לאומי
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">
          הדגמה של שילוב הצ׳קליסט החכם בתוך מערכת DocClaim הקיימת — מוכן ליישום
        </p>
      </div>

      {/* View toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setView('clerk')}
          className={`px-4 py-2 rounded-lg text-sm font-bold min-h-[44px] transition-colors ${
            view === 'clerk' ? 'bg-[#0077b6] text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏢 מסך פקיד — מערכת פנימית
        </button>
        <button
          onClick={() => setView('citizen')}
          className={`px-4 py-2 rounded-lg text-sm font-bold min-h-[44px] transition-colors ${
            view === 'citizen' ? 'bg-[#0077b6] text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          👤 מסך אזרח — אתר ביטוח לאומי
        </button>
      </div>

      {/* Diagnosis selector */}
      <div className="flex justify-center gap-2 flex-wrap mb-2">
        {mvp.map(g => (
          <button
            key={g.id}
            onClick={() => { setSelectedDiag(g.id); setCheckedDocs({}); }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all min-h-[36px] ${
              selectedDiag === g.id
                ? 'bg-[#0077b6] text-white border-[#0077b6]'
                : 'bg-white text-gray-600 border-gray-300 hover:border-[#0077b6]'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* ═══════ CLERK VIEW ═══════ */}
      {view === 'clerk' && (
        <div className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg" style={{ fontFamily: 'Heebo, sans-serif' }}>
          {/* NII Header bar */}
          <div className="bg-[#003d6b] text-white px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="opacity-60">systemis/level/DocClaim/</span>
              <span>מערכת ועדות רפואיות</span>
            </div>
            <div className="flex items-center gap-4 opacity-70">
              <span>Power BI</span>
              <span>SAP</span>
              <span>BI מרכזי</span>
            </div>
          </div>

          {/* Sub header */}
          <div className="bg-[#0077b6] text-white px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {/* NII Logo circle */}
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold">ב״ל</span>
              </div>
              <div>
                <div className="font-bold text-base sm:text-lg">תביעה לגמלת {group.domain === 'ילד נכה' ? 'ילד נכה' : 'נכות כללית'}</div>
                <div className="text-white/70 text-xs">{MOCK_CASE.org} • מספר בקשה: {MOCK_CASE.caseNumber}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded min-h-[32px]">
                📎 קבצים שהועלו
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded min-h-[32px]">
                💾 שמירה
              </button>
            </div>
          </div>

          {/* Steps bar */}
          <div className="bg-[#e6f3fa] border-b border-[#b3d9f0] px-4 py-3">
            <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    s.done ? 'bg-[#0077b6] text-white' :
                    s.active ? 'bg-[#0077b6] text-white ring-2 ring-[#0077b6] ring-offset-2' :
                    'bg-white text-gray-400 border border-gray-300'
                  }`}>
                    {s.done ? <Check className="h-3.5 w-3.5" /> : s.num}
                  </div>
                  <span className={`text-[10px] sm:text-xs whitespace-nowrap ${s.active ? 'font-bold text-[#0077b6]' : 'text-gray-500'}`}>
                    {s.label}
                  </span>
                  {i < STEPS.length - 1 && <div className="w-4 sm:w-8 h-px bg-gray-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="bg-white p-4 sm:p-6">
            {/* Section title */}
            <div className="border-b-2 border-[#0077b6] pb-3 mb-4">
              <h3 className="text-[#0077b6] font-bold text-lg">פרטי נכות</h3>
              <p className="text-gray-500 text-xs mt-1">אנחנו ממפים את המסמכים בהתאם ל(יום שנות חובה)</p>
            </div>

            {/* Diagnosis field */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 block mb-1">פרטי הליקוי הרפואי או המחלה של הילד *</label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[44px]">
                <span className="bg-[#e6f3fa] text-[#0077b6] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  {group.name}
                  <span className="text-[#0077b6]/60 cursor-pointer">×</span>
                </span>
                {group.domain === 'ילד נכה' && (
                  <span className="bg-[#e6f3fa] text-[#0077b6] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    ליקוי שמיעה/חירשות
                    <span className="text-[#0077b6]/60 cursor-pointer">×</span>
                  </span>
                )}
              </div>
            </div>

            {/* Readiness score — NEW ADDITION */}
            <div className={`mb-5 p-4 rounded-xl border-2 ${
              readiness >= 8 ? 'border-green-400 bg-green-50' :
              readiness >= 5 ? 'border-orange-400 bg-orange-50' :
              'border-red-400 bg-red-50'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl sm:text-4xl font-extrabold" style={{ color: readinessColor }}>
                    {readiness}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">ציון מוכנות לוועדה</div>
                    <div className="font-bold text-sm" style={{ color: readinessColor }}>
                      {readiness >= 5 ? '🟢' : '🔴'} {readinessLabel}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className="w-3 sm:w-4 h-5 sm:h-7 rounded-sm"
                      style={{ backgroundColor: i < readiness ? readinessColor : '#e0e0e0' }}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {reqChecked}/{required.length} חובה ✓
                </div>
              </div>
            </div>

            {/* Two columns: required + recommended */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Required docs */}
              <div>
                <div className="bg-[#0077b6] text-white px-4 py-2 rounded-t-lg font-bold text-sm">
                  מסמכי חובה
                </div>
                <div className="border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100">
                  {required.map((doc, i) => (
                    <DocRow key={doc.id} doc={doc} index={i + 1} checked={!!checkedDocs[doc.id]} onToggle={() => toggle(doc.id)} color="#0077b6" />
                  ))}
                </div>
              </div>

              {/* Recommended docs */}
              <div>
                <div className="bg-[#00838f] text-white px-4 py-2 rounded-t-lg font-bold text-sm">
                  מסמכי המלצה
                </div>
                <div className="border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100">
                  {recommended.map((doc, i) => (
                    <DocRow key={doc.id} doc={doc} index={i + 1} checked={!!checkedDocs[doc.id]} onToggle={() => toggle(doc.id)} color="#00838f" />
                  ))}
                  {optional.map((doc, i) => (
                    <DocRow key={doc.id} doc={doc} index={recommended.length + i + 1} checked={!!checkedDocs[doc.id]} onToggle={() => toggle(doc.id)} color="#666" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ CITIZEN VIEW ═══════ */}
      {view === 'citizen' && (
        <div className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg" style={{ fontFamily: 'Heebo, sans-serif' }}>
          {/* NII public site header */}
          <div className="bg-[#0077b6] text-white px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <span className="text-[#0077b6] text-xs font-extrabold">ב״ל</span>
              </div>
              <div>
                <div className="font-bold text-lg">המוסד לביטוח לאומי</div>
                <div className="text-white/70 text-xs">הכנה לוועדה רפואית — בדוק מה צריך להביא</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 space-y-5">
            {/* Greeting */}
            <div className="bg-[#e6f3fa] rounded-xl p-4 border border-[#b3d9f0]">
              <h3 className="text-[#0077b6] font-bold text-base mb-1">👋 שלום, הנה הרשימה שלך</h3>
              <p className="text-sm text-gray-600">
                בחרת: <span className="font-bold text-[#0077b6]">{group.name}</span>
                {group.domain === 'ילד נכה' && <span className="text-gray-500"> (ילד נכה)</span>}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ברגע שתגיש את התביעה — אתה מוכר מתאריך ההגשה. המסמכים עוזרים לזרז את הטיפול.
              </p>
            </div>

            {/* Readiness */}
            <div className={`p-4 rounded-xl border-2 text-center ${
              readiness >= 8 ? 'border-green-400 bg-green-50' :
              readiness >= 5 ? 'border-orange-400 bg-orange-50' :
              'border-red-400 bg-red-50'
            }`}>
              <div className="text-4xl font-extrabold mb-1" style={{ color: readinessColor }}>{readiness}</div>
              <div className="text-sm font-bold" style={{ color: readinessColor }}>{readinessLabel}</div>
              <div className="flex justify-center gap-0.5 mt-2">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="w-5 h-3 rounded-sm" style={{ backgroundColor: i < readiness ? readinessColor : '#e0e0e0' }} />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {readiness < 5 ? 'צריך להשלים מסמכים כדי שנוכל לקבוע ועדה' : 'אפשר לקבוע ועדה — כל הכבוד!'}
              </p>
            </div>

            {/* Required docs — simple cards */}
            <div>
              <h4 className="font-bold text-sm text-[#c62828] mb-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> חובה להביא ({reqChecked}/{required.length})
              </h4>
              <div className="space-y-2">
                {required.map((doc, i) => (
                  <CitizenDocCard key={doc.id} doc={doc} index={i + 1} checked={!!checkedDocs[doc.id]} onToggle={() => toggle(doc.id)} />
                ))}
              </div>
            </div>

            {/* Recommended */}
            {recommended.length > 0 && (
              <div>
                <h4 className="font-bold text-sm text-[#ef6c00] mb-2">🟡 מומלץ להביא ({recommended.length})</h4>
                <div className="space-y-2">
                  {recommended.map((doc, i) => (
                    <CitizenDocCard key={doc.id} doc={doc} index={i + 1} checked={!!checkedDocs[doc.id]} onToggle={() => toggle(doc.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* Optional */}
            {optional.length > 0 && (
              <div>
                <h4 className="font-bold text-sm text-gray-500 mb-2">🔵 אם יש לך — שווה להביא ({optional.length})</h4>
                <div className="space-y-2">
                  {optional.map((doc, i) => (
                    <CitizenDocCard key={doc.id} doc={doc} index={i + 1} checked={!!checkedDocs[doc.id]} onToggle={() => toggle(doc.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom note */}
            <div className="text-center text-xs text-gray-400 pt-3 border-t">
              <p>המוסד לביטוח לאומי • מינהל גמלאות • הכנה לוועדה רפואית</p>
            </div>
          </div>
        </div>
      )}

      {/* Implementation note */}
      <div className="text-center text-xs text-muted-foreground mt-4 space-y-1">
        <p className="font-semibold">💡 מה נדרש ליישום?</p>
        <p>הלוגיקה קיימת ומוכנה. נדרש: חיבור API לטבלת אבחנה-מסמך + הוספת קומפוננטת צ׳קליסט למסך DocClaim הקיים.</p>
        <p>אביעד יצחקי | מינהל גמלאות | מרץ 2026</p>
      </div>
    </div>
  );
}

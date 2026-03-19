export interface TrackedCase {
  id: string;
  date: string;
  caseNumber: string;
  diagnosis: string;
  domain: string;
  submittedDocs: number;
  missingDocs: number;
  completeness: number;
  status: 'הושלם' | 'חלקי' | 'חסר';
}

export const initialCases: TrackedCase[] = [
  {
    id: '1',
    date: '2026-03-01',
    caseNumber: 'T-10234',
    diagnosis: 'כאבי גב',
    domain: 'נכות',
    submittedDocs: 7,
    missingDocs: 1,
    completeness: 88,
    status: 'חלקי',
  },
  {
    id: '2',
    date: '2026-03-02',
    caseNumber: 'T-10235',
    diagnosis: 'מחלת לב איסכמית',
    domain: 'נכות',
    submittedDocs: 6,
    missingDocs: 0,
    completeness: 100,
    status: 'הושלם',
  },
  {
    id: '3',
    date: '2026-03-03',
    caseNumber: 'T-10236',
    diagnosis: 'תסמונת התעלה הקרפלית',
    domain: 'נכות מעבודה',
    submittedDocs: 3,
    missingDocs: 3,
    completeness: 50,
    status: 'חלקי',
  },
  {
    id: '4',
    date: '2026-03-05',
    caseNumber: 'T-10237',
    diagnosis: 'אוטיזם',
    domain: 'ילד נכה',
    submittedDocs: 2,
    missingDocs: 4,
    completeness: 33,
    status: 'חסר',
  },
  {
    id: '5',
    date: '2026-03-07',
    caseNumber: 'T-10238',
    diagnosis: 'COPD',
    domain: 'מס הכנסה',
    submittedDocs: 4,
    missingDocs: 0,
    completeness: 100,
    status: 'הושלם',
  },
];

'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Citizen {
  citizenId: string;
  fullName: string;
}

interface InsightData {
  [key: string]: string | number | string[] | boolean;
}

interface InsightResponse {
  citizenId: string;
  role: string;
  generatedAt: string;
  insight: InsightData;
}

interface StoredUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export default function Dashboard() {
  const userRef = useRef<StoredUser | null>(null);
  const [userDisplay, setUserDisplay] = useState<StoredUser | null>(null);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('udis_user');
    if (!stored) {
      window.location.href = '/';
      return;
    }
    const parsed = JSON.parse(stored) as StoredUser;
    userRef.current = parsed;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/insights/citizens`, {
        headers: { Authorization: `Bearer ${parsed.token}` },
      })
      .then(res => {
        setCitizens(res.data as Citizen[]);
        setUserDisplay(parsed);
        setReady(true);
      })
      .catch(() => {
        setUserDisplay(parsed);
        setReady(true);
      });
  }, []);

  const endpointMap: Record<string, string> = {
    clinician: 'health',
    employer: 'employment',
    educator: 'education',
    insurer: 'insurance',
  };

  const fetchInsight = async () => {
    const user = userRef.current;
    if (!selectedId || !user) return;
    setLoading(true);
    setError('');
    setInsight(null);
    try {
      const endpoint = endpointMap[user.role];
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/insights/${endpoint}/${selectedId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setInsight(data as InsightResponse);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to generate insight');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const roleConfig: Record<string, { bg: string; icon: string; label: string }> = {
    clinician: { bg: 'bg-red-500',    icon: '🏥', label: 'Clinician Portal' },
    employer:  { bg: 'bg-blue-500',   icon: '💼', label: 'Employer Portal'  },
    educator:  { bg: 'bg-green-500',  icon: '🎓', label: 'Educator Portal'  },
    insurer:   { bg: 'bg-purple-500', icon: '🛡️', label: 'Insurer Portal'   },
  };

  if (!ready || !userDisplay) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600 font-bold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const config = roleConfig[userDisplay.role] || roleConfig['clinician'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-2 border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full ${config.bg} flex items-center justify-center text-xl shadow`}>
              {config.icon}
            </div>
            <div>
              <h1 className="font-black text-gray-900 text-lg">UDIS Dashboard</h1>
              <p className="text-xs font-semibold text-gray-500">{config.label} — {userDisplay.name}</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem('udis_user'); window.location.href = '/'; }}
            className="text-sm font-bold text-gray-500 hover:text-red-500 transition px-4 py-2 rounded-lg hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-1">Citizen Lookup</h2>
          <p className="text-xs font-semibold text-gray-400 mb-4">Select a citizen ID to generate an AI-powered insight</p>
          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="flex-1 min-w-52 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">— Select a Citizen ID —</option>
              {citizens.map(c => (
                <option key={c.citizenId} value={c.citizenId}>
                  {c.citizenId} — {c.fullName}
                </option>
              ))}
            </select>
            <button
              onClick={fetchInsight}
              disabled={loading || !selectedId}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 disabled:opacity-40 transition shadow-lg shadow-blue-100"
            >
              {loading ? 'Generating...' : '⚡ Generate AI Insight'}
            </button>
          </div>
          {error && (
            <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-700 text-sm font-bold">⚠ {error}</p>
            </div>
          )}
        </div>

        {loading && (
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center shadow-sm">
            <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 font-bold">AI is analysing citizen data...</p>
            <p className="text-gray-400 text-xs font-semibold mt-1">This may take a few seconds</p>
          </div>
        )}

        {insight && !loading && (
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-base font-black text-gray-900 uppercase tracking-wide capitalize">
                  {userDisplay.role} Insight Report
                </h2>
                <p className="text-xs font-semibold text-gray-400 mt-1">
                  Citizen: {insight.citizenId} &nbsp;|&nbsp; {new Date(insight.generatedAt).toLocaleString()}
                </p>
              </div>
              {insight.insight?.supervisorOverride ? (
                <span className="px-4 py-2 bg-amber-100 text-amber-700 text-xs font-black rounded-full border-2 border-amber-200">
                  ⚠ SUPERVISOR REVIEW REQUIRED
                </span>
              ) : (
                <span className="px-4 py-2 bg-green-100 text-green-700 text-xs font-black rounded-full border-2 border-green-200">
                  ✓ CONFIDENCE: {Math.round(((insight.insight?.confidenceScore as number) || 0) * 100)}%
                </span>
          )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(insight.insight || {})
                .filter(([k]) => !['confidenceScore', 'supervisorOverride'].includes(k))
                .map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-xl border-2 border-gray-100 p-4">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    {Array.isArray(value) ? (
                      <ul className="space-y-2">
                        {(value as string[]).map((item, i) => (
                          <li key={i} className="text-sm font-semibold text-gray-800 flex items-start gap-2">
                            <span className="text-blue-500 font-black mt-0.5">›</span>{item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">{String(value)}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
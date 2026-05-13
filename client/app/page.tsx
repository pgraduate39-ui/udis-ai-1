'use client';
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('clinician');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );
      localStorage.setItem('udis_user', JSON.stringify(data));
      window.location.href = '/dashboard';
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        { name, email, password, role }
      );
      setSuccess('Account created! You can now sign in.');
      setIsRegister(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed.');
      } else {
        setError('Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 px-8 py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-3">
            <span className="text-blue-600 text-2xl font-black">U</span>
          </div>
          <h1 className="text-white text-2xl font-black tracking-wide">UDIS</h1>
          <p className="text-blue-100 text-sm mt-1">Unified Digital Identity System</p>
        </div>

        <div className="px-8 py-6">
          {/* Tabs */}
          <div className="flex rounded-xl border-2 border-gray-200 mb-6 overflow-hidden">
            <button
              onClick={() => { setIsRegister(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 text-sm font-black transition-all ${
                !isRegister ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 text-sm font-black transition-all ${
                isRegister ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              REGISTER
            </button>
          </div>

          {/* Quick login buttons */}
          {!isRegister && (
            <div className="mb-6">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest text-center mb-3">
                Login
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['clinician', 'employer', 'educator', 'insurer'].map(r => (
                  <button
                    key={r}
                    onClick={() => { setEmail(`${r}@test.com`); setPassword('password123'); }}
                    className="py-2.5 px-3 text-xs font-black border-2 border-blue-200 rounded-lg text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 capitalize transition-all"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jane Wangui"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">
                  Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="clinician">Clinician</option>
                  <option value="employer">Employer</option>
                  <option value="educator">Educator</option>
                  <option value="insurer">Insurer</option>
                </select>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-700 text-sm font-bold">⚠ {error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3">
                <p className="text-green-700 text-sm font-bold">✓ {success}</p>
              </div>
            )}

            <button
              onClick={isRegister ? handleRegister : handleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-black text-sm tracking-wide hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
            >
              {loading
                ? (isRegister ? 'CREATING ACCOUNT...' : 'SIGNING IN...')
                : (isRegister ? 'CREATE ACCOUNT' : 'SIGN IN')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
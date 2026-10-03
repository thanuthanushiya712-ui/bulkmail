import { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [status, setstatus] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    setstatus(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        onLogin();
      }
    } catch (error) {
      seterror(error.response?.data?.message || "Login failed");
    }

    setstatus(false);
  };

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="login-card relative z-10 w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/70 shadow-[0_35px_120px_rgba(15,23,42,0.8)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="login-hero relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.26),_transparent_40%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.88))] p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="absolute -left-10 top-8 h-48 w-48 rounded-full bg-violet-500/20 blur-[100px]" />
            <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-sky-500/15 blur-[100px]" />

            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.22em] text-violet-200 uppercase">
                <span className="h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.8)]" />
                YOUR CAMPAIGNS, REIMAGINED
              </div>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 shadow-[0_20px_45px_rgba(129,140,248,0.45)]">
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
                </svg>
              </div>

              <h1 className="login-hero-title text-4xl font-black tracking-tight text-white sm:text-5xl">MailMuse</h1>
              <p className="mt-3 max-w-md text-base text-slate-300">Make every send feel intentional. Bring your best ideas to the inbox with a little more imagination.</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="glass-card rounded-2xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Scale</div>
                  <div className="mt-3 text-2xl font-black text-white">1M+</div>
                </div>
                <div className="glass-card rounded-2xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Speed</div>
                  <div className="mt-3 text-2xl font-black text-white">6x</div>
                </div>
                <div className="glass-card rounded-2xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Voices</div>
                  <div className="mt-3 text-2xl font-black text-white">24/7</div>
                </div>
              </div>

              <div className="mt-9 rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>Live campaign</span>
                  <span className="status-pill"><span className="status-dot" />active</span>
                </div>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2"><span>Sent</span><strong className="text-white">42,680</strong></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2"><span>Open rate</span><strong className="text-emerald-300">65.4%</strong></div>
                </div>
              </div>
            </div>
          </div>

          <div className="login-form-panel bg-slate-950/75 p-6 sm:p-8 lg:p-10">
            <div className="mb-7">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">Secure access</div>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-400">Sign in to manage campaigns and delivery workflows.</p>
            </div>

            <form onSubmit={handlesubmit} className="space-y-5">
              <div>
                <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Email address</label>
                <div className="input-shell flex items-center gap-3 rounded-2xl px-4 py-3">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
                  </svg>
                  <input type="email" value={email} onChange={(e) => setemail(e.target.value)} placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Password</label>
                <div className="input-shell flex items-center gap-3 rounded-2xl px-4 py-3">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
                  </svg>
                  <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} placeholder="Enter password" required />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
                <label className="inline-flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-violet-500" />Keep me signed in</label>
                <button type="button" className="font-medium text-violet-300 transition hover:text-violet-200">Forgot password?</button>
              </div>

              {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

              <button type="submit" disabled={status} className="primary-btn w-full disabled:cursor-not-allowed disabled:opacity-70">
                {status ? "Signing in..." : "Sign in to dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

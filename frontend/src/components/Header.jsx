import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setShowDropdown(false);
  };

  return (
    <header className="relative z-20 border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate("/send-mail")} className="group flex items-center gap-3 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 shadow-[0_20px_45px_rgba(99,102,241,0.42)] transition-transform duration-200 group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
            </svg>
          </div>

          <div className="hidden sm:block">
            <div className="text-[15px] font-bold tracking-tight text-white">MailMuse</div>
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">Campaign studio</div>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1 rounded-2xl border border-white/10 bg-slate-900/70 p-1.5 shadow-inner shadow-slate-950/40">
            <button onClick={() => navigate("/send-mail")} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white sm:px-4 sm:text-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-violet-300" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.12 2.12 0 1 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
              </svg>
              Compose
            </button>

            <button onClick={() => navigate("/history")} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white sm:px-4 sm:text-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-sky-300" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 13h5" />
              </svg>
              History
            </button>
          </nav>

          <div className="hidden h-8 w-px bg-white/10 sm:block" />

          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)]" aria-label="Open profile menu">
              U
            </button>

            {showDropdown && (
              <>
                <button aria-label="Close menu" className="fixed inset-0 z-40 cursor-default bg-transparent" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-[0_30px_80px_rgba(2,6,23,0.8)]">
                  <div className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">U</div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">User</p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">user@gmail.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button onClick={handleLogout} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800">
                      <span>Log out</span>
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

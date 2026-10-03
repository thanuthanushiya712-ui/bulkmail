import { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [emails, setemails] = useState([]);
  const [loading, setloading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchhistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setloading(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/emails`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setemails(response.data.emails || []);
      } catch (error) {
        console.error("History error:", error.response?.data || error.message);
      } finally {
        setloading(false);
      }
    };

    fetchhistory();
  }, []);

  const handleDeleteEmail = async (id) => {
    if (!id) {
      alert("Invalid email history ID");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this email history?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/emails/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success) {
        setemails((prev) => prev.filter((email) => String(email._id) !== String(id)));
        if (String(openId) === String(id)) setOpenId(null);
      } else {
        alert(response.data?.message || "Failed to delete history");
      }
    } catch (error) {
      console.error("Delete history error:", error);
      alert(error.response?.data?.message || "Failed to delete email history");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleHistory = (id) => {
    setOpenId((currentId) => (String(currentId) === String(id) ? null : id));
  };

  const formatDate = (value) => {
    if (!value) return "Unknown time";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  };

  if (loading) {
    return (
      <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="panel rounded-[28px] p-8">
            <div className="h-10 w-56 animate-pulse rounded-2xl bg-slate-800/80" />
            <div className="mt-4 h-4 w-80 animate-pulse rounded-xl bg-slate-800/80" />
            <div className="mt-10 space-y-4">
              <div className="h-20 animate-pulse rounded-2xl bg-slate-800/80" />
              <div className="h-20 animate-pulse rounded-2xl bg-slate-800/80" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-violet-500 text-white">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 13h5" />
                </svg>
              </span>
              Campaign archive
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Email history</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Review prior sends, recipient counts, and the exact message content behind each campaign.</p>
          </div>

          <div className="panel rounded-2xl px-5 py-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Total campaigns</div>
            <div className="mt-2 flex items-end gap-3">
              <div className="metric-value">{emails.length}</div>
              <div className="pb-1 text-xs text-sky-300">sent</div>
            </div>
          </div>
        </div>

        {emails.length === 0 ? (
          <div className="panel rounded-[28px] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/80 text-violet-300">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 13h5" />
              </svg>
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white">No campaign history yet</h2>
            <p className="mt-2 text-sm text-slate-400">Your sent emails will appear here once the first batch goes out.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map((email) => {
              const isOpen = String(openId) === String(email._id);
              const recipients = Array.isArray(email.recipients) ? email.recipients : [];
              const successful = Array.isArray(email.successfulEmails) ? email.successfulEmails.length : 0;
              const failed = Array.isArray(email.failedEmails) ? email.failedEmails.length : 0;

              return (
                <div key={email._id || email.id} className="history-accordion">
                  <button type="button" onClick={() => toggleHistory(email._id)} className="history-summary">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-sky-500/15 text-violet-200">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-base font-semibold text-white">{email.subject || "Untitled campaign"}</div>
                        <div className="mt-1 text-xs text-slate-400">{formatDate(email.createdAt)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden items-center gap-2 sm:flex">
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-200">{successful} sent</span>
                        {failed > 0 && <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-red-200">{failed} failed</span>}
                      </div>

                      <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteEmail(email._id); }} disabled={deletingId === email._id} className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60">
                        {deletingId === email._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="history-detail">
                      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Message body</div>
                          <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm leading-7 text-slate-200 whitespace-pre-line">{email.body || "No body content available."}</div>
                        </div>

                        <div className="space-y-4">
                          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Recipient count</div>
                            <div className="mt-3 text-2xl font-black text-white">{recipients.length}</div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Sent summary</div>
                            <div className="mt-3 space-y-2 text-sm text-slate-300">
                              <div className="flex items-center justify-between"><span>Successful</span><strong className="text-emerald-300">{successful}</strong></div>
                              <div className="flex items-center justify-between"><span>Failed</span><strong className="text-red-300">{failed}</strong></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default History;

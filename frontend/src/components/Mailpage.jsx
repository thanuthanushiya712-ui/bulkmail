import { useContext, useState } from "react";
import { Mailcontext } from "../context/Provider";
import * as XLSX from "xlsx";
import axios from "axios";

const Mailpage = () => {
  const { maildata, handlechange, setmaildata } = useContext(Mailcontext);
  const [status, setstatus] = useState(false);
  const [successCount, setsuccessCount] = useState(0);
  const [failedCount, setfailedCount] = useState(0);
  const [recipientsText, setRecipientsText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const recipients = recipientsText.split(/[\n,]/).map((email) => email.trim()).filter(Boolean);
  const uniqueRecipients = [...new Set(recipients)];

  const handleFieldChange = (e) => handlechange(e);

  const handleRecipientsChange = (value) => {
    setRecipientsText(value);
    setsuccessCount(0);
    setfailedCount(0);
  };

  function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setsuccessCount(0);
    setfailedCount(0);

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const workbook = XLSX.read(loadEvent.target.result, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: "A", defval: "" });

        const emails = rows
          .map((row) => String(row.A || "").trim().toLowerCase())
          .filter((email) => email.length > 0);

        if (emails.length === 0) {
          alert("No email addresses found in column A.");
          setSelectedFileName("");
          return;
        }

        setRecipientsText((currentText) => [...(currentText ? currentText.split(/[\n,]/) : []), ...emails].filter(Boolean).join("\n"));
      } catch (error) {
        console.log("Excel error:", error);
        alert("Unable to read the Excel file.");
        setSelectedFileName("");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  const handlesubmit = async (e) => {
    e.preventDefault();
    setsuccessCount(0);
    setfailedCount(0);

    if (!maildata?.subject?.trim()) {
      alert("Please enter email subject.");
      return;
    }

    if (!maildata?.body?.trim()) {
      alert("Please enter email message.");
      return;
    }

    if (uniqueRecipients.length === 0) {
      alert("Please enter an email or upload an Excel file.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      setstatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/sendmail`,
        {
          subject: maildata.subject,
          body: maildata.body,
          recipients: uniqueRecipients,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let successful = 0;
      let failed = 0;

      if (Array.isArray(response.data?.successfulEmails)) successful = response.data.successfulEmails.length;
      if (Array.isArray(response.data?.failedEmails)) failed = response.data.failedEmails.length;
      if (typeof response.data?.successCount === "number") successful = response.data.successCount;
      if (typeof response.data?.failedCount === "number") failed = response.data.failedCount;

      if (response.data?.success) {
        if (successful === 0 && failed === 0) successful = uniqueRecipients.length;

        setsuccessCount(successful);
        setfailedCount(failed);

        alert(failed > 0 ? `Mail sending completed.\n\nSuccessful: ${successful}\nFailed: ${failed}` : `Mail sent successfully to ${successful} recipient${successful === 1 ? "" : "s"}.`);

        setmaildata((prev) => ({ ...prev, subject: "", body: "", recipients: "", file: null, filemails: [] }));
        setRecipientsText("");
        setSelectedFileName("");
      } else {
        setsuccessCount(0);
        setfailedCount(uniqueRecipients.length);
        alert(response.data?.message || "Mail could not be sent.");
      }
    } catch (error) {
      console.log("Email sending error:", error);
      setsuccessCount(0);
      setfailedCount(uniqueRecipients.length);
      alert(error.response?.data?.message || error.response?.data?.error || "Failed to send mail");
    } finally {
      setstatus(false);
    }
  };

  const removeFile = () => setSelectedFileName("");

  const clearCompose = () => {
    setmaildata((prev) => ({ ...prev, subject: "", body: "", recipients: "", file: null, filemails: [] }));
    setRecipientsText("");
    setSelectedFileName("");
    setsuccessCount(0);
    setfailedCount(0);
  };

  return (
    <section className="relative px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-sky-500 text-white">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.12 2.12 0 1 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
                </svg>
              </span>
              Campaign studio
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Launch a new message</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Compose a polished email and deliver it to a curated audience in one focused workflow.</p>
          </div>

          <div className="panel rounded-2xl px-5 py-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Audience</div>
            <div className="mt-2 flex items-end gap-3">
              <div className="metric-value">{uniqueRecipients.length}</div>
              <div className="pb-1 text-xs text-violet-300">recipients</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="panel overflow-hidden rounded-[28px]">
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Email details</div>
                  <div className="text-xs text-slate-400">Write your campaign and preview the flow.</div>
                </div>
              </div>

              <button type="button" onClick={clearCompose} className="secondary-btn text-xs sm:text-sm">Clear</button>
            </div>

            <div className="p-5 sm:p-6">
              <form onSubmit={handlesubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Subject</label>
                  <div className="input-shell rounded-2xl px-4 py-3">
                    <input type="text" name="subject" value={maildata.subject || ""} onChange={handleFieldChange} placeholder="Campaign update, product launch, invite..." />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Message body</label>
                  <div className="input-shell rounded-2xl px-4 py-3">
                    <textarea name="body" value={maildata.body || ""} onChange={handleFieldChange} rows={12} placeholder="Write the content for your recipients..." className="resize-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button type="button" className="secondary-btn" onClick={clearCompose}>Reset draft</button>
                  <button type="submit" disabled={status} className="primary-btn min-w-[180px] disabled:cursor-not-allowed disabled:opacity-70">
                    {status ? "Sending..." : "Send campaign"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="panel rounded-[28px] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">Recipients</div>
                  <div className="text-xs text-slate-400">Paste emails or upload a spreadsheet</div>
                </div>
                <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-violet-200">
                  {uniqueRecipients.length} live
                </div>
              </div>

              <textarea value={recipientsText} onChange={(e) => handleRecipientsChange(e.target.value)} rows={8} placeholder="name@example.com" className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10" />

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {selectedFileName && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200">
                    {selectedFileName}
                    <button type="button" onClick={removeFile} className="text-emerald-100/80 hover:text-white">×</button>
                  </div>
                )}
              </div>

              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-400/40 bg-violet-500/5 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-300/80 hover:bg-violet-500/10">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0 4 4m-4-4-4 4M4 16.5v1A2.5 2.5 0 0 0 6.5 20h11A2.5 2.5 0 0 0 20 17.5v-1" />
                </svg>
                Upload spreadsheet
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />
              </label>
            </div>

            <div className="panel rounded-[28px] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Delivery pulse</div>
                  <div className="mt-1 text-xs text-slate-400">Latest results</div>
                </div>
                <div className="status-pill"><span className="status-dot" />Live</div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-4">
                  <div className="small-label">Success</div>
                  <div className="metric-value mt-3 text-emerald-300">{successCount}</div>
                </div>
                <div className="rounded-2xl border border-red-500/15 bg-red-500/8 p-4">
                  <div className="small-label">Failed</div>
                  <div className="metric-value mt-3 text-red-300">{failedCount}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Mailpage;

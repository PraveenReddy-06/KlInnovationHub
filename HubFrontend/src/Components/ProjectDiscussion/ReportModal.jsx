import { useEffect, useState } from "react";
import { AlertTriangle, Flag, Loader2, X } from "lucide-react";

const ReportModal = ({ open, type = "discussion", onClose, onSubmit, submitting = false }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, submitting, onClose]);

  if (!open) return null;
  const label = type === "reply" ? "reply" : "discussion";
  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedReason = reason.trim();
    if (!trimmedReason || submitting) return;
    await onSubmit(trimmedReason);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !submitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/10 px-4 py-6 backdrop-blur-xs"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="w-full max-w-md overflow-hidden border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <div>
              <h2 id="report-modal-title" className="text-base font-bold text-slate-900">
                Report {label}
              </h2>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                Help us understand what may be inappropriate or problematic. Reviewed By Admin.
              </p>
            </div>
          </div>

          <button type="button" onClick={onClose} disabled={submitting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close report dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5">
            <label htmlFor="report-reason" className="mb-2 block text-sm font-semibold text-slate-800">
              Reason for reporting
            </label>

            <textarea id="report-reason" value={reason} onChange={(event) => setReason(event.target.value)} maxLength={50} autoFocus
              rows={5} placeholder={`Tell us why you are reporting this ${label}...`} disabled={submitting}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="mt-2 flex items-start justify-between gap-3">
              <div className="flex items-start gap-1.5 text-[11px] leading-4 text-slate-500">
                <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                <span>Please provide a clear and genuine reason.</span>
              </div>
              <span className="shrink-0 text-[11px] text-slate-400">{reason.length}/50</span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>

            <button type="submit" disabled={!reason.trim() || submitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Reporting...
                </>
              ) : (
                <>
                  <Flag size={16} />
                  Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
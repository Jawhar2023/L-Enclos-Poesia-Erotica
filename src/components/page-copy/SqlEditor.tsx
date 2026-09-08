"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";

const SAMPLES = [
  "select id, title_fr, author_fr from poems order by created_at;",
  "select count(*) as n from comments;",
  "select poem_id, count(*) as likes from reactions group by poem_id;",
  "select * from submissions where status = 'pending';",
];

export function SqlEditor({ connected }: { connected: boolean }) {
  const { d } = useLang();
  const [sql, setSql] = useState("select id, title_fr, author_fr from poems order by created_at;");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [kind, setKind] = useState("");

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError("");
    setKind("");
    try {
      const res = await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setRows([]);
        setColumns([]);
        setRowCount(null);
        setError(data.error || d.sqlError);
        return;
      }
      setKind(data.type);
      setColumns(data.columns || []);
      setRows(data.rows || []);
      setRowCount(data.rowCount ?? null);
    } catch {
      setError(d.sqlError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-[1.2rem] bg-paper p-4 sm:rounded-[1.5rem] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl sm:text-2xl">{d.sqlTitle}</h2>
        <p
          className={`rounded-full px-3 py-1 text-sm ${
            connected ? "bg-pistachio/70" : "bg-rose/50"
          }`}
        >
          {connected ? d.sqlConnected : d.sqlDisconnected}
        </p>
      </div>
      <p className="mt-2 text-sm text-ink/55">{d.sqlHint}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {SAMPLES.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => setSql(sample)}
            className="rounded-full bg-cream px-3 py-1.5 text-left font-mono text-[11px] text-ink/70 hover:text-ink"
          >
            {sample.replace("select ", "SELECT ").slice(0, 42)}…
          </button>
        ))}
      </div>

      <form onSubmit={run} className="mt-4">
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          spellCheck={false}
          rows={10}
          className="w-full min-w-0 resize-y rounded-xl border border-mist bg-[#1f1c1a] px-4 py-3 font-mono text-sm leading-6 text-[#f4ead8] outline-none focus:border-sky"
        />
        <button
          type="submit"
          disabled={busy || !connected}
          className="mt-3 w-full rounded-full bg-ink px-5 py-3 font-display text-paper disabled:opacity-50 sm:w-auto sm:py-2"
        >
          {busy ? d.sqlRunning : d.sqlRun}
        </button>
      </form>

      {error ? <p className="mt-4 rounded-xl bg-rose/40 px-4 py-3 text-sm">{error}</p> : null}

      {kind === "ok" && rowCount !== null ? (
        <p className="mt-4 text-sm text-ink/60">
          {d.sqlDone} · {rowCount}
        </p>
      ) : null}

      {kind === "rows" ? (
        rows.length === 0 ? (
          <p className="mt-4 text-sm text-ink/50">{d.sqlEmpty}</p>
        ) : (
          <div className="mt-4 max-w-full overflow-x-auto rounded-xl border border-mist">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-cream">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-3 py-2 font-display font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-t border-mist/70 align-top">
                    {columns.map((col) => (
                      <td key={col} className="max-w-xs truncate px-3 py-2 font-mono text-xs">
                        {formatCell(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </section>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

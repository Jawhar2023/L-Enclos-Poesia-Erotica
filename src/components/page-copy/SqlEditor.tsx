"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/context/LangContext";
import {
  isWriteSql,
  SQL_GROUPS,
  SQL_RECIPES,
  TABLE_PRESETS,
  type SqlGroup,
  type SqlRecipe,
} from "@/lib/sql-workbench";

type TableInfo = {
  name: string;
  count: number;
  columns: { name: string; type: string; nullable: string }[];
};

type Catalog = {
  ok: boolean;
  connected: boolean;
  stats?: {
    poems: number;
    likes: number;
    comments: number;
    submissions: number;
    pending: number;
  };
  tables?: TableInfo[];
  activity?: {
    likes: { id: string; poem_id: string; poem_title?: string; visitor_id: string; created_at: string }[];
    comments: { id: string; poem_id: string; poem_title?: string; author: string; body: string; created_at: string }[];
    submissions: { id: string; author: string; title_fr: string; title_ar: string; status: string; created_at: string }[];
  };
};

type HistoryItem = { sql: string; at: number; ok: boolean; rows: number; ms: number };

const HISTORY_KEY = "enclos-sql-history-v1";

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 16) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 16)));
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function looksIso(value: string) {
  return /^\d{4}-\d{2}-\d{2}T/.test(value);
}

function displayCell(value: unknown) {
  const text = formatCell(value);
  if (!text) return "—";
  if (looksIso(text)) {
    const date = new Date(text);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString();
    }
  }
  return text;
}

function toCsv(columns: string[], rows: Record<string, unknown>[]) {
  const esc = (value: string) => `"${value.replace(/"/g, '""')}"`;
  return [
    columns.map(esc).join(","),
    ...rows.map((row) => columns.map((col) => esc(formatCell(row[col]))).join(",")),
  ].join("\n");
}

export function SqlEditor({ connected }: { connected: boolean }) {
  const { d, lang } = useLang();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [group, setGroup] = useState<SqlGroup>("likes");
  const [sql, setSql] = useState(SQL_RECIPES[0].sql);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [kind, setKind] = useState("");
  const [ms, setMs] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openTable, setOpenTable] = useState<string | null>("reactions");
  const [expanded, setExpanded] = useState<{ col: string; value: string } | null>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const recipes = useMemo(() => SQL_RECIPES.filter((item) => item.group === group), [group]);

  const refreshCatalog = useCallback(async () => {
    const res = await fetch("/api/admin/sql", { cache: "no-store" });
    const data = await res.json();
    setCatalog(data);
  }, []);

  useEffect(() => {
    setHistory(loadHistory());
    let cancelled = false;
    (async () => {
      const catalogRes = await fetch("/api/admin/sql", { cache: "no-store" });
      const catalogData = await catalogRes.json();
      if (cancelled) return;
      setCatalog(catalogData);
      if (!catalogData.connected) return;
      const exec = await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: SQL_RECIPES[0].sql }),
      });
      const result = await exec.json();
      if (cancelled || !result.ok) return;
      setKind(result.type);
      setColumns(result.columns || []);
      setRows(result.rows || []);
      setRowCount(result.rowCount ?? null);
      setMs(result.ms ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function run(query = sql) {
    const next = query.trim();
    if (!next) return;
    if (isWriteSql(next) && !window.confirm(d.sqlWriteConfirm)) return;
    setBusy(true);
    setError("");
    setKind("");
    setExpanded(null);
    try {
      const res = await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: next }),
      });
      const data = await res.json();
      const took = typeof data.ms === "number" ? data.ms : null;
      setMs(took);
      if (!res.ok || !data.ok) {
        setRows([]);
        setColumns([]);
        setRowCount(null);
        setError(data.error || d.sqlError);
        const fail: HistoryItem = { sql: next, at: Date.now(), ok: false, rows: 0, ms: took || 0 };
        setHistory((prev) => {
          const nextHistory = [fail, ...prev.filter((item) => item.sql !== next)].slice(0, 16);
          saveHistory(nextHistory);
          return nextHistory;
        });
        return;
      }
      setKind(data.type);
      setColumns(data.columns || []);
      setRows(data.rows || []);
      setRowCount(data.rowCount ?? null);
      const okItem: HistoryItem = {
        sql: next,
        at: Date.now(),
        ok: true,
        rows: data.rows?.length || data.rowCount || 0,
        ms: took || 0,
      };
      setHistory((prev) => {
        const nextHistory = [okItem, ...prev.filter((item) => item.sql !== next)].slice(0, 16);
        saveHistory(nextHistory);
        return nextHistory;
      });
      refreshCatalog();
    } catch {
      setError(d.sqlError);
    } finally {
      setBusy(false);
    }
  }

  function useRecipe(recipe: SqlRecipe) {
    setSql(recipe.sql);
    setGroup(recipe.group);
    if (!recipe.write) run(recipe.sql);
  }

  function useTable(name: keyof typeof TABLE_PRESETS) {
    const next = TABLE_PRESETS[name];
    setSql(next);
    setOpenTable(name);
    run(next);
  }

  function exportCsv() {
    if (!columns.length) return;
    const blob = new Blob([toCsv(columns, rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `enclos-${group}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(rows, null, 2));
  }

  const stats = catalog?.stats;
  const tables = catalog?.tables || [];
  const activity = catalog?.activity;
  const lines = sql.split("\n").length;
  const connectedNow = Boolean(connected && catalog?.connected);

  return (
    <section className="sql-bench overflow-hidden rounded-[1.4rem] border border-mist bg-paper">
      <header className="flex flex-col gap-3 border-b border-mist/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-display text-2xl">{d.sqlTitle}</h2>
          <p className="mt-1 text-sm text-ink/55">{d.sqlHint}</p>
        </div>
        <p className={`rounded-full px-3 py-1 text-sm ${connectedNow ? "bg-pistachio/70" : "bg-rose/50"}`}>
          {connectedNow ? d.sqlConnected : d.sqlDisconnected}
        </p>
      </header>

      <div className="grid gap-3 border-b border-mist/80 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
        {(
          [
            { id: "likes" as const, label: d.sqlCardLikes, value: stats?.likes ?? "—", query: SQL_RECIPES.find((r) => r.id === "likes-recent") },
            { id: "comments" as const, label: d.sqlCardComments, value: stats?.comments ?? "—", query: SQL_RECIPES.find((r) => r.id === "comments-recent") },
            { id: "submissions" as const, label: d.sqlCardPending, value: stats?.pending ?? "—", query: SQL_RECIPES.find((r) => r.id === "subs-pending") },
            { id: "poems" as const, label: d.sqlCardPoems, value: stats?.poems ?? "—", query: SQL_RECIPES.find((r) => r.id === "poems-library") },
          ] as const
        ).map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => card.query && useRecipe(card.query)}
            className={`rounded-[1.1rem] bg-gradient-to-br p-4 text-left ${
              group === card.id ? "from-ink to-[#3d3834] text-paper" : "from-cream to-paper"
            }`}
          >
            <p className={`font-display text-[11px] uppercase tracking-[0.18em] ${group === card.id ? "text-paper/60" : "text-ink/45"}`}>
              {card.label}
            </p>
            <p className="mt-1 font-display text-3xl">{card.value}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-mist/80 p-4 lg:border-b-0 lg:border-r">
          <p className="font-display text-sm text-ink/50">{d.sqlTables}</p>
          <ul className="mt-2 space-y-1">
            {(["reactions", "comments", "submissions", "poems"] as const).map((name) => {
              const table = tables.find((item) => item.name === name);
              return (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => useTable(name)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 font-mono text-xs ${
                      openTable === name ? "bg-ink text-paper" : "bg-cream text-ink/80"
                    }`}
                  >
                    <span>{name}</span>
                    <span>{table?.count ?? "·"}</span>
                  </button>
                  {openTable === name && table?.columns.length ? (
                    <ul className="mt-1 space-y-0.5 px-2 pb-2">
                      {table.columns.map((col) => (
                        <li key={col.name} className="flex justify-between gap-2 font-mono text-[10px] text-ink/55">
                          <span>{col.name}</span>
                          <span>{col.type}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <p className="mt-5 font-display text-sm text-ink/50">{d.sqlRecipes}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {SQL_GROUPS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setGroup(item.id)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-display ${
                  group === item.id ? "bg-sky text-ink" : "bg-cream text-ink/60"
                }`}
              >
                {lang === "ar" ? item.labelAr : item.labelFr}
              </button>
            ))}
          </div>
          <ul className="mt-3 space-y-1">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <button
                  type="button"
                  onClick={() => useRecipe(recipe)}
                  className="w-full rounded-xl bg-cream/80 px-3 py-2 text-left hover:bg-cream"
                >
                  <span className="block text-sm font-display">{lang === "ar" ? recipe.labelAr : recipe.labelFr}</span>
                  <span className="mt-0.5 block text-[11px] text-ink/50">
                    {lang === "ar" ? recipe.hintAr : recipe.hintFr}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {history.length ? (
            <>
              <p className="mt-5 font-display text-sm text-ink/50">{d.sqlHistory}</p>
              <ul className="mt-2 space-y-1">
                {history.slice(0, 6).map((item) => (
                  <li key={`${item.at}-${item.sql.slice(0, 12)}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setSql(item.sql);
                        run(item.sql);
                      }}
                      className="w-full truncate rounded-lg px-2 py-1.5 text-left font-mono text-[10px] text-ink/60 hover:bg-cream"
                    >
                      {item.ok ? "✓" : "✗"} {item.sql.replace(/\s+/g, " ").slice(0, 54)}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </aside>

        <div className="min-w-0 p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <ActivityColumn
              title={d.sqlLiveLikes}
              empty={d.none}
              items={(activity?.likes || []).map((row) => ({
                id: row.id,
                kicker: row.poem_title || row.poem_id,
                body: row.visitor_id.slice(0, 8),
                at: row.created_at,
              }))}
              onOpen={() => useRecipe(SQL_RECIPES.find((r) => r.id === "likes-recent")!)}
            />
            <ActivityColumn
              title={d.sqlLiveComments}
              empty={d.none}
              items={(activity?.comments || []).map((row) => ({
                id: row.id,
                kicker: row.author.trim() || d.commentAnonymous,
                body: row.body,
                at: row.created_at,
              }))}
              onOpen={() => useRecipe(SQL_RECIPES.find((r) => r.id === "comments-recent")!)}
            />
            <ActivityColumn
              title={d.sqlLiveSubs}
              empty={d.none}
              items={(activity?.submissions || []).map((row) => ({
                id: row.id,
                kicker: row.status,
                body: row.title_fr || row.title_ar || row.author,
                at: row.created_at,
              }))}
              onOpen={() => useRecipe(SQL_RECIPES.find((r) => r.id === "subs-all")!)}
            />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              run();
            }}
            className="mt-5"
          >
            <div className="sql-editor flex overflow-hidden rounded-xl border border-[#3a342f] bg-[#161310]">
              <div
                className="select-none border-r border-white/5 px-2 py-3 text-right font-mono text-[11px] leading-6 text-[#7d7368]"
                aria-hidden
              >
                {Array.from({ length: Math.max(lines, 8) }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                ref={areaRef}
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    run();
                  }
                }}
                spellCheck={false}
                rows={Math.max(8, lines)}
                className="min-h-48 w-full resize-y bg-transparent px-3 py-3 font-mono text-[13px] leading-6 text-[#f4ead8] outline-none"
              />
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={busy || !connectedNow}
                  className="rounded-full bg-ink px-5 py-2.5 font-display text-paper disabled:opacity-50"
                >
                  {busy ? d.sqlRunning : d.sqlRun}
                </button>
                <button
                  type="button"
                  onClick={exportCsv}
                  disabled={!rows.length}
                  className="rounded-full border border-mist px-4 py-2.5 font-display text-sm disabled:opacity-40"
                >
                  {d.sqlExport}
                </button>
                <button
                  type="button"
                  onClick={copyJson}
                  disabled={!rows.length}
                  className="rounded-full border border-mist px-4 py-2.5 font-display text-sm disabled:opacity-40"
                >
                  {d.sqlCopy}
                </button>
              </div>
              <p className="text-xs text-ink/45">{d.sqlShortcut}</p>
            </div>
          </form>

          {error ? <p className="mt-4 rounded-xl bg-rose/40 px-4 py-3 text-sm">{error}</p> : null}

          {kind === "ok" && rowCount !== null ? (
            <p className="mt-4 text-sm text-ink/60">
              {d.sqlDone} · {rowCount}
              {ms !== null ? ` · ${ms} ms` : ""}
            </p>
          ) : null}

          {kind === "rows" ? (
            rows.length === 0 ? (
              <p className="mt-4 text-sm text-ink/50">{d.sqlEmpty}</p>
            ) : (
              <div className="mt-4">
                <p className="mb-2 text-xs text-ink/45">
                  {rows.length} {d.sqlRows}
                  {ms !== null ? ` · ${ms} ms` : ""}
                </p>
                <div className="max-h-[28rem] max-w-full overflow-auto rounded-xl border border-mist">
                  <table className="min-w-full text-left text-sm">
                    <thead className="sticky top-0 bg-cream">
                      <tr>
                        <th className="px-2 py-2 font-mono text-[10px] text-ink/40">#</th>
                        {columns.map((col) => (
                          <th key={col} className="whitespace-nowrap px-3 py-2 font-display font-medium">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i} className="border-t border-mist/70 align-top odd:bg-paper even:bg-cream/40">
                          <td className="px-2 py-2 font-mono text-[10px] text-ink/35">{i + 1}</td>
                          {columns.map((col) => {
                            const raw = formatCell(row[col]);
                            const shown = displayCell(row[col]);
                            const status = col === "status" ? raw : "";
                            return (
                              <td key={col} className="max-w-[16rem] px-3 py-2">
                                {status ? (
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                                      status === "pending"
                                        ? "bg-butter/80"
                                        : status === "approved"
                                          ? "bg-pistachio/80"
                                          : "bg-rose/60"
                                    }`}
                                  >
                                    {status}
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setExpanded({ col, value: raw || "—" })}
                                    className="block max-w-full truncate text-left font-mono text-xs text-ink/80"
                                    title={shown}
                                  >
                                    {shown}
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : null}

          {expanded ? (
            <div className="mt-3 rounded-xl bg-cream px-4 py-3">
              <p className="font-mono text-[11px] text-ink/45">{expanded.col}</p>
              <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap break-words font-mono text-xs">
                {expanded.value}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ActivityColumn({
  title,
  empty,
  items,
  onOpen,
}: {
  title: string;
  empty: string;
  items: { id: string; kicker: string; body: string; at?: string }[];
  onOpen: () => void;
}) {
  return (
    <button type="button" onClick={onOpen} className="rounded-2xl bg-cream/70 p-3 text-left hover:bg-cream">
      <p className="font-display text-sm">{title}</p>
      {items.length === 0 ? (
        <p className="mt-2 text-xs text-ink/45">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.slice(0, 4).map((item) => (
            <li key={item.id} className="min-w-0">
              <p className="truncate text-xs font-display">{item.kicker}</p>
              <p className="truncate text-[11px] text-ink/55">{item.body}</p>
            </li>
          ))}
        </ul>
      )}
    </button>
  );
}

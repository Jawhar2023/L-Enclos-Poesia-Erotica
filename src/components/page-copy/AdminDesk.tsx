"use client";

import { useEffect, useState } from "react";
import { CommentAvatar } from "@/components/CommentAvatar";
import { useLang } from "@/context/LangContext";
import type { AdminPoem, Comment, Reaction, Submission } from "@/types";

type PoemRow = AdminPoem & { likes: number; comments: number };

type Session = {
  ok: boolean;
  supabase?: boolean;
  supabaseAdmin?: boolean;
  poems?: PoemRow[];
  submissions?: Submission[];
  comments?: Comment[];
  reactions?: Reaction[];
  stats?: {
    poems: number;
    likes: number;
    comments: number;
    visitors: number;
    pending: number;
  };
};

const emptyForm = {
  titleFr: "",
  titleAr: "",
  authorFr: "",
  authorAr: "",
  translatorFr: "",
  translatorAr: "",
  bodyFr: "",
  bodyAr: "",
};

const field =
  "w-full min-w-0 rounded-xl border border-mist bg-cream px-3 py-3 text-base outline-none focus:border-sky sm:px-4";

export function AdminDesk() {
  const { d, lang } = useLang();
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [poem, setPoem] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translateMsg, setTranslateMsg] = useState("");
  const [tab, setTab] = useState<"poems" | "inbox" | "likes" | "comments">("poems");
  const [inboxFilter, setInboxFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  async function refresh() {
    const res = await fetch("/api/admin/session");
    const data = await res.json();
    setSession(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setSession({ ok: false });
  }

  async function translateToArabic() {
    if (!poem.titleFr.trim() && !poem.authorFr.trim() && !poem.bodyFr.trim()) {
      setTranslateMsg(d.adminTranslateNeedFr);
      return;
    }
    setTranslating(true);
    setTranslateMsg("");
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleFr: poem.titleFr,
          authorFr: poem.authorFr,
          bodyFr: poem.bodyFr,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTranslateMsg(d.adminTranslateErr);
        return;
      }
      setPoem((current) => ({
        ...current,
        titleAr: data.titleAr || current.titleAr,
        authorAr: data.authorAr || current.authorAr,
        bodyAr: data.bodyAr || current.bodyAr,
      }));
    } catch {
      setTranslateMsg(d.adminTranslateErr);
    } finally {
      setTranslating(false);
    }
  }

  function startEdit(row: PoemRow) {
    setEditingId(row.id);
    setPoem({
      titleFr: row.titleFr,
      titleAr: row.titleAr,
      authorFr: row.authorFr,
      authorAr: row.authorAr,
      translatorFr: row.translatorFr || "",
      translatorAr: row.translatorAr || "",
      bodyFr: row.bodyFr,
      bodyAr: row.bodyAr,
    });
    setTab("poems");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setPoem(emptyForm);
    setTranslateMsg("");
  }

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    const url = editingId ? `/api/admin/poems/${editingId}` : "/api/admin/poems";
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(poem),
    });
    cancelEdit();
    refresh();
  }

  async function removePoem(id: string) {
    if (!window.confirm(d.adminConfirmDelete)) return;
    await fetch(`/api/admin/poems/${id}`, { method: "DELETE" });
    if (editingId === id) cancelEdit();
    refresh();
  }

  async function decide(id: string, status: "approved" | "rejected") {
    await fetch(`/api/admin/submissions/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  async function removeComment(id: string) {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    refresh();
  }

  async function removeLike(id: string) {
    await fetch(`/api/admin/reactions/${id}`, { method: "DELETE" });
    refresh();
  }

  if (!session?.ok) {
    return (
      <form onSubmit={login} className="mx-auto w-full max-w-md rounded-[1.4rem] bg-paper p-5 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl sm:text-3xl">{d.adminTitle}</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={d.adminPass}
          className={`mt-6 ${field}`}
        />
        <button type="submit" className="mt-4 w-full rounded-full bg-sky px-5 py-3 font-display sm:w-auto sm:py-2">
          {d.adminEnter}
        </button>
      </form>
    );
  }

  const stats = session.stats || { poems: 0, likes: 0, comments: 0, visitors: 0, pending: 0 };
  const poems = session.poems || [];
  const submissions = session.submissions || [];
  const comments = session.comments || [];
  const reactions = session.reactions || [];
  const inbox =
    inboxFilter === "all" ? submissions : submissions.filter((s) => s.status === inboxFilter);

  const statCards = [
    { id: "poems" as const, label: d.adminStatsPoems, value: stats.poems, tone: "from-pistachio/70 to-paper" },
    { id: "likes" as const, label: d.adminStatsLikes, value: stats.likes, tone: "from-rose/70 to-paper" },
    { id: "comments" as const, label: d.adminStatsComments, value: stats.comments, tone: "from-sky/70 to-paper" },
    { id: "inbox" as const, label: d.adminStatsVisitors, value: stats.visitors, tone: "from-butter/80 to-paper" },
  ];

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">{d.adminTitle}</h1>
        <button onClick={logout} className="w-full rounded-full border border-mist px-4 py-2.5 font-display sm:w-auto">
          {d.adminLogout}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => setTab(card.id)}
            className={`rounded-[1.3rem] bg-gradient-to-br ${card.tone} p-4 text-left sm:p-5 ${
              tab === card.id ? "ring-2 ring-ink/20" : ""
            }`}
          >
            <p className="font-display text-xs uppercase tracking-[0.2em] text-ink/50">{card.label}</p>
            <p className="mt-2 font-display text-4xl">{card.value}</p>
          </button>
        ))}
      </div>
      {stats.pending > 0 ? (
        <button
          type="button"
          onClick={() => setTab("inbox")}
          className="w-full rounded-full bg-rose/60 px-4 py-2 font-display text-sm sm:w-auto"
        >
          {d.adminStatsPending}: {stats.pending}
        </button>
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            ["poems", d.adminLibrary],
            ["inbox", d.adminPending],
            ["likes", d.adminLikes],
            ["comments", d.adminComments],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`shrink-0 rounded-full px-4 py-2 font-display text-sm ${
              tab === id ? "bg-ink text-paper" : "bg-paper text-ink/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "poems" ? (
        <>
          <section className="rounded-[1.2rem] bg-paper p-4 sm:rounded-[1.5rem] sm:p-6">
            <h2 className="font-display text-xl sm:text-2xl">
              {editingId ? d.adminEdit : d.adminAdd}
            </h2>
            <form onSubmit={publish} className="mt-4 grid gap-3">
              <input value={poem.titleFr} onChange={(e) => setPoem({ ...poem, titleFr: e.target.value })} placeholder={d.adminTitleFr} className={field} />
              <input value={poem.authorFr} onChange={(e) => setPoem({ ...poem, authorFr: e.target.value })} placeholder={d.adminAuthorFr} className={field} />
              <textarea value={poem.bodyFr} onChange={(e) => setPoem({ ...poem, bodyFr: e.target.value })} placeholder={d.adminBodyFr} rows={5} className={`${field} min-h-32 resize-y`} />
              <button type="button" onClick={translateToArabic} disabled={translating} className="w-full rounded-full bg-ink px-5 py-3 font-display text-paper disabled:opacity-60 sm:w-auto sm:py-2">
                {translating ? d.adminTranslating : d.adminTranslate}
              </button>
              {translateMsg ? <p className="text-sm text-ink/60">{translateMsg}</p> : null}
              <input dir="rtl" value={poem.titleAr} onChange={(e) => setPoem({ ...poem, titleAr: e.target.value })} placeholder={d.adminTitleAr} className={`${field} font-poem-ar`} />
              <input dir="rtl" value={poem.authorAr} onChange={(e) => setPoem({ ...poem, authorAr: e.target.value })} placeholder={d.adminAuthorAr} className={`${field} font-poem-ar`} />
              <textarea dir="rtl" value={poem.bodyAr} onChange={(e) => setPoem({ ...poem, bodyAr: e.target.value })} placeholder={d.adminBodyAr} rows={5} className={`${field} min-h-32 resize-y font-poem-ar`} />
              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="submit" className="w-full rounded-full bg-pistachio px-5 py-3 font-display sm:w-auto sm:py-2">
                  {editingId ? d.adminSave : d.adminAdd}
                </button>
                {editingId ? (
                  <button type="button" onClick={cancelEdit} className="w-full rounded-full border border-mist px-5 py-3 font-display sm:w-auto sm:py-2">
                    {d.adminCancel}
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="rounded-[1.2rem] bg-paper p-4 sm:p-6">
            <h2 className="font-display text-xl sm:text-2xl">{d.adminLibrary}</h2>
            <ul className="mt-4 space-y-3">
              {poems.length === 0 ? (
                <li className="text-ink/50">{d.none}</li>
              ) : (
                poems.map((row) => {
                  const title = lang === "ar" && row.titleAr ? row.titleAr : row.titleFr;
                  return (
                    <li key={row.id} className="rounded-xl bg-cream p-3 sm:p-4">
                      <p className="break-words font-display text-lg">{title}</p>
                      <p className="text-sm text-ink/55">{row.authorFr || row.authorAr}</p>
                      <p className="mt-2 text-sm text-ink/60">
                        ♥ {row.likes} · {d.adminComments} {row.comments}
                      </p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <button onClick={() => startEdit(row)} className="w-full rounded-full bg-sky/70 px-4 py-2.5 sm:w-auto sm:py-1">
                          {d.adminEdit}
                        </button>
                        <button onClick={() => removePoem(row.id)} className="w-full rounded-full bg-rose/70 px-4 py-2.5 sm:w-auto sm:py-1">
                          {d.delete}
                        </button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </section>
        </>
      ) : null}

      {tab === "inbox" ? (
        <section className="rounded-[1.2rem] bg-paper p-4 sm:p-6">
          <h2 className="font-display text-xl sm:text-2xl">{d.adminPending}</h2>
          <p className="mt-1 text-sm text-ink/55">{d.adminInboxHint}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ["pending", d.adminStatsPending],
                ["approved", d.approve],
                ["rejected", d.reject],
                ["all", d.adminInboxAll],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setInboxFilter(id)}
                className={`rounded-full px-3 py-1.5 text-sm font-display ${
                  inboxFilter === id ? "bg-ink text-paper" : "bg-cream text-ink/65"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ul className="mt-4 space-y-4">
            {inbox.length === 0 ? (
              <li className="text-ink/50">{d.none}</li>
            ) : (
              inbox.map((s) => (
                <li key={s.id} className="min-w-0 rounded-xl bg-cream p-3 sm:p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words font-display text-lg">{s.titleFr || s.titleAr}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        s.status === "pending"
                          ? "bg-butter/80"
                          : s.status === "approved"
                            ? "bg-pistachio/80"
                            : "bg-rose/60"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink/55">{s.author}</p>
                  <pre className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap break-words text-sm">
                    {s.bodyFr || s.bodyAr}
                  </pre>
                  {s.status === "pending" ? (
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <button onClick={() => decide(s.id, "approved")} className="w-full rounded-full bg-pistachio px-4 py-2.5 sm:w-auto sm:py-1">
                        {d.approve}
                      </button>
                      <button onClick={() => decide(s.id, "rejected")} className="w-full rounded-full bg-rose/70 px-4 py-2.5 sm:w-auto sm:py-1">
                        {d.reject}
                      </button>
                    </div>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </section>
      ) : null}

      {tab === "likes" ? (
        <section className="rounded-[1.2rem] bg-paper p-4 sm:p-6">
          <h2 className="font-display text-xl sm:text-2xl">{d.adminLikes}</h2>
          <p className="mt-1 text-sm text-ink/55">{d.adminLikesHint}</p>
          <ul className="mt-4 space-y-3">
            {reactions.length === 0 ? (
              <li className="text-ink/50">{d.none}</li>
            ) : (
              reactions.map((r) => {
                const poem = poems.find((p) => p.id === r.poemId);
                const title = lang === "ar" && poem?.titleAr ? poem.titleAr : poem?.titleFr || r.poemId;
                return (
                  <li key={r.id} className="flex min-w-0 flex-col gap-3 rounded-xl bg-cream p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                    <div className="min-w-0">
                      <p className="font-display">{title}</p>
                      <p className="truncate font-mono text-xs text-ink/50">{r.visitorId}</p>
                    </div>
                    <button
                      onClick={() => removeLike(r.id)}
                      className="w-full rounded-full border border-mist px-4 py-2 text-sm sm:w-auto sm:border-0 sm:underline sm:text-ink/50"
                    >
                      {d.delete}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </section>
      ) : null}

      {tab === "comments" ? (
        <section className="rounded-[1.2rem] bg-paper p-4 sm:p-6">
          <h2 className="font-display text-xl sm:text-2xl">{d.adminComments}</h2>
          <ul className="mt-4 space-y-3">
            {comments.length === 0 ? (
              <li className="text-ink/50">{d.none}</li>
            ) : (
              comments.map((c) => (
                <li key={c.id} className="flex min-w-0 flex-col gap-3 rounded-xl bg-cream p-3 sm:flex-row sm:items-start sm:justify-between sm:p-4">
                  <div className="flex min-w-0 gap-3">
                    <CommentAvatar id={c.avatar || c.id} size="sm" />
                    <div className="min-w-0">
                      <p className="font-display">{c.author.trim() || d.commentAnonymous}</p>
                      <p className="text-[11px] text-ink/45">
                        {poems.find((p) => p.id === c.poemId)?.titleFr || c.poemId}
                      </p>
                      <p className="break-words text-sm text-ink/70">{c.body}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeComment(c.id)}
                    className="w-full rounded-full border border-mist px-4 py-2 text-sm sm:w-auto sm:border-0 sm:underline sm:text-ink/50"
                  >
                    {d.delete}
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

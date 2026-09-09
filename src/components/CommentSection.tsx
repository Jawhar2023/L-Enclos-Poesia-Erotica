"use client";

import { useEffect, useState } from "react";
import { CommentAvatar } from "@/components/CommentAvatar";
import { useLang } from "@/context/LangContext";
import type { Comment } from "@/types";

const EMPTY_COMMENTS: Comment[] = [];

export function CommentSection({
  poemId,
  initialComments = EMPTY_COMMENTS,
}: {
  poemId: string;
  initialComments?: Comment[];
}) {
  const { d } = useLang();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setComments(initialComments);
    const ac = new AbortController();
    fetch(`/api/comments?poemId=${encodeURIComponent(poemId)}`, {
      cache: "no-store",
      signal: ac.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.comments)) setComments(data.comments);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
      });
    return () => ac.abort();
    // initialComments is tied to the poem page payload for this id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poemId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ poemId, author, body }),
      });
      const data = await res.json();
      if (!res.ok || !data.comment) {
        setError(d.commentFailed);
        return;
      }
      setComments((prev) => [data.comment as Comment, ...prev.filter((c) => c.id !== data.comment.id)]);
      setBody("");
    } catch {
      setError(d.commentFailed);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mt-12 rounded-[1.5rem] border border-mist bg-paper p-6">
      <h3 className="font-display text-2xl">{d.comments}</h3>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder={d.commentName}
          className="rounded-xl border border-mist bg-cream px-4 py-3 outline-none focus:border-sky"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={d.commentBody}
          rows={3}
          className="rounded-xl border border-mist bg-cream px-4 py-3 outline-none focus:border-sky"
        />
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button
          type="submit"
          disabled={sending}
          className="justify-self-start rounded-full bg-sky px-5 py-2 font-display disabled:opacity-60"
        >
          {sending ? "…" : d.commentSend}
        </button>
      </form>
      <ul className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <li className="text-sm text-ink/55">{d.commentEmpty}</li>
        ) : (
          comments.map((c) => (
            <li key={c.id} className="flex gap-3 rounded-xl bg-cream/80 px-4 py-3">
              <CommentAvatar id={c.avatar || c.id} />
              <div className="min-w-0">
                <p className="font-display text-lg">{c.author.trim() || d.commentAnonymous}</p>
                <p className="mt-1 whitespace-pre-wrap text-ink/80">{c.body}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

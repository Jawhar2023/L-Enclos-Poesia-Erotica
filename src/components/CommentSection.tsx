"use client";

import { useEffect, useState } from "react";
import { CommentAvatar } from "@/components/CommentAvatar";
import { useLang } from "@/context/LangContext";
import type { Comment } from "@/types";

export function CommentSection({ poemId }: { poemId: string }) {
  const { d } = useLang();
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");

  function load() {
    fetch(`/api/comments?poemId=${encodeURIComponent(poemId)}`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => undefined);
  }

  useEffect(load, [poemId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ poemId, author, body }),
    });
    setBody("");
    load();
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
        <button
          type="submit"
          className="justify-self-start rounded-full bg-sky px-5 py-2 font-display"
        >
          {d.commentSend}
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

"use client";

import { useState } from "react";
import { Ornament } from "@/components/Ornament";
import { useLang } from "@/context/LangContext";

export function SubmitForm() {
  const { d } = useLang();
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({
    author: "",
    title: "",
    body: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setOk(true);
      setForm({ author: "", title: "", body: "" });
    }
  }

  const field = (key: keyof typeof form, placeholder: string, area = false) =>
    area ? (
      <textarea
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        rows={8}
        className="rounded-xl border-2 border-black/25 bg-paper px-5 py-3.5 text-lg font-medium text-black placeholder:text-black/50 outline-none focus:border-black"
      />
    ) : (
      <input
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="rounded-xl border-2 border-black/25 bg-paper px-5 py-3.5 text-lg font-medium text-black placeholder:text-black/50 outline-none focus:border-black"
      />
    );

  return (
    <div>
      <h1 className="font-display text-4xl font-bold sm:text-5xl text-black">{d.submitTitle}</h1>
      <Ornament className="my-5 justify-start" />
      <p className="text-xl font-medium leading-8 text-black">{d.submitLead}</p>
      <form onSubmit={submit} className="mt-8 grid gap-4">
        {field("author", d.submitAuthor)}
        {field("title", d.submitPoemTitle || d.submitTitleFr)}
        {field("body", d.submitPoemBody || d.submitBodyFr, true)}
        <button type="submit" className="justify-self-start rounded-full border-2 border-black bg-rose px-8 py-3 font-display text-lg font-bold text-black hover:bg-rose/85 transition">
          {d.submitSend}
        </button>
      </form>
      {ok ? <p className="mt-4 rounded-xl border-2 border-black/20 bg-pistachio px-5 py-4 font-bold text-black text-lg">{d.submitOk}</p> : null}
    </div>
  );
}

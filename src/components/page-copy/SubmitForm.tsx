"use client";

import { useState } from "react";
import { Ornament } from "@/components/Ornament";
import { useLang } from "@/context/LangContext";

export function SubmitForm() {
  const { d } = useLang();
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({
    author: "",
    titleFr: "",
    titleAr: "",
    bodyFr: "",
    bodyAr: "",
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
      setForm({ author: "", titleFr: "", titleAr: "", bodyFr: "", bodyAr: "" });
    }
  }

  const field = (key: keyof typeof form, placeholder: string, area = false) =>
    area ? (
      <textarea
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        rows={7}
        className="rounded-xl border border-mist bg-paper px-4 py-3 outline-none focus:border-sky"
      />
    ) : (
      <input
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="rounded-xl border border-mist bg-paper px-4 py-3 outline-none focus:border-sky"
      />
    );

  return (
    <div>
      <h1 className="font-display text-4xl">{d.submitTitle}</h1>
      <Ornament className="my-5 justify-start" />
      <p className="text-ink/70">{d.submitLead}</p>
      <form onSubmit={submit} className="mt-8 grid gap-3">
        {field("author", d.submitAuthor)}
        {field("titleFr", d.submitTitleFr)}
        {field("titleAr", d.submitTitleAr)}
        {field("bodyFr", d.submitBodyFr, true)}
        {field("bodyAr", d.submitBodyAr, true)}
        <button type="submit" className="justify-self-start rounded-full bg-rose/80 px-6 py-2 font-display">
          {d.submitSend}
        </button>
      </form>
      {ok ? <p className="mt-4 rounded-xl bg-pistachio/50 px-4 py-3">{d.submitOk}</p> : null}
    </div>
  );
}

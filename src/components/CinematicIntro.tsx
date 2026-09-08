"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "enclos-cinematic-v2";
const NAME = "L'Enclos Poesia Erotica";

type Phase = "boot" | "play" | "open" | "gone";

function Pen() {
  return (
    <span className="intro-pen" aria-hidden>
      <svg viewBox="0 0 52 52">
        <path d="M16 36c9-11 18-22 31-31-5 11-13 20-22 27l-9 4Z" fill="#1a1714" />
        <path d="M18 34c4-5 10-11 16-16" stroke="#d4b56a" strokeWidth="1.3" fill="none" />
        <path d="M14 38 8 48" stroke="#3d3a38" strokeWidth="2" strokeLinecap="round" />
        <circle cx="8.5" cy="48" r="2" fill="#f6e7a3" />
      </svg>
    </span>
  );
}

function Title({ count, shining }: { count: number; shining: boolean }) {
  const written = NAME.slice(0, count);
  const writing = count < NAME.length;
  return (
    <p className={`intro-name ${shining ? "is-shining" : ""}`}>
      {written.split("").map((ch, i) => (
        <span key={i} className="intro-ch">
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
      {writing ? <Pen /> : null}
    </p>
  );
}

export function CinematicIntro() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [shining, setShining] = useState(false);
  const closed = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const motes = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        top: `${(i * 29) % 100}%`,
        size: 1.5 + (i % 4),
        delay: `${(i % 12) * 0.28}s`,
        duration: `${3.2 + (i % 5) * 0.45}s`,
        tone: i % 3 === 0 ? "#f6e7a3" : i % 3 === 1 ? "#f3c6d4" : "#fffaf1",
      })),
    [],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const force = params.get("intro") === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!force && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setPhase("gone");
      return;
    }

    setPhase("play");
    document.body.style.overflow = "hidden";

    if (reduced) {
      setReady(true);
      setCount(NAME.length);
      setShining(true);
      timers.current = [
        window.setTimeout(() => setPhase("open"), 700),
        window.setTimeout(() => finish(), 1400),
      ];
    } else {
      const letterMs = 200;
      const spaceMs = 420;
      const startMs = 1100;
      const shineMs = 1600;
      const openMs = 1400;
      let writeMs = 80;
      for (let k = 1; k < NAME.length; k += 1) {
        writeMs += NAME[k] === " " ? spaceMs : letterMs;
      }
      const openAt = startMs + writeMs + shineMs;
      const goneAt = openAt + openMs;

      let i = 0;
      const arm = window.setTimeout(() => setReady(true), 900);
      const startWrite = window.setTimeout(() => {
        const step = () => {
          i += 1;
          setCount(i);
          if (i >= NAME.length) {
            setShining(true);
            return;
          }
          const wait = NAME[i] === " " ? spaceMs : letterMs;
          timers.current.push(window.setTimeout(step, wait));
        };
        timers.current.push(window.setTimeout(step, 80));
      }, startMs);

      timers.current = [
        arm,
        startWrite,
        window.setTimeout(() => setPhase("open"), openAt),
        window.setTimeout(() => finish(), goneAt),
      ];
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    if (closed.current) return;
    closed.current = true;
    timers.current.forEach((id) => window.clearTimeout(id));
    sessionStorage.setItem(STORAGE_KEY, "1");
    document.body.style.overflow = "";
    setPhase("gone");
  }

  function skip() {
    if (closed.current) return;
    timers.current.forEach((id) => window.clearTimeout(id));
    setReady(true);
    setCount(NAME.length);
    setShining(true);
    setPhase("open");
    timers.current = [window.setTimeout(() => finish(), 1200)];
  }

  if (phase === "boot" || phase === "gone") return null;

  const leaf = <Title count={count} shining={shining} />;

  return (
    <div
      className={`intro-root ${phase === "open" ? "is-open" : ""} ${shining ? "is-shining" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="L'Enclos Poesia Erotica"
      onClick={skip}
    >
      <div className="intro-void" />
      <div className="intro-bloom" />
      <div className="intro-drop" />
      <div className="intro-grain" />
      {motes.map((mote) => (
        <span
          key={mote.id}
          className="intro-mote"
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            background: mote.tone,
            animationDelay: mote.delay,
            animationDuration: mote.duration,
          }}
        />
      ))}

      <div className="intro-leaf intro-leaf-l">
        <div className="intro-leaf-copy">{ready ? leaf : null}</div>
      </div>
      <div className="intro-leaf intro-leaf-r">
        <div className="intro-leaf-copy">{ready ? leaf : null}</div>
      </div>

      <div className="intro-cut" />
      <div className="intro-flash" />
      <div className="intro-bar intro-bar-t" />
      <div className="intro-bar intro-bar-b" />
    </div>
  );
}

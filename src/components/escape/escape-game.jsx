"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { OS, SHORTCUTS } from "./shortcuts";
import { comboFromEvent, isTypingTarget, matchCombo, prettyCombo } from "./key-utils";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

const INITIAL_LINES = [
  'function greet(name) {',
  '  const msg = "Hello " + name;',
  '  console.log(msg);',
  '}',
  '',
  'const user = "World";',
  "greet(user);",
  "",
  "// Try moving and duplicating lines",
  "// Then use multi-cursor on 'const'",
];

function swap(arr, i, j) {
  const next = arr.slice();
  const tmp = next[i];
  next[i] = next[j];
  next[j] = tmp;
  return next;
}

function insertAt(arr, index, value) {
  const next = arr.slice();
  next.splice(index, 0, value);
  return next;
}

export default function EscapeGame() {
  const [os, setOs] = useState(null); // "mac" | "win"
  const [mode, setMode] = useState(null); // "casual" | "hardcore"
  const [startedAt, setStartedAt] = useState(null);
  const [now, setNow] = useState(Date.now());

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | ok | bad | done
  const [lastPressed, setLastPressed] = useState(null);

  const [attempts, setAttempts] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(100);

  // ✅ Fake editor state
  const [lines, setLines] = useState(INITIAL_LINES);
  const [activeLine, setActiveLine] = useState(1); // 0-based
  const [cursors, setCursors] = useState([1]); // line indexes
  const [selectedWord, setSelectedWord] = useState("const");
  const [matchCursor, setMatchCursor] = useState(0);

  // ✅ Go to line flow (2-step)
  const [gotoOpen, setGotoOpen] = useState(false);
  const [gotoValue, setGotoValue] = useState("");
  const [pendingStep2, setPendingStep2] = useState(null); // { expectedLine: number } | null

  const [notice, setNotice] = useState(null); // { type: "ok" | "bad", text: string } | null
const [shake, setShake] = useState(false);

  const flashTimerRef = useRef(null);
  const stageRef = useRef(null);

  const current = SHORTCUTS[index];
  const total = SHORTCUTS.length;

  const elapsedSec = useMemo(() => {
    if (!startedAt) return 0;
    return Math.floor((now - startedAt) / 1000);
  }, [now, startedAt]);

  // timer tick
  useEffect(() => {
    if (!startedAt) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [startedAt]);

  // auto-focus stage when game starts / progresses
  useEffect(() => {
    if (!os || !startedAt) return;
    stageRef.current?.focus();
  }, [os, startedAt, index, gotoOpen]);

  function resetFlash() {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = null;
  }

  function flash(nextStatus) {
    resetFlash();
    setStatus(nextStatus);
    flashTimerRef.current = setTimeout(() => {
      setStatus("idle");
    }, 650);
  }
  function showNotice(type, text) {
  setNotice({ type, text });
  setShake(type === "bad");

  window.clearTimeout(flashTimerRef.current);
  flashTimerRef.current = window.setTimeout(() => {
    setNotice(null);
    setShake(false);
  }, 900);
}


  function resetEditor() {
    setLines(INITIAL_LINES);
    setActiveLine(1);
    setCursors([1]);
    setSelectedWord("const");
    setMatchCursor(0);
    setGotoOpen(false);
    setGotoValue("");
    setPendingStep2(null);
  }

  function startGame(selectedOs, selectedMode) {
    setOs(selectedOs);
    setMode(selectedMode);
    setStartedAt(Date.now());
    setNow(Date.now());

    setIndex(0);
    setStatus("idle");
    setLastPressed(null);

    setAttempts(0);
    setWrongCount(0);
    setStreak(0);
    setBestStreak(0);

    setShowHint(false);
    setHintsUsed(0);
    setScore(100);

    resetEditor();
  }

  function useHint() {
    if (showHint) return;
    setShowHint(true);
    setHintsUsed((h) => h + 1);
    setScore((s) => Math.max(0, s - 5));
  }

  function finish() {
    setStatus("done");
    resetFlash();
  }

  function expectedComboForOs(puzzle) {
    return os === OS.MAC ? puzzle.mac : puzzle.win;
  }

  function advanceLock() {
    setShowHint(false);
    setWrongCount(0);
    setIndex((i) => {
      const ni = i + 1;
      if (ni >= total) {
        finish();
        return i;
      }
      return ni;
    });
  }

  // ======= DEMO ACTIONS (fake editor effects) =======
  function demoMoveLine(dir) {
    setLines((prev) => {
      const i = activeLine;
      if (dir === "up" && i > 0) {
        setActiveLine(i - 1);
        setCursors((cs) => cs.map((x) => (x === i ? i - 1 : x === i - 1 ? i : x)));
        return swap(prev, i, i - 1);
      }
      if (dir === "down" && i < prev.length - 1) {
        setActiveLine(i + 1);
        setCursors((cs) => cs.map((x) => (x === i ? i + 1 : x === i + 1 ? i : x)));
        return swap(prev, i, i + 1);
      }
      return prev;
    });
  }

  function demoCopyLine(dir) {
    setLines((prev) => {
      const i = activeLine;
      if (dir === "up") {
        const next = insertAt(prev, i, prev[i]);
        setActiveLine(i); // stays on the original line
        setCursors((cs) => cs.map((x) => (x >= i ? x + 1 : x)));
        return next;
      }
      if (dir === "down") {
        const next = insertAt(prev, i + 1, prev[i]);
        setActiveLine(i + 1); // VS Code often lands on the duplicated line
        setCursors((cs) => cs.map((x) => (x > i ? x + 1 : x)));
        return next;
      }
      return prev;
    });
  }

  function demoCursorAdd(dir) {
    setCursors((prev) => {
      const base = activeLine;
      const target = dir === "down" ? base + 1 : base - 1;
      if (target < 0 || target >= lines.length) return prev;
      if (prev.includes(target)) return prev;
      const next = prev.concat(target).sort((a, b) => a - b);
      return next;
    });
  }

  function demoNextMatch() {
    // Simple: find occurrences of selectedWord in file, advance to next.
    const word = selectedWord || "const";
    const matches = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(word)) matches.push(i);
    }
    if (!matches.length) return;

    const nextIndex = (matchCursor + 1) % matches.length;
    const lineIdx = matches[nextIndex];

    setMatchCursor(nextIndex);
    setActiveLine(lineIdx);
    setCursors((prev) => {
      if (prev.includes(lineIdx)) return prev;
      return prev.concat(lineIdx).sort((a, b) => a - b);
    });
  }

  function demoOpenGoToLine(expectedLine) {
    setGotoOpen(true);
    setGotoValue("");
    setPendingStep2({ expectedLine });
  }

  function submitGoToLine() {
    if (!pendingStep2) return false;
    const n = parseInt(gotoValue || "", 10);
    if (!Number.isFinite(n)) return false;

    // lines shown to user are 1-based
    const target = Math.max(1, Math.min(lines.length, n));
    setActiveLine(target - 1);
    setCursors([target - 1]);

    const ok = target === pendingStep2.expectedLine;
    setGotoOpen(false);
    setGotoValue("");
    setPendingStep2(null);
    return ok;
  }

  function runDemoForPuzzle(puzzle) {
    const demo = puzzle?.demo;
    if (!demo) return;

    if (demo.type === "MOVE_LINE") demoMoveLine(demo.dir);
    if (demo.type === "COPY_LINE") demoCopyLine(demo.dir);
    if (demo.type === "CURSOR_ADD") demoCursorAdd(demo.dir);
    if (demo.type === "NEXT_MATCH") demoNextMatch();
    if (demo.type === "OPEN_GOTO_LINE") {
      const exp = puzzle?.step2?.expectedLine ?? 8;
      demoOpenGoToLine(exp);
    }
  }

  // ======= KEY HANDLING =======

  function handleGoToLineTyping(e) {
    // While "Go to Line" panel is open, we accept typing.
    // Don't block regular numbers/backspace/enter.
    const k = e.key;

    if (k === "Escape") {
      e.preventDefault();
      setGotoOpen(false);
      setGotoValue("");
      setPendingStep2(null);
      return;
    }

    if (k === "Backspace") {
      e.preventDefault();
      setGotoValue((v) => v.slice(0, -1));
      return;
    }

    if (k === "Enter") {
      e.preventDefault();
      const ok = submitGoToLine();
      if (ok) {
        flash("ok");
        setTimeout(() => advanceLock(), 350);
      } else {
        flash("bad");
        showNotice("bad", "Try again.");
        setWrongCount((w) => w + 1);
        setStreak(0);
        setScore((s) => Math.max(0, s - (mode === "hardcore" ? 2 : 1)));
      }
      return;
    }

    // Only digits
    if (/^\d$/.test(k)) {
      e.preventDefault();
      setGotoValue((v) => (v.length >= 4 ? v : v + k));
    }
  }

  function handleGameKeyDown(e) {
    if (!os || !startedAt) return;
    if (status === "done") return;

    // If go-to-line is open, we want typing.
    if (gotoOpen) {
      handleGoToLineTyping(e);
      return;
    }

    if (isTypingTarget(e.target)) return;

    // prevent browser stealing key combos (especially Option on Mac)
    if (e.ctrlKey || e.metaKey || e.altKey) e.preventDefault();

    const actual = comboFromEvent(e);
    setLastPressed(actual);

    const expected = expectedComboForOs(current);
    setAttempts((a) => a + 1);

    if (matchCombo(actual, expected)) {
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });

      flash("ok");

      // run the visual demo
      runDemoForPuzzle(current);

      // if this puzzle requires step2 (Go to Line typing), don't advance yet
      if (current?.step2) return;

      setTimeout(() => advanceLock(), 350);
    } else {
      setStreak(0);
      setWrongCount((w) => w + 1);
      setScore((s) => Math.max(0, s - (mode === "hardcore" ? 2 : 1)));
      flash("bad");
    }
  }

  // Auto-show hint after 2 wrong attempts on the same lock
  useEffect(() => {
    if (!os) return;
    if (mode !== "hardcore") return;
    if (wrongCount >= 2) setShowHint(true);
  }, [wrongCount, mode, os]);

  // Keyboard controls on the start screen
  useEffect(() => {
    if (os) return;

    const onKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      const typing =
        tag === "input" || tag === "textarea" || e.target?.isContentEditable;
      if (typing) return;

      const k = (e.key || "").toLowerCase();

      if (k === "1") setMode("casual");
      if (k === "2") setMode("hardcore");

      if (k === "m" && mode) startGame(OS.MAC, mode);
      if (k === "w" && mode) startGame(OS.WIN, mode);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [os, mode]);

  const progress = total ? (index / total) * 100 : 0;

  // ======= UI: Fake VS Code =======

  function Editor() {
    return (
      <div className="relative overflow-hidden rounded-2xl border bg-background">
        {/* top tabs bar */}
        <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
          <div className="flex items-center gap-2 rounded-md bg-background px-3 py-1.5 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-primary/60" />
            hello.js
          </div>
          <div className="text-xs text-muted-foreground">Escape Mode</div>
        </div>

        {/* go to line overlay */}
        {gotoOpen ? (
          <div className="absolute left-1/2 top-3 z-10 w-[320px] -translate-x-1/2 rounded-xl border bg-background/95 p-3 shadow-lg">
            <div className="text-xs font-semibold">Go to Line</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Type a line number and press Enter
              {pendingStep2?.expectedLine ? ` (target: ${pendingStep2.expectedLine})` : ""}.
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
              <span className="font-mono text-sm tabular-nums">
                {gotoValue || "—"}
              </span>
              <span className="text-[11px] text-muted-foreground">Enter</span>
            </div>
          </div>
        ) : null}

        {/* editor grid */}
        <div className="grid grid-cols-[52px_1fr]">
          {/* gutter */}
          <div className="border-r bg-muted/20 px-2 py-3 font-mono text-[11px] text-muted-foreground">
            {lines.map((_, i) => {
              const ln = i + 1;
              const isActive = i === activeLine;
              return (
                <div
                  key={i}
                  className={[
                    "h-5 leading-5 tabular-nums",
                    isActive ? "text-foreground font-semibold" : "",
                  ].join(" ")}
                >
                  {ln}
                </div>
              );
            })}
          </div>

          {/* code */}
          <div className="px-3 py-3 font-mono text-[12px]">
            {lines.map((line, i) => {
              const isActive = i === activeLine;
              const hasCursor = cursors.includes(i);
              const highlightWord =
                selectedWord && line.includes(selectedWord) ? selectedWord : null;

              // basic highlight: wrap selectedWord
              const parts = highlightWord
                ? line.split(highlightWord)
                : [line];

              return (
                <div
                  key={i}
                  className={[
                    "relative h-5 leading-5 rounded-sm px-2",
                    isActive ? "bg-primary/10" : "",
                  ].join(" ")}
                >
                  {/* cursor indicator */}
                  {hasCursor ? (
                    <span className="absolute left-1 top-[3px] h-4 w-[2px] bg-primary" />
                  ) : null}

                  {/* code text */}
                  <span className="whitespace-pre">
                    {highlightWord ? (
                      <>
                        {parts[0]}
                        <span className="rounded bg-primary/15 px-1">
                          {highlightWord}
                        </span>
                        {parts.slice(1).join(highlightWord)}
                      </>
                    ) : (
                      line || " "
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* bottom status bar */}
        <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
          <span>
            {os === OS.MAC ? "Mac" : "Windows"} •{" "}
            {mode === "hardcore" ? "Hardcore" : "Casual"} •{" "}
            {cursors.length} cursor{cursors.length === 1 ? "" : "s"}
          </span>
          <span className="font-mono">
            Ln {activeLine + 1}, Col 1
          </span>
        </div>
      </div>
    );
  }

  // ======= START SCREEN =======
if (!os) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div
        className="rounded-3xl border bg-card p-8 shadow-sm"
        role="region"
        aria-labelledby="escape-title"
      >
        <div className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
          Interactive Experience
        </div>

        <h1
          id="escape-title"
          className="mt-2 text-3xl font-semibold tracking-tight"
        >
          Escape the Editor
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Test real VS Code keyboard shortcuts inside a simulated editor.
          Select difficulty and operating system to begin.
        </p>

        {/* ========= Difficulty ========= */}
        <div
          className="mt-8"
          role="radiogroup"
          aria-label="Select difficulty"
        >
          <div className="text-sm font-semibold">Difficulty</div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              role="radio"
              aria-checked={mode === "casual"}
              onClick={() => setMode("casual")}
              className={[
                "rounded-2xl border px-5 py-5 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                mode === "casual"
                  ? "border-primary bg-primary/10"
                  : "hover:bg-muted",
              ].join(" ")}
            >
              <div className="text-lg font-semibold">Casual</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Hints available • lower penalties
              </div>
            </button>

            <button
              role="radio"
              aria-checked={mode === "hardcore"}
              onClick={() => setMode("hardcore")}
              className={[
                "rounded-2xl border px-5 py-5 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                mode === "hardcore"
                  ? "border-primary bg-primary/10"
                  : "hover:bg-muted",
              ].join(" ")}
            >
              <div className="text-lg font-semibold">Hardcore</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Auto hint after 2 fails • higher penalties
              </div>
            </button>
          </div>
        </div>

        {/* ========= OS ========= */}
        <div
          className="mt-10"
          role="radiogroup"
          aria-label="Select operating system"
        >
          <div className="text-sm font-semibold">Operating System</div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              role="radio"
              aria-checked={false}
              onClick={() => mode && startGame(OS.MAC, mode)}
              disabled={!mode}
              className={[
                "rounded-2xl border px-5 py-5 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                mode
                  ? "hover:bg-muted"
                  : "opacity-40 cursor-not-allowed",
              ].join(" ")}
            >
              <div className="text-lg font-semibold">Mac</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Uses ⌘ Command and ⌥ Option
              </div>
            </button>

            <button
              role="radio"
              aria-checked={false}
              onClick={() => mode && startGame(OS.WIN, mode)}
              disabled={!mode}
              className={[
                "rounded-2xl border px-5 py-5 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                mode
                  ? "hover:bg-muted"
                  : "opacity-40 cursor-not-allowed",
              ].join(" ")}
            >
              <div className="text-lg font-semibold">Windows</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Uses Ctrl and Alt
              </div>
            </button>
          </div>
        </div>

        {/* ========= Accessible Help ========= */}
        <div
          className="mt-10 rounded-2xl border bg-muted/40 p-4 text-sm"
          aria-live="polite"
        >
          <div className="font-semibold">Keyboard users</div>
          <p className="mt-2 text-muted-foreground">
            Press <span className="font-mono">1</span> for Casual or{" "}
            <span className="font-mono">2</span> for Hardcore.
            <br />
            Then press <span className="font-mono">M</span> for Mac or{" "}
            <span className="font-mono">W</span> for Windows.
          </p>
        </div>
      </div>
    </div>
  );
}

  // ======= WIN SCREEN =======
  if (status === "done") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
            Escaped ✅
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            You escaped the editor.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Time: <span className="font-semibold text-foreground">{elapsedSec}s</span>{" "}
            • Attempts: <span className="font-semibold text-foreground">{attempts}</span>{" "}
            • Best streak: <span className="font-semibold text-foreground">{bestStreak}</span>{" "}
            • Score: <span className="font-semibold text-foreground">{score}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setOs(null)}
              className="rounded-2xl border px-4 py-3 hover:bg-muted transition"
            >
              Change OS
            </button>

            <button
              onClick={() => startGame(os, mode)}
              className="rounded-2xl bg-foreground px-4 py-3 text-background hover:opacity-90 transition"
            >
              Play again
            </button>
          </div>

          <div className="mt-6 rounded-2xl border bg-muted/40 p-4">
            <div className="text-sm font-semibold">Portfolio angle</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Keyboard event handling • OS abstraction • step-based puzzles • UI feedback loops.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const expected = expectedComboForOs(current);

  // ======= GAME SCREEN =======
  return (
    <div
      ref={stageRef}
      tabIndex={0}
      onKeyDown={handleGameKeyDown}
      onMouseDown={() => stageRef.current?.focus()}
      className="mx-auto max-w-5xl px-4 py-7 outline-none"
    >
      <div className="rounded-3xl border bg-card shadow-sm overflow-hidden">
        {/* top bar */}
        <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
          <div>
            <div className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
              Escape the Editor • {os === OS.MAC ? "Mac" : "Windows"} • {mode?.toUpperCase()}
            </div>
            <div className="mt-1 text-lg font-semibold">
              Lock {index + 1} / {total}: {current.title}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-muted-foreground">Time</div>
            <div className="text-lg font-semibold tabular-nums">{elapsedSec}s</div>
          </div>
        </div>

        {/* progress */}
        <div className="h-2 bg-muted">
          <div
            className="h-2 bg-foreground transition-all"
            style={{ width: `${clamp(progress, 0, 100)}%` }}
          />
        </div>

        {/* main */}
        <div className="grid pb-7 gap-0 lg:grid-cols-[1.6fr_0.8fr]">
          {/* fake editor + prompt */}
          <div className="px-3">
            <div
              className={[
                " px-3",
                status === "ok" ? "border-foreground" : "",
                status === "bad" ? "border-destructive" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Editor Lock</div>
                <div
                    aria-live="polite"
                    className={[
                        " rounded-xl border px-4 py-3 text-sm transition",
                        notice?.type === "ok"
                        ? "border-foreground/40 bg-foreground/5 text-foreground"
                        : notice?.type === "bad"
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-transparent bg-transparent text-transparent",
                    ].join(" ")}
                    >
                    {notice?.text || "."}
                    </div>
                <div
                    className={[
                        " px-4 text-sm transition",
                        status === "ok" ? "border-foreground" : "",
                        status === "bad" ? "border-destructive" : "",
                        shake ? "animate-[shake_0.18s_ease-in-out_0s_2]" : "",
                    ].join(" ")}
                    >
                  {status === "ok"
                    ? "ACCESS GRANTED"
                    : status === "bad"
                    ? "DENIED"
                    : gotoOpen
                    ? "TYPE LINE #…"
                    : "WAITING…"}
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-muted/40 p-4">
                <div className="text-sm font-semibold">{current.prompt}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {gotoOpen
                    ? "Type the line number and press Enter."
                    : "Click the editor, then press the shortcut."}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <Editor />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground">
                      {showHint ? "Expected" : "Expected (locked)"}
                    </div>

                    {!showHint ? (
                      <button
                        onClick={useHint}
                        className="text-xs font-semibold underline underline-offset-4 hover:opacity-80"
                      >
                        {mode === "hardcore" ? "Use hint (-5)" : "Show hint"}
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-1 text-sm font-semibold">
                    {showHint
                    ? prettyCombo(
                        {
                            key: expected.key,
                            ctrl: !!expected.ctrl,
                            meta: !!expected.meta,
                            alt: !!expected.alt,
                            shift: !!expected.shift,
                        },
                        os
                        )
                    : "••••"}
                  </div>

                  {showHint && current.hint ? (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Hint: {current.hint}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-xl border bg-background p-3">
                  <div className="text-xs text-muted-foreground">You pressed</div>
                  <div className="mt-1 text-sm font-semibold">
                    {lastPressed ? prettyCombo(lastPressed, os) : "—"}
                  </div>
                </div>
              </div>

              {/* <div className="mt-4 text-sm text-muted-foreground">{current.explain}</div> */}
            </div>
          </div>

          {/* side panel */}
          <div className="border-t lg:border-t-0 lg:border-l p-5">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="text-sm font-semibold">Stats</div>

              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Score</div>
                  <div className="font-semibold tabular-nums">{score}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Hints</div>
                  <div className="font-semibold tabular-nums">{hintsUsed}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Attempts</div>
                  <div className="font-semibold tabular-nums">{attempts}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                  <div className="font-semibold tabular-nums">{streak}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Best</div>
                  <div className="font-semibold tabular-nums">{bestStreak}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Locks left</div>
                  <div className="font-semibold tabular-nums">
                    {total - (index + 1)}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => startGame(os, mode)}
                  className="rounded-xl border px-3 py-2 text-sm hover:bg-muted transition"
                >
                  Restart
                </button>

                <button
                  onClick={() => setOs(null)}
                  className="rounded-xl border px-3 py-2 text-sm hover:bg-muted transition"
                >
                  Change OS
                </button>

                <button
                  onClick={resetEditor}
                  className="rounded-xl border px-3 py-2 text-sm hover:bg-muted transition"
                >
                  Reset file
                </button>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Note: some browser/OS shortcuts may be reserved. Click the editor first.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
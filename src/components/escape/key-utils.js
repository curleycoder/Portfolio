export function normalizeKey(e) {
  // normalize letters to uppercase
  if (e.key.length === 1) return e.key.toUpperCase();
  // keep named keys consistent
  return e.key;
}

export function comboFromEvent(e) {
  return {
    key: normalizeKey(e),
    ctrl: !!e.ctrlKey,
    meta: !!e.metaKey,
    alt: !!e.altKey,
    shift: !!e.shiftKey,
  };
}

export function matchCombo(actual, expected) {
  // expected only sets what matters; anything not mentioned is treated as false
  const exp = {
    key: expected.key,
    ctrl: !!expected.ctrl,
    meta: !!expected.meta,
    alt: !!expected.alt,
    shift: !!expected.shift,
  };

  return (
    actual.key === exp.key &&
    actual.ctrl === exp.ctrl &&
    actual.meta === exp.meta &&
    actual.alt === exp.alt &&
    actual.shift === exp.shift
  );
}

export function prettyCombo(combo, os) {
  // display in a friendly order
  const parts = [];
  if (combo.meta) parts.push(os === "mac" ? "⌘" : "Meta");
  if (combo.ctrl) parts.push(os === "mac" ? "Ctrl" : "Ctrl");
  if (combo.alt) parts.push(os === "mac" ? "⌥" : "Alt");
  if (combo.shift) parts.push(os === "mac" ? "⇧" : "Shift");

  const keyLabel =
    combo.key === " " ? "Space" :
    combo.key === "ArrowUp" ? "↑" :
    combo.key === "ArrowDown" ? "↓" :
    combo.key === "ArrowLeft" ? "←" :
    combo.key === "ArrowRight" ? "→" :
    combo.key;

  parts.push(keyLabel);
  return parts.join(" + ");
}

export function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
}
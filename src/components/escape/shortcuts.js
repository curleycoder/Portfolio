export const OS = {
  MAC: "mac",
  WIN: "win",
};

// NOTE: "demo" is what your fake VS Code editor should do when the lock is solved.
// You will implement these actions in the EscapeGame fake-editor state.
// step2 is for puzzles that require a follow-up input (e.g., Go to Line).

export const SHORTCUTS = [
  // ========= MOVE LINE =========
  {
    id: "moveLineUp",
    title: "Move line up",
    prompt: "Move the current line UP by one.",
    win: { alt: true, key: "ArrowUp" },
    mac: { alt: true, key: "ArrowUp" }, // ⌥
    explain: "Reorder code without cut/paste.",
    hint: "Try the same key as Move Line Down, but with the Up arrow.",
    demo: { type: "MOVE_LINE", dir: "up" },
  },
  {
    id: "moveLineDown",
    title: "Move line down",
    prompt: "Move the current line DOWN by one.",
    win: { alt: true, key: "ArrowDown" },
    mac: { alt: true, key: "ArrowDown" }, // ⌥
    explain: "Reorder code without cut/paste.",
    hint: "Hold Alt/Option and use the arrow keys.",
    demo: { type: "MOVE_LINE", dir: "down" },
  },

  // ========= COPY LINE =========
  {
    id: "copyLineUp",
    title: "Copy line up",
    prompt: "Duplicate the current line ABOVE.",
    win: { alt: true, shift: true, key: "ArrowUp" },
    mac: { alt: true, shift: true, key: "ArrowUp" }, // ⇧⌥
    explain: "Duplicate patterns fast without copy/paste.",
    hint: "It’s Move Line Up + Shift.",
    demo: { type: "COPY_LINE", dir: "up" },
  },
  {
    id: "copyLineDown",
    title: "Copy line down",
    prompt: "Duplicate the current line BELOW.",
    win: { alt: true, shift: true, key: "ArrowDown" },
    mac: { alt: true, shift: true, key: "ArrowDown" }, // ⇧⌥
    explain: "Duplicate patterns fast without copy/paste.",
    hint: "It’s Move Line Down + Shift.",
    demo: { type: "COPY_LINE", dir: "down" },
  },

  // ========= MULTI-CURSOR =========
  {
    id: "addSelectionNextMatch",
    title: "Add selection to next match",
    prompt: "Select the next match of the current word (multi-cursor).",
    win: { ctrl: true, key: "D" },
    mac: { meta: true, key: "D" }, // ⌘D
    explain: "Select repeated words quickly and edit them together.",
    hint: "Think ‘Duplicate selection’ but it’s D with Ctrl/⌘.",
    demo: { type: "NEXT_MATCH" },
  },
  {
    id: "insertCursorBelow",
    title: "Insert cursor below",
    prompt: "Add another cursor ONE LINE BELOW.",
    win: { ctrl: true, alt: true, key: "ArrowDown" },
    mac: { alt: true, meta: true, key: "ArrowDown" }, // ⌥⌘↓
    explain: "Edit multiple lines at once.",
    hint: "On Windows it’s Ctrl+Alt+Down. On Mac it’s ⌥⌘↓.",
    demo: { type: "CURSOR_ADD", dir: "down" },
  },

  // ========= GO TO LINE (2-step) =========
  {
    id: "goToLine",
    title: "Go to Line…",
    prompt: "Open Go to Line, then jump to line 8.",
    // stable choice for game: Ctrl+G on both
    win: { ctrl: true, key: "G" },
    mac: { ctrl: true, key: "G" },
    explain: "Jump to a specific line number in the current file.",
    hint: "It’s Ctrl+G (and then type a number).",
    demo: { type: "OPEN_GOTO_LINE" },
    step2: {
      type: "INPUT_LINE_NUMBER",
      expectedLine: 8,
      placeholder: "Type a line number…",
    },
  },
];
import EscapeGame from "@/components/escape/escape-game";

export const metadata = {
  title: "Escape the Editor",
  description: "A keyboard-shortcut escape room for VS Code.",
};

export default function EscapePage() {
  return (
    <main className="min-h-screen">
      <EscapeGame />
    </main>
  );
}
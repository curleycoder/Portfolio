export default function AdminLogin() {
  return (
    <main className="mx-auto max-w-xl p-8 text-neutral-100">
      <h1 className="text-2xl font-semibold mt-10">Admin</h1>
      <p className="mt-2 text-neutral-300">Login to access the dashboard.</p>

      <a
        href="/api/auth/login"
        className="mt-6 inline-flex rounded-lg bg-purple-500/40 px-4 py-2 font-semibold ring-1 ring-purple-500/25 hover:bg-purple-500/25 mb-56"
      >
        Login
      </a>
    </main>
  );
}

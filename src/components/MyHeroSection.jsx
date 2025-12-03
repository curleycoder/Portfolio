import Image from "next/image";

export default function MyHero({ hero }) {
  const {
    avatar,
    fullName,
    shortDescription,
    longDescription,
  } = hero ?? {};

  return (
    <section className="w-full border-b bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-center">
        {/* LEFT: avatar + name + tagline */}
        <div className="flex flex-1 items-center gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border bg-white shadow-md md:h-28 md:w-28">
            <Image
              src={avatar || "/logo11.jpg"} // fallback if no avatar set yet
              alt={fullName || "Profile photo"}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Full-stack dev & PM
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
              {fullName || "Your Name"}
            </h1>
            <p className="mt-2 text-base text-slate-700">
              {shortDescription || "Short one-line summary about what you build."}
            </p>
          </div>
        </div>

        {/* RIGHT: longer blurb */}
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-slate-600 md:text-base">
            {longDescription ||
              "Use this space for a 3–4 sentence intro: what you’re good at, what tech you use, and what kinds of projects you like to work on."}
          </p>
        </div>
      </div>
    </section>
  );
}

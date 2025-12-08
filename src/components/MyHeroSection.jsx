import Image from "next/image";

export default function MyHero({ hero }) {
  const { avatar, fullName, shortDescription, longDescription } = hero ?? {};

  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:items-center">
        {/* LEFT: avatar + name + tagline */}
        <div className="flex flex-1 items-center gap-6">
          {/* BIGGER AVATAR */}
          <div className="flex items-center justify-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900 shadow-md md:h-40 md:w-40">
              <Image
                src={avatar || "/me.jpg"}
                alt={fullName || "Profile image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 7rem, 10rem"
                priority
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Full-stack dev &amp; PM
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-50 md:text-4xl">
              {fullName || "Your Name"}
            </h1>
            <p className="mt-2 text-sm text-neutral-200">
              {shortDescription ||
                "Short one-line summary about what you build."}
            </p>
          </div>
        </div>

        {/* RIGHT: longer blurb */}
        <div className="flex">
          <p className="text-sm flex-2 leading-relaxed text-neutral-300 md:text-sm">
            {longDescription ||
              "Use this space for a 3–4 sentence intro: what you’re good at, what tech you use, and what kinds of projects you like to work on."}
          </p>
        </div>
      </div>
    </section>
  );
}

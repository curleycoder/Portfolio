// src/lib/db.js
import postgres from "postgres";
import { unstable_noStore as noStore } from "next/cache";
import { slugify } from "./slug";

// ---------------------------------
// DATABASE CONNECTION (Supabase)
// ---------------------------------
const DB_URL = process.env.SUPABASE_DB_URL;

if (!DB_URL) {
  throw new Error(
    "Missing SUPABASE_DB_URL in .env.local"
  );
}

export const sql = postgres(DB_URL, {
  ssl: "require",
  max: 5,
  idle_timeout: 20,

  // ✅ REQUIRED for Supabase pooler (PgBouncer)
  prepare: false,
});
// ---------------------------------
// HELPERS
// ---------------------------------
function asArray(v) {
  if (Array.isArray(v)) return v;

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return [];

    try {
      const once = JSON.parse(s);

      // ✅ normal case
      if (Array.isArray(once)) return once;

      // ✅ double-stringified case: once is a string like '["a","b"]'
      if (typeof once === "string") {
        const twice = JSON.parse(once);
        return Array.isArray(twice) ? twice : [];
      }

      return [];
    } catch {
      return [];
    }
  }

  return [];
}

function isUuid(v) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(v || "")
  );
}

function mapProject(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description ?? "",
    description: row.description,
    image: row.image,
    link: row.link ?? "",
    keywords: asArray(row.keywords),
    images: asArray(row.images),
    media: asArray(row.media),
    whyTitle: row.why_title ?? "",
    why: row.why ?? "",
    rationaleProblem: row.rationale_problem ?? "",
    rationaleChallenge: row.rationale_challenge ?? "",
    rationaleSolution: row.rationale_solution ?? "",
    rationale: row.rationale ?? "",
    highlights: asArray(row.highlights),
    githubLink: row.github_link ?? "",
    demoLink: row.demo_link ?? "",
    figmaLink: row.figma_link ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    repoYear: row.repo_year ?? null,
  };
}

// ---------------------------------
// PROJECTS TABLE
// ---------------------------------
let projectsInitPromise = null;

export async function ensureProjectsTable() {
  if (projectsInitPromise) return projectsInitPromise;

  projectsInitPromise = (async () => {

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title text NOT NULL,
        short_description text NOT NULL DEFAULT '',
        description text NOT NULL,
        image text NOT NULL,
        link text NOT NULL DEFAULT '',
        github_link text NOT NULL DEFAULT '',
        demo_link text NOT NULL DEFAULT '',
        figma_link text NOT NULL DEFAULT '',
        keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
        images jsonb NOT NULL DEFAULT '[]'::jsonb,
        media jsonb NOT NULL DEFAULT '[]'::jsonb,
        why_title text NOT NULL DEFAULT '',
        why text NOT NULL DEFAULT '',
        rationale_problem text NOT NULL DEFAULT '',
        rationale_challenge text NOT NULL DEFAULT '',
        rationale_solution text NOT NULL DEFAULT '',
        rationale text NOT NULL DEFAULT '',
        highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `;
  })();

  return projectsInitPromise;
}

// ---------------------------------
// READ
// ---------------------------------
export async function fetchProjects({ limit = 50, offset = 0 } = {}) {
  noStore();
  await ensureProjectsTable();

  const rows = await sql`
    SELECT *
    FROM projects
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  return rows.map(mapProject);
}

export async function fetchProjectById(id) {
  noStore();
  await ensureProjectsTable();

  if (!isUuid(id)) return null;

  const rows = await sql`
    SELECT *
    FROM projects
    WHERE id = ${id}
    LIMIT 1;
  `;

  return mapProject(rows[0]);
}

export async function getProjectById(id) {
  return fetchProjectById(id);
}

// ---------------------------------
// WRITE
// ---------------------------------
export async function insertProject(data) {
  await ensureProjectsTable();

  const [row] = await sql`
    INSERT INTO projects (
      title, short_description, description, image, link,
      github_link, demo_link, figma_link,
      keywords, images, media,
      why_title, why,
      rationale_problem, rationale_challenge, rationale_solution, rationale,
      highlights
    )
    VALUES (
      ${data.title},
      ${data.shortDescription ?? ""},
      ${data.description},
      ${data.image},
      ${data.link ?? ""},
      ${data.githubLink ?? ""},
      ${data.demoLink ?? ""},
      ${data.figmaLink ?? ""},
      ${JSON.stringify(data.keywords ?? [])}::jsonb,
      ${JSON.stringify(data.images ?? [])}::jsonb,
      ${JSON.stringify(data.media ?? [])}::jsonb,
      ${data.whyTitle ?? ""},
      ${data.why ?? ""},
      ${data.rationaleProblem ?? ""},
      ${data.rationaleChallenge ?? ""},
      ${data.rationaleSolution ?? ""},
      ${data.rationale ?? ""},
      ${JSON.stringify(data.highlights ?? [])}::jsonb
    )
    RETURNING *;
  `;

  return mapProject(row);
}

function asJsonArray(v) {
  if (v === undefined) return undefined; // means "don't change"
  if (v === null) return []; // optional: if you ever pass null, treat as empty

  // already array
  if (Array.isArray(v)) return v;

  // if it's a string, try parsing once or twice
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return [];
    try {
      const once = JSON.parse(s);
      if (Array.isArray(once)) return once;

      // double-stringified
      if (typeof once === "string") {
        const twice = JSON.parse(once);
        return Array.isArray(twice) ? twice : [];
      }
      return [];
    } catch {
      return [];
    }
  }

  return [];
}

function asJsonArrayOfObjects(v) {
  const arr = asJsonArray(v);
  // if someone sends objects already, good; if strings, drop
  return Array.isArray(arr) ? arr.filter((x) => x && typeof x === "object") : [];
}

export async function updateProject(id, updates) {
  await ensureProjectsTable();

  const keywords = asJsonArray(updates.keywords);
  const images = asJsonArray(updates.images);

  const media = updates.media === undefined ? undefined : asJsonArray(updates.media);
  const highlights =
    updates.highlights === undefined ? undefined : asJsonArray(updates.highlights);

  const rows = await sql`
    UPDATE projects
    SET
      title = COALESCE(${updates.title ?? null}, title),
      short_description = COALESCE(${updates.shortDescription ?? null}, short_description),
      description = COALESCE(${updates.description ?? null}, description),
      image = COALESCE(${updates.image ?? null}, image),
      link = COALESCE(${updates.link ?? null}, link),

      keywords = COALESCE(
        ${keywords !== undefined ? sql.json(keywords) : null}::jsonb,
        keywords
      ),

      images = COALESCE(
        ${images !== undefined ? sql.json(images) : null}::jsonb,
        images
      ),

      media = COALESCE(
        ${media !== undefined ? sql.json(media) : null}::jsonb,
        media
      ),

      why_title = COALESCE(${updates.whyTitle ?? null}, why_title),
      why = COALESCE(${updates.why ?? null}, why),

      rationale_problem = COALESCE(${updates.rationaleProblem ?? null}, rationale_problem),
      rationale_challenge = COALESCE(${updates.rationaleChallenge ?? null}, rationale_challenge),
      rationale_solution = COALESCE(${updates.rationaleSolution ?? null}, rationale_solution),
      rationale = COALESCE(${updates.rationale ?? null}, rationale),

      highlights = COALESCE(
        ${highlights !== undefined ? sql.json(highlights) : null}::jsonb,
        highlights
      ),

      github_link = COALESCE(${updates.githubLink ?? null}, github_link),
      demo_link = COALESCE(${updates.demoLink ?? null}, demo_link),
      figma_link = COALESCE(${updates.figmaLink ?? null}, figma_link),

      repo_year = COALESCE(${updates.repoYear ?? null}, repo_year),

      updated_at = now()
    WHERE id = ${id}
    RETURNING *;
  `;

  return mapProject(rows[0]);
}

export async function deleteProject(id) {
  await ensureProjectsTable();

  const rows = await sql`
    DELETE FROM projects
    WHERE id = ${id}
    RETURNING *;
  `;
  return mapProject(rows[0]);
}

// -----------------------------
// AUDIT LOGS
// -----------------------------
let auditInitPromise = null;

export async function ensureAuditTable() {
  if (auditInitPromise) return auditInitPromise;

  auditInitPromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS project_audit_logs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id uuid NOT NULL,
        user_email text NOT NULL,
        action text NOT NULL,
        payload jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `;
  })();

  return auditInitPromise;
}

export async function insertAuditLog({ projectId, userEmail, action, payload }) {
  await ensureAuditTable();
  await sql`
    INSERT INTO project_audit_logs (project_id, user_email, action, payload)
    VALUES (
      ${projectId},
      ${userEmail},
      ${action},
      ${JSON.stringify(payload)}::jsonb
    );
  `;
}

// -----------------------------
// HERO
// -----------------------------
// If you had these in another file, keep them there.
// If not, define safe defaults here so db.js doesn't crash.
const HERO_PLACEHOLDER_AVATAR = "/ai.png";
const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  fullName: "Shabnam Beiraghian",
  shortDescription: "BCIT Full-Stack Web Development student building real-world Next.js apps.",
  longDescription:
    "I’m transitioning into software development. I build practical Next.js apps with clean UI and reliable flows.",
};

let heroInitPromise = null;

export async function ensureHeroTable() {
  if (heroInitPromise) return heroInitPromise;

  heroInitPromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS hero (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        avatar text NOT NULL DEFAULT '',
        full_name text NOT NULL,
        short_description text NOT NULL CHECK (char_length(short_description) <= 120),
        long_description text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `;

    const [{ count }] = await sql`SELECT count(*)::int AS count FROM hero;`;
    if (Number(count) === 0) {
      await sql`
        INSERT INTO hero (avatar, full_name, short_description, long_description)
        VALUES (
          ${defaultHeroContent.avatar},
          ${defaultHeroContent.fullName},
          ${defaultHeroContent.shortDescription},
          ${defaultHeroContent.longDescription}
        );
      `;
    }
  })();

  return heroInitPromise;
}

function mapHeroRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    avatar: row.avatar || HERO_PLACEHOLDER_AVATAR,
    fullName: row.full_name || defaultHeroContent.fullName,
    shortDescription: row.short_description || defaultHeroContent.shortDescription,
    longDescription: row.long_description || defaultHeroContent.longDescription,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getHero() {
  await ensureHeroTable();
  const rows = await sql`
    SELECT *
    FROM hero
    ORDER BY created_at ASC
    LIMIT 1;
  `;
  return mapHeroRow(rows[0]);
}

export async function upsertHero(updates = {}) {
  await ensureHeroTable();
  const current = await getHero();

  const merged = { ...defaultHeroContent, ...(current || {}), ...updates };

  const avatar =
    typeof merged.avatar === "string" && merged.avatar.trim() ? merged.avatar.trim() : HERO_PLACEHOLDER_AVATAR;

  const fullName = (merged.fullName || "").trim();
  const shortDescription = (merged.shortDescription || "").trim().slice(0, 120);
  const longDescription = (merged.longDescription || "").trim();

  if (current?.id) {
    const rows = await sql`
      UPDATE hero
      SET
        avatar = ${avatar},
        full_name = ${fullName},
        short_description = ${shortDescription},
        long_description = ${longDescription},
        updated_at = now()
      WHERE id = ${current.id}
      RETURNING *;
    `;
    return mapHeroRow(rows[0]);
  }

  const rows = await sql`
    INSERT INTO hero (avatar, full_name, short_description, long_description)
    VALUES (${avatar}, ${fullName}, ${shortDescription}, ${longDescription})
    RETURNING *;
  `;
  return mapHeroRow(rows[0]);
}

// -----------------------------
// BLOG
// -----------------------------
let blogInitPromise = null;

export async function ensureBlogPostTable() {
  if (blogInitPromise) return blogInitPromise;

  blogInitPromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        slug         text NOT NULL UNIQUE,
        title        text NOT NULL,
        excerpt      text,
        content      text NOT NULL,
        author_email text NOT NULL,
        published_at timestamptz NOT NULL DEFAULT now(),
        created_at   timestamptz NOT NULL DEFAULT now(),
        updated_at   timestamptz NOT NULL DEFAULT now()
      );
    `;
  })();

  return blogInitPromise;
}

function mapBlogPostRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content,
    authorEmail: row.author_email,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function blogSlugExists(slug) {
  const [{ count }] = await sql`
    SELECT count(*)::int AS count
    FROM blog_posts
    WHERE slug = ${slug};
  `;
  return Number(count) > 0;
}

export async function insertBlogPost({ title, excerpt = "", content, authorEmail }) {
  await ensureBlogPostTable();
  if (!title || !content) throw new Error("Title and content are required");

  const baseSlug = slugify(title) || "post";
  let slug = baseSlug;
  let suffix = 1;

  while (await blogSlugExists(slug)) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const rows = await sql`
    INSERT INTO blog_posts (slug, title, excerpt, content, author_email)
    VALUES (${slug}, ${title}, ${excerpt}, ${content}, ${authorEmail})
    RETURNING *;
  `;
  return mapBlogPostRow(rows[0]);
}

export async function fetchBlogPostBySlug(slug) {
  await ensureBlogPostTable();
  const rows = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} LIMIT 1;`;
  return mapBlogPostRow(rows[0]);
}

export async function countBlogPosts() {
  await ensureBlogPostTable();
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM blog_posts;`;
  return Number(count) || 0;
}

export async function fetchBlogPostsPage({ limit, offset }) {
  await ensureBlogPostTable();
  const rows = await sql`
    SELECT *
    FROM blog_posts
    ORDER BY published_at DESC
    LIMIT ${limit}
    OFFSET ${offset};
  `;
  return rows.map(mapBlogPostRow);
}

// -----------------------------
// BOOKINGS
// -----------------------------
let bookingsInitPromise = null;

export async function ensureBookingRequestsTable() {
  if (bookingsInitPromise) return bookingsInitPromise;

  bookingsInitPromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS booking_requests (
        id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name  text NOT NULL,
        email      text NOT NULL,
        date       date NOT NULL,
        time_slot  text NOT NULL,
        note       text,
        status     text NOT NULL DEFAULT 'pending',
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `;

    // unique slot index (safe)
    try {
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS booking_requests_unique_slot
        ON booking_requests (date, time_slot);
      `;
    } catch (e) {
      // don't crash app
      console.warn("[booking_requests] unique index not created:", e?.code || e);
    }
  })();

  return bookingsInitPromise;
}

function mapBookingRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    date: row.date,
    timeSlot: row.time_slot,
    note: row.note || "",
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function insertBookingRequest({ fullName, email, date, timeSlot, note = "" }) {
  await ensureBookingRequestsTable();

  const rows = await sql`
    INSERT INTO booking_requests (full_name, email, date, time_slot, note)
    VALUES (${fullName}, ${email}, ${date}, ${timeSlot}, ${note})
    RETURNING *;
  `;
  return mapBookingRow(rows[0]);
}

export async function fetchBookingsBetween({ startDate, endDate }) {
  await ensureBookingRequestsTable();

  const rows = await sql`
    SELECT *
    FROM booking_requests
    WHERE date BETWEEN ${startDate} AND ${endDate}
      AND status IN ('pending','confirmed')
    ORDER BY date ASC, time_slot ASC;
  `;
  return rows.map(mapBookingRow);
}

// -----------------------------
// ANALYTICS: ROUTE VIEWS
// -----------------------------
let routeViewsInitPromise = null;

export async function ensureRouteViewsTable() {
  if (routeViewsInitPromise) return routeViewsInitPromise;

  routeViewsInitPromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS route_views (
        id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        path       text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `;
  })();

  return routeViewsInitPromise;
}

export async function insertRouteView(pathValue) {
  await ensureRouteViewsTable();
  await sql`INSERT INTO route_views (path) VALUES (${pathValue});`;
}

export async function getRouteViewCounts() {
  await ensureRouteViewsTable();

  const rows = await sql`
    SELECT path, count(*)::int AS views
    FROM route_views
    GROUP BY path
    ORDER BY views DESC;
  `;

  return rows.map((row) => ({ path: row.path, views: row.views }));
}

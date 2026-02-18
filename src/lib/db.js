import { neon } from "@neondatabase/serverless";
import { unstable_noStore as noStore } from "next/cache";

export const sql = neon(process.env.NEON_DB_URL);

// Tell Neon’s internal fetch not to cache
sql.fetchOptions = { cache: "no-store" };

// One-time init per server instance
let projectsInitPromise = null;
let auditInitPromise = null;

function asArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// ---- mapper MUST be above usage
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

    // ✅ NEW
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
  };
}

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

        -- ✅ NEW
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

// ---------- PROJECTS (READ) ----------
export async function fetchProjects({ limit = 20, offset = 0 } = {}) {
  noStore(); // ✅ prevent Next RSC caching
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
  noStore(); // ✅ prevent Next RSC caching
  await ensureProjectsTable();

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

// ---------- PROJECTS (WRITE) ----------
export async function insertProject(data) {
  await ensureProjectsTable();

  const rows = await sql`
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

      -- ✅ NEW
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
  return mapProject(rows[0]);
}

export async function updateProject(id, updates) {
  await ensureProjectsTable();

  const rows = await sql`
    UPDATE projects
    SET
      title = COALESCE(${updates.title ?? null}, title),
      short_description = COALESCE(${updates.shortDescription ?? null}, short_description),
      description = COALESCE(${updates.description ?? null}, description),
      image = COALESCE(${updates.image ?? null}, image),
      link = COALESCE(${updates.link ?? null}, link),

      keywords = COALESCE(
        ${updates.keywords !== undefined ? JSON.stringify(updates.keywords) : null}::jsonb,
        keywords
      ),

      images = COALESCE(
        ${updates.images !== undefined ? JSON.stringify(updates.images) : null}::jsonb,
        images
      ),

      -- ✅ NEW
      media = COALESCE(
        ${updates.media !== undefined ? JSON.stringify(updates.media) : null}::jsonb,
        media
      ),

      why_title = COALESCE(${updates.whyTitle ?? null}, why_title),
      why = COALESCE(${updates.why ?? null}, why),

      rationale_problem = COALESCE(${updates.rationaleProblem ?? null}, rationale_problem),
      rationale_challenge = COALESCE(${updates.rationaleChallenge ?? null}, rationale_challenge),
      rationale_solution = COALESCE(${updates.rationaleSolution ?? null}, rationale_solution),
      rationale = COALESCE(${updates.rationale ?? null}, rationale),

      highlights = COALESCE(
        ${updates.highlights !== undefined ? JSON.stringify(updates.highlights) : null}::jsonb,
        highlights
      ),

      github_link = COALESCE(${updates.githubLink ?? null}, github_link),
      demo_link = COALESCE(${updates.demoLink ?? null}, demo_link),
      figma_link = COALESCE(${updates.figmaLink ?? null}, figma_link),

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


// ---------- AUDIT LOGS ----------
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
      ${JSON.stringify(payload)}
    );
  `;
}

// ---------- HERO ----------

export async function ensureHeroTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS hero (
      id uuid PRIMARY KEY,
      avatar text NOT NULL DEFAULT '',
      full_name text NOT NULL,
      short_description text NOT NULL CHECK (char_length(short_description) <= 120),
      long_description text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `;

  const [{ count }] = await sql`
    SELECT count(*)::int AS count FROM hero;
  `;
  if (Number(count) === 0) {
    await sql`
      INSERT INTO hero (id, avatar, full_name, short_description, long_description)
      VALUES (
        gen_random_uuid(),
        ${defaultHeroContent.avatar},
        ${defaultHeroContent.fullName},
        ${defaultHeroContent.shortDescription},
        ${defaultHeroContent.longDescription}
      );
    `;
  }
}

function mapHeroRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    avatar: row.avatar || HERO_PLACEHOLDER_AVATAR,
    fullName: row.full_name || defaultHeroContent.fullName,
    shortDescription:
      row.short_description || defaultHeroContent.shortDescription,
    longDescription: row.long_description || defaultHeroContent.longDescription,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getHero() {
  await ensureHeroTable();

  const [row] = await sql`
    SELECT
      id,
      avatar,
      full_name,
      short_description,
      long_description,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM hero
    ORDER BY created_at ASC
    LIMIT 1;
  `;

  return mapHeroRow(row);
}

export async function upsertHero(updates = {}) {
  await ensureHeroTable();
  const current = await getHero();

  const merged = {
    ...defaultHeroContent,
    ...(current || {}),
    ...updates,
  };

  const normalizedAvatar =
    typeof merged.avatar === "string" &&
    merged.avatar.trim().startsWith("data:")
      ? merged.avatar.trim()
      : HERO_PLACEHOLDER_AVATAR;

  const shortDescription = (merged.shortDescription || "").trim().slice(0, 120);
  const fullName = (merged.fullName || "").trim();
  const longDescription = (merged.longDescription || "").trim();

  if (current?.id) {
    const [row] = await sql`
      UPDATE hero
      SET
        avatar = ${normalizedAvatar},
        full_name = ${fullName},
        short_description = ${shortDescription},
        long_description = ${longDescription},
        updated_at = now()
      WHERE id = ${current.id}
      RETURNING
        id,
        avatar,
        full_name,
        short_description,
        long_description,
        created_at AS "createdAt",
        updated_at AS "updatedAt";
    `;

    return mapHeroRow(row);
  }

  const [row] = await sql`
    INSERT INTO hero (id, avatar, full_name, short_description, long_description)
    VALUES (
      gen_random_uuid(),
      ${normalizedAvatar},
      ${fullName},
      ${shortDescription},
      ${longDescription}
    )
    RETURNING
      id,
      avatar,
      full_name,
      short_description,
      long_description,
      created_at AS "createdAt",
      updated_at AS "updatedAt";
  `;

  return mapHeroRow(row);
}
// --- BLOG HELPERS ----------------------------------------------------

import { slugify } from "./slug";

// 1. Create table helper
export async function ensureBlogPostTable() {
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
}

function mapBlogPostRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content,
    authorEmail: row.author_email ?? row.authorEmail,
    publishedAt: row.publishedAt ?? row.published_at,
    createdAt: row.createdAt ?? row.created_at,
    updatedAt: row.updatedAt ?? row.updated_at,
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

// 2. Create post
export async function insertBlogPost({
  title,
  excerpt = "",
  content,
  authorEmail,
}) {
  await ensureBlogPostTable();

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const baseSlug = slugify(title) || "post";
  let slug = baseSlug;
  let suffix = 1;

  while (await blogSlugExists(slug)) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const [row] = await sql`
    INSERT INTO blog_posts (slug, title, excerpt, content, author_email)
    VALUES (
      ${slug},
      ${title},
      ${excerpt},
      ${content},
      ${authorEmail}
    )
    RETURNING
      id,
      slug,
      title,
      excerpt,
      content,
      author_email,
      published_at AS "publishedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt";
  `;

  return mapBlogPostRow(row);
}

// 3. Read one post
export async function fetchBlogPostBySlug(slug) {
  const [row] = await sql`
    SELECT
      id,
      slug,
      title,
      excerpt,
      content,
      author_email,
      published_at AS "publishedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM blog_posts
    WHERE slug = ${slug}
    LIMIT 1;
  `;

  return mapBlogPostRow(row);
}

// 4. Count posts
export async function countBlogPosts() {
  const [{ count }] = await sql`
    SELECT count(*)::int AS count
    FROM blog_posts;
  `;
  return Number(count) || 0;
}

// 5. Paginated list
export async function fetchBlogPostsPage({ limit, offset }) {
  const rows = await sql`
    SELECT
      id,
      slug,
      title,
      excerpt,
      content,
      author_email,
      published_at AS "publishedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM blog_posts
    ORDER BY published_at DESC
    LIMIT ${limit}
    OFFSET ${offset};
  `;
  return rows.map(mapBlogPostRow);
}
// --- BOOKING / AVAILABILITY -----------------------------------------

export async function ensureBookingRequestsTable() {
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

  // Try to add unique index; if duplicates exist, don't crash the app.
  try {
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS booking_requests_unique_slot
      ON booking_requests (date, time_slot);
    `;
  } catch (e) {
    // 23505 = unique_violation (duplicates exist)
    if (e?.code === "23505") {
      console.warn(
        "[booking_requests] Unique index NOT created because duplicates exist. Run dedupe SQL once.",
      );
    } else {
      // Unknown error: log it, but don't take down the site
      console.error("[booking_requests] Failed to create unique index:", e);
    }
  }
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

export async function insertBookingRequest({
  fullName,
  email,
  date,
  timeSlot,
  note = "",
}) {
  await ensureBookingRequestsTable();

  const [row] = await sql`
    INSERT INTO booking_requests (full_name, email, date, time_slot, note)
    VALUES (${fullName}, ${email}, ${date}, ${timeSlot}, ${note})
    RETURNING
      id,
      full_name,
      email,
      date,
      time_slot,
      note,
      status,
      created_at;
  `;

  return mapBookingRow(row);
}

export async function fetchBookingsBetween({ startDate, endDate }) {
  await ensureBookingRequestsTable();

  const rows = await sql`
    SELECT
      id,
      full_name,
      email,
      date,
      time_slot,
      note,
      status,
      created_at
    FROM booking_requests
    WHERE date BETWEEN ${startDate} AND ${endDate}
      AND status IN ('pending','confirmed')
    ORDER BY date ASC, time_slot ASC;
  `;

  return rows.map(mapBookingRow);
}

// --- ANALYTICS: ROUTE VIEWS ------------------------------------------

export async function ensureRouteViewsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS route_views (
      id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      path       text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;
}

export async function insertRouteView(path) {
  await ensureRouteViewsTable();

  await sql`
    INSERT INTO route_views (path)
    VALUES (${path});
  `;
}

export async function getRouteViewCounts() {
  await ensureRouteViewsTable();

  const rows = await sql`
    SELECT
      path,
      count(*)::int AS views
    FROM route_views
    GROUP BY path
    ORDER BY views DESC;
  `;

  return rows.map((row) => ({
    path: row.path,
    views: row.views,
  }));
}

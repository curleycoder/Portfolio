import { neon } from "@neondatabase/serverless";

export const HERO_PLACEHOLDER_AVATAR =
  "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

export const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  fullName: "...",
  shortDescription: "...",
  longDescription: "...",
};

const sql = neon(process.env.NEON_DB_URL);

// ---------- PROJECTS ----------

function mapProject(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    link: row.link,
    keywords: row.keywords ?? [],
    images: row.images ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function ensureProjectsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      description text NOT NULL,
      image text NOT NULL,
      link text NOT NULL,
      keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
      images jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `;
}

export async function seedProjectsTable(seed) {
  for (const item of seed) {
    await sql`
      INSERT INTO projects (title, description, image, link, keywords, images)
      VALUES (
        ${item.title},
        ${item.description},
        ${item.image},
        ${item.link},
        ${JSON.stringify(item.keywords ?? [])},
        ${JSON.stringify(item.images ?? [])}
      )
      ON CONFLICT DO NOTHING;
    `;
  }
}

export async function fetchProjects({ limit = 20, offset = 0 } = {}) {
  const rows = await sql`
    SELECT *
    FROM projects
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset};
  `;
  return rows.map(mapProject);
}

export async function fetchProjectById(id) {
  const rows = await sql`
    SELECT *
    FROM projects
    WHERE id = ${id}
    LIMIT 1;
  `;
  return mapProject(rows[0]);
}

export async function getProjectById(id) {
  const rows = await sql`
    SELECT *
    FROM projects
    WHERE id = ${id}
    LIMIT 1;
  `;
  return mapProject(rows[0]);
}

export async function insertProject(data) {
  const rows = await sql`
    INSERT INTO projects (title, description, image, link, keywords, images)
    VALUES (
      ${data.title},
      ${data.description},
      ${data.image},
      ${data.link},
      ${JSON.stringify(data.keywords ?? [])},
      ${JSON.stringify(data.images ?? [])}
    )
    RETURNING *;
  `;
  return mapProject(rows[0]);
}

export async function updateProject(id, updates) {
  const rows = await sql`
    UPDATE projects
    SET
      title = COALESCE(${updates.title}, title),
      description = COALESCE(${updates.description}, description),
      image = COALESCE(${updates.image}, image),
      link = COALESCE(${updates.link}, link),
      keywords = COALESCE(
        ${updates.keywords ? JSON.stringify(updates.keywords) : null},
        keywords
      ),
      images = COALESCE(
        ${updates.images ? JSON.stringify(updates.images) : null},
        images
      ),
      updated_at = now()
    WHERE id = ${id}
    RETURNING *;
  `;
  return mapProject(rows[0]);
}

export async function deleteProject(id) {
  const rows = await sql`
    DELETE FROM projects
    WHERE id = ${id}
    RETURNING *;
  `;
  return mapProject(rows[0]);
}

// ---------- AUDIT LOGS ----------

export async function ensureAuditTable() {
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

  const shortDescription = (merged.shortDescription || "")
    .trim()
    .slice(0, 120);
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

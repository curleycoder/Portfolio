// src/lib/db.js
"use server";

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DB_URL);

function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    link: row.link,
    keywords: row.keywords ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function ensureProjectsTable() {
  // IMPORTANT: only ONE statement here, no CREATE EXTENSION
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      description text NOT NULL,
      image text NOT NULL,
      link text NOT NULL,
      keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `;
}

export async function seedProjectsTable(seed) {
  for (const item of seed) {
    await sql`
      INSERT INTO projects (title, description, image, link, keywords)
      VALUES (
        ${item.title},
        ${item.description},
        ${item.image},
        ${item.link},
        ${JSON.stringify(item.keywords ?? [])}
      )
      ON CONFLICT DO NOTHING;
    `;
  }
}

export async function fetchProjects({ limit = 20, offset = 0 } = {}) {
  const rows = await sql`
    SELECT * FROM projects
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return rows.map(mapProject);
}

export async function insertProject(data) {
  const rows = await sql`
    INSERT INTO projects (title, description, image, link, keywords)
    VALUES (
      ${data.title},
      ${data.description},
      ${data.image},
      ${data.link},
      ${JSON.stringify(data.keywords ?? [])}
    )
    RETURNING *;
  `;

  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    link: row.link,
    keywords: row.keywords ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
export async function getProjectById(id) {
  const rows = await sql`select * from projects where id = ${id} limit 1`;
  const row = rows[0];
  return row ? mapProject(row) : null;
}

export async function updateProject(id, updates) {
  const rows = await sql`
    update projects
    set
      title = coalesce(${updates.title}, title),
      description = coalesce(${updates.description}, description),
      image = coalesce(${updates.image}, image),
      link = coalesce(${updates.link}, link),
      keywords = coalesce(
        ${updates.keywords ? JSON.stringify(updates.keywords) : null},
        keywords
      ),
      updated_at = now()
    where id = ${id}
    returning *;
  `;
  const row = rows[0];
  return row ? mapProject(row) : null;
}

export async function deleteProject(id) {
  const rows = await sql`
    delete from projects where id = ${id} returning *;
  `;
  const row = rows[0];
  return row ? mapProject(row) : null;
}

export async function ensureAuditTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS project_audit_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id uuid NOT NULL,
      user_email text NOT NULL,
      action text NOT NULL,             -- "create" | "update" | "delete"
      payload jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;
}
export async function insertAuditLog({ projectId, userEmail, action, payload }) {
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

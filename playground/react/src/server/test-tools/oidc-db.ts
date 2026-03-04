import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import type { MockOidcBehavior, MockOidcUser } from '../../tools/types';

let _db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (_db) return _db;

  const dbDir = path.join(process.cwd(), '.data');
  mkdirSync(dbDir, { recursive: true });
  const dbPath = path.join(dbDir, 'tooling.sqlite');

  _db = new DatabaseSync(dbPath);

  _db.exec(`
    CREATE TABLE IF NOT EXISTS mock_oidc_users (
      id TEXT PRIMARY KEY,
      dev_session_id TEXT NOT NULL,
      email TEXT NOT NULL,
      behavior TEXT NOT NULL DEFAULT 'success',
      created_at INTEGER NOT NULL
    );
  `);

  _db.exec(`
    CREATE TABLE IF NOT EXISTS mock_oidc_auth_codes (
      code TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      dev_session_id TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  _db.exec(`
    CREATE TABLE IF NOT EXISTS session_users (
      dev_session_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (dev_session_id, user_id)
    );
  `);

  return _db;
}

function toUser(row: Record<string, unknown>): MockOidcUser {
  return {
    id: String(row.id),
    devSessionId: String(row.dev_session_id),
    email: String(row.email),
    behavior: String(row.behavior) as MockOidcBehavior,
  };
}

export const OidcDb = {
  listUsers(devSessionId: string): MockOidcUser[] {
    const stmt = getDb().prepare(
      `SELECT id, dev_session_id, email, behavior
       FROM mock_oidc_users
       WHERE dev_session_id = ?
       ORDER BY created_at DESC`,
    );
    return (stmt.all(devSessionId) as Record<string, unknown>[]).map(toUser);
  },

  setSingleUser(devSessionId: string, email: string): MockOidcUser {
    getDb().prepare(`DELETE FROM mock_oidc_users WHERE dev_session_id = ?`).run(devSessionId);
    const user: MockOidcUser = {
      id: crypto.randomUUID(),
      devSessionId,
      email,
      behavior: 'success',
    };
    getDb()
      .prepare(
        `INSERT INTO mock_oidc_users (id, dev_session_id, email, behavior, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      )
      .run(user.id, devSessionId, email, user.behavior, Date.now());
    return user;
  },

  updateBehavior(id: string, behavior: MockOidcBehavior): MockOidcUser | null {
    getDb().prepare(`UPDATE mock_oidc_users SET behavior = ? WHERE id = ?`).run(behavior, id);
    return this.getUserById(id);
  },

  getUserById(id: string): MockOidcUser | null {
    const row = getDb()
      .prepare(
        `SELECT id, dev_session_id, email, behavior
         FROM mock_oidc_users
         WHERE id = ?
         LIMIT 1`,
      )
      .get(id) as Record<string, unknown> | undefined;
    return row ? toUser(row) : null;
  },

  clearUsers(devSessionId: string) {
    getDb().prepare(`DELETE FROM mock_oidc_users WHERE dev_session_id = ?`).run(devSessionId);
    getDb().prepare(`DELETE FROM mock_oidc_auth_codes WHERE dev_session_id = ?`).run(devSessionId);
  },

  storeAuthCode(code: string, userId: string, devSessionId: string) {
    getDb()
      .prepare(
        `INSERT INTO mock_oidc_auth_codes (code, user_id, dev_session_id, created_at)
       VALUES (?, ?, ?, ?)`,
      )
      .run(code, userId, devSessionId, Date.now());
  },

  getAuthCode(code: string): { code: string; userId: string; sessionId: string } | null {
    const row = getDb()
      .prepare(
        `SELECT code, user_id, dev_session_id
         FROM mock_oidc_auth_codes
         WHERE code = ?
         LIMIT 1`,
      )
      .get(code) as Record<string, unknown> | undefined;
    if (!row) {
      return null;
    }
    return {
      code: String(row.code),
      userId: String(row.user_id),
      sessionId: String(row.dev_session_id),
    };
  },

  deleteAuthCode(code: string) {
    getDb().prepare(`DELETE FROM mock_oidc_auth_codes WHERE code = ?`).run(code);
  },

  addSessionUser(devSessionId: string, userId: string) {
    getDb()
      .prepare(
        `INSERT OR IGNORE INTO session_users (dev_session_id, user_id, created_at)
       VALUES (?, ?, ?)`,
      )
      .run(devSessionId, userId, Date.now());
  },

  listSessionUsers(devSessionId: string): string[] {
    const rows = getDb()
      .prepare(
        `SELECT user_id
         FROM session_users
         WHERE dev_session_id = ?
         ORDER BY created_at DESC`,
      )
      .all(devSessionId) as Record<string, unknown>[];
    return rows.map(row => String(row.user_id));
  },

  removeSessionUser(devSessionId: string, userId: string) {
    getDb().prepare(`DELETE FROM session_users WHERE dev_session_id = ? AND user_id = ?`).run(devSessionId, userId);
  },

  clearSessionUsers(devSessionId: string) {
    getDb().prepare(`DELETE FROM session_users WHERE dev_session_id = ?`).run(devSessionId);
  },
};

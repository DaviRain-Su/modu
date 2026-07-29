import { openDB, type DBSchema, type IDBPDatabase } from "idb";

export interface StoredObject {
  key: string;
  blob: Blob;
  contentType: string;
  size: number;
  updatedAt: number;
}

interface BookMetaRecord {
  id: string;
  json: string;
  updatedAt: number;
}

interface ProgressRecord {
  bookId: string;
  json: string;
  updatedAt: number;
}

interface ModuDB extends DBSchema {
  objects: {
    key: string;
    value: StoredObject;
  };
  books: {
    key: string;
    value: BookMetaRecord;
  };
  progress: {
    key: string;
    value: ProgressRecord;
  };
}

const DB_NAME = "modu-reader";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ModuDB>> | null = null;

function getDb() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }
  if (!dbPromise) {
    dbPromise = openDB<ModuDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("objects")) {
          db.createObjectStore("objects", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("books")) {
          db.createObjectStore("books", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("progress")) {
          db.createObjectStore("progress", { keyPath: "bookId" });
        }
      },
    });
  }
  return dbPromise;
}

export async function idbPutObject(obj: StoredObject): Promise<void> {
  const db = await getDb();
  await db.put("objects", obj);
}

export async function idbGetObject(key: string): Promise<StoredObject | null> {
  const db = await getDb();
  return (await db.get("objects", key)) ?? null;
}

export async function idbDeleteObject(key: string): Promise<void> {
  const db = await getDb();
  await db.delete("objects", key);
}

export async function idbListObjects(prefix: string): Promise<StoredObject[]> {
  const db = await getDb();
  const all = await db.getAll("objects");
  return all.filter((o) => o.key.startsWith(prefix));
}

export async function idbSaveBookMeta(
  id: string,
  data: unknown,
): Promise<void> {
  const db = await getDb();
  await db.put("books", {
    id,
    json: JSON.stringify(data),
    updatedAt: Date.now(),
  });
}

export async function idbGetBookMeta<T>(id: string): Promise<T | null> {
  const db = await getDb();
  const row = await db.get("books", id);
  if (!row) return null;
  return JSON.parse(row.json) as T;
}

export async function idbListBookMeta<T>(): Promise<T[]> {
  const db = await getDb();
  const rows = await db.getAll("books");
  return rows.map((r) => JSON.parse(r.json) as T);
}

export async function idbDeleteBookMeta(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("books", id);
}

export async function idbSaveProgress(
  bookId: string,
  data: unknown,
): Promise<void> {
  const db = await getDb();
  await db.put("progress", {
    bookId,
    json: JSON.stringify(data),
    updatedAt: Date.now(),
  });
}

export async function idbGetProgress<T>(bookId: string): Promise<T | null> {
  const db = await getDb();
  const row = await db.get("progress", bookId);
  if (!row) return null;
  return JSON.parse(row.json) as T;
}

export async function idbListProgress<T>(): Promise<T[]> {
  const db = await getDb();
  const rows = await db.getAll("progress");
  return rows.map((r) => JSON.parse(r.json) as T);
}

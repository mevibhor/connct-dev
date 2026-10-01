import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

import { Project, User } from "@/types/models";

export interface BookmarkRecord {
  userId: string;
  projectId: string;
  createdAt: string;
}

export interface InquiryRecord {
  id: string;
  userId: string;
  projectId: string;
  pitch: string;
  availability: "immediate" | "weekends" | "evenings";
  relevantTech: string;
  createdAt: string;
}

export interface Database {
  users: User[];
  projects: Project[];
  bookmarks: BookmarkRecord[];
  inquiries: InquiryRecord[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

async function ensureDatabase() {
  const dataDirectory = path.dirname(DB_PATH);

  await fs.mkdir(dataDirectory, {
    recursive: true,
  });

  try {
    await fs.access(DB_PATH);
  } catch {
    const initialDatabase: Database = {
      users: [],
      projects: [],
      bookmarks: [],
      inquiries: [],
    };

    await fs.writeFile(
      DB_PATH,
      JSON.stringify(initialDatabase, null, 2),
      "utf-8",
    );
  }
}

export async function readDatabase(): Promise<Database> {
  await ensureDatabase();

  const file = await fs.readFile(DB_PATH, "utf-8");

  return JSON.parse(file) as Database;
}

export async function writeDatabase(data: Database): Promise<void> {
  await ensureDatabase();

  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function generateId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

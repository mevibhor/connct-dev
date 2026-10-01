import "server-only";

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

const JSONBIN_API_URL = "https://api.jsonbin.io/v3/b";
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

function getJsonBinUrl(version = "latest") {
  if (!JSONBIN_BIN_ID) {
    throw new Error("JSONBIN_BIN_ID is not configured");
  }

  return `${JSONBIN_API_URL}/${JSONBIN_BIN_ID}/${version}`;
}

function getHeaders(): HeadersInit {
  if (!JSONBIN_API_KEY) {
    throw new Error("JSONBIN_API_KEY is not configured");
  }

  return {
    "Content-Type": "application/json",
    "X-Master-Key": JSONBIN_API_KEY,
  };
}

export async function readDatabase(): Promise<Database> {
  const response = await fetch(getJsonBinUrl(), {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to read database from JSONBin: ${response.status} ${errorText}`,
    );
  }

  const result = (await response.json()) as {
    record?: Database;
  };

  if (!result.record) {
    throw new Error("JSONBin returned an invalid database response");
  }

  return result.record;
}

export async function writeDatabase(data: Database): Promise<void> {
  if (!JSONBIN_BIN_ID) {
    throw new Error("JSONBIN_BIN_ID is not configured");
  }

  const response = await fetch(`${JSONBIN_API_URL}/${JSONBIN_BIN_ID}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to write database to JSONBin: ${response.status} ${errorText}`,
    );
  }
}

export function generateId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

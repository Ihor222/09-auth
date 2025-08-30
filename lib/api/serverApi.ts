import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

// --- отримати список нотаток ---
export const getNotesServer = async (): Promise<Note[]> => {
  const cookieStore = await cookies();
  const { data } = await api.get("/notes", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

// --- отримати профіль користувача ---
export const getProfileServer = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

// --- перевірка сесії ---
export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const response = await api.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
    validateStatus: () => true,
  });
  return response;
};

// --- отримати нотатку за id ---
export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const { data } = await api.get(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

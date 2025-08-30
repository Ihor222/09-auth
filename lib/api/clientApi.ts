"use client";

import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";

// --- тип для відповіді при отриманні списку нотаток ---
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// --- Auth ---
export const signUp = async <T = any>(data: { email: string; password: string }): Promise<T> => {
  const { data: user } = await api.post("/auth/register", data);
  return user;
};

export const signIn = async <T = any>(data: { email: string; password: string }): Promise<T> => {
  const { data: user } = await api.post("/auth/login", data);
  return user;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async <T = any>(): Promise<T> => {
  const { data } = await api.get("/auth/session");
  return data;
};

// --- Notes ---
export const fetchNotes = async (
  page: number = 1,
  search?: string,
  tag?: NoteTag
): Promise<FetchNotesResponse> => {
  const params: Record<string, any> = { page };
  if (search) params.search = search;
  if (tag) params.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: { title: string; content: string; tag: NoteTag }): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

// --- Profile ---
export const getProfile = async <T = any>(): Promise<T> => {
  const { data } = await api.get("/users/me");
  return data;
};

export const updateProfile = async (profile: { username: string }): Promise<any> => {
  const { data } = await api.patch("/users/me", profile);
  return data;
};

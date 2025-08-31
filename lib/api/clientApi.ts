import { Note, NoteTag } from "@/types/note";
import { api } from "./api";
import { User } from "@/types/user";

export const checkServerSession = async (
  cookieHeader?: string
): Promise<User | null> => {
  try {
    const { data } = await api.get("/auth/session", {
      headers: { Cookie: cookieHeader || "" },
      withCredentials: true,
    });

    return data || null;
  } catch {
    return null;
  }
};


interface UserInfo {
  isAuth: boolean;
  user?: User;
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>("/auth/login", { email, password });
  return data;
}

export async function register(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>("/auth/register", { email, password });
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout", {}, { withCredentials: true });
}

export async function checkSession(): Promise<UserInfo> {
  const { data } = await api.get<UserInfo>("/auth/session");
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateUserProfile(payload: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}

export interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const createNote = async (note: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string) => {
  const response = await api.delete<{ success: boolean }>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { page, search, tag } = params;

  const queryParams: Record<string, string | number> = {
    page,
  };

  if (search?.trim()) {
    queryParams.search = search;
  }

  if (tag && tag !== "All") {
    queryParams.tag = tag;
  }

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: queryParams,
  });
  return data;
};
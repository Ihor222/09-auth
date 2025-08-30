import { cookies } from "next/headers";
import { api } from "./api";

// --- окремі експортовані методи ---
export const getNotesServer = async () => {
  const cookieStore = cookies();
  const { data } = await api.get("/notes", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const getProfileServer = async () => {
  const cookieStore = cookies();
  const { data } = await api.get("/users/profile", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const checkServerSession = async () => {
  const cookieStore = cookies();
  const response = await api.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
    validateStatus: () => true,
  });
  return response;
};

export const fetchNoteByIdServer = async (id: string) => {
  try {
    const cookieStore = cookies();
    const { data } = await api.get(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return data;
  } catch (error) {
    throw error;
  }
};


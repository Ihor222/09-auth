import { cookies } from "next/headers";
import { api } from "./api";

export const serverApi = {
  async getNotes() {
    const cookieStore = cookies();
    const { data } = await api.get("/notes", {
      headers: { Cookie: cookieStore.toString() },
    });
    return data;
  },

  async getProfile() {
    const cookieStore = cookies();
    const { data } = await api.get("/users/profile", {
      headers: { Cookie: cookieStore.toString() },
    });
    return data;
  },

  async checkServerSession() {
    const cookieStore = cookies();
    const response = await api.get("/auth/session", {
      headers: { Cookie: cookieStore.toString() },
      validateStatus: () => true, 
    });
    return response;
  },

  async fetchNoteById(id: string) {
    const cookieStore = cookies();
    const { data } = await api.get(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return data;
  },
};

"use client";

import { api } from "./api";

export const clientApi = {
  async signUp(data: { email: string; password: string }) {
    const { data: user } = await api.post("/auth/register", data, {
      withCredentials: true, // щоб токен писався в cookies
    });
    return user;
  },

  async signIn(data: { email: string; password: string }) {
    const { data: user } = await api.post("/auth/login", data, {
      withCredentials: true, // щоб токен писався в cookies
    });
    return user;
  },

  async getNotes() {
    const { data } = await api.get("/notes");
    return data;
  },

  async getProfile() {
    const { data } = await api.get("/users/profile");
    return data;
  },

  async updateProfile(profile: { username: string; email: string }) {
    const { data } = await api.put("/users/profile", profile);
    return data;
  },

  async createNote(note: { title: string; content: string }) {
    const { data } = await api.post("/notes", note);
    return data;
  },

  async deleteNote(id: string) {
    const { data } = await api.delete(`/notes/${id}`);
    return data;
  },
};

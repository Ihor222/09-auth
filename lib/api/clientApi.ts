"use client";

import { api } from "./api";

export const signUp = async (data: { email: string; password: string }) => {
  const { data: user } = await api.post("/auth/register", data, {
    withCredentials: true,
  });
  return user;
};

export const signIn = async (data: { email: string; password: string }) => {
  const { data: user } = await api.post("/auth/login", data, {
    withCredentials: true,
  });
  return user;
};

export const getNotes = async () => {
  const { data } = await api.get("/notes");
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/users/profile");
  return data;
};

export const updateProfile = async (profile: { username: string; email: string }) => {
  const { data } = await api.put("/users/profile", profile);
  return data;
};

export const createNote = async (note: { title: string; content: string }) => {
  const { data } = await api.post("/notes", note);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string) => {
  try {
    const { data } = await api.get(`/notes/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};


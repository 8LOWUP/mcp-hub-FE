// lib/serverAxios.ts (SSR-safe)
import axios from "axios";

export const serverAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { Accept: "application/json" },
});
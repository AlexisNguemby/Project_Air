import { AUTH_ROUTES } from "./authRoutes.js";

export const AUTH_API_BASE_URL = "http://localhost:3000";

export async function register(body: {
  account_name: string;
  mail: string;
  password: string;
}) {
  const response = await fetch(`${AUTH_API_BASE_URL}${AUTH_ROUTES.register}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

export async function login(body: { mail: string; password: string }) {
  const response = await fetch(`${AUTH_API_BASE_URL}${AUTH_ROUTES.login}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

export async function me(token: string) {
  const response = await fetch(`${AUTH_API_BASE_URL}${AUTH_ROUTES.me}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
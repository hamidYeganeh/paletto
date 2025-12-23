import { endpoints } from "../../client/endpoints";
import { http } from "../../client/http";
import type { User } from "../users/users.types";
import type { LoginPayload, LoginResponse, Session } from "./auth.types";

export async function login(payload: LoginPayload): Promise<Session> {
  const response = await http.post<LoginResponse, LoginPayload>(
    endpoints.auth.login,
    payload
  );
  return { token: response.token };
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await http.get<{ data: User }>(endpoints.auth.me);
  return response.data;
}

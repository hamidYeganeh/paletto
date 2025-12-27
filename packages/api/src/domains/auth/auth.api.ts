import { endpoints } from "../../client/endpoints";
import { http } from "../../client/http";
import { setAuthToken } from "../../session";
import type {
  SignInPayload,
  SignInResponse,
  Session,
} from "./auth.types";
import type { UserProfileResponse } from "../users/users.types";

export async function signIn(payload: SignInPayload): Promise<Session> {
  const response = await http.post<SignInResponse, SignInPayload>(
    endpoints.auth.signIn,
    payload
  );
  setAuthToken(response.token);
  return response;
}

export async function fetchCurrentUser(): Promise<UserProfileResponse> {
  const response = await http.get<UserProfileResponse>(endpoints.auth.me);
  return response;
}

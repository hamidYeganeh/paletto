import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "../../client/http";
import { fetchCurrentUser, login } from "./auth.api";
import { authKeys } from "./auth.keys";
import type { LoginPayload, Session } from "./auth.types";
import type { User } from "../users/users.types";

export function useCurrentUser(options?: UseQueryOptions<User, ApiError>) {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000,
    ...options,
  });
}

export function useLogin(
  options?: UseMutationOptions<Session, ApiError, LoginPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: login,
    ...options,
    onSuccess: (session, variables, onMutateResult, mutationContext) => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      options?.onSuccess?.(session, variables, onMutateResult, mutationContext);
    },
  });
}

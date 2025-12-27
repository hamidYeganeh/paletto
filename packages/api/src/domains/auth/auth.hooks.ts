import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "../../client/http";
import { fetchCurrentUser, signIn } from "./auth.api";
import { authKeys } from "./auth.keys";
import type { SignInPayload, Session } from "./auth.types";
import type { UserProfileResponse } from "../users/users.types";

export function useCurrentUser(
  options?: UseQueryOptions<UserProfileResponse, ApiError>
) {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000,
    ...options,
  });
}

export function useSignIn(
  options?: UseMutationOptions<Session, ApiError, SignInPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authKeys.signIn(),
    mutationFn: signIn,
    ...options,
    onSuccess: (session, variables, onMutateResult, mutationContext) => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      options?.onSuccess?.(session, variables, onMutateResult, mutationContext);
    },
  });
}

type KeyPart = string | number | boolean | Record<string, unknown>;

export function createQueryKeys<TPrefix extends string>(prefix: TPrefix) {
  const base = [prefix] as const;

  return {
    base,
    detail: (...parts: KeyPart[]) => [prefix, ...parts] as const,
  };
}

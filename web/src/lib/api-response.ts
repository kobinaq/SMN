type JsonBody = Record<string, unknown>;

export function okJson(data: JsonBody = { ok: true }, status = 200) {
  return Response.json(data, { status });
}

export function failJson(error: string, status = 400, extras: JsonBody = {}) {
  return Response.json({ error, ...extras }, { status });
}

export function logServerError(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`[${scope}]`, message);
}

export async function withMutationGuard<T>(
  scope: string,
  run: () => Promise<T>,
  mapSuccess: (value: T) => JsonBody = () => ({ ok: true }),
) {
  try {
    const value = await run();
    return okJson(mapSuccess(value));
  } catch (error) {
    logServerError(scope, error);
    return failJson("Something went wrong. Please try again.", 500);
  }
}

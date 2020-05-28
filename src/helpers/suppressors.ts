export async function resolveOrNull<T>(promiseToResolve: Promise<T>): Promise<T | null> {
  try {
    return await promiseToResolve;
  } catch {
    return null;
  }
}

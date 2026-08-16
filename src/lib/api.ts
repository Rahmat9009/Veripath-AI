/**
 * Where the backend lives.
 *
 * The frontend and the API used to be one Express process on one origin, so
 * every call could be a bare `/api/...` path. The backend is deployed
 * separately now, and a relative path on Vercel resolves to the static site —
 * which has no /api routes and answers 404. That 404 is what put Verified
 * Updates into its "Backend unavailable" state.
 *
 * VITE_API_BASE_URL names the backend origin. Vite inlines it at BUILD time,
 * so it must be set in the Vercel project's environment variables before the
 * build runs, not at runtime.
 *
 * Unset — which is the case for `npm run dev`, where server.ts serves the
 * frontend and the API from the same Express process — the base is empty and
 * every URL below stays exactly the relative path it is today. Local
 * development is unchanged.
 */
const RAW_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

/** No trailing slash, so joining never produces `//api/...`. */
const API_BASE = RAW_BASE.replace(/\/+$/, '');

/**
 * `/api/news-feed` -> `https://api.example.com/api/news-feed`, or unchanged
 * when no base is set.
 */
export function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * fetch, against the API origin.
 *
 * A thin pass-through on purpose: every caller keeps its own method, headers,
 * body, response parsing and error handling. This changes where the request
 * goes and nothing else — including the failures. A request that cannot be
 * made still rejects, so the callers' existing "Backend unavailable" states
 * are reached exactly as before rather than being papered over here.
 */
export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}

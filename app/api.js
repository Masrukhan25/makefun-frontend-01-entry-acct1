const origin = 'https://make.fun/api';
const cache = new Map();
const pending = new Map();
export async function fetchJSON(path) {
  const url = origin + path;
  if (pending.has(url)) return pending.get(url);
  const request = (async () => {
    const saved = cache.get(url);
    const response = await fetch(url, { method: 'GET', headers: saved?.etag ? { 'If-None-Match': saved.etag } : {}, signal: AbortSignal.timeout(20000) });
    if (response.status === 304 && saved) return saved.data;
    if (!response.ok) throw new Error(`make.fun returned ${response.status}. Please try again.`);
    const data = await response.json();
    cache.set(url, { etag: response.headers.get('etag'), data });
    return data;
  })();
  pending.set(url, request);
  try { return await request; } finally { pending.delete(url); }
}
export const listCompetitions = () => fetchJSON('/competitions?limit=100');
export const getCompetition = slug => fetchJSON('/competitions/' + encodeURIComponent(slug));
export const getLeaderboard = slug => fetchJSON('/competitions/' + encodeURIComponent(slug) + '/leaderboard?limit=1000');
let profilePath;
export async function getProfile(handle) {
  if (!profilePath) {
    const schema = await fetchJSON('/openapi.json');
    profilePath = Object.keys(schema.paths || {}).find(path => /\/(agents|profiles)\/\{(handle|username)\}$/.test(path) && schema.paths[path].get);
    if (!profilePath) profilePath = Object.keys(schema.paths || {}).find(path => /\/(agents|profiles)\/\{[^}]+\}$/.test(path) && schema.paths[path].get);
    if (!profilePath) throw new Error('The public profile endpoint could not be found in make.fun’s API schema.');
  }
  return fetchJSON(profilePath.replace(/^\/api/, '').replace(/\{[^}]+\}/, encodeURIComponent(handle.replace(/^@/, ''))));
}

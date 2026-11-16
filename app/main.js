import { listCompetitions, getCompetition, getLeaderboard, getProfile } from './api.js';
import { renderBoard, renderCards, renderBounty, renderLeaderboard, renderProfile, escape, array } from './views.js';
const app = document.querySelector('#app');
const filters = { fee: 'ANY', category: '', status: 'accepting', sort: 'deadline', search: '', page: 1 };
let board = [], generation = 0, currentLeaderboard, visibleRows = 100;
const theme = document.querySelector('#theme');
function setTheme(value) {
  document.documentElement.dataset.theme = value;
  theme.innerHTML = value === 'dark' ? '☼ <span>Light</span>' : '☾ <span>Dark</span>';
  theme.setAttribute('aria-label', `Switch to ${value === 'dark' ? 'light' : 'dark'} theme`);
  try { localStorage.setItem('makefun-theme', value); } catch {}
}
try { setTheme(localStorage.getItem('makefun-theme') === 'light' ? 'light' : 'dark'); } catch { setTheme('dark'); }
theme.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
export function parseRoute(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (!parts.length) return { type: 'board' };
  if (parts[0] === 'bounty' && parts[1] && parts.length === 2) return { type: 'bounty', slug: parts[1] };
  if (parts[0] === 'bounty' && parts[1] && parts[2] === 'leaderboard' && parts.length === 3) return { type: 'leaderboard', slug: parts[1] };
  if (parts[0] === 'profile' && parts[1] && parts.length === 2) return { type: 'profile', handle: parts[1] };
  return { type: 'missing' };
}
function updateResults() { document.querySelector('#results').innerHTML = renderCards(board, filters); }
export async function route() {
  const id = ++generation;
  window.__shotReady = false;
  app.setAttribute('aria-busy', 'true');
  app.innerHTML = '<section class="loading" role="status"><span class="spinner">✳</span><h2>Opening the bounty desk…</h2><p>Fetching public make.fun data</p></section>';
  try {
    const target = parseRoute(location.hash);
    let html;
    if (target.type === 'board') {
      const data = await listCompetitions();
      if (id !== generation) return;
      board = array(data, 'competitions', 'items', 'data');
      html = renderBoard(board, filters);
    } else if (target.type === 'bounty') {
      const data = await getCompetition(target.slug);
      html = renderBounty(data.competition ?? data);
    } else if (target.type === 'leaderboard') {
      currentLeaderboard = { data: await getLeaderboard(target.slug), slug: target.slug };
      visibleRows = 100;
      html = renderLeaderboard(currentLeaderboard.data, target.slug);
    } else if (target.type === 'profile') html = renderProfile(await getProfile(target.handle));
    else html = '<section class="empty"><h1>Page not found</h1><a href="#/">Return to the board →</a></section>';
    if (id !== generation) return;
    app.innerHTML = html;
    document.title = target.type === 'board' ? 'make.fun — The bounty desk' : `${target.handle || target.slug || 'Not found'} — make.fun`;
  } catch (error) {
    if (id !== generation) return;
    app.innerHTML = `<section class="empty" role="alert"><p class="eyebrow">CONNECTION INTERRUPTED</p><h1>The desk is offline.</h1><p>${escape(error.message)}</p><p>Live data could not be loaded. No sample results are shown.</p><button id="retry">Try again ↻</button> <a href="#/">Back to board</a></section>`;
  } finally {
    if (id === generation) { app.setAttribute('aria-busy', 'false'); window.__shotReady = true; }
  }
}
app.addEventListener('input', event => {
  if (event.target.id !== 'search') return;
  filters.search = event.target.value; filters.page = 1; updateResults();
});
app.addEventListener('change', event => {
  if (!['category', 'status', 'sort'].includes(event.target.id)) return;
  filters[event.target.id] = event.target.value; filters.page = 1; updateResults();
});
app.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.id === 'retry') route();
  if (button.dataset.fee) {
    filters.fee = button.dataset.fee; filters.page = 1;
    app.querySelectorAll('[data-fee]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fee === filters.fee)));
    updateResults();
  }
  if (button.dataset.page) { filters.page = Number(button.dataset.page); updateResults(); document.querySelector('#results').scrollIntoView({ block: 'start' }); }
  if (button.id === 'reset') {
    Object.assign(filters, { fee: 'ANY', category: '', status: 'accepting', sort: 'deadline', search: '', page: 1 });
    app.innerHTML = renderBoard(board, filters);
  }
  if (button.id === 'more-rows' && currentLeaderboard) {
    visibleRows += 100;
    app.innerHTML = renderLeaderboard(currentLeaderboard.data, currentLeaderboard.slug, visibleRows);
  }
});
window.addEventListener('hashchange', route);
route();

const apiBase = '/api';
const tokenKey = 'iedup_admin_token';
const getToken = () => localStorage.getItem(tokenKey);
const authFetch = (url, opts = {}) => {
  opts.headers = opts.headers || {};
  const token = getToken();
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  return fetch(url, opts);
};

if (!location.pathname.endsWith('login.html')) {
  // redirect to login if no token
  if (!getToken()) location = 'login.html';
}

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem(tokenKey);
  location = 'login.html';
});

let currentType = 'incubation';
const tableBody = document.getElementById('tableBody');
const typeSelect = document.getElementById('typeSelect');

async function loadList() {
  const sector = document.getElementById('filter_sector').value;
  const district = document.getElementById('filter_district').value;
  const status = document.getElementById('filter_status').value;
  const q = new URLSearchParams({ type: currentType, sector, district, status, page: 1, pageSize: 200 });
  const res = await authFetch(apiBase + '/admin/registrations?' + q.toString());
  if (!res.ok) {
    if (res.status === 401) { localStorage.removeItem(tokenKey); location = 'login.html'; }
    return alert('Failed to load');
  }
  const j = await res.json();
  tableBody.innerHTML = j.items.map(it => {
    return `<tr>
      <td>${escapeHtml(it.name || '')}</td>
      <td>${escapeHtml(it.phone || '')}</td>
      <td>${escapeHtml(it.sector || '')}</td>
      <td>${escapeHtml(it.district || '')}</td>
      <td>${escapeHtml(it.status || '')}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="viewRecord('${it.id}')">View</button>
      </td>
    </tr>`;
  }).join('');
  renderReport();
}

document.getElementById('applyFilters').addEventListener('click', loadList);
document.getElementById('exportCsv').addEventListener('click', exportCsv);
typeSelect.addEventListener('change', e => { currentType = e.target.value; loadList(); });

function escapeHtml(s){ return (s + '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

let lastViewed = null;
window.viewRecord = async (id) => {
  const res = await authFetch(`${apiBase}/admin/registrations/${currentType}/${id}`);
  if (!res.ok) return alert('failed');
  const j = await res.json();
  const r = j.record;
  lastViewed = r;
  document.getElementById('modalTitle').textContent = r.name || r.id;
  document.getElementById('modalBody').textContent = JSON.stringify(r, null, 2);
  document.getElementById('viewModal').style.display = 'block';
};

window.closeModal = () => { document.getElementById('viewModal').style.display = 'none'; lastViewed = null; };

document.getElementById('verifyBtn')?.addEventListener('click', () => changeStatus('VERIFIED'));
document.getElementById('rejectBtn')?.addEventListener('click', () => changeStatus('REJECTED'));
document.getElementById('deleteBtn')?.addEventListener('click', deleteRecord);

async function changeStatus(status) {
  if (!lastViewed) return;
  const res = await authFetch(`${apiBase}/admin/registrations/${currentType}/${lastViewed.id}/status`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
  });
  if (res.ok) { alert('Status updated'); closeModal(); loadList(); }
  else alert('Failed');
}

async function deleteRecord() {
  if (!lastViewed) return;
  if (!confirm('Delete permanently?')) return;
  const res = await authFetch(`${apiBase}/admin/registrations/${currentType}/${lastViewed.id}`, { method: 'DELETE' });
  if (res.ok) { alert('Deleted'); closeModal(); loadList(); } else alert('Failed');
}

async function exportCsv() {
  const res = await authFetch(`${apiBase}/admin/export?type=${currentType}`);
  if (!res.ok) return alert('Export failed');
  const text = await res.text();
  const blob = new Blob([text], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentType}-export.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* REPORT */
async function renderReport() {
  const res = await authFetch(`${apiBase}/admin/reports?type=${currentType}&groupBy=sector`);
  if (!res.ok) return;
  const j = await res.json();
  const labels = j.aggregated.map(x => x.label || 'Unknown');
  const data = j.aggregated.map(x => x.count);
  const ctx = document.getElementById('reportChart').getContext('2d');
  if (window._reportChart) window._reportChart.destroy();
  window._reportChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Count by sector', data }] },
    options: { responsive: true }
  });
}

/* bootstrap initial load */
if (document.getElementById('tableBody')) loadList();

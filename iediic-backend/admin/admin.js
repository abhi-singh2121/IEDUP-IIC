// admin/admin.js
(async function () {
  const tableWrap = document.getElementById('tableWrap');
  const qInput = document.getElementById('q');
  const typeFilter = document.getElementById('typeFilter');
  const btnSearch = document.getElementById('btnSearch');
  const btnExport = document.getElementById('btnExport');
  const btnRefresh = document.getElementById('btnRefresh');

  async function fetchList() {
    const q = qInput.value.trim();
    const type = typeFilter.value;
    const url = `/api/admin/forms?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}&limit=500`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      renderTable(json.rows || []);
    } catch (err) {
      tableWrap.innerHTML = `<div class="p-4 text-danger">Failed to load: ${err.message}</div>`;
    }
  }

  function renderTable(rows) {
    if (!rows.length) {
      tableWrap.innerHTML = `<div class="p-4 text-center text-muted">No submissions found</div>`;
      return;
    }
    const html = ['<table class="table table-sm mb-0"><thead class="table-light"><tr><th>#</th><th>Type</th><th>Name</th><th>Startup</th><th>Email</th><th>Stage</th><th>Status</th><th>Submitted</th><th>Action</th></tr></thead><tbody>'];
    rows.forEach((r, i) => {
      html.push(`<tr>
        <td>${i+1}</td>
        <td>${escapeHtml(r.formType)}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${escapeHtml(r.startup_name || '')}</td>
        <td>${escapeHtml(r.email)}</td>
        <td>${escapeHtml(r.stage || '')}</td>
        <td>${escapeHtml(r.status || '')}</td>
        <td>${new Date(r.createdAt).toLocaleString()}</td>
        <td><button class="btn btn-sm btn-outline-primary view-btn" data-id="${r._id}">View</button></td>
      </tr>`);
    });
    html.push('</tbody></table>');
    tableWrap.innerHTML = html.join('');
    document.querySelectorAll('.view-btn').forEach(b => b.addEventListener('click', viewHandler));
  }

  function escapeHtml(s) {
    return s ? s.toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) : '';
  }

  async function viewHandler(e) {
    const id = e.currentTarget.dataset.id;
    const res = await fetch(`/api/admin/forms/${id}`);
    const row = await res.json();
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
      <dl class="row">
        <dt class="col-sm-3">Name</dt><dd class="col-sm-9">${escapeHtml(row.name)}</dd>
        <dt class="col-sm-3">Email</dt><dd class="col-sm-9">${escapeHtml(row.email)}</dd>
        <dt class="col-sm-3">Phone</dt><dd class="col-sm-9">${escapeHtml(row.phone)}</dd>
        <dt class="col-sm-3">Startup</dt><dd class="col-sm-9">${escapeHtml(row.startup_name || '')}</dd>
        <dt class="col-sm-3">Stage</dt><dd class="col-sm-9">${escapeHtml(row.stage || '')}</dd>
        <dt class="col-sm-3">Idea</dt><dd class="col-sm-9"><pre style="white-space:pre-wrap;">${escapeHtml(row.idea)}</pre></dd>
        <dt class="col-sm-3">Status</dt><dd class="col-sm-9">${escapeHtml(row.status)}</dd>
      </dl>
    `;
    document.getElementById('modalStatus').value = row.status || 'new';
    const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
    detailModal.show();
    document.getElementById('saveStatus').onclick = async () => {
      const newStatus = document.getElementById('modalStatus').value;
      await fetch(`/api/admin/forms/${id}/status`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ status: newStatus })
      });
      detailModal.hide();
      fetchList();
    };
  }

  btnSearch.addEventListener('click', fetchList);
  btnRefresh.addEventListener('click', () => { qInput.value = ''; typeFilter.value = ''; fetchList(); });

  btnExport.addEventListener('click', async () => {
    const q = qInput.value.trim();
    const type = typeFilter.value;
    const url = `/api/admin/forms?export=csv&q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`;
    try {
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = `forms_export_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  });

  // initial load
  fetchList();
})();

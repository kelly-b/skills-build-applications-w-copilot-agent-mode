import React, { useMemo, useState } from 'react';

const PREFERRED_KEYS = ['name', 'title', 'username', 'email', 'label', 'id'];

function getPrimary(item) {
  if (!item || typeof item !== 'object') return String(item ?? '');
  for (const key of PREFERRED_KEYS) if (item[key]) return String(item[key]);
  for (const [, v] of Object.entries(item)) {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  }
  return JSON.stringify(item).slice(0, 60);
}

function truncate(str, n = 120) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

export default function DataTable({ title, items = [], endpoint = '', loading = false, error = null, onRefresh = null }) {
  const [filter, setFilter] = useState('');
  const [modalItem, setModalItem] = useState(null);

  const filtered = useMemo(() => {
    if (!filter) return items;
    const q = filter.toLowerCase();
    return items.filter(it => JSON.stringify(it).toLowerCase().includes(q));
  }, [items, filter]);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">{title}</h5>
            <small className="text-muted">{items.length} item(s)</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <form className="d-flex" onSubmit={e => e.preventDefault()}>
              <input
                className="form-control form-control-sm me-2"
                placeholder="Filter JSON..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                aria-label="filter"
              />
            </form>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => { setFilter(''); onRefresh && onRefresh(); }}>
              Refresh
            </button>
          </div>
        </div>

        <div className="card-body">
          <p className="text-muted">Endpoint: <code>{endpoint}</code></p>

          {loading && <div className="text-muted">Loading...</div>}
          {error && <div className="alert alert-danger">Error: {error}</div>}

          {!loading && !error && filtered.length === 0 && (
            <div className="alert alert-info">No items to show.</div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-sm align-middle">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '4%' }}>#</th>
                    <th style={{ width: '28%' }}>Primary</th>
                    <th>Preview</th>
                    <th style={{ width: '18%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => {
                    const primary = getPrimary(item);
                    const preview = JSON.stringify(item, null, 0);
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td><strong>{primary}</strong></td>
                        <td className="text-muted"><code>{truncate(preview)}</code></td>
                        <td>
                          <button className="btn btn-sm btn-primary me-2" onClick={() => setModalItem(item)}>
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => { navigator.clipboard?.writeText(JSON.stringify(item)); }}
                          >
                            Copy JSON
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal (React-controlled, no Bootstrap JS required) */}
      {modalItem && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalItem(null)}></button>
              </div>
              <div className="modal-body">
                <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '60vh', overflow: 'auto' }}>{JSON.stringify(modalItem, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalItem(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(modalItem)); }}>
                  Copy JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

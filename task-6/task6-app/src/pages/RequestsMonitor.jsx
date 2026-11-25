import React, { useState, useEffect } from 'react';
import { useRequests } from '../hooks/useRequests';
import '../App.css';

const DEFAULT_HEADERS = '{\n  "content-type": "application/json"\n}';
const DEFAULT_PAYLOAD = '{\n  "key": "value"\n}';
const PAGE_LIMIT = 15;

export default function RequestsMonitor() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'post',
    headers: DEFAULT_HEADERS,
    payload: DEFAULT_PAYLOAD,
    status: 'new',
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    type: 'post',
    headers: DEFAULT_HEADERS,
    payload: DEFAULT_PAYLOAD,
    status: 'new',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    requests,
    totalPages,
    totalItems,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    createRequest,
    isCreating,
    editRequest,
    isEditing,
    acceptRequest,
  } = useRequests({
    page: currentPage,
    limit: PAGE_LIMIT,
    search: debouncedSearch,
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getMethodClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'get': return 'method-get';
      case 'post': return 'method-post';
      case 'patch': return 'method-patch';
      case 'put': return 'method-put';
      case 'delete': return 'method-delete';
      default: return 'method-default';
    }
  };

  const getAcceptClass = (status) => {
    if (status === 'ACCEPTED') return 'accepted';
    if (status === 'FAILED') return 'failed';
    return 'pending';
  };

  const renderJsonBlock = (value) => {
    if (!value) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return String(value);
    }
  };

  const parseJsonFields = (headersRaw, payloadRaw) => {
    let parsedHeaders = {};
    let parsedPayload = null;

    try {
      parsedHeaders = headersRaw ? JSON.parse(headersRaw) : {};
    } catch {
      alert('Error in JSON formatt for Headers');
      return null;
    }

    try {
      parsedPayload = payloadRaw ? JSON.parse(payloadRaw) : null;
    } catch {
      alert('Error in JSON formatt for Payload');
      return null;
    }

    return { parsedHeaders, parsedPayload };
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseJsonFields(formData.headers, formData.payload);
    if (!parsed) return;

    try {
      await createRequest({
        type: formData.type,
        headers: parsed.parsedHeaders,
        payload: parsed.parsedPayload,
        status: 'new',
      });

      setIsCreateOpen(false);
      setFormData({
        type: 'post',
        headers: DEFAULT_HEADERS,
        payload: DEFAULT_PAYLOAD,
        status: 'new',
      });
    } catch (err) {
      alert(`Failed to create: ${err.message}`);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.id) {
      alert('Enter request ID');
      return;
    }

    const parsed = parseJsonFields(editFormData.headers, editFormData.payload);
    if (!parsed) return;

    const targetId = Number(editFormData.id);

    try {
      await editRequest({
        id: targetId,
        data: {
          type: editFormData.type,
          headers: parsed.parsedHeaders,
          payload: parsed.parsedPayload,
        },
      });

      setIsEditOpen(false);
      setEditFormData({
        id: '',
        type: 'post',
        headers: DEFAULT_HEADERS,
        payload: DEFAULT_PAYLOAD,
        status: 'new',
      });
    } catch (err) {
      const message = err?.message?.includes('not found') || err?.status === 404
        ? `Request with ID #${targetId} not found!`
        : err.message;
      alert(`Failed to update: ${message}`);
    }
  };

  const handleAcceptRequest = async (req) => {
    try {
      await acceptRequest(req);
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  return (
    <div className="page-wrapper">
      <header className="header">
        <div className="header-content">
          <div>
            <h1 className="title">Requests Monitor</h1>
            <p className="subtitle">
              Requests amount: <strong>{totalItems}</strong>
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="reload-btn"
          >
            {isFetching ? 'Updating...' : 'Update'}
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="search-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by method (POST, GET), headers or payload..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search-btn"
              >
                ✖
              </button>
            )}
          </div>
        </div>

        {isLoading && <div className="info-box">Loading...</div>}
        {isError && (
          <div className="info-box info-box-error">
            {error?.message || 'Failed to load data'}
          </div>
        )}

        {!isLoading && !isError && requests.length === 0 && (
          <div className="info-box">
            {debouncedSearch
              ? `Not found "${debouncedSearch}"`
              : 'No requests'}
          </div>
        )}

        <div className="actions-bar">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="create-btn"
          >
            Add Request
          </button>
          <button
            onClick={() => setIsEditOpen(true)}
            className="edit-btn"
          >
            Edit Request
          </button>
        </div>

        {!isLoading && !isError && requests.length > 0 && (
          <>
            <div className="grid">
              {requests.map((req) => (
                <div key={req.id} className="card">
                  <div className="card-header">
                    <span className="id-badge">ID #{req.id}</span>
                    <span className={`method-badge ${getMethodClass(req.type || 'GET')}`}>
                      {req.type ? String(req.type).toUpperCase() : 'UNKNOWN'}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      <span className="label">Status:</span>
                      <span className="status-badge">
                        {req.status ? String(req.status) : 'new'}
                      </span>
                    </div>

                    <div className="row">
                      <span className="label">Payload Size:</span>
                      <span className="value">{req.size ?? 0} bytes</span>
                    </div>

                    <div className="section">
                      <span className="section-title">Headers:</span>
                      <pre className="code-block">
                        {renderJsonBlock(req.headers)}
                      </pre>
                    </div>

                    <div className="section">
                      <span className="section-title">Payload:</span>
                      <pre className="code-block">
                        {renderJsonBlock(req.payload)}
                      </pre>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className={`accept-card-btn ${getAcceptClass(req.status)}`}
                    >
                      {req.status === 'ACCEPTED'
                        ? 'Accepted'
                        : req.status === 'FAILED'
                          ? 'Failed'
                          : 'Accept Request'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-button"
                >
                  ← Back
                </button>

                <span className="page-info">
                  Page <strong>{currentPage}</strong> from <strong>{totalPages}</strong>
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="page-button"
                >
                  Forward →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {isCreateOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">New Request</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="close-btn"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="modal-form">
              <div className="form-group">
                <label className="label">Request Type (Method):</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="select-input"
                >
                  <option value="get">GET</option>
                  <option value="post">POST</option>
                  <option value="put">PUT</option>
                  <option value="patch">PATCH</option>
                  <option value="delete">DELETE</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Headers (JSON):</label>
                <textarea
                  rows={3}
                  value={formData.headers}
                  onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                  className="textarea-input"
                />
              </div>

              <div className="form-group">
                <label className="label">Payload (JSON):</label>
                <textarea
                  rows={4}
                  value={formData.payload}
                  onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                  className="textarea-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="submit-btn"
                >
                  {isCreating ? 'Saving...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Request Editing</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="close-btn"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label className="label">Request ID for editing:*</label>
                <input
                  type="number"
                  required
                  placeholder="Enter ID"
                  value={editFormData.id}
                  onChange={(e) => setEditFormData({ ...editFormData, id: e.target.value })}
                  className="text-input"
                />
              </div>

              <div className="form-group">
                <label className="label">New Type (Method):</label>
                <select
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  className="select-input"
                >
                  <option value="get">GET</option>
                  <option value="post">POST</option>
                  <option value="put">PUT</option>
                  <option value="patch">PATCH</option>
                  <option value="delete">DELETE</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Headers (JSON):</label>
                <textarea
                  rows={3}
                  value={editFormData.headers}
                  onChange={(e) => setEditFormData({ ...editFormData, headers: e.target.value })}
                  className="textarea-input"
                />
              </div>

              <div className="form-group">
                <label className="label">Payload (JSON):</label>
                <textarea
                  rows={4}
                  value={editFormData.payload}
                  onChange={(e) => setEditFormData({ ...editFormData, payload: e.target.value })}
                  className="textarea-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="submit-edit-btn"
                >
                  {isEditing ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
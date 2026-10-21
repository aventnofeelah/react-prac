import React, { useState, useEffect } from 'react';
import { getItemsList, getItem, updateItem, createItem } from './api/fakeApi.js';

export default function App() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 15;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'post',
    headers: '{\n  "content-type": "application/json"\n}',
    payload: '{\n  "key": "value"\n}',
    status: 'new'
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    type: 'post',
    headers: '{\n  "content-type": "application/json"\n}',
    payload: '{\n  "key": "value"\n}',
    status: 'new'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchRequests = async (page, search, signal) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('page', page);
      params.set('limit', limit);

      const response = await getItemsList(params.toString(), { signal });

      if (response && Array.isArray(response.data)) {
        setRequests(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.total || 0);
      } else if (Array.isArray(response)) {
        setRequests(response);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Ошибка загрузки данных');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchRequests(currentPage, debouncedSearch, controller.signal);

    return () => controller.abort();
  }, [currentPage, debouncedSearch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getMethodColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'get': return '#2e7d32';
      case 'post': return '#1976d2';
      case 'patch': return '#ed6c02';
      case 'put': return '#0288d1';
      case 'delete': return '#d32f2f';
      default: return '#757575';
    }
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      let parsedHeaders = {};
      let parsedPayload = null;

      try {
        parsedHeaders = formData.headers ? JSON.parse(formData.headers) : {};
      } catch {
        alert('Ошибка в формате JSON для Headers');
        setCreateLoading(false);
        return;
      }

      try {
        parsedPayload = formData.payload ? JSON.parse(formData.payload) : null;
      } catch {
        alert('Ошибка в формате JSON для Payload');
        setCreateLoading(false);
        return;
      }

      await createItem({
        type: formData.type,
        headers: parsedHeaders,
        payload: parsedPayload,
        status: "new"
      });

      setIsCreateOpen(false);
      setFormData({
        type: 'post',
        headers: '{\n  "content-type": "application/json"\n}',
        payload: '{\n  "key": "value"\n}',
      });

      fetchRequests(currentPage, debouncedSearch);
    } catch (err) {
      alert(`Ошибка создания: ${err.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.id) {
      alert('Пожалуйста, укажите ID запроса');
      return;
    }

    setEditLoading(true);

    try {
      const targetId = Number(editFormData.id);

      try {
        await getItem(targetId);
      } catch {
        alert(`Ошибка редактирования: Запрос с ID #${targetId} не найден!`);
        setEditLoading(false);
        return;
      }

      let parsedHeaders = {};
      let parsedPayload = null;

      try {
        parsedHeaders = editFormData.headers ? JSON.parse(editFormData.headers) : {};
      } catch {
        alert('Ошибка в формате JSON для Headers');
        setEditLoading(false);
        return;
      }

      try {
        parsedPayload = editFormData.payload ? JSON.parse(editFormData.payload) : null;
      } catch {
        alert('Ошибка в формате JSON для Payload');
        setEditLoading(false);
        return;
      }

      await updateItem(targetId, {
        type: editFormData.type,
        headers: parsedHeaders,
        payload: parsedPayload
      });

      setIsEditOpen(false);
      
      setEditFormData({
        id: '',
        type: 'post',
        headers: '{\n  "content-type": "application/json"\n}',
        payload: '{\n  "key": "value"\n}'
      });

      fetchRequests(currentPage, debouncedSearch);
    } catch (err) {
      alert(`Ошибка обновления: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleAcceptRequest = async (req) => {
    try {
      const payloadSize = req.payload
        ? JSON.stringify(req.payload).length
        : 0;

      const newStatus = payloadSize > 15 ? 'FAILED' : 'ACCEPTED';

      await updateItem(req.id, {
        status: newStatus
      });

      fetchRequests(currentPage, debouncedSearch);
    } catch (err) {
      alert(`Ошибка обновления статуса: ${err.message}`);
    }
  };
  return (
    <div style={styles.pageWrapper}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Requests Monitor</h1>
            <p style={styles.subtitle}>
              Количество запросов: <strong>{totalItems}</strong>
            </p>
          </div>
          <button 
            onClick={() => fetchRequests(currentPage, debouncedSearch)} 
            disabled={loading}
            style={styles.reloadBtn}
          >
            {loading ? 'Обновление...' : 'Обновить'}
          </button>
        </div>
      </header>

      <main style={styles.mainContent}>
        
        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Поиск по методу (POST, GET), заголовкам или payload..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={styles.clearSearchBtn}
              >
                ✖
              </button>
            )}
          </div>
        </div>

        {loading && <div style={styles.infoBox}>Загрузка данных...</div>}
        {error && <div style={{ ...styles.infoBox, color: '#d32f2f' }}>{error}</div>}

        {!loading && !error && requests.length === 0 && (
          <div style={styles.infoBox}>
            {debouncedSearch 
              ? `Ничего не найдено по запросу "${debouncedSearch}"` 
              : 'Запросы отсутствуют'}
          </div>
        )}

        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={() => setIsCreateOpen(true)}
            style={styles.createBtn}
          >
            Добавить запрос
          </button>
          <button
            onClick={() => setIsEditOpen(true)}
            style={styles.editBtn}
          >
            Редактировать запрос
          </button>
        </div>

        {!loading && !error && requests.length > 0 && (
          <>
            <div style={styles.grid}>
              {requests.map((req) => (
                <div key={req.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={styles.idBadge}>ID #{req.id}</span>
                    <span
                      style={{
                        ...styles.methodBadge,
                        backgroundColor: getMethodColor(req.type || 'GET'),
                      }}
                    >
                      {req.type ? String(req.type).toUpperCase() : 'UNKNOWN'}
                    </span>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.row}>
                      <span style={styles.label}>Status:</span>
                      <span style={styles.statusBadge}>
                        {req.status ? String(req.status) : 'new'}
                      </span>
                    </div>

                    <div style={styles.row}>
                      <span style={styles.label}>Payload Size:</span>
                      <span style={styles.value}>{req.size ?? 0} bytes</span>
                    </div>

                    <div style={styles.section}>
                      <span style={styles.sectionTitle}>Headers:</span>
                      <pre style={styles.codeBlock}>
                        {renderJsonBlock(req.headers)}
                      </pre>
                    </div>

                    <div style={styles.section}>
                      <span style={styles.sectionTitle}>Payload:</span>
                      <pre style={styles.codeBlock}>
                        {renderJsonBlock(req.payload)}
                      </pre>
                    </div>
                  </div>
                  <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f3f5' }}>
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      style={{
                        ...styles.acceptCardBtn,
                        backgroundColor: req.status === 'ACCEPTED' ? '#2b8a3e' : req.status === 'FAILED' ? '#e03131' : '#228be6'
                      }}
                    >
                      {req.status === 'ACCEPTED' ? 'Accepted' : req.status === 'FAILED' ? 'Failed' : 'Accept Request'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    ...styles.pageButton,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ← Назад
                </button>

                <span style={styles.pageInfo}>
                  Страница <strong>{currentPage}</strong> из <strong>{totalPages}</strong>
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.pageButton,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Вперед →
                </button>
              </div>
            )}
          </>
        )}
      </main>
      {isCreateOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>НовыйЗапрос</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                style={styles.closeBtn}
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Тип запроса (Method):</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={styles.selectInput}
                >
                  <option value="get">GET</option>
                  <option value="post">POST</option>
                  <option value="put">PUT</option>
                  <option value="patch">PATCH</option>
                  <option value="delete">DELETE</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Headers (JSON):</label>
                <textarea
                  rows={3}
                  value={formData.headers}
                  onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                  style={styles.textareaInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Payload (JSON):</label>
                <textarea
                  rows={4}
                  value={formData.payload}
                  onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                  style={styles.textareaInput}
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  style={styles.cancelBtn}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  style={styles.submitBtn}
                >
                  {createLoading ? 'Сохранение...' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Редактирование Запроса</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                style={styles.closeBtn}
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>ID запроса для редактирования:*</label>
                <input
                  type="number"
                  required
                  placeholder="Введите ID (например, 1)"
                  value={editFormData.id}
                  onChange={(e) => setEditFormData({ ...editFormData, id: e.target.value })}
                  style={styles.textInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Новый тип (Method):</label>
                <select
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  style={styles.selectInput}
                >
                  <option value="get">GET</option>
                  <option value="post">POST</option>
                  <option value="put">PUT</option>
                  <option value="patch">PATCH</option>
                  <option value="delete">DELETE</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Headers (JSON):</label>
                <textarea
                  rows={3}
                  value={editFormData.headers}
                  onChange={(e) => setEditFormData({ ...editFormData, headers: e.target.value })}
                  style={styles.textareaInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Payload (JSON):</label>
                <textarea
                  rows={4}
                  value={editFormData.payload}
                  onChange={(e) => setEditFormData({ ...editFormData, payload: e.target.value })}
                  style={styles.textareaInput}
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  style={styles.cancelBtn}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  style={styles.submitEditBtn}
                >
                  {editLoading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f1f3f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e9ecef',
    padding: '20px 40px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  headerContent: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    color: '#1a1a1a',
    fontSize: '26px',
    fontWeight: '700'
  },
  subtitle: {
    margin: '6px 0 0',
    color: '#6c757d',
    fontSize: '14px'
  },
  reloadBtn: {
    padding: '10px 18px',
    backgroundColor: '#228be6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  mainContent: {
    padding: '30px 40px',
    flex: 1
  },
  searchContainer: {
    marginBottom: '24px'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
    overflow: 'hidden'
  },
  searchIcon: {
    paddingLeft: '16px',
    fontSize: '16px',
    color: '#868e96'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: '#212529',
    backgroundColor: 'transparent'
  },
  clearSearchBtn: {
    padding: '8px 16px',
    background: 'none',
    border: 'none',
    color: '#adb5bd',
    fontSize: '14px',
    cursor: 'pointer'
  },
  infoBox: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#495057',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #dee2e6',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f3f5',
    marginBottom: '14px'
  },
  idBadge: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#495057'
  },
  methodBadge: {
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px'
  },
  label: {
    color: '#6c757d',
    fontWeight: '500'
  },
  value: {
    color: '#212529',
    fontWeight: '600'
  },
  statusBadge: {
    backgroundColor: '#e7f5ff',
    color: '#1c7ed6',
    padding: '3px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  sectionTitle: {
    fontSize: '12px',
    color: '#868e96',
    fontWeight: '600'
  },
  codeBlock: {
    margin: 0,
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    color: '#212529',
    overflowX: 'auto',
    maxHeight: '100px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '40px',
    marginBottom: '20px'
  },
  pageButton: {
    padding: '10px 20px',
    border: '1px solid #ced4da',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057'
  },
  pageInfo: {
    fontSize: '15px',
    color: '#495057'
  },
  createBtn: {
    padding: '10px 20px',
    backgroundColor: '#2b8a3e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '500px',
    padding: '24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#868e96'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  selectInput: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    backgroundColor: '#fff'
  },
  textInput: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px'
  },
  textareaInput: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontFamily: 'monospace',
    fontSize: '13px',
    resize: 'vertical'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px'
  },
  cancelBtn: {
    padding: '10px 18px',
    border: '1px solid #ced4da',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  submitBtn: {
    padding: '10px 18px',
    border: 'none',
    backgroundColor: '#1976d2',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  editBtn: {
    padding: '10px 20px',
    backgroundColor: '#f59f00',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  submitEditBtn: {
    padding: '10px 18px',
    border: 'none',
    backgroundColor: '#f59f00',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  acceptCardBtn: {
    width: '100%',
    padding: '8px 12px',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};
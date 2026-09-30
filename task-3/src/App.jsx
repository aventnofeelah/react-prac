import React, { useState } from 'react';
import './App.css';

const initialBooks = [
  { id: 1, title: '1984', author: 'Джордж Оруэлл', pages: 328, genre: 'Антиутопия' },
  { id: 2, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', pages: 480, genre: 'Роман' },
  { id: 3, title: 'Дюна', author: 'Фрэнк Герберт', pages: 704, genre: 'Фантастика' },
];

function BookCard({ book, onDelete, onUpdateTitle }) {
  console.log(`[Re-render] BookCard render ID: ${book.id} ("${book.title}")`);

  const [readingStatus, setReadingStatus] = useState('Не прочитано');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(book.title);

  const handleResetLocalState = () => {
    setReadingStatus('Не прочитано');
  };

  const handleTitleSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      if (editedTitle.trim()) {
        onUpdateTitle(book.id, editedTitle.trim());
      } else {
        setEditedTitle(book.title);
      }
      setIsEditing(false);
    }
  };

  return (
    <div className="book-card">
      <div>
        <div className="book-title-section">
          {isEditing ? (
            <input
              type="text"
              className="edit-title-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleTitleSubmit}
              onBlur={handleTitleSubmit}
              autoFocus
            />
          ) : (
            <h3
              className="book-title"
              onClick={() => setIsEditing(true)}
              title="Нажмите, чтобы изменить название"
            >
              {book.title} 
            </h3>
          )}
          <span className="edit-hint">кликните по названию для редактирования</span>
        </div>

        <div className="book-info">
          <p><strong>Автор:</strong> {book.author}</p>
          <p><strong>Страниц:</strong> {book.pages}</p>
          <span className="genre-tag">{book.genre}</span>
        </div>

        <div className="local-state-box">
          <label className="status-label">Статус:</label>
          <select
            className="status-select"
            value={readingStatus}
            onChange={(e) => setReadingStatus(e.target.value)}
          >
            <option value="Не прочитано">Не прочитано</option>
            <option value="Читаю">Читаю</option>
            <option value="Завершено">Завершено</option>
          </select>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-reset" onClick={handleResetLocalState}>
          Сбросить статус
        </button>
        <button className="btn-delete" onClick={() => onDelete(book.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
}

export default function App() {
  console.log('[Re-render] App Component rendered');

  const [books, setBooks] = useState(initialBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Все');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPages, setNewPages] = useState('');
  const [newGenre, setNewGenre] = useState('Фантастика');

  const handleDeleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const handleUpdateTitle = (id, newName) => {
    setBooks(
      books.map((book) => (book.id === id ? { ...book, title: newName } : book))
    );
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newTitle || !newAuthor || !newPages) return;

    const newBook = {
      id: Date.now(),
      title: newTitle,
      author: newAuthor,
      pages: Number(newPages),
      genre: newGenre,
    };

    setBooks([newBook, ...books]);
    setNewTitle('');
    setNewAuthor('');
    setNewPages('');
    setIsModalOpen(false);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'Все' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = ['Все', ...new Set(books.map((b) => b.genre))];

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1>Bookverse Dashboard</h1>
          <p className="subtitle">Управление коллекцией книг</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Добавить книгу
        </button>
      </header>

      <div className="controls-card">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по названию или автору..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              Жанр: {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="book-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={handleDeleteBook}
              onUpdateTitle={handleUpdateTitle}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>Книги не найдены</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Добавить новую книгу</h2>
            <form onSubmit={handleAddBook}>
              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Автор</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Количество страниц</label>
                <input
                  type="number"
                  required
                  value={newPages}
                  onChange={(e) => setNewPages(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Жанр</label>
                <input
                  type="text"
                  required
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="btn-primary">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
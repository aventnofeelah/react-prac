import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';

export default function Todos() {
  const { todos, isLoading, isError, error, addTodo, deleteTodo, isAdding } = useTodos();
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTodo({ title, completed: false });
    setTitle('');
  };

  if (isLoading) return <div style={{ padding: '2rem' }}>Loading tasks...</div>;
  if (isError) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error.message}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2>My Tasks (Cached Resource)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="New task title..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button type="submit" disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {todos.length === 0 ? (
        <p>No tasks found. Create your first task above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {todos.map((todo) => (
            <li 
              key={todo.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '0.75rem', 
                background: '#f9f9f9', 
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <span>{todo.title}</span>
              <button 
                onClick={() => deleteTodo(todo.id)}
                style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '0.25rem 0.5rem', cursor: 'pointer', borderRadius: '4px' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
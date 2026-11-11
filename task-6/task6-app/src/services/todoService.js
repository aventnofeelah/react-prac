const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

export const todoService = {
  async getTodos() {
    const response = await fetch(`${BASE_URL}?_limit=10`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  async addTodo(newTodo) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },

  async deleteTodo(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
    return id;
  }
};
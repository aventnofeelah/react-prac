# Cache strategy

* `staleTime`. Data (todo items) received from the server are considered fresh for 5 minutes (1000 * 60 * 5). When switching between pages, the application avoids unnecessary network requests and instead serves the data instantly from the cache.

* `refetchOnWindowFocus: false`. Automatic data re-requesting upon switching focus to a browser tab has been disabled, which saves network resources.

* All request logic has been moved to a separate service `(todoService.js)`, while caching and mutation logic is encapsulated within a custom hook `(useTodos.js)`. UI components do not perform fetch requests directly.

* Mutations (Add / Delete): When performing create `(addTodo)` or delete `(deleteTodo)` operations, the cache is updated instantly on the client via `queryClient.setQueryData`.
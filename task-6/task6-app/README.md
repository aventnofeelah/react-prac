# Cache strategy (Task 6)

* `staleTime`. Data (todo items) received from the server are considered fresh for 5 minutes (1000 * 60 * 5). When switching between pages, the application avoids unnecessary network requests and instead serves the data instantly from the cache.

* `refetchOnWindowFocus: false`. Automatic data re-requesting upon switching focus to a browser tab has been disabled, which saves network resources.

* All request logic has been moved to a separate service `(todoService.js)`, while caching and mutation logic is encapsulated within a custom hook `(useTodos.js)`. UI components do not perform fetch requests directly.

* Mutations (Add / Delete): When performing create `(addTodo)` or delete `(deleteTodo)` operations, the cache is updated instantly on the client via `queryClient.setQueryData`.

# Requirements (Task 8)
- [x] Configure `configureStore` and `Provider`.
- [x] Implement at least 3 meaningful feature-based slices.
- [x] Separate Redux logic, API services, custom hooks, and UI components.
- [x] Keep temporary UI state local and authentication in AuthContext if appropriate.
- [ ] Implement at least 3 `createAsyncThunk` operations: list fetching, details fetching,
- [ ] and one mutation/business operation.
- [ ] Handle `pending`, `fulfilled`, and `rejected` through `extraReducers`.
- [ ] Handle loading, errors, empty results, retries, and stale requests.
- [ ] Refresh affected data after mutations.
- [x] Use `useSelector` and `useDispatch`.
- [ ] Implement at least 3 reusable selectors, including 2 memoized selectors using `createSelector`.
- [ ] Avoid duplicated state and unnecessary API requests.
- [x] Preserve URL search parameters, debounce, filters, sorting, and pagination.
- [x] Keep authentication, protected routes, personalized features, and CRUD working.
- [ ] Preserve PWA installation, Service Worker caching, and offline behavior.
- [x] Ensure the deployed application works correctly.

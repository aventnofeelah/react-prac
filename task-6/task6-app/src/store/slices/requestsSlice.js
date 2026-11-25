import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getItemsList, getItem, updateItem, createItem } from "../../api/fakeApi.js";

export const fetchRequestsThunk = createAsyncThunk(
  "requests/fetchList",
  async ({ page, limit, search }, { signal, rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const response = await getItemsList(params.toString(), { signal });
      return response;
    } catch (err) {
      if (err?.name === "AbortError" || signal?.aborted) {
        return rejectWithValue({ aborted: true });
      }
      return rejectWithValue({ message: err.message || "Failed to load data" });
    }
  }
);

export const createRequestThunk = createAsyncThunk(
  "requests/create",
  async (newItem, { dispatch, getState, rejectWithValue }) => {
    try {
      await createItem(newItem);
      const { requestsUi } = getState();
      dispatch(
        fetchRequestsThunk({
          page: requestsUi.currentPage,
          limit: requestsUi.limit,
          search: requestsUi.debouncedSearch,
        })
      );
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create request");
    }
  }
);

export const editRequestThunk = createAsyncThunk(
  "requests/edit",
  async ({ id, data }, { dispatch, getState, rejectWithValue }) => {
    try {
      await getItem(id);
      await updateItem(id, data);
      const { requestsUi } = getState();
      dispatch(
        fetchRequestsThunk({
          page: requestsUi.currentPage,
          limit: requestsUi.limit,
          search: requestsUi.debouncedSearch,
        })
      );
    } catch (err) {
      return rejectWithValue({
        message: err.message || "Failed to update request",
        status: err?.status,
        targetId: id,
      });
    }
  }
);

export const acceptRequestThunk = createAsyncThunk(
  "requests/accept",
  async (req, { dispatch, getState, rejectWithValue }) => {
    try {
      const payloadSize = req.payload ? JSON.stringify(req.payload).length : 0;
      const newStatus = payloadSize > 15 ? "FAILED" : "ACCEPTED";

      await updateItem(req.id, { status: newStatus });
      const { requestsUi } = getState();
      dispatch(
        fetchRequestsThunk({
          page: requestsUi.currentPage,
          limit: requestsUi.limit,
          search: requestsUi.debouncedSearch,
        })
      );
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update status");
    }
  }
);

const initialState = {
  items: [],
  totalPages: 1,
  totalItems: 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  creating: false,
  editing: false,
};

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRequestsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const response = action.payload;
        if (response && Array.isArray(response.data)) {
          state.items = response.data;
          state.totalPages = response.totalPages || 1;
          state.totalItems = response.total || 0;
        } else if (Array.isArray(response)) {
          state.items = response;
          state.totalPages = 1;
          state.totalItems = response.length;
        }
      })
      .addCase(fetchRequestsThunk.rejected, (state, action) => {
        if (action.payload?.aborted) return;
        state.status = "failed";
        state.error = action.payload?.message || "Failed to load data";
      })
      .addCase(createRequestThunk.pending, (state) => {
        state.creating = true;
      })
      .addCase(createRequestThunk.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createRequestThunk.rejected, (state) => {
        state.creating = false;
      })
      .addCase(editRequestThunk.pending, (state) => {
        state.editing = true;
      })
      .addCase(editRequestThunk.fulfilled, (state) => {
        state.editing = false;
      })
      .addCase(editRequestThunk.rejected, (state) => {
        state.editing = false;
      });
  },
});

export default requestsSlice.reducer;
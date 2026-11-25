import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchTerm: "",
  debouncedSearch: "",
  currentPage: 1,
  limit: 15,
  isCreateOpen: false,
  isEditOpen: false,
};

const requestsUiSlice = createSlice({
  name: "requestsUi",
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setDebouncedSearch(state, action) {
      state.debouncedSearch = action.payload;
      state.currentPage = 1;
    },
    clearSearch(state) {
      state.searchTerm = "";
      state.debouncedSearch = "";
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setCreateOpen(state, action) {
      state.isCreateOpen = action.payload;
    },
    setEditOpen(state, action) {
      state.isEditOpen = action.payload;
    },
  },
});

export const {
  setSearchTerm,
  setDebouncedSearch,
  clearSearch,
  setCurrentPage,
  setCreateOpen,
  setEditOpen,
} = requestsUiSlice.actions;

export default requestsUiSlice.reducer;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRequestsThunk,
  createRequestThunk,
  editRequestThunk,
  acceptRequestThunk,
} from "../store/slices/requestsSlice";
import {
  setSearchTerm,
  setDebouncedSearch,
  clearSearch,
  setCurrentPage,
  setCreateOpen,
  setEditOpen,
} from "../store/slices/requestsUiSlice";

export function useRequests() {
  const dispatch = useDispatch();

  const {
    items: requests,
    totalPages,
    totalItems,
    status,
    error,
    creating: isCreating,
    editing: isEditing,
  } = useSelector((state) => state.requests);

  const {
    searchTerm,
    debouncedSearch,
    currentPage,
    limit,
    isCreateOpen,
    isEditOpen,
  } = useSelector((state) => state.requestsUi);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDebouncedSearch(searchTerm));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    const promise = dispatch(
      fetchRequestsThunk({
        page: currentPage,
        limit,
        search: debouncedSearch,
      })
    );

    return () => promise.abort();
  }, [dispatch, currentPage, limit, debouncedSearch]);

  const isLoading = status === "loading" && requests.length === 0;
  const isFetching = status === "loading";
  const isError = status === "failed";

  return {
    requests,
    totalPages,
    totalItems,
    currentPage,
    searchTerm,
    debouncedSearch,
    isLoading,
    isFetching,
    isError,
    error,
    isCreating,
    isEditing,
    isCreateOpen,
    isEditOpen,
    setSearchTerm: (val) => dispatch(setSearchTerm(val)),
    clearSearch: () => dispatch(clearSearch()),
    setCurrentPage: (page) => dispatch(setCurrentPage(page)),
    setCreateOpen: (open) => dispatch(setCreateOpen(open)),
    setEditOpen: (open) => dispatch(setEditOpen(open)),
    refetch: () =>
      dispatch(
        fetchRequestsThunk({
          page: currentPage,
          limit,
          search: debouncedSearch,
        })
      ),
    createRequest: (data) => dispatch(createRequestThunk(data)).unwrap(),
    editRequest: (payload) => dispatch(editRequestThunk(payload)).unwrap(),
    acceptRequest: (req) => dispatch(acceptRequestThunk(req)).unwrap(),
  };
}
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../services/authService";
import {
  setAuthUser,
  clearAuthError,
  signupUser,
  loginUser,
  loginWithGoogleUser,
  logoutUser,
} from "../store/slices/authSlice";

export function useAuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges((user) => {
      dispatch(setAuthUser(user));
    });
    return unsubscribe;
  }, [dispatch]);
}

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isInitialized, status, error } = useSelector((state) => state.auth);

  return {
    currentUser: user,
    loading: !isInitialized,
    isSubmitting: status === "loading",
    error,
    clearError: () => dispatch(clearAuthError()),
    signup: (email, password) =>
      dispatch(signupUser({ email, password })).unwrap(),
    login: (email, password) =>
      dispatch(loginUser({ email, password })).unwrap(),
    loginWithGoogle: () => dispatch(loginWithGoogleUser()).unwrap(),
    logout: () => dispatch(logoutUser()).unwrap(),
  };
}
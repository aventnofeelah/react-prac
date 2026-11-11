import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  }

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#f0f0f0" }}>
      <div>
        <Link to="/profile" style={{ marginRight: "1rem" }}>Task 6 App</Link>
        {currentUser && <Link to="/todos">Tasks</Link>}
      </div>
      <div>
        {currentUser ? (
          <>
            <Link to="/profile" style={{ marginRight: "1rem" }}>Profile</Link>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
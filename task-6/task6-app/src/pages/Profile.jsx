import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
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
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Profile</h2>
      <p><strong>Email:</strong> {currentUser?.email}</p>
      <p><strong>UID:</strong> {currentUser?.uid}</p>
      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>Log Out</button>
    </div>
  );
}
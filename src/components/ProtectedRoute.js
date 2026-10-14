import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

//wraps a page that only logged in users should see
//used in App.js like <ProtectedRoute><MyEvents /></ProtectedRoute>
function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;

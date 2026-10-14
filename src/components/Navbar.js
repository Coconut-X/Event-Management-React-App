import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const registrations = useSelector((state) => state.registrations.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //how many events this user signed up for
  const myCount = user
    ? registrations.filter((r) => r.userId === user.id).length
    : 0;

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link to="/events" className="navbar__brand">
        EventHub
      </Link>

      <nav className="navbar__links">
        {/*NavLink adds the active class on the current page*/}
        <NavLink to="/events" className="navbar__link">
          Events
        </NavLink>
        {user && (
          <NavLink to="/my-events" className="navbar__link">
            My Events
            {myCount > 0 && <span className="count">{myCount}</span>}
          </NavLink>
        )}
      </nav>

      <div className="navbar__auth">
        {user ? (
          <>
            <span className="navbar__user">Hi, {user.name}</span>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">
              Login
            </Link>
            <Link to="/register" className="btn btn--primary">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;

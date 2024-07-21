import { Link, redirect } from "react-router-dom";
import { useUser } from "../context/user";
import { Button } from "./ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("hit");
    await axios.post(`${import.meta.env.VITE_SERVER_URL}user/logout`, {
      withCredentials: true,
    });
    logout();
    navigate("/login");
    return;
  };

  return (
    <nav className="w-full px-5 py-10 h-10 border-b flex items-center justify-between ">
      <div>
        <Link to="/">
          <Button>Home</Button>
        </Link>
      </div>
      <div>
        {!user ? (
          <div className="flex gap-4">
            <Link to={"/login"}>
              <Button>Login</Button>
            </Link>
            <Link to={"/register"}>
              <Button>Register</Button>
            </Link>
          </div>
        ) : (
          <div className="flex gap-4">
            {user && user.role === "admin" && (
              <div className="flex gap-4">
                <Link to="/admin/availibilty">
                  <Button>Admin availibilty</Button>
                </Link>
                <Link to="/admin/shifts">
                  <Button>Admin shift</Button>
                </Link>
              </div>
            )}
            {user && user.role === "employee" && (
              <div className="flex gap-4">
                <Link to="/employee/availibilty">
                  <Button>Employee Availibilty</Button>
                </Link>
                <Link to="/employee/shifts">
                  <Button>Employee Shifts</Button>
                </Link>
              </div>
            )}
            {user && <Button onClick={handleLogout}>Logout</Button>}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

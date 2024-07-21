import { useState } from "react";
import { Alert } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/user";
import axios from "axios";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and Password required");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}user/login`,
        {
          username,
          password,
        },
        { withCredentials: true },
      );

      if (response.status === 200) {
        login(response.data.user);

        navigate("/");
        window.location.reload();
      } else {
        setError(response.data.msg || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response.data.msg);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login
        </h2>
        {error && <Alert type="error">{error}</Alert>}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Login
          </Button>
          <Link to="/register">
            <div className="w-full text-center">Not having an account?</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

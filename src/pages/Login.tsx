

import "../styles/register.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handledatachange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({
        ...data,
        [name]: e.target.value,
      });
    };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const loginhandle = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await login(data);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="chatappcontainer">
      <div className="authhero">
        <p className="autheyebrow">Conversations brewed fresh</p>
        <h1 className="headapp">Chai Pe Charcha</h1>
      </div>

      <section className="lockcontainer" aria-labelledby="login-title">
        <div className="authheader">
          <h2 id="login-title">Welcome back</h2>
          <p>Sign in to catch up with your chats and groups.</p>
        </div>

        <div className="formdetails">
          <label className="fieldgroup" htmlFor="login-username">
            <span>Username</span>
            <input
              id="login-username"
              className="inputfield"
              placeholder="Enter your username"
              onChange={handledatachange("username")}
            />
          </label>

          <label className="fieldgroup" htmlFor="login-password">
            <span>Password</span>
            <input
              id="login-password"
              className="inputfield"
              placeholder="Enter your password"
              type="password"
              onChange={handledatachange("password")}
            />
          </label>

          <button
            onClick={loginhandle}
            className="registerbutton"
            type="button"
            disabled={isSubmitting || !data.username || !data.password}
          >
            {isSubmitting ? (
              <span className="buttonloader">
                <svg
                  className="spinnersvg"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="30 60"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </div>

        <p className="authswitch">
          Don't have an account?{" "}
          <Link className="authlink" to="/register">
            Create one
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Login;



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
  const { login } = useAuth();
  const loginhandle = async () => login(data);
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

          <button onClick={loginhandle} className="registerbutton" type="button">
            Sign in
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

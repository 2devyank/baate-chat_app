

import "../styles/register.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Register() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { register } = useAuth();
  const handledatachange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({
        ...data,
        [name]: e.target.value,
      });
    };
  const handleRegister = async () => {
    console.log("data");
    await register(data);
  };
  console.log(data);
  return (
    <div className="chatappcontainer">
      <div className="authhero">
        <p className="autheyebrow">Join the conversation</p>
        <h1 className="headapp">Chai Pe Charcha</h1>
      </div>

      <section className="lockcontainer" aria-labelledby="register-title">
        <div className="authheader">
          <h2 id="register-title">Create your account</h2>
          <p>Set up your profile and start chatting with your people.</p>
        </div>
        <div className="formdetails">
          <label className="fieldgroup" htmlFor="register-username">
            <span>Username</span>
            <input
              id="register-username"
              className="inputfield"
              placeholder="Choose a username"
              onChange={handledatachange("username")}
            />
          </label>

          <label className="fieldgroup" htmlFor="register-email">
            <span>Email</span>
            <input
              id="register-email"
              className="inputfield"
              placeholder="you@example.com"
              type="email"
              onChange={handledatachange("email")}
            />
          </label>

          <label className="fieldgroup" htmlFor="register-password">
            <span>Password</span>
            <input
              id="register-password"
              className="inputfield"
              placeholder="Create a password"
              type="password"
              onChange={handledatachange("password")}
            />
          </label>

          <button onClick={handleRegister} className="registerbutton" type="button">
            Create account
          </button>
        </div>

        <p className="authswitch">
          Already have an account?{" "}
          <Link className="authlink" to="/login">
            Login
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Register;

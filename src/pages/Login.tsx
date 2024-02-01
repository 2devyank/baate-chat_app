

import "../styles/register.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
      <div className="headapp">Chai Pe Charcha App</div>

      <div className="lockcontainer">
        <div>Login</div>
        <div className="formdetails">
          {/* name */}
          <input
            className="inputfield"
            placeholder="username..."
            onChange={handledatachange("username")}
          />

          {/* password */}
          <input
            className="inputfield"
            placeholder="password..."
            onChange={handledatachange("password")}
          />
          {/* button */}
          <button onClick={loginhandle} className="registerbutton">
            Login
          </button>
          {/* <div> */}
          {/* </div> */}
        </div>
        <div>
          Don't have an account ?{" "}
          <a
            style={{ textDecoration: "none", color: "rgb(166, 166, 251)" }}
            href="/register"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;

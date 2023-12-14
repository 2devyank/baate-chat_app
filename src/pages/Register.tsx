import { TextField } from "@mui/material";

import "../styles/register.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
      <div className="headapp">Chai Pe Charcha App</div>

      <div className="lockcontainer">
        <div>Register</div>
        <div className="formdetails">
          {/* name */}
          <input
            className="inputfield"
            placeholder="username..."
            onChange={handledatachange("username")}
          />
          {/* email */}
          <input
            className="inputfield"
            placeholder="email..."
            onChange={handledatachange("email")}
          />
          {/* password */}
          <input
            className="inputfield"
            placeholder="password..."
            onChange={handledatachange("password")}
          />
          {/* button */}
          <button onClick={handleRegister} className="registerbutton">
            Register
          </button>
          {/* <div> */}
          {/* </div> */}
        </div>
        <div>
          Already have an account ?{" "}
          <a
            style={{ textDecoration: "none", color: "rgb(166, 166, 251)" }}
            href="/login"
          >
            login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;

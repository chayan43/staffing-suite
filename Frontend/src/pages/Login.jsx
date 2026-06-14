import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

      window.location.href = "/";
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "420px",
          background: "#171717",
          padding: "40px",
          borderRadius: "20px",
          border: "1px solid #262626",
          boxShadow: "0 0 30px rgba(0,0,0,0.4)",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: "10px",
            fontSize: "32px",
          }}
        >
          Staffing Suite
        </h1>

        <p
          style={{
            color: "#a3a3a3",
            marginBottom: "25px",
          }}
        >
          Sign in to your account
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            background: "#262626",
            border: "1px solid #404040",
            borderRadius: "10px",
            color: "white",
            marginBottom: "15px",
            outline: "none",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            background: "#262626",
            border: "1px solid #404040",
            borderRadius: "10px",
            color: "white",
            marginBottom: "20px",
            outline: "none",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            background: "#404040",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Login
        </button>

        <p
          style={{
            color: "#a3a3a3",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          Don't have an account?{" "}
          <a
            href="/signup"
            style={{
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Create Account
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
import { useState } from "react";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://staffing-suite.onrender.com/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      alert("Account Created Successfully");

      window.location.href = "/login";
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Signup Failed"
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
        onSubmit={handleSignup}
        style={{
          width: "420px",
          background: "#171717",
          padding: "40px",
          borderRadius: "20px",
          border: "1px solid #262626",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: "10px",
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
          Create your account
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            background: "#262626",
            border: "1px solid #404040",
            borderRadius: "10px",
            color: "white",
            marginBottom: "15px",
          }}
        />

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
          }}
        >
          Create Account
        </button>

        <p
          style={{
            color: "#a3a3a3",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SECRET_KEY = "royal_jewellery_secret";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://jewellery-backend-icja.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify({
            token: data.token,
            user: data.user,
          }),
          SECRET_KEY
        ).toString();

        localStorage.setItem("auth", encryptedData);

        toast.success("Login Successful");

        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>ROYAL JEWELLERY</h2>
        <p style={styles.subtitle}>LOGIN TO CONTINUE</p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          LOGIN
        </button>
        <p
  style={styles.registerText}
  onClick={() => navigate("/register")}
>
  Don’t have an account? <span style={styles.registerLink}>Sign up</span>
</p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#faf9f6",
  },

  form: {
    background: "#ffffff",
    padding: "40px 32px",
    borderRadius: "14px",
    width: "340px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    border: "1px solid rgba(212,175,55,0.35)",
  },

  title: {
    color: "#D4AF37",
    letterSpacing: 3,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 0,
  },

  subtitle: {
    color: "#777",
    textAlign: "center",
    fontSize: 13,
    marginBottom: 20,
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(212,175,55,0.5)",
    outline: "none",
    fontSize: 14,
  },

  button: {
    padding: "12px",
    background: "linear-gradient(135deg, #D4AF37, #b8962e)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    letterSpacing: 1,
    marginTop: 10,
  },
  registerText: {
  textAlign: "center",
  fontSize: 13,
  color: "#777",
  marginTop: 10,
  cursor: "pointer",
},

registerLink: {
  color: "#D4AF37",
  fontWeight: 600,
  marginLeft: 4,
},
};

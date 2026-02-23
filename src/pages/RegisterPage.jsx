// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const SECRET_KEY = "royal_jewellery_secret";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "https://jewellery-backend-icja.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({
          token: data.token,
          user: data.user,
        }),
        SECRET_KEY
      ).toString();

      localStorage.setItem("auth", encryptedData);

      alert("Registration successful");

      navigate("/login");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>ROYAL JEWELLERY</h2>
        <p style={styles.subtitle}>CREATE YOUR ACCOUNT</p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating Account..." : "REGISTER"}
        </button>

        <p style={styles.loginText}>
          Already have an account?
          <span
            style={styles.loginLink}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
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
    width: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    border: "1px solid rgba(212,175,55,0.35)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
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
    letterSpacing: 1,
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(212,175,55,0.5)",
    outline: "none",
    fontSize: 14,
    transition: "0.2s",
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
    boxShadow: "0 6px 18px rgba(212,175,55,0.35)",
  },

  loginText: {
    textAlign: "center",
    fontSize: 13,
    color: "#777",
    marginTop: 10,
  },

  loginLink: {
    color: "#D4AF37",
    fontWeight: 600,
    marginLeft: 6,
    cursor: "pointer",
  },
};
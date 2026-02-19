import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const SECRET_KEY = "royal_jewellery_secret";

const getToken = () => {
  try {
    const encryptedData = localStorage.getItem("auth");
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return data.token;
  } catch {
    return null;
  }
};

export default function AddressPage() {
  const navigate = useNavigate();
  const token = getToken();

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchAddresses();
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(
        "https://jewellery-backend-icja.onrender.com/api/address",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const list = data.addresses || [];
        setAddresses(list);
        setShowForm(list.length === 0);

        if (list.length > 0) {
          const def = list.find((a) => a.isDefault) || list[0];
          setSelectedId(def._id);
        }
      }
    } catch (e) {
      setShowForm(true);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Required";
    if (!phone.trim()) errs.phone = "Required";
    else if (phone.trim().length !== 10) errs.phone = "10 digits required";
    if (!street.trim()) errs.street = "Required";
    if (!city.trim()) errs.city = "Required";
    if (!stateVal.trim()) errs.state = "Required";
    if (!pincode.trim()) errs.pincode = "Required";
    else if (pincode.trim().length !== 6) errs.pincode = "6 digits required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitAddress = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://jewellery-backend-icja.onrender.com/api/address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            street: street.trim(),
            city: city.trim(),
            state: stateVal.trim(),
            pincode: pincode.trim(),
            isDefault,
          }),
        }
      );

      if (res.ok) {
        alert("Address saved! ✅");
        setName(""); setPhone(""); setStreet("");
        setCity(""); setStateVal(""); setPincode("");
        setErrors({});
        await fetchAddresses();
      } else {
        alert("Failed to save address ❌");
      }
    } catch (e) {
      alert(e.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const proceed = () => {
    if (!selectedId) return;
    const addr = addresses.find((a) => a._id === selectedId);
    navigate("/order", { state: { address: addr } });
  };

  if (loadingAddresses) {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={{ background: "#FAF9F6", minHeight: "100vh" }}>
      {/* AppBar */}
      <div style={styles.appBar}>
        <h2 style={styles.appBarTitle}>Delivery Address</h2>
      </div>

      {showForm ? (
        <FormView
          addresses={addresses}
          setShowForm={setShowForm}
          name={name} setName={setName}
          phone={phone} setPhone={setPhone}
          street={street} setStreet={setStreet}
          city={city} setCity={setCity}
          stateVal={stateVal} setStateVal={setStateVal}
          pincode={pincode} setPincode={setPincode}
          isDefault={isDefault} setIsDefault={setIsDefault}
          errors={errors}
          isLoading={isLoading}
          onSubmit={submitAddress}
        />
      ) : (
        <ListView
          addresses={addresses}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          setShowForm={setShowForm}
          onProceed={proceed}
        />
      )}
    </div>
  );
}

// ─── Address List View ───────────────────────────────────────────────────────

function ListView({ addresses, selectedId, setSelectedId, setShowForm, onProceed }) {
  return (
    <div style={styles.scrollContainer}>
      <div style={styles.innerContainer}>
        <p style={styles.sectionTitle}>Select Delivery Address</p>

        {addresses.map((a) => (
          <AddressCard
            key={a._id}
            address={a}
            selected={selectedId === a._id}
            onSelect={() => setSelectedId(a._id)}
          />
        ))}

        <button
          style={styles.outlinedBtn}
          onClick={() => setShowForm(true)}
          onMouseEnter={(e) => (e.target.style.background = "rgba(212,175,55,0.05)")}
          onMouseLeave={(e) => (e.target.style.background = "transparent")}
        >
          + Add New Address
        </button>

        <button
          style={{
            ...styles.primaryBtn,
            opacity: selectedId ? 1 : 0.5,
            cursor: selectedId ? "pointer" : "not-allowed",
          }}
          onClick={onProceed}
          disabled={!selectedId}
        >
          Continue to Order &nbsp; →
        </button>
      </div>
    </div>
  );
}

function AddressCard({ address: a, selected, onSelect }) {
  return (
    <div
      style={{
        ...styles.card,
        border: `${selected ? 2 : 1}px solid ${selected ? "#D4AF37" : "#ddd"}`,
        cursor: "pointer",
      }}
      onClick={onSelect}
    >
      {/* Radio */}
      <div style={styles.radioOuter(selected)}>
        {selected && <div style={styles.radioInner} />}
      </div>

      <div style={{ flex: 1, marginLeft: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 600 }}>{a.name}</span>
          {a.isDefault && (
            <span style={styles.defaultBadge}>Default</span>
          )}
        </div>
        <div style={{ color: "#555", marginTop: 4 }}>{a.phone}</div>
        <div style={{ fontSize: 13, color: "#777", marginTop: 4 }}>
          {a.street}, {a.city}, {a.state} - {a.pincode}
        </div>
      </div>
    </div>
  );
}

// ─── Form View ───────────────────────────────────────────────────────────────

function FormView({
  addresses, setShowForm,
  name, setName, phone, setPhone,
  street, setStreet, city, setCity,
  stateVal, setStateVal, pincode, setPincode,
  isDefault, setIsDefault,
  errors, isLoading, onSubmit,
}) {
  return (
    <div style={styles.scrollContainer}>
      <div style={{ ...styles.innerContainer, maxWidth: 600 }}>
        <div style={styles.formCard}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            {addresses.length > 0 && (
              <button
                style={styles.backBtn}
                onClick={() => setShowForm(false)}
              >
                ←
              </button>
            )}
            <span style={{ color: "#D4AF37", fontSize: 20 }}>📍</span>
            <span style={{ fontSize: 20, fontWeight: 500 }}>Add New Address</span>
          </div>

          {/* Fields */}
          <Field label="Name" value={name} onChange={setName} icon="👤" error={errors.name} />
          <Field label="Phone" value={phone} onChange={setPhone} icon="📞" type="tel" error={errors.phone} />
          <Field label="Street" value={street} onChange={setStreet} icon="🏠" error={errors.street} multiline />

          <div style={{ display: "flex", gap: 12 }}>
            <Field label="City" value={city} onChange={setCity} icon="🏙️" error={errors.city} flex />
            <Field label="State" value={stateVal} onChange={setStateVal} icon="🗺️" error={errors.state} flex />
          </div>

          <Field label="Pincode" value={pincode} onChange={setPincode} icon="📌" type="number" error={errors.pincode} />

          {/* Default Toggle */}
          <div style={styles.switchRow}>
            <span>Set as default</span>
            <div
              style={styles.toggle(isDefault)}
              onClick={() => setIsDefault(!isDefault)}
            >
              <div style={styles.toggleThumb(isDefault)} />
            </div>
          </div>

          {/* Submit */}
          <button
            style={{
              ...styles.primaryBtn,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, icon, type = "text", error, multiline, flex }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 16, flex: flex ? 1 : undefined }}>
      {multiline ? (
        <textarea
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={2}
          style={{
            ...styles.input,
            border: `1.5px solid ${error ? "red" : focused ? "#D4AF37" : "#ddd"}`,
            resize: "none",
            height: 70,
          }}
        />
      ) : (
        <input
          type={type}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...styles.input,
            border: `1.5px solid ${error ? "red" : focused ? "#D4AF37" : "#ddd"}`,
          }}
        />
      )}
      {error && <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  centered: {
    display: "flex", justifyContent: "center",
    alignItems: "center", height: "100vh",
  },
  spinner: {
    width: 36, height: 36,
    border: "3px solid #eee",
    borderTop: "3px solid #D4AF37",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  appBar: {
    background: "#fff",
    padding: "16px 30px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  },
  appBarTitle: {
    fontWeight: 400,
    fontSize: 22,
    color: "#444",
    margin: 0,
  },
  scrollContainer: {
    padding: "24px 16px",
    display: "flex",
    justifyContent: "center",
  },
  innerContainer: {
    width: "100%",
    maxWidth: 800,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 500,
    marginBottom: 24,
  },
  card: {
    display: "flex",
    alignItems: "flex-start",
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  },
  radioOuter: (selected) => ({
    width: 20, height: 20,
    borderRadius: "50%",
    border: `2px solid ${selected ? "#D4AF37" : "#aaa"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginTop: 2,
  }),
  radioInner: {
    width: 10, height: 10,
    borderRadius: "50%",
    background: "#D4AF37",
  },
  defaultBadge: {
    background: "rgba(212,175,55,0.1)",
    color: "#D4AF37",
    fontSize: 10,
    fontWeight: 600,
    padding: "2px 6px",
    borderRadius: 4,
  },
  outlinedBtn: {
    width: "100%",
    padding: 16,
    border: "1.5px solid #D4AF37",
    borderRadius: 12,
    color: "#D4AF37",
    background: "transparent",
    fontSize: 15,
    cursor: "pointer",
    marginBottom: 20,
    fontWeight: 500,
    transition: "background 0.2s",
  },
  primaryBtn: {
    width: "100%",
    padding: "14px 0",
    background: "#D4AF37",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
  },
  formCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: 20,
    color: "#D4AF37",
    cursor: "pointer",
    padding: "4px 8px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    background: "#fafafa",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s",
  },
  switchRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    fontSize: 15,
  },
  toggle: (on) => ({
    width: 44, height: 24,
    borderRadius: 12,
    background: on ? "#D4AF37" : "#ccc",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.2s",
  }),
  toggleThumb: (on) => ({
    position: "absolute",
    top: 3, left: on ? 23 : 3,
    width: 18, height: 18,
    borderRadius: "50%",
    background: "#fff",
    transition: "left 0.2s",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  }),
};
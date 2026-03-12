import { useState } from "react";

/* ─────────────────── GLOBAL CSS ─────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans','Segoe UI',sans-serif}
  .finput{background:#fff;border:1px solid #e2e8f0;color:#1e293b;border-radius:10px;padding:11px 14px;font-size:14px;outline:none;transition:border .15s,box-shadow .15s;width:100%;font-family:'DM Sans',sans-serif}
  .finput:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12)}.finput::placeholder{color:#94a3b8}
  .finput.error{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.1)}
  .btn-primary{background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(99,102,241,.3);width:100%;font-family:'DM Sans',sans-serif}
  .btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.4)}
  .btn-primary:disabled{opacity:.6;cursor:not-allowed;transform:none}
  .field-label{font-size:11px;color:#64748b;display:block;margin-bottom:7px;text-transform:uppercase;letter-spacing:.6px;font-weight:600}
  @keyframes fadeup{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.7)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .login-card{animation:fadeup .45s cubic-bezier(.22,1,.36,1) both}
  .logo-glow{filter:drop-shadow(0 0 12px rgba(99,102,241,.5))}
  .divider-text{position:relative;text-align:center;color:#94a3b8;font-size:12px;margin:20px 0}
  .divider-text::before,.divider-text::after{content:'';position:absolute;top:50%;width:calc(50% - 28px);height:1px;background:#e2e8f0}
  .divider-text::before{left:0}.divider-text::after{right:0}
  .sso-btn{background:#fff;border:1px solid #e2e8f0;color:#374151;border-radius:10px;padding:10px 16px;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;width:100%;display:flex;align-items:center;justify-content:center;gap:10px;font-family:'DM Sans',sans-serif;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .sso-btn:hover{background:#fafbff;border-color:#c7d2fe;color:#4f46e5}
  .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
  .toast-err{position:fixed;top:24px;left:50%;transform:translateX(-50%);background:#fff;border:1px solid #fecaca;color:#dc2626;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.1);z-index:999;animation:fadeup .25s ease;display:flex;align-items:center;gap:8px}
`;

/* ─── decorative grid pattern (SVG bg) ─── */
const GridBg = () => (
  <svg
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4f46e5" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

/* ─── animated indigo dots (decorative) ─── */
const Orb = ({ style }) => (
  <div style={{
    position: "absolute", borderRadius: "50%",
    background: "radial-gradient(circle at 30% 30%, #818cf8, #4f46e5)",
    opacity: .12, filter: "blur(40px)", ...style
  }} />
);

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [toast, setToast]       = useState("");

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    // Simulated auth — replace with real call
    setTimeout(() => {
      setLoading(false);
      if (email === "admin@sightspectrum.io" && password === "password") {
        if (onLogin) onLogin({ email, name: "Dana Mercer", role: "Admin" });
      } else {
        setToast("Invalid email or password. Please try again.");
        setTimeout(() => setToast(""), 3500);
      }
    }, 1400);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #f4f6fb 0%, #eef0f8 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{GLOBAL_CSS}</style>
      <GridBg />
      <Orb style={{ width: 420, height: 420, top: -80, left: -120 }} />
      <Orb style={{ width: 340, height: 340, bottom: -60, right: -80 }} />

      {toast && (
        <div className="toast-err">
          <span style={{ fontSize: 15 }}>⚠</span> {toast}
        </div>
      )}

      {/* Card */}
      <div className="login-card" style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        padding: "44px 40px 36px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 8px 40px rgba(79,70,229,.08), 0 2px 10px rgba(0,0,0,.06)",
        position: "relative",
        zIndex: 2,
      }}>

        {/* Logo + title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="logo-glow" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, background: "linear-gradient(135deg,#4f46e5,#6366f1)",
            borderRadius: 14, marginBottom: 16, boxShadow: "0 4px 16px rgba(99,102,241,.35)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity=".9"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: -.3 }}>
            SightSpectrum
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>
            IT Services Management · Sign in to your workspace
          </p>
        </div>

        {/* SSO */}
        <button className="sso-btn" style={{ marginBottom: 4 }}>
          <svg width="18" height="18" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
          Continue with Microsoft
        </button>

        <div className="divider-text">or sign in with email</div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label className="field-label">Email Address</label>
          <input
            className={`finput${errors.email ? " error" : ""}`}
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: "" })); }}
            onKeyDown={handleKey}
            autoComplete="email"
          />
          {errors.email && (
            <span style={{ fontSize: 11.5, color: "#ef4444", marginTop: 5, display: "block" }}>
              {errors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 10 }}>
          <label className="field-label">Password</label>
          <div style={{ position: "relative" }}>
            <input
              className={`finput${errors.password ? " error" : ""}`}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: "" })); }}
              onKeyDown={handleKey}
              autoComplete="current-password"
              style={{ paddingRight: 44 }}
            />
            <button
              onClick={() => setShowPw(v => !v)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
                fontSize: 16, padding: 2, lineHeight: 1,
              }}
              title={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
          {errors.password && (
            <span style={{ fontSize: 11.5, color: "#ef4444", marginTop: 5, display: "block" }}>
              {errors.password}
            </span>
          )}
        </div>

        {/* Forgot */}
        <div style={{ textAlign: "right", marginBottom: 24 }}>
          <button style={{
            background: "none", border: "none", color: "#6366f1", fontSize: 12.5,
            cursor: "pointer", fontWeight: 500, textDecoration: "none", fontFamily: "inherit",
          }}>
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading
            ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span className="spinner" /> Signing in…
              </span>
            : "Sign In"}
        </button>

        {/* Footer */}
        <p style={{
          fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 24,
          borderTop: "1px solid #f1f5f9", paddingTop: 20,
        }}>
          Don&apos;t have an account?{" "}
          <button style={{
            background: "none", border: "none", color: "#6366f1", fontWeight: 600,
            fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          }}>
            Request Access
          </button>
        </p>

        {/* Demo hint */}
        <div style={{
          marginTop: 16, background: "#f8faff", border: "1px dashed #c7d2fe",
          borderRadius: 8, padding: "9px 14px", fontSize: 11.5, color: "#64748b",
          textAlign: "center", lineHeight: 1.6,
        }}>
          <strong style={{ color: "#4f46e5" }}>Demo credentials:</strong>{" "}
          admin@sightspectrum.io / password
        </div>
      </div>

      {/* Bottom brand tag */}
      <div style={{
        position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
        fontSize: 11, color: "#cbd5e1", letterSpacing: .5, zIndex: 2,
      }}>
        © 2026 SightSpectrum · IT Services Management
      </div>
    </div>
  );
}

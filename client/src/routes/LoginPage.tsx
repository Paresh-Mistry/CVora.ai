import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin, useRegister } from "../hooks/useAuth";
import { Eye, EyeClosed, EyeOff } from "lucide-react";



function Input({
  label, name, type = "text", placeholder, value, onChange, suffix,
}: {
  label: string; name: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </label>
      <div className={`flex items-center border-b-2 transition-colors duration-200 ${
        focused ? "border-indigo-500" : "border-slate-200"
      }`}>
        <input
          name={name} type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 py-3 bg-transparent text-slate-900 placeholder-slate-300
                     text-sm focus:outline-none"
        />
        {suffix}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode]         = useState<"login" | "register">("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [showPass, setShowPass] = useState(false);

  const login    = useLogin();
  const register = useRegister();

  const active  = mode === "login" ? login : register;
  const isError = active.isError;
  const errorMsg = isError
    ? ((active.error as any)?.response?.data?.detail ?? "Something went wrong.")
    : null;

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setEmail(""); setPassword(""); setName("");
    login.reset?.(); register.reset?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login.mutate({ email, password });
    } else {
      register.mutate({ email, password, full_name: name });
    }
  };

  return (
    <>

      <div className="min-h-screen flex bg-[#F8FAFC]">

        {/* ── Left — brand panel ──────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-[52%] bg-[#0F172A] relative overflow-hidden flex-col">

          {/* grid texture */}
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "linear-gradient(#818cf8 1px,transparent 1px),linear-gradient(90deg,#818cf8 1px,transparent 1px)", backgroundSize: "44px 44px" }} />

          {/* glow blobs */}
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-600 rounded-full blur-[130px] opacity-20 pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-700 rounded-full blur-[100px] opacity-15 pointer-events-none" />


          {/* Bottom copy */}
          <div className="relative z-10 p-10 pb-12">
            <h2 className="text-white text-2xl font-bold leading-snug tracking-tight mb-2">
              "Land interviews faster<br />with AI-powered resumes."
            </h2>
            <p className="text-slate-400 text-sm">ATS scoring · AI improvements · One-click export</p>
            <div className="flex items-center gap-3 mt-5">
              <div className="flex -space-x-2">
                {["#6366f1","#8b5cf6","#06b6d4","#10b981"].map((c,i)=>(
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0F172A] flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background:c }}>
                    {["A","M","J","K"][i]}
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-xs">
                <span className="text-white font-semibold">2,400+</span> resumes built this month
              </p>
            </div>
          </div>
        </div>

        {/* ── Right — auth panel ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10 self-start">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white" stroke="currentColor" strokeWidth={2.5}>
                <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-slate-900 font-semibold text-sm tracking-tight">ResumeAI</span>
          </div>

          <div className="w-full max-w-[360px]">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {mode === "login" ? "Welcome back" : "Get started"}
              </h1>
              <p className="text-slate-500 text-sm mt-1.5">
                {mode === "login"
                  ? "Sign in to continue building your resume."
                  : "Create your free account in seconds."}
              </p>
            </div>

            {/* ── Tab switcher ─────────────────────────────────────────────── */}
            <div className="relative flex bg-slate-100 rounded-xl p-1 mb-8">
              {/* sliding pill */}
              <div
                className="tab-indicator absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
                style={{ transform: mode === "login" ? "translateX(0)" : "translateX(calc(100% + 8px))" }}
              />
              {(["login","register"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                    mode === m ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {m === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            {/* ── Error banner ──────────────────────────────────────────────── */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <p className="text-red-600 text-sm">{errorMsg}</p>
              </div>
            )}

            {/* ── Form ─────────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name — register only */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: mode === "register" ? "80px" : "0px", opacity: mode === "register" ? 1 : 0 }}
              >
                <Input label="Full name" name="full_name" placeholder="Jane Smith"
                  value={name} onChange={setName} />
              </div>

              <Input label="Email" name="email" type="email" placeholder="you@example.com"
                value={email} onChange={setEmail} />

              {/* Password with show/hide */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Password
                  </label>
                  {mode === "login" && (
                    <Link to="/forgot-password" className="text-[11px] text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className={`flex items-center border-b-2 transition-colors duration-200 border-slate-200 focus-within:border-indigo-500`}>
                  <input
                    name="password" type={showPass ? "text" : "password"}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="flex-1 py-3 bg-transparent text-slate-900 placeholder-slate-300 text-sm focus:outline-none"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 ml-1"
                    aria-label={showPass ? "Hide password" : "Show password"}>
                    {showPass ? <Eye/> : <EyeOff/>}
                  </button>
                </div>
                {mode === "register" && password.length > 0 && password.length < 8 && (
                  <p className="text-[11px] text-amber-500 mt-1.5">Use at least 8 characters</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={active.isPending || !email || !password || (mode === "register" && (!name || password.length < 8))}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]
                           text-white py-3.5 rounded-xl text-sm font-semibold tracking-wide
                           transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {active.isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                    </svg>
                    {mode === "login" ? "Signing in…" : "Creating account…"}
                  </>
                ) : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
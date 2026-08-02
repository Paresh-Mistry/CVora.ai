import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLogin, useRegister } from "../hooks/useAuth";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Upload,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Loader2,
} from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const login = useLogin();
  const register = useRegister();

  const active = mode === "login" ? login : register;
  const isError = active.isError;
  const errorMsg = isError
    ? ((active.error as any)?.response?.data?.detail ??
        "Something went wrong. Please try again.")
    : null;

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setEmail("");
    setPassword("");
    setName("");
    setImage(null);
    setImagePreview(null);
    login.reset?.();
    register.reset?.();
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login.mutate({ email, password });
    } else {
      register.mutate({ email, password, full_name: name, image });
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50/60 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Left Brand Side-Panel (Light Gradient) */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[50%] bg-gradient-to-br from-indigo-50/80 via-slate-50 to-indigo-100/50 relative overflow-hidden flex-col justify-between p-12 border-r border-slate-200/60">
        {/* Ambient Decorative Shapes */}
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#6366f1 0.75px, transparent 0.75px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-900 font-bold text-xl tracking-tight">
            ResumeAI
          </span>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 border border-indigo-200/60 text-indigo-700 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              AI-Powered Career Tools
            </div>
            <h2 className="text-slate-900 text-4xl font-extrabold leading-tight tracking-tight mb-4">
              Build resumes that hiring managers love.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Real-time ATS scoring, smart AI improvements, and slick visual templates engineered to help you land interviews faster.
            </p>
          </motion.div>

          {/* Social Proof Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
                    style={{ background: c }}
                  >
                    {["A", "M", "J", "K"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-slate-900 text-sm font-semibold">
                  2,400+ job seekers
                </p>
                <p className="text-slate-500 text-xs">
                  Built resumes with us this month
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> ATS Optimized
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" /> One-Click Export
              </span>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} ResumeAI Inc. All rights reserved.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-16">
        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8 self-start">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-slate-900 font-bold text-lg tracking-tight">
            ResumeAI
          </span>
        </div>

        <div className="w-full max-w-sm">
          {/* Header Title */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {mode === "login" ? "Welcome back" : "Get started"}
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">
              {mode === "login"
                ? "Sign in to access your dashboard and saved resumes."
                : "Create your account in seconds."}
            </p>
          </div>

          {/* Shadcn-Style Tabs Switcher */}
          <div className="relative flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/80">
            {/* Sliding Pill Indicator */}
            <motion.div
              className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm border border-slate-200/50"
              initial={false}
              animate={{
                left: mode === "login" ? "4px" : "50%",
                width: "calc(50% - 4px)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                  mode === m
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {m === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Error Message Alert */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="overflow-hidden mb-5"
              >
                <div className="flex items-start gap-3 p-3.5 bg-red-50/80 border border-red-200/80 rounded-xl text-red-700 text-sm">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <p className="leading-snug">{errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registration Animated Collapsible Fields */}
            <AnimatePresence initial={false}>
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden space-y-4"
                >
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Profile Picture <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden group shadow-inner">
                        {imagePreview ? (
                          <>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleImageChange(null)}
                              className="absolute inset-0 bg-slate-900/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 border border-slate-300/80 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        {image ? "Change Avatar" : "Upload Photo"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.length) {
                              handleImageChange(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Full Name Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 absolute left-3.5 text-slate-400" />
                      <input
                        type="text"
                        required={mode === "register"}
                        placeholder="Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                {mode === "login" && (
                  <Link
                    to="/forgot-password"
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-slate-400" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {mode === "register" && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1 w-full bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        password.length === 0
                          ? "w-0 bg-transparent"
                          : password.length < 8
                          ? "w-1/3 bg-amber-500"
                          : "w-full bg-emerald-500"
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>At least 8 characters</span>
                    {password.length >= 8 && (
                      <span className="text-emerald-600 font-medium inline-flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Strong
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                active.isPending ||
                !email ||
                !password ||
                (mode === "register" && (!name || password.length < 8))
              }
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]
                         text-white py-3 rounded-xl text-sm font-semibold tracking-wide
                         transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none
                         flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
            >
              {active.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === "login"
                      ? "Signing in..."
                      : "Creating account..."}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode === "login" ? "Sign in" : "Create account"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Terms */}
          <p className="text-center text-xs text-slate-400 mt-8">
            By continuing, you agree to ResumeAI&apos;s{" "}
            <a href="#" className="underline hover:text-slate-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-slate-600">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
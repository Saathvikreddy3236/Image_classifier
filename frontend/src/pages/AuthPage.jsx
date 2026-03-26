import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import FloatingInput from "../components/ui/FloatingInput";
import GlassCard from "../components/ui/GlassCard";

export default function AuthPage() {
  const { token, login } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login({ name, password }, mode);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-700 to-cyan-500" />
        <div className="absolute left-10 top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-14 text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.5em] text-white/80">Computer Vision Lab</p>
            <h1 className="mt-6 max-w-lg text-5xl font-semibold leading-tight">
              Build clean datasets with a polished annotation workspace.
            </h1>
          </div>
          <div className="grid gap-4">
            {["Project workspaces", "Image folder uploads", "Bounding-box annotation export"].map((item) => (
              <div key={item} className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <GlassCard className="w-full max-w-md">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-500">
              {mode === "login" ? "Welcome back" : "Create account"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              {mode === "login" ? "Sign in to annotate" : "Register your account"}
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Use your username and password to access the annotation workspace.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <FloatingInput label="Username" value={name} onChange={(e) => setName(e.target.value)} required />
              <FloatingInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error ? <p className="text-sm text-rose-500">{error}</p> : null}
              <button disabled={loading} className="gradient-button w-full disabled:opacity-60">
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
              </button>
            </form>

            <button
              onClick={() => setMode((current) => (current === "login" ? "register" : "login"))}
              className="mt-5 text-sm text-sky-500"
            >
              {mode === "login" ? "Need an account? Register" : "Already registered? Login"}
            </button>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
}

import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { FolderKanban, FolderOpen, LogOut, Moon, Sun, UploadCloud } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { to: "/", label: "Projects", icon: FolderKanban },
  { to: "/uploads", label: "Uploads", icon: UploadCloud },
  { to: "/classes", label: "Classes", icon: FolderOpen }
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen lg:pl-72">
      <aside className="glass-panel fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r p-6 lg:flex">
        <Link to="/" className="rounded-3xl bg-white/60 p-4 dark:bg-slate-900/50">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-500">AI Vision Suite</p>
          <h1 className="mt-2 text-2xl font-semibold">Annotation System</h1>
        </Link>

        <nav className="mt-8 space-y-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={`${to}-${label}`}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                    : "hover:bg-white/50 dark:hover:bg-slate-900/40"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl bg-white/50 p-4 dark:bg-slate-900/40">
          <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
          <p className="mt-1 font-semibold">{user?.name}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200/70 px-3 py-2 text-sm dark:border-slate-700"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center rounded-2xl border border-rose-200 px-3 py-2 text-rose-500 dark:border-rose-900/60"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

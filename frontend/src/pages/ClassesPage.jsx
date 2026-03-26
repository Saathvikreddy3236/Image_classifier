import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import { useFetch } from "../hooks/useFetch";

export default function ClassesPage() {
  const { data, loading } = useFetch("/projects", []);
  const projects = data?.projects || [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Classes</p>
        <h1 className="mt-2 text-4xl font-semibold">Manage labels by project</h1>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        {loading ? <p>Loading projects...</p> : null}
        {projects.map((project) => (
          <GlassCard key={project.project_id}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
                <FolderOpen size={20} />
              </div>
              <div>
                <h2 className="font-semibold">{project.project_name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Open this project to add or remove classes.
                </p>
              </div>
            </div>
            <Link to={`/projects/${project.project_id}`} className="gradient-button mt-6 inline-block">
              Open class manager
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

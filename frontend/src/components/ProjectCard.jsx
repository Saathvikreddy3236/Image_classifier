import { Link } from "react-router-dom";
import { Folder, ArrowRight } from "lucide-react";
import GlassCard from "./ui/GlassCard";

export default function ProjectCard({ project }) {
  return (
    <GlassCard className="group h-full">
      <div className="flex items-start justify-between">
        <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-500">
          <Folder size={24} />
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
          Project #{project.project_id}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-semibold">Folder {project.folder_id || "Pending"}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Linked to user {project.user_id}. Open the project to upload images, manage classes, and annotate.
      </p>
      <Link
        to={`/projects/${project.project_id}`}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition group-hover:bg-sky-600 dark:bg-white dark:text-slate-950"
      >
        Open project
        <ArrowRight size={16} />
      </Link>
    </GlassCard>
  );
}

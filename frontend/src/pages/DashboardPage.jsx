import { useState } from "react";
import api from "../services/api";
import { useFetch } from "../hooks/useFetch";
import StatCard from "../components/ui/StatCard";
import ProjectCard from "../components/ProjectCard";
import GlassCard from "../components/ui/GlassCard";
import Modal from "../components/ui/Modal";
import FloatingInput from "../components/ui/FloatingInput";

export default function DashboardPage() {
  const { data, loading, error, setData } = useFetch("/projects", []);
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const createProject = async () => {
    if (!projectName.trim()) return;
    const response = await api.post("/projects", { projectName });
    setData((current) => ({ projects: [response.data.project, ...(current?.projects || [])] }));
    setProjectName("");
    setOpen(false);
  };

  const projects = data?.projects || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold">Annotation projects</h1>
        </div>
        <button className="gradient-button" onClick={() => setOpen(true)}>
          Create project
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Projects" value={projects.length} accent="bg-sky-500" />
        <StatCard
          label="Folders linked"
          value={projects.filter((project) => project.folder_id).length}
          accent="bg-emerald-500"
        />
        <StatCard label="Ready for export" value={projects.length} accent="bg-amber-500" />
      </div>

      <GlassCard className="p-4">
        <div className="grid gap-5 xl:grid-cols-3">
          {loading ? <p className="p-4">Loading projects...</p> : null}
          {error ? <p className="p-4 text-rose-500">{error}</p> : null}
          {!loading && !projects.length ? (
            <p className="p-4 text-slate-500 dark:text-slate-400">
              No projects yet. Create one to start uploading folders and annotating files.
            </p>
          ) : null}
          {projects.map((project) => (
            <ProjectCard key={project.project_id} project={project} />
          ))}
        </div>
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Create project">
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          Choose a project name first, then create the workspace and link uploads later.
        </p>
        <div className="mb-5">
          <FloatingInput
            label="Project name"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
        </div>
        <button onClick={createProject} className="gradient-button w-full">
          Confirm
        </button>
      </Modal>
    </div>
  );
}

import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import api from "../services/api";
import { useFetch } from "../hooks/useFetch";
import GlassCard from "../components/ui/GlassCard";
import ImageCard from "../components/ImageCard";
import ClassManager from "../components/ClassManager";

export default function ProjectPage() {
  const { projectId } = useParams();
  const fileRef = useRef(null);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const projectQuery = useFetch(`/projects/${projectId}`, [projectId, refreshKey]);
  const classesQuery = useFetch(`/classes/project/${projectId}`, [projectId, refreshKey]);
  const files = projectQuery.data?.files || [];
  const perPage = 6;
  const pages = Math.max(Math.ceil(files.length / perPage), 1);

  const visibleFiles = useMemo(
    () => files.slice((page - 1) * perPage, page * perPage),
    [files, page]
  );

  const uploadFiles = async (event) => {
    const formData = new FormData();
    for (const file of event.target.files) {
      formData.append("images", file);
    }
    formData.append("projectId", projectId);
    await api.post("/folders/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Project workspace</p>
          <h1 className="mt-2 text-4xl font-semibold">
            {projectQuery.data?.project?.project_name || `Project #${projectId}`}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            webkitdirectory="true"
            onChange={uploadFiles}
          />
          <button onClick={() => fileRef.current?.click()} className="gradient-button inline-flex items-center gap-2">
            <UploadCloud size={18} />
            Upload folder
          </button>
          <Link to={`/projects/${projectId}/export`} className="rounded-2xl border border-slate-200/70 px-5 py-3 dark:border-slate-700">
            Export 
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <GlassCard>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Images</h2>
              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm text-sky-500">
                {files.length} total
              </span>
            </div>
          </GlassCard>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {visibleFiles.map((file) => (
              <ImageCard key={file.file_id} file={file} />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              className="rounded-2xl border border-slate-200/70 px-4 py-2 dark:border-slate-700"
            >
              Prev
            </button>
            <span className="rounded-2xl bg-white/50 px-4 py-2 dark:bg-slate-900/40">
              Page {page} / {pages}
            </span>
            <button
              onClick={() => setPage((current) => Math.min(current + 1, pages))}
              className="rounded-2xl border border-slate-200/70 px-4 py-2 dark:border-slate-700"
            >
              Next
            </button>
          </div>
        </div>

        <GlassCard>
          <h2 className="text-xl font-semibold">Project classes</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Add the labels your annotators can assign while drawing bounding boxes.
          </p>
          <div className="mt-6">
            <ClassManager
              projectId={projectId}
              classes={classesQuery.data?.classes || []}
              onUpdated={() => setRefreshKey((value) => value + 1)}
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

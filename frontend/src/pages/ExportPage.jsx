import { useParams } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import { useFetch } from "../hooks/useFetch";
import api from "../services/api";

export default function ExportPage() {
  const { projectId } = useParams();
  const { data } = useFetch(`/annotations/export/${projectId}`, [projectId]);
  const classesExport = useFetch(`/annotations/export/${projectId}/classes`, [projectId]);

  const downloadCsv = async () => {
    const response = await api.get(`/annotations/export/${projectId}?download=true`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `project-${projectId}-annotations.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadClassesTxt = async () => {
    const response = await api.get(`/annotations/export/${projectId}/classes?download=true`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `project-${projectId}-classes.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <GlassCard className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Export</p>
          <h1 className="mt-2 text-4xl font-semibold">Project #{projectId} annotations</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Export all bounding boxes as CSV with file, class, and geometry columns.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={downloadCsv} className="gradient-button">
            Export CSV
          </button>
          <button
            onClick={downloadClassesTxt}
            className="rounded-2xl border border-slate-200/70 px-5 py-3 font-semibold dark:border-slate-700"
          >
            Export Classes TXT
          </button>
        </div>
      </GlassCard>

      <div className="grid gap-5 md:grid-cols-3">
        <GlassCard>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total rows</p>
          <p className="mt-4 text-3xl font-semibold">{data?.summary?.annotationCount || 0}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-500 dark:text-slate-400">Files covered</p>
          <p className="mt-4 text-3xl font-semibold">{data?.summary?.fileCount || 0}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-500 dark:text-slate-400">Classes used</p>
          <p className="mt-4 text-3xl font-semibold">{data?.summary?.classCount || 0}</p>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2">file_name</th>
                <th className="px-3 py-2">object_count</th>
                <th className="px-3 py-2">class_name</th>
                <th className="px-3 py-2">x_min</th>
                <th className="px-3 py-2">y_min</th>
                <th className="px-3 py-2">width</th>
                <th className="px-3 py-2">height</th>
              </tr>
            </thead>
            <tbody>
              {(data?.rows || []).map((row, index) => (
                <tr key={`${row.file_name}-${row.class_name}-${index}`} className="border-t border-slate-200/60 dark:border-slate-800">
                  <td className="px-3 py-3">{row.file_name}</td>
                  <td className="px-3 py-3">{row.object_count}</td>
                  <td className="px-3 py-3">{row.class_name}</td>
                  <td className="px-3 py-3">{row.x_min}</td>
                  <td className="px-3 py-3">{row.y_min}</td>
                  <td className="px-3 py-3">{row.width}</td>
                  <td className="px-3 py-3">{row.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-xl font-semibold">Class List TXT Preview</h2>
        <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-slate-100/80 p-4 text-sm dark:bg-slate-950/60">
          {classesExport.data?.preview || "No classes available for this project."}
        </pre>
      </GlassCard>
    </div>
  );
}

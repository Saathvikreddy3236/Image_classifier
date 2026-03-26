import { Link, useParams } from "react-router-dom";
import GlassCard from "./ui/GlassCard";

export default function ImageCard({ file }) {
  const { projectId } = useParams();

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="aspect-[4/3] overflow-hidden bg-slate-200/70 dark:bg-slate-800">
        <img
          src={file.file_url}
          alt={file.file_name}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="truncate font-semibold">{file.file_name}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Objects: {file.object_count}
            </p>
          </div>
          <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-500">
            #{file.file_id}
          </span>
        </div>
        <Link to={`/projects/${projectId}/annotate/${file.file_id}`} className="gradient-button mt-5 inline-block">
          Annotate image
        </Link>
      </div>
    </GlassCard>
  );
}

import { useEffect, useRef, useState } from "react";
import { Trash2, ZoomIn, ZoomOut } from "lucide-react";

function normalizeBox(box) {
  const x = Math.min(box.x1, box.x2);
  const y = Math.min(box.y1, box.y2);
  return {
    x,
    y,
    width: Math.abs(box.x2 - box.x1),
    height: Math.abs(box.y2 - box.y1)
  };
}

export default function AnnotationCanvas({
  file,
  classes,
  annotations,
  selectedClass,
  setSelectedClass,
  onSave,
  onDelete
}) {
  const containerRef = useRef(null);
  const [draft, setDraft] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);

  useEffect(() => {
    setSelectedBox(null);
  }, [file?.file_id]);

  const toLocalPoint = (event) => {
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - pan.x) / zoom,
      y: (event.clientY - rect.top - pan.y) / zoom
    };
  };

  const handleMouseDown = (event) => {
    if (!selectedClass) return;
    const point = toLocalPoint(event);
    setDraft({ x1: point.x, y1: point.y, x2: point.x, y2: point.y });
  };

  const handleMouseMove = (event) => {
    if (draft) {
      const point = toLocalPoint(event);
      setDraft((current) => ({ ...current, x2: point.x, y2: point.y }));
      return;
    }

    if (dragging) {
      setPan((current) => ({
        x: current.x + event.movementX,
        y: current.y + event.movementY
      }));
    }
  };

  const finishDraft = () => {
    if (!draft) return;
    const normalized = normalizeBox(draft);
    if (normalized.width > 8 && normalized.height > 8) {
      onSave({
        class_id: Number(selectedClass),
        coordinates: normalized
      });
    }
    setDraft(null);
  };

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1fr_320px]">
      <div className="glass-panel relative overflow-hidden rounded-[2rem] border shadow-glass">
        <div className="absolute left-4 top-4 z-20 flex gap-3">
          <button onClick={() => setZoom((z) => Math.min(z + 0.2, 3))} className="rounded-2xl bg-white/80 p-3 dark:bg-slate-900/70">
            <ZoomIn size={18} />
          </button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))} className="rounded-2xl bg-white/80 p-3 dark:bg-slate-900/70">
            <ZoomOut size={18} />
          </button>
          <button
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
            className="rounded-2xl bg-white/80 px-4 py-3 text-sm dark:bg-slate-900/70"
          >
            Pan
          </button>
        </div>

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={finishDraft}
          onMouseLeave={() => {
            setDragging(false);
            finishDraft();
          }}
          className="relative h-[72vh] cursor-crosshair overflow-hidden rounded-[2rem]"
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            <img src={file.file_url} alt={file.file_name} className="max-h-[72vh] rounded-[2rem]" draggable={false} />
            {annotations.map((annotation, index) => {
              const box = annotation.coordinates;
              const isSelected = selectedBox === index;
              return (
                <button
                  key={`${annotation.class_id}-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBox(index);
                  }}
                  className={`absolute border-2 ${isSelected ? "border-rose-500 bg-rose-500/10" : "border-sky-400 bg-sky-500/10"}`}
                  style={{
                    left: box.x,
                    top: box.y,
                    width: box.width,
                    height: box.height
                  }}
                />
              );
            })}
            {draft ? (
              <div
                className="absolute border-2 border-amber-400 bg-amber-400/10"
                style={{
                  left: normalizeBox(draft).x,
                  top: normalizeBox(draft).y,
                  width: normalizeBox(draft).width,
                  height: normalizeBox(draft).height
                }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <aside className="glass-panel soft-scrollbar flex h-[72vh] flex-col overflow-auto rounded-[2rem] p-5 shadow-glass">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-sky-500">Toolbar</p>
          <select
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="mt-4 w-full rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/60"
          >
            <option value="">Select class</option>
            {classes.map((item) => (
              <option key={item.class_id} value={item.class_id}>
                {item.classname || item.className}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold">Classes</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {classes.map((item) => (
              <button
                key={item.class_id}
                onClick={() => setSelectedClass(item.class_id)}
                className={`rounded-full px-3 py-2 text-sm ${
                  Number(selectedClass) === item.class_id
                    ? "bg-sky-500 text-white"
                    : "bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                {item.classname || item.className}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Annotations</h3>
            <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm text-sky-500">
              {annotations.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {annotations.map((annotation, index) => (
              <div
                key={`${annotation.class_id}-${index}-item`}
                className={`rounded-2xl border px-4 py-3 ${
                  selectedBox === index
                    ? "border-rose-300 bg-rose-500/10"
                    : "border-slate-200/70 bg-white/50 dark:border-slate-700 dark:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">Class #{annotation.class_id}</p>
                    <p className="text-xs text-slate-500">
                      x:{annotation.coordinates.x.toFixed(1)} y:{annotation.coordinates.y.toFixed(1)}
                    </p>
                  </div>
                  <button onClick={() => onDelete(annotation.class_id, index)} className="text-rose-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

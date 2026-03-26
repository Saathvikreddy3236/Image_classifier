import { useState } from "react";
import api from "../services/api";
import FloatingInput from "./ui/FloatingInput";

export default function ClassManager({ projectId, classes = [], onUpdated }) {
  const [name, setName] = useState("");

  const createClass = async () => {
    if (!name.trim()) return;
    await api.post("/classes", { projectId, className: name });
    setName("");
    onUpdated();
  };

  const removeClass = async (classId) => {
    await api.delete(`/classes/${classId}`, { data: { projectId } });
    onUpdated();
  };

  return (
    <div className="space-y-4">
      <FloatingInput label="Add class" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={createClass} className="gradient-button w-full">
        Save class
      </button>
      <div className="space-y-3">
        {classes.map((item) => (
          <div
            key={item.class_id}
            className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/40"
          >
            <span>{item.classname || item.className}</span>
            <button onClick={() => removeClass(item.class_id)} className="text-rose-500">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

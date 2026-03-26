import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useFetch } from "../hooks/useFetch";
import AnnotationCanvas from "../components/AnnotationCanvas";
import GlassCard from "../components/ui/GlassCard";

export default function AnnotationPage() {
  const { projectId, fileId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const classesQuery = useFetch(`/classes/project/${projectId}`, [projectId, refreshKey]);
  const fileQuery = useFetch(`/files/${fileId}`, [fileId]);
  const annotationQuery = useFetch(`/annotations/file/${fileId}`, [fileId]);
  const [selectedClass, setSelectedClass] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [saveState, setSaveState] = useState("Draw a box to begin");
  const [pendingBox, setPendingBox] = useState(null);
  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    setAnnotations(annotationQuery.data?.annotations || []);
  }, [annotationQuery.data]);

  useEffect(() => {
    setPendingBox(null);
    setNewClassName("");
  }, [fileId]);

  const file = fileQuery.data?.file;
  const classes = classesQuery.data?.classes || [];
  const summary = useMemo(
    () =>
      annotations.reduce((total, item) => total + Number(item.coordinates?.width > 0 && item.coordinates?.height > 0), 0),
    [annotations]
  );

  const handleDraftComplete = (coordinates) => {
    setPendingBox(coordinates);
    setSaveState("Draft ready");
  };

  const handleCreateClass = async () => {
    if (newClassName.trim()) {
      const classResponse = await api.post("/classes", {
        projectId,
        className: newClassName.trim()
      });
      const createdClassId = classResponse.data.class.class_id;
      setSelectedClass(createdClassId);
      setNewClassName("");
      setRefreshKey((value) => value + 1);
      setSaveState("Class created");
    }
  };

  const handleSave = async () => {
    if (!pendingBox || !selectedClass) return;

    const response = await api.post("/annotations", {
      fileId,
      class_id: Number(selectedClass),
      coordinates: pendingBox
    });
    setAnnotations(response.data.annotations);
    setPendingBox(null);
    setSaveState("Annotation saved");
  };

  const handleDelete = async (classId, index) => {
    const response = await api.delete(`/annotations/file/${fileId}/${classId}/${index}`);
    setAnnotations(response.data.annotations);
    setSaveState("Annotation removed");
  };

  if (!file) {
    return <p>Loading annotation workspace...</p>;
  }

  return (
    <div className="space-y-6">
      <GlassCard className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Annotation canvas</p>
          <h1 className="mt-2 text-3xl font-semibold">{file.file_name}</h1>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-sky-500/10 px-4 py-2 text-sky-500">{summary} boxes</span>
          <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-500">{saveState}</span>
        </div>
      </GlassCard>

      <AnnotationCanvas
        file={file}
        classes={classes}
        annotations={annotations}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        pendingBox={pendingBox}
        newClassName={newClassName}
        setNewClassName={setNewClassName}
        onCreateClass={handleCreateClass}
        onDraftComplete={handleDraftComplete}
        onSavePending={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

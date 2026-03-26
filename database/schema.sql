CREATE TABLE IF NOT EXISTS "user" (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS folder (
  folder_id SERIAL PRIMARY KEY,
  file_id INTEGER,
  file_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS project (
  project_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  project_name VARCHAR(150) NOT NULL,
  folder_id INTEGER,
  CONSTRAINT fk_project_user FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_project_folder FOREIGN KEY (folder_id) REFERENCES folder(folder_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS files (
  file_id SERIAL PRIMARY KEY,
  folder_id INTEGER NOT NULL,
  object_count INTEGER DEFAULT 0,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  CONSTRAINT fk_files_folder FOREIGN KEY (folder_id) REFERENCES folder(folder_id) ON DELETE CASCADE
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_folder_file'
      AND table_name = 'folder'
  ) THEN
    ALTER TABLE folder
      ADD CONSTRAINT fk_folder_file FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS classes (
  class_id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  className VARCHAR(150) NOT NULL,
  CONSTRAINT fk_classes_project FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS objects (
  class_id INTEGER NOT NULL,
  file_id INTEGER NOT NULL,
  coordinates JSONB NOT NULL,
  CONSTRAINT fk_objects_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
  CONSTRAINT fk_objects_file FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE
);

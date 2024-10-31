// server/server.ts

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import db from "./db/db";
import { serveStatic } from "@hono/node-server/serve-static";
import { v4 as uuidv4 } from "uuid";
import createProjectsTable from './db/tables';

const app = new Hono();

// Initier tabeller
createProjectsTable();

// Aktiver CORS for alle ruter
app.use("/*", cors());

// Serve statiske filer fra ./dist
app.get("/statics/*", serveStatic({ root: "./dist" }));

// GET alle prosjekter
app.get("/json", async (c) => {
  try {
    const stmt = db.prepare("SELECT id, title, description FROM projects");
    const projects = stmt.all();
    return c.json(projects);
  } catch (error) {
    return c.json({ message: "Error fetching projects", error }, 500);
  }
});

// Legg til et nytt prosjekt
app.post("/json", async (c) => {
  try {
    const newProject = await c.req.json();
    const { title, description } = newProject;

    if (!title || !description) {
      return c.json({ message: "Title and description are required" }, 400);
    }

    const id = uuidv4();

    const stmt = db.prepare("INSERT INTO projects (id, title, description) VALUES (?, ?, ?)");
    stmt.run(id, title, description);

    const insertedProject = { id, title, description };

    return c.json({ message: "Project added successfully!", project: insertedProject }, 201);
  } catch (error) {
    return c.json({ message: "Error adding project", error }, 500);
  }
});

// Oppdater et eksisterende prosjekt
app.put("/json/:id", async (c) => {
  try {
    const projectId = c.req.param("id");
    const updatedProject = await c.req.json();
    const { title, description } = updatedProject;

    if (!title || !description) {
      return c.json({ message: "Title and description are required" }, 400);
    }

    const selectStmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    const existingProject = selectStmt.get(projectId);

    if (!existingProject) {
      return c.json({ message: "Project not found" }, 404);
    }

    const updateStmt = db.prepare("UPDATE projects SET title = ?, description = ? WHERE id = ?");
    updateStmt.run(title, description, projectId);

    const updatedProjectData = { id: projectId, title, description };

    return c.json({
      message: "Project updated successfully!",
      project: updatedProjectData,
    });
  } catch (error) {
    return c.json({ message: "Error updating project", error }, 500);
  }
});

// Slett et prosjekt
app.delete("/json/:id", async (c) => {
  try {
    const projectId = c.req.param("id");

    const selectStmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    const existingProject = selectStmt.get(projectId);

    if (!existingProject) {
      return c.json({ message: "Project not found" }, 404);
    }

    const deleteStmt = db.prepare("DELETE FROM projects WHERE id = ?");
    deleteStmt.run(projectId);

    const remainingProjects = db.prepare("SELECT id, title, description FROM projects").all();

    return c.json({
      message: "Project deleted successfully!",
      projects: remainingProjects,
    });
  } catch (error) {
    return c.json({ message: "Error deleting project", error }, 500);
  }
});

const port = 1234;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { readFile, writeFile } from "node:fs/promises";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.use("/*", cors());

app.get("/statics/*", serveStatic({ root: "./dist" }));

app.get("/json", async (c) => {
  try {
    const data = await readFile("./server/Data.json", "utf-8");
    const parsedData = JSON.parse(data);
    return c.json(parsedData.ProjectInformation);
  } catch (error) {
    return c.json({ message: "Error reading data", error }, 500);
  }
});

app.post("/json", async (c) => {
  try {
    const newProject = await c.req.json();

    const data = await readFile("./server/Data.json", "utf-8");
    const parsedData = JSON.parse(data);

    newProject.Id = parsedData.ProjectInformation.length + 1;

    parsedData.ProjectInformation.push(newProject);

    await writeFile("./server/Data.json", JSON.stringify(parsedData, null, 2));

    return c.json({ message: "Project added successfully!", projects: parsedData.ProjectInformation });
  } catch (error) {
    return c.json({ message: "Error writing data", error }, 500);
  }
});

const port = 4000;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

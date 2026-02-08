import { getProject } from "@theatre/core";
import type { IProject } from "@theatre/core";

let project: IProject | null = null;

export function getTheatreProject(): IProject {
  if (!project) {
    project = getProject("VINO12");
  }
  return project;
}

export async function initTheatreStudio(): Promise<void> {
  if (process.env.NODE_ENV !== "development") return;
  try {
    const studio = await import("@theatre/studio");
    studio.default.initialize();
  } catch {
    // Studio not available in production build
  }
}

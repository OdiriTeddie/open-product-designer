import type { SavedDesign } from "./types";
import { cloneDesignerObjects } from "./objects";

export function cloneSavedDesign(design: SavedDesign): SavedDesign {
  return {
    ...design,
    objects: cloneDesignerObjects(design.objects),
  };
}

export function serializeDesign(design: SavedDesign): string {
  return JSON.stringify(cloneSavedDesign(design), null, 2);
}

export function deserializeDesign(json: string): SavedDesign {
  const parsed = JSON.parse(json) as SavedDesign;
  return cloneSavedDesign(parsed);
}

export function createEmptyDesign(
  templateId: string,
  activeSideId: string,
): SavedDesign {
  return {
    templateId,
    activeSideId,
    objects: [],
  };
}

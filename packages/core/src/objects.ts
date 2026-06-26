import type { CreateDesignerObjectInput, DesignerObject } from "./types";
import { createObjectId } from "./ids";

export function createDesignerObject(
  input: CreateDesignerObjectInput,
): DesignerObject {
  return {
    ...input,
    id: input.id ?? createObjectId(input.type),
    rotation: input.rotation ?? 0,
  };
}

export function cloneDesignerObject(object: DesignerObject): DesignerObject {
  return { ...object };
}

export function cloneDesignerObjects(
  objects: DesignerObject[],
): DesignerObject[] {
  return objects.map(cloneDesignerObject);
}

export function updateDesignerObject(
  objects: DesignerObject[],
  objectId: string,
  patch: Partial<Omit<DesignerObject, "id">>,
): DesignerObject[] {
  return objects.map((object) =>
    object.id === objectId ? { ...object, ...patch } : object,
  );
}

export function removeDesignerObject(
  objects: DesignerObject[],
  objectId: string,
): DesignerObject[] {
  return objects.filter((object) => object.id !== objectId);
}

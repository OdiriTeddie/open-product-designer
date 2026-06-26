import type { DesignerObject } from "./types";

function findLayerIndex(objects: DesignerObject[], objectId: string): number {
  return objects.findIndex((object) => object.id === objectId);
}

function moveLayer(
  objects: DesignerObject[],
  objectId: string,
  targetIndex: number,
): DesignerObject[] {
  const currentIndex = findLayerIndex(objects, objectId);

  if (currentIndex === -1 || currentIndex === targetIndex) {
    return [...objects];
  }

  const nextObjects = [...objects];
  const [object] = nextObjects.splice(currentIndex, 1);

  if (!object) {
    return [...objects];
  }

  nextObjects.splice(targetIndex, 0, object);
  return nextObjects;
}

export function bringObjectForward(
  objects: DesignerObject[],
  objectId: string,
): DesignerObject[] {
  const currentIndex = findLayerIndex(objects, objectId);

  if (currentIndex === -1 || currentIndex === objects.length - 1) {
    return [...objects];
  }

  return moveLayer(objects, objectId, currentIndex + 1);
}

export function sendObjectBackward(
  objects: DesignerObject[],
  objectId: string,
): DesignerObject[] {
  const currentIndex = findLayerIndex(objects, objectId);

  if (currentIndex <= 0) {
    return [...objects];
  }

  return moveLayer(objects, objectId, currentIndex - 1);
}

export function bringObjectToFront(
  objects: DesignerObject[],
  objectId: string,
): DesignerObject[] {
  return moveLayer(objects, objectId, objects.length - 1);
}

export function sendObjectToBack(
  objects: DesignerObject[],
  objectId: string,
): DesignerObject[] {
  return moveLayer(objects, objectId, 0);
}

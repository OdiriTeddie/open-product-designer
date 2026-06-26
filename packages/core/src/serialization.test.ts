import { describe, expect, it } from "vitest";
import {
  cloneSavedDesign,
  createEmptyDesign,
  deserializeDesign,
  serializeDesign,
} from "./serialization";
import type { SavedDesign } from "./types";

describe("serialization helpers", () => {
  it("creates an empty saved design", () => {
    expect(createEmptyDesign("basic-shirt", "front")).toEqual({
      templateId: "basic-shirt",
      activeSideId: "front",
      objects: [],
    });
  });

  it("serializes and deserializes a saved design", () => {
    const design: SavedDesign = {
      templateId: "basic-shirt",
      activeSideId: "front",
      objects: [
        {
          id: "text-1",
          type: "text",
          sideId: "front",
          x: 20,
          y: 30,
          text: "Hello",
        },
      ],
    };

    expect(deserializeDesign(serializeDesign(design))).toEqual(design);
  });

  it("clones saved designs without sharing the objects array", () => {
    const design: SavedDesign = {
      templateId: "basic-shirt",
      activeSideId: "front",
      objects: [],
    };

    const cloned = cloneSavedDesign(design);

    expect(cloned).toEqual(design);
    expect(cloned).not.toBe(design);
    expect(cloned.objects).not.toBe(design.objects);
  });
});

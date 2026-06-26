import { describe, expect, it } from "vitest";
import type { DesignerObject } from "./types";
import {
  bringObjectForward,
  bringObjectToFront,
  sendObjectBackward,
  sendObjectToBack,
} from "./layers";

const objects: DesignerObject[] = [
  { id: "one", type: "text", sideId: "front", x: 0, y: 0 },
  { id: "two", type: "text", sideId: "front", x: 0, y: 0 },
  { id: "three", type: "text", sideId: "front", x: 0, y: 0 },
];

function ids(items: DesignerObject[]): string[] {
  return items.map((object) => object.id);
}

describe("layer helpers", () => {
  it("brings an object forward one layer", () => {
    expect(ids(bringObjectForward(objects, "one"))).toEqual([
      "two",
      "one",
      "three",
    ]);
  });

  it("sends an object backward one layer", () => {
    expect(ids(sendObjectBackward(objects, "three"))).toEqual([
      "one",
      "three",
      "two",
    ]);
  });

  it("brings an object to the front", () => {
    expect(ids(bringObjectToFront(objects, "one"))).toEqual([
      "two",
      "three",
      "one",
    ]);
  });

  it("sends an object to the back", () => {
    expect(ids(sendObjectToBack(objects, "three"))).toEqual([
      "three",
      "one",
      "two",
    ]);
  });
});

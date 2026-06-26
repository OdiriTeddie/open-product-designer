import { describe, expect, it } from "vitest";
import {
  createDesignerObject,
  removeDesignerObject,
  updateDesignerObject,
} from "./objects";

describe("designer object helpers", () => {
  it("creates an object with an id and default rotation", () => {
    const object = createDesignerObject({
      type: "text",
      sideId: "front",
      x: 10,
      y: 20,
      text: "Hello",
    });

    expect(object.id).toMatch(/^text-/);
    expect(object.rotation).toBe(0);
  });

  it("updates an object without mutating the original array", () => {
    const objects = [
      createDesignerObject({
        id: "text-1",
        type: "text",
        sideId: "front",
        x: 10,
        y: 20,
        text: "Hello",
      }),
    ];

    const updated = updateDesignerObject(objects, "text-1", {
      text: "Updated",
      fill: "#111111",
    });

    expect(updated).not.toBe(objects);
    expect(updated[0]?.text).toBe("Updated");
    expect(objects[0]?.text).toBe("Hello");
  });

  it("removes an object by id", () => {
    const objects = [
      createDesignerObject({
        id: "text-1",
        type: "text",
        sideId: "front",
        x: 10,
        y: 20,
      }),
    ];

    expect(removeDesignerObject(objects, "text-1")).toEqual([]);
  });
});

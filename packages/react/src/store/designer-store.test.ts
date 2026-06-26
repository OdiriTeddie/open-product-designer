import { describe, expect, it } from "vitest";
import { createDesignerStore } from "./designer-store";
import type { ProductTemplate } from "@open-product-designer/core";

const template: ProductTemplate = {
  id: "basic-shirt",
  name: "Basic T-Shirt",
  width: 600,
  height: 700,
  sides: [
    {
      id: "front",
      name: "Front",
      printArea: {
        x: 150,
        y: 150,
        width: 300,
        height: 400,
      },
    },
  ],
};

describe("designer store", () => {
  it("initializes from a product template", () => {
    const store = createDesignerStore({ template });

    expect(store.getState().template?.id).toBe("basic-shirt");
    expect(store.getState().design).toEqual({
      templateId: "basic-shirt",
      activeSideId: "front",
      objects: [],
    });
  });

  it("adds text and selects it", () => {
    const store = createDesignerStore({ template });
    const object = store.getState().addText("Hello");

    expect(object.type).toBe("text");
    expect(object.text).toBe("Hello");
    expect(store.getState().selectedObjectId).toBe(object.id);
    expect(store.getState().design.objects).toHaveLength(1);
  });

  it("adds an image object", () => {
    const store = createDesignerStore({ template });
    const object = store.getState().addImage("data:image/png;base64,test");

    expect(object.type).toBe("image");
    expect(object.src).toBe("data:image/png;base64,test");
    expect(store.getState().design.objects).toHaveLength(1);
  });

  it("updates and deletes the selected object", () => {
    const store = createDesignerStore({ template });
    const object = store.getState().addText("Hello");

    store.getState().updateSelectedObject({ text: "Updated" });

    expect(store.getState().design.objects[0]?.text).toBe("Updated");

    store.getState().deleteSelectedObject();

    expect(store.getState().design.objects).toEqual([]);
    expect(store.getState().selectedObjectId).toBeNull();
  });

  it("orders selected objects by layer", () => {
    const store = createDesignerStore({ template });
    const first = store.getState().addText("One");
    const second = store.getState().addText("Two");

    store.getState().selectObject(first.id);
    store.getState().bringSelectedForward();

    expect(store.getState().design.objects.map((object) => object.id)).toEqual([
      second.id,
      first.id,
    ]);

    store.getState().sendSelectedBackward();

    expect(store.getState().design.objects.map((object) => object.id)).toEqual([
      first.id,
      second.id,
    ]);
  });

  it("supports undo and redo", () => {
    const store = createDesignerStore({ template });

    store.getState().addText("One");
    store.getState().addText("Two");

    expect(store.getState().design.objects).toHaveLength(2);

    store.getState().undo();

    expect(store.getState().design.objects).toHaveLength(1);

    store.getState().redo();

    expect(store.getState().design.objects).toHaveLength(2);
  });

  it("saves and loads design JSON", () => {
    const store = createDesignerStore({ template });
    store.getState().addText("Saved");

    const json = store.getState().saveDesign();
    const nextStore = createDesignerStore({ template });

    nextStore.getState().loadDesign(json);

    expect(nextStore.getState().design.objects[0]?.text).toBe("Saved");
  });
});

import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
} from "react";
import {
  Canvas,
  FabricImage,
  Rect,
  Textbox,
  type FabricObject,
} from "fabric";
import type {
  DesignerObject,
  ProductTemplate,
  ProductTemplateSide,
} from "@open-product-designer/core";
import { designerStore, useDesignerStore } from "../store";

type FabricDesignerObject = FabricObject & {
  designerObjectId?: string;
};

export type DesignerCanvasProps = {
  className?: string;
  style?: CSSProperties;
};

const PRODUCT_PLACEHOLDER_ID = "__opd_product_placeholder__";
const PRINT_AREA_ID = "__opd_print_area__";

function getActiveSide(
  template: ProductTemplate | null,
  activeSideId: string,
): ProductTemplateSide | null {
  return (
    template?.sides.find((side) => side.id === activeSideId) ??
    template?.sides[0] ??
    null
  );
}

function setDesignerObjectId(
  object: FabricObject,
  designerObjectId: string,
): FabricDesignerObject {
  const objectWithId = object as FabricDesignerObject;
  objectWithId.designerObjectId = designerObjectId;
  return objectWithId;
}

function createPlaceholder(template: ProductTemplate): Rect {
  const inset = 24;

  return new Rect({
    left: inset,
    top: inset,
    width: template.width - inset * 2,
    height: template.height - inset * 2,
    rx: 28,
    ry: 28,
    fill: "#f8fafc",
    stroke: "#cbd5e1",
    strokeWidth: 2,
    selectable: false,
    evented: false,
    excludeFromExport: true,
  });
}

function createPrintArea(side: ProductTemplateSide): Rect {
  return new Rect({
    left: side.printArea.x,
    top: side.printArea.y,
    width: side.printArea.width,
    height: side.printArea.height,
    fill: "rgba(14, 165, 233, 0.06)",
    stroke: "#0ea5e9",
    strokeDashArray: [8, 6],
    strokeWidth: 2,
    selectable: false,
    evented: false,
    excludeFromExport: true,
  });
}

async function createBackgroundImage(
  side: ProductTemplateSide,
  template: ProductTemplate,
): Promise<FabricImage | null> {
  if (!side.backgroundImage) {
    return null;
  }

  const image = await FabricImage.fromURL(side.backgroundImage, {
    crossOrigin: "anonymous",
  });

  image.set({
    left: 0,
    top: 0,
    selectable: false,
    evented: false,
    excludeFromExport: true,
  });

  image.scaleToWidth(template.width);
  image.scaleToHeight(template.height);

  return image;
}

async function createFabricObject(
  object: DesignerObject,
): Promise<FabricDesignerObject | null> {
  if (object.type === "text") {
    return setDesignerObjectId(
      new Textbox(object.text ?? "", {
        left: object.x,
        top: object.y,
        width: object.width ?? 240,
        angle: object.rotation ?? 0,
        fill: object.fill ?? "#111827",
        fontSize: object.fontSize ?? 32,
        fontFamily: object.fontFamily ?? "Inter, Arial, sans-serif",
      }),
      object.id,
    );
  }

  if (object.type === "image" && object.src) {
    const image = await FabricImage.fromURL(object.src, {
      crossOrigin: "anonymous",
    });

    image.set({
      left: object.x,
      top: object.y,
      angle: object.rotation ?? 0,
    });

    if (object.width) {
      image.scaleToWidth(object.width);
    }

    if (object.height) {
      image.scaleToHeight(object.height);
    }

    return setDesignerObjectId(image, object.id);
  }

  if (object.type === "shape") {
    return setDesignerObjectId(
      new Rect({
        left: object.x,
        top: object.y,
        width: object.width ?? 120,
        height: object.height ?? 120,
        angle: object.rotation ?? 0,
        fill: object.fill ?? "#111827",
      }),
      object.id,
    );
  }

  return null;
}

function toDesignerPatch(object: FabricDesignerObject): Partial<DesignerObject> {
  const width = object.getScaledWidth();
  const height = object.getScaledHeight();

  return {
    x: object.left ?? 0,
    y: object.top ?? 0,
    width,
    height,
    rotation: object.angle ?? 0,
  };
}

function getCanvasObjects(canvas: Canvas): FabricDesignerObject[] {
  return canvas
    .getObjects()
    .filter(
      (object): object is FabricDesignerObject =>
        Boolean((object as FabricDesignerObject).designerObjectId),
    );
}

export function DesignerCanvas({ className, style }: DesignerCanvasProps) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const isRenderingFromStoreRef = useRef(false);

  const template = useDesignerStore((state) => state.template);
  const activeSideId = useDesignerStore((state) => state.design.activeSideId);
  const objects = useDesignerStore((state) => state.design.objects);
  const selectedObjectId = useDesignerStore((state) => state.selectedObjectId);

  const activeSide = useMemo(
    () => getActiveSide(template, activeSideId),
    [activeSideId, template],
  );

  useEffect(() => {
    if (!canvasElementRef.current || !template) {
      return;
    }

    const canvas = new Canvas(canvasElementRef.current, {
      width: template.width,
      height: template.height,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });

    canvasRef.current = canvas;

    const handleSelection = () => {
      if (isRenderingFromStoreRef.current) {
        return;
      }

      const activeObject = canvas.getActiveObject() as
        | FabricDesignerObject
        | undefined;

      designerStore
        .getState()
        .selectObject(activeObject?.designerObjectId ?? null);
    };

    const handleObjectModified = (event: { target?: FabricObject }) => {
      if (isRenderingFromStoreRef.current) {
        return;
      }

      const target = event.target as FabricDesignerObject | undefined;

      if (!target?.designerObjectId) {
        return;
      }

      designerStore
        .getState()
        .updateObject(target.designerObjectId, toDesignerPatch(target));
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleSelection);
    canvas.on("object:modified", handleObjectModified);

    return () => {
      canvas.dispose();
      canvasRef.current = null;
    };
  }, [template]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !template || !activeSide) {
      return;
    }

    const currentCanvas = canvas;
    const currentTemplate = template;
    const currentActiveSide = activeSide;
    let isCancelled = false;

    async function renderCanvas() {
      isRenderingFromStoreRef.current = true;
      currentCanvas.clear();
      currentCanvas.setDimensions({
        width: currentTemplate.width,
        height: currentTemplate.height,
      });
      currentCanvas.backgroundColor = "#ffffff";

      const background = await createBackgroundImage(
        currentActiveSide,
        currentTemplate,
      );

      if (isCancelled) {
        return;
      }

      if (background) {
        (background as FabricDesignerObject).designerObjectId =
          PRODUCT_PLACEHOLDER_ID;
        currentCanvas.add(background);
      } else {
        const placeholder = createPlaceholder(currentTemplate);
        (placeholder as FabricDesignerObject).designerObjectId =
          PRODUCT_PLACEHOLDER_ID;
        currentCanvas.add(placeholder);
      }

      const printArea = createPrintArea(currentActiveSide);
      (printArea as FabricDesignerObject).designerObjectId = PRINT_AREA_ID;
      currentCanvas.add(printArea);

      const sideObjects = objects.filter(
        (object) => object.sideId === currentActiveSide.id,
      );

      for (const object of sideObjects) {
        const fabricObject = await createFabricObject(object);

        if (isCancelled) {
          return;
        }

        if (fabricObject) {
          currentCanvas.add(fabricObject);
        }
      }

      const selectedObject = getCanvasObjects(currentCanvas).find(
        (object) => object.designerObjectId === selectedObjectId,
      );

      if (selectedObject) {
        currentCanvas.setActiveObject(selectedObject);
      } else {
        currentCanvas.discardActiveObject();
      }

      currentCanvas.requestRenderAll();
      isRenderingFromStoreRef.current = false;
    }

    void renderCanvas();

    return () => {
      isCancelled = true;
      isRenderingFromStoreRef.current = false;
    };
  }, [activeSide, objects, selectedObjectId, template]);

  if (!template) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        maxWidth: "100%",
        overflow: "auto",
        ...style,
      }}
    >
      <canvas ref={canvasElementRef} />
    </div>
  );
}

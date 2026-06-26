export type ProductSide = "front" | "back" | "left" | "right";

export type DesignerObjectType = "text" | "image" | "shape";

export type DesignerObject = {
  id: string;
  type: DesignerObjectType;
  sideId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  fill?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  src?: string;
};

export type ProductTemplate = {
  id: string;
  name: string;
  width: number;
  height: number;
  sides: ProductTemplateSide[];
};

export type ProductTemplateSide = {
  id: string;
  name: string;
  backgroundImage?: string;
  printArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type SavedDesign = {
  templateId: string;
  activeSideId: string;
  objects: DesignerObject[];
};

export function serializeDesign(design: SavedDesign): string {
  return JSON.stringify(design, null, 2);
}

export function deserializeDesign(json: string): SavedDesign {
  return JSON.parse(json) as SavedDesign;
}

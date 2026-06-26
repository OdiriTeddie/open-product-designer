export type {
  DesignerObject,
  DesignerObjectType,
  ProductSide,
  ProductTemplate,
  ProductTemplateSide,
  SavedDesign,
} from "@open-product-designer/core";

export { deserializeDesign, serializeDesign } from "@open-product-designer/core";
export {
  createDesignerStore,
  designerStore,
  useDesignerStore,
  type DesignerHistory,
  type DesignerStore,
  type DesignerStoreActions,
  type DesignerStoreOptions,
  type DesignerStoreState,
} from "./store";
export {
  DesignerCanvas,
  ProductDesigner,
  type DesignerCanvasProps,
  type ProductDesignerProps,
} from "./components";

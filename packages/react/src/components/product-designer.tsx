import { useEffect } from "react";
import type { ProductTemplate } from "@open-product-designer/core";
import { DesignerCanvas } from "./designer-canvas";
import { designerStore } from "../store";

export type ProductDesignerProps = {
  template: ProductTemplate;
};

export function ProductDesigner({ template }: ProductDesignerProps) {
  useEffect(() => {
    designerStore.getState().setTemplate(template);
  }, [template]);

  return <DesignerCanvas />;
}

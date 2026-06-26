import { useStore } from "zustand";
import { createDesignerStore, type DesignerStore } from "./designer-store";

export const designerStore = createDesignerStore();

export function useDesignerStore<T>(
  selector: (state: DesignerStore) => T,
): T {
  return useStore(designerStore, selector);
}

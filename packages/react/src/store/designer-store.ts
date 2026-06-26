import {
  bringObjectForward,
  bringObjectToFront,
  cloneSavedDesign,
  createDesignerObject,
  createEmptyDesign,
  deserializeDesign,
  removeDesignerObject,
  sendObjectBackward,
  sendObjectToBack,
  serializeDesign,
  updateDesignerObject,
  type CreateDesignerObjectInput,
  type DesignerObject,
  type ProductTemplate,
  type SavedDesign,
} from "@open-product-designer/core";
import { createStore } from "zustand/vanilla";

export type DesignerHistory = {
  past: SavedDesign[];
  future: SavedDesign[];
};

export type DesignerStoreState = {
  template: ProductTemplate | null;
  design: SavedDesign;
  selectedObjectId: string | null;
  history: DesignerHistory;
};

export type DesignerStoreActions = {
  setTemplate: (template: ProductTemplate, activeSideId?: string) => void;
  setActiveSide: (sideId: string) => void;
  selectObject: (objectId: string | null) => void;
  addObject: (input: CreateDesignerObjectInput) => DesignerObject;
  addText: (text?: string) => DesignerObject;
  addImage: (src: string) => DesignerObject;
  updateObject: (
    objectId: string,
    patch: Partial<Omit<DesignerObject, "id">>,
  ) => void;
  updateSelectedObject: (patch: Partial<Omit<DesignerObject, "id">>) => void;
  deleteSelectedObject: () => void;
  bringSelectedForward: () => void;
  sendSelectedBackward: () => void;
  bringSelectedToFront: () => void;
  sendSelectedToBack: () => void;
  undo: () => void;
  redo: () => void;
  saveDesign: () => string;
  loadDesign: (json: string) => void;
  resetHistory: () => void;
};

export type DesignerStore = DesignerStoreState & DesignerStoreActions;

export type DesignerStoreOptions = {
  template?: ProductTemplate;
  design?: SavedDesign;
};

function getDefaultActiveSideId(template?: ProductTemplate): string {
  return template?.sides[0]?.id ?? "";
}

function createInitialState(options: DesignerStoreOptions = {}): DesignerStoreState {
  const activeSideId =
    options.design?.activeSideId ?? getDefaultActiveSideId(options.template);

  return {
    template: options.template ?? null,
    design:
      options.design ??
      createEmptyDesign(options.template?.id ?? "", activeSideId),
    selectedObjectId: null,
    history: {
      past: [],
      future: [],
    },
  };
}

function withHistory(state: DesignerStoreState): Pick<DesignerStoreState, "history"> {
  return {
    history: {
      past: [...state.history.past, cloneSavedDesign(state.design)],
      future: [],
    },
  };
}

function updateDesign(
  state: DesignerStoreState,
  design: SavedDesign,
): Pick<DesignerStoreState, "design" | "history"> {
  return {
    design: cloneSavedDesign(design),
    ...withHistory(state),
  };
}

export function createDesignerStore(options: DesignerStoreOptions = {}) {
  return createStore<DesignerStore>()((set, get) => ({
    ...createInitialState(options),

    setTemplate: (template, activeSideId = getDefaultActiveSideId(template)) => {
      set({
        template,
        design: createEmptyDesign(template.id, activeSideId),
        selectedObjectId: null,
        history: { past: [], future: [] },
      });
    },

    setActiveSide: (sideId) => {
      set((state) => ({
        ...updateDesign(state, {
          ...state.design,
          activeSideId: sideId,
        }),
        selectedObjectId: null,
      }));
    },

    selectObject: (objectId) => {
      set({ selectedObjectId: objectId });
    },

    addObject: (input) => {
      const object = createDesignerObject(input);

      set((state) => ({
        ...updateDesign(state, {
          ...state.design,
          objects: [...state.design.objects, object],
        }),
        selectedObjectId: object.id,
      }));

      return object;
    },

    addText: (text = "New text") => {
      const state = get();

      return state.addObject({
        type: "text",
        sideId: state.design.activeSideId,
        x: 120,
        y: 120,
        text,
        fill: "#111827",
        fontSize: 32,
        fontFamily: "Inter, Arial, sans-serif",
      });
    },

    addImage: (src) => {
      const state = get();

      return state.addObject({
        type: "image",
        sideId: state.design.activeSideId,
        x: 120,
        y: 120,
        width: 160,
        height: 160,
        src,
      });
    },

    updateObject: (objectId, patch) => {
      set((state) => ({
        ...updateDesign(state, {
          ...state.design,
          objects: updateDesignerObject(state.design.objects, objectId, patch),
        }),
      }));
    },

    updateSelectedObject: (patch) => {
      const selectedObjectId = get().selectedObjectId;

      if (!selectedObjectId) {
        return;
      }

      get().updateObject(selectedObjectId, patch);
    },

    deleteSelectedObject: () => {
      const selectedObjectId = get().selectedObjectId;

      if (!selectedObjectId) {
        return;
      }

      set((state) => ({
        ...updateDesign(state, {
          ...state.design,
          objects: removeDesignerObject(state.design.objects, selectedObjectId),
        }),
        selectedObjectId: null,
      }));
    },

    bringSelectedForward: () => {
      const selectedObjectId = get().selectedObjectId;

      if (!selectedObjectId) {
        return;
      }

      set((state) => ({
        ...updateDesign(state, {
          ...state.design,
          objects: bringObjectForward(state.design.objects, selectedObjectId),
        }),
      }));
    },

    sendSelectedBackward: () => {
      const selectedObjectId = get().selectedObjectId;

      if (!selectedObjectId) {
        return;
      }

      set((state) => ({
        ...updateDesign(state, {
          ...state.design,
          objects: sendObjectBackward(state.design.objects, selectedObjectId),
        }),
      }));
    },

    bringSelectedToFront: () => {
      const selectedObjectId = get().selectedObjectId;

      if (!selectedObjectId) {
        return;
      }

      set((state) => ({
        ...updateDesign(state, {
          ...state.design,
          objects: bringObjectToFront(state.design.objects, selectedObjectId),
        }),
      }));
    },

    sendSelectedToBack: () => {
      const selectedObjectId = get().selectedObjectId;

      if (!selectedObjectId) {
        return;
      }

      set((state) => ({
        ...updateDesign(state, {
          ...state.design,
          objects: sendObjectToBack(state.design.objects, selectedObjectId),
        }),
      }));
    },

    undo: () => {
      const state = get();
      const previous = state.history.past.at(-1);

      if (!previous) {
        return;
      }

      set({
        design: cloneSavedDesign(previous),
        selectedObjectId: null,
        history: {
          past: state.history.past.slice(0, -1),
          future: [cloneSavedDesign(state.design), ...state.history.future],
        },
      });
    },

    redo: () => {
      const state = get();
      const next = state.history.future[0];

      if (!next) {
        return;
      }

      set({
        design: cloneSavedDesign(next),
        selectedObjectId: null,
        history: {
          past: [...state.history.past, cloneSavedDesign(state.design)],
          future: state.history.future.slice(1),
        },
      });
    },

    saveDesign: () => serializeDesign(get().design),

    loadDesign: (json) => {
      const design = deserializeDesign(json);

      set((state) => ({
        ...updateDesign(state, design),
        selectedObjectId: null,
      }));
    },

    resetHistory: () => {
      set({ history: { past: [], future: [] } });
    },
  }));
}

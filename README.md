# Open Product Designer

Open Product Designer is an open-source, React-first product customization editor for custom products such as T-shirts, mugs, cards, posters, labels, phone cases, and other printable or configurable items.

The goal is to provide a reusable editor foundation that can be embedded into ecommerce, print-on-demand, and product personalization workflows.

> This project is in early V1 development. The current focus is the editor foundation, not ecommerce integrations or production print pipelines.

## Vision

Open Product Designer aims to become a framework-friendly product design engine with:

- A framework-agnostic core design model
- A React SDK
- A working browser-based editor
- Exportable customer designs
- Future Vue/Nuxt support
- Future Next.js, Shopify, WooCommerce, and Laravel integrations
- Future print and ecommerce workflow helpers

## V1 Scope

Version 1 focuses on the editor foundation:

- Product template data model
- Design object data model
- Canvas editor using Fabric.js
- React components for the editor UI
- Zustand-powered editor state
- Text and image objects
- Object selection, movement, resizing, and rotation
- Layer ordering
- Undo and redo
- Save and load JSON
- Export PNG
- Vite playground app

## Non-Goals For V1

These are intentionally out of scope for the first version:

- Ecommerce checkout flows
- Shopify, WooCommerce, Laravel, or Next.js integrations
- Backend APIs
- Admin dashboard
- User accounts
- Pricing rules
- Print vendor integrations
- Advanced print-ready exports such as PDF, SVG, CMYK, bleed, or DPI enforcement
- Multi-framework SDKs beyond React

## Repository Structure

```txt
open-product-designer/
  apps/
    playground/
  packages/
    core/
    react/
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
```

## Packages

### `@open-product-designer/core`

Framework-agnostic product designer logic.

This package owns:

- Product template types
- Design object types
- Saved design types
- Serialization helpers
- Deserialization helpers
- Shared utility functions

It must not import React, Fabric.js, browser-only APIs, or framework-specific code.

### `@open-product-designer/react`

React implementation of the product designer.

This package owns:

- React components
- Fabric.js canvas integration
- Zustand editor store
- Toolbar, canvas, layers, and properties UI
- Editor actions such as add text, upload image, delete, undo, redo, save, load, and export

Fabric-specific logic should stay in this package.

### `@open-product-designer/playground`

Local Vite app used to develop and test the editor.

The playground should remain a practical implementation surface, not a marketing site.

## Tech Stack

- pnpm workspaces
- Vite
- React
- TypeScript
- Fabric.js
- Zustand
- Vitest
- ESLint

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the playground:

```bash
pnpm dev
```

Build all packages and apps:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

Run linting:

```bash
pnpm lint
```

## Development Workflow

Most editor work should follow this order:

1. Add or update framework-agnostic types and helpers in `packages/core`.
2. Add React state/actions in `packages/react`.
3. Add or update Fabric.js behavior in `packages/react`.
4. Expose the behavior through React components.
5. Verify the flow in `apps/playground`.

Keep package boundaries strict:

- `core` should stay portable.
- `react` can depend on `core`.
- `playground` can depend on `react`.
- `core` must not depend on `react`, `fabric`, or `zustand`.

## Product Template Example

```ts
const sampleTemplate = {
  id: "basic-shirt",
  name: "Basic T-Shirt",
  width: 600,
  height: 700,
  sides: [
    {
      id: "front",
      name: "Front",
      backgroundImage: undefined,
      printArea: {
        x: 150,
        y: 150,
        width: 300,
        height: 400,
      },
    },
  ],
};
```

## Design Principles

- Keep the core package independent from rendering frameworks.
- Prefer clear, readable TypeScript over clever abstractions.
- Make V1 functional before adding polish.
- Keep Fabric.js details isolated to the React package.
- Treat JSON serialization as a first-class workflow.
- Keep the playground focused on real editor usage.

## Roadmap

### V1

- Working React editor
- Product placeholder/background rendering
- Print area overlay
- Add/edit text
- Upload images
- Select, move, resize, and rotate objects
- Layer panel
- Properties panel
- Undo/redo
- Save/load JSON
- Export PNG

### Later

- Multiple product sides
- Multiple product templates
- Rich text controls
- Shape tools
- Clip paths and print masks
- SVG/PDF export
- Print resolution checks
- React package documentation
- Vue package
- Nuxt example
- Next.js example
- Shopify integration
- WooCommerce integration
- Laravel integration

## Contributing

Contributions are welcome once the V1 foundation is in place.

For now, useful contributions should focus on:

- Tightening the core data model
- Improving editor state behavior
- Making Fabric.js sync reliable
- Improving accessibility of editor controls
- Adding focused tests for serialization and state helpers
- Improving the playground as a development surface

Before opening a pull request:

```bash
pnpm build
pnpm test
pnpm lint
```

## License

License information will be added before the first public release.

## Status

Open Product Designer is under active early development. APIs may change while the V1 editor foundation is being built.

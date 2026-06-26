import { ProductDesigner } from '@open-product-designer/react'
import './App.css'

const sampleTemplate = {
  id: 'basic-shirt',
  name: 'Basic T-Shirt',
  width: 600,
  height: 700,
  sides: [
    {
      id: 'front',
      name: 'Front',
      backgroundImage: undefined,
      printArea: {
        x: 150,
        y: 150,
        width: 300,
        height: 400,
      },
    },
  ],
}

const toolItems = [
  'Add Text',
  'Upload Image',
  'Delete',
  'Undo',
  'Redo',
  'Save JSON',
  'Load JSON',
  'Export PNG',
]

function App() {
  return (
    <main className="designer-app">
      <header className="app-header">
        <div>
          <h1>Open Product Designer</h1>
          <p>{sampleTemplate.name}</p>
        </div>
        <div className="template-meta">
          <span>{sampleTemplate.width} x {sampleTemplate.height}</span>
          <span>{sampleTemplate.sides[0]?.name}</span>
        </div>
      </header>

      <section className="editor-shell" aria-label="Product designer editor">
        <aside className="toolbar-panel" aria-label="Designer toolbar">
          <h2>Tools</h2>
          <div className="tool-list">
            {toolItems.map((item) => (
              <button key={item} type="button" disabled>
                {item}
              </button>
            ))}
          </div>
        </aside>

        <section className="canvas-panel" aria-label="Canvas workspace">
          <div className="canvas-stage">
            <ProductDesigner template={sampleTemplate} />
          </div>
        </section>

        <aside className="inspector-panel" aria-label="Properties and layers">
          <section>
            <h2>Properties</h2>
            <div className="empty-panel">
              Select an object to edit text, color, size, and position.
            </div>
          </section>

          <section>
            <h2>Layers</h2>
            <div className="layer-item">
              <span>Print area</span>
              <span>Guide</span>
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

export default App

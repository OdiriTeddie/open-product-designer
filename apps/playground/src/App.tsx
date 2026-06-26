import { useMemo, useRef } from 'react'
import {
  ProductDesigner,
  exportDesignerCanvasAsPng,
  useDesignerStore,
} from '@open-product-designer/react'
import type { ProductTemplate } from '@open-product-designer/react'
import './App.css'

const sampleTemplate: ProductTemplate = {
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

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

function downloadText(contents: string, filename: string) {
  const blob = new Blob([contents], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  downloadDataUrl(url, filename)
  URL.revokeObjectURL(url)
}

function App() {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const jsonInputRef = useRef<HTMLInputElement | null>(null)

  const design = useDesignerStore((state) => state.design)
  const selectedObjectId = useDesignerStore((state) => state.selectedObjectId)
  const addText = useDesignerStore((state) => state.addText)
  const addImage = useDesignerStore((state) => state.addImage)
  const deleteSelectedObject = useDesignerStore(
    (state) => state.deleteSelectedObject,
  )
  const undo = useDesignerStore((state) => state.undo)
  const redo = useDesignerStore((state) => state.redo)
  const saveDesign = useDesignerStore((state) => state.saveDesign)
  const loadDesign = useDesignerStore((state) => state.loadDesign)
  const updateSelectedObject = useDesignerStore(
    (state) => state.updateSelectedObject,
  )
  const selectObject = useDesignerStore((state) => state.selectObject)
  const bringSelectedForward = useDesignerStore(
    (state) => state.bringSelectedForward,
  )
  const sendSelectedBackward = useDesignerStore(
    (state) => state.sendSelectedBackward,
  )
  const history = useDesignerStore((state) => state.history)

  const selectedObject = useMemo(
    () => design.objects.find((object) => object.id === selectedObjectId),
    [design.objects, selectedObjectId],
  )

  const activeSideName =
    sampleTemplate.sides.find((side) => side.id === design.activeSideId)?.name ??
    sampleTemplate.sides[0]?.name

  function handleImageUpload(file: File | undefined) {
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        addImage(reader.result)
      }
    })
    reader.readAsDataURL(file)
  }

  function handleJsonUpload(file: File | undefined) {
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        loadDesign(reader.result)
      }
    })
    reader.readAsText(file)
  }

  function handleSaveJson() {
    downloadText(saveDesign(), 'open-product-design.json')
  }

  function handleExportPng() {
    const png = exportDesignerCanvasAsPng({ multiplier: 2 })

    if (png) {
      downloadDataUrl(png, 'open-product-design.png')
    }
  }

  return (
    <main className="designer-app">
      <header className="app-header">
        <div>
          <h1>Open Product Designer</h1>
          <p>{sampleTemplate.name}</p>
        </div>
        <div className="template-meta">
          <span>
            {sampleTemplate.width} x {sampleTemplate.height}
          </span>
          <span>{activeSideName}</span>
        </div>
      </header>

      <section className="editor-shell" aria-label="Product designer editor">
        <aside className="toolbar-panel" aria-label="Designer toolbar">
          <h2>Tools</h2>
          <div className="tool-list">
            <button type="button" onClick={() => addText()}>
              Add Text
            </button>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
            >
              Upload Image
            </button>
            <button
              type="button"
              disabled={!selectedObject}
              onClick={deleteSelectedObject}
            >
              Delete
            </button>
            <button
              type="button"
              disabled={history.past.length === 0}
              onClick={undo}
            >
              Undo
            </button>
            <button
              type="button"
              disabled={history.future.length === 0}
              onClick={redo}
            >
              Redo
            </button>
            <button type="button" onClick={handleSaveJson}>
              Save JSON
            </button>
            <button type="button" onClick={() => jsonInputRef.current?.click()}>
              Load JSON
            </button>
            <button type="button" onClick={handleExportPng}>
              Export PNG
            </button>
          </div>

          <input
            ref={imageInputRef}
            className="visually-hidden"
            type="file"
            accept="image/*"
            onChange={(event) => {
              handleImageUpload(event.target.files?.[0])
              event.target.value = ''
            }}
          />
          <input
            ref={jsonInputRef}
            className="visually-hidden"
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              handleJsonUpload(event.target.files?.[0])
              event.target.value = ''
            }}
          />
        </aside>

        <section className="canvas-panel" aria-label="Canvas workspace">
          <div className="canvas-stage">
            <ProductDesigner template={sampleTemplate} />
          </div>
        </section>

        <aside className="inspector-panel" aria-label="Properties and layers">
          <section>
            <h2>Properties</h2>
            {selectedObject ? (
              <div className="properties-form">
                {selectedObject.type === 'text' ? (
                  <label>
                    Text
                    <textarea
                      value={selectedObject.text ?? ''}
                      rows={3}
                      onChange={(event) =>
                        updateSelectedObject({ text: event.target.value })
                      }
                    />
                  </label>
                ) : null}

                <label>
                  Fill
                  <input
                    type="color"
                    value={selectedObject.fill ?? '#111827'}
                    onChange={(event) =>
                      updateSelectedObject({ fill: event.target.value })
                    }
                  />
                </label>

                {selectedObject.type === 'text' ? (
                  <label>
                    Font size
                    <input
                      type="number"
                      min="8"
                      max="160"
                      value={selectedObject.fontSize ?? 32}
                      onChange={(event) =>
                        updateSelectedObject({
                          fontSize: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                ) : null}

                <div className="layer-actions">
                  <button type="button" onClick={bringSelectedForward}>
                    Bring Forward
                  </button>
                  <button type="button" onClick={sendSelectedBackward}>
                    Send Backward
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-panel">
                Select an object to edit text, color, size, and position.
              </div>
            )}
          </section>

          <section>
            <h2>Layers</h2>
            <div className="layers-list">
              {design.objects.length > 0 ? (
                [...design.objects].reverse().map((object) => (
                  <button
                    key={object.id}
                    type="button"
                    className={
                      object.id === selectedObjectId
                        ? 'layer-item selected'
                        : 'layer-item'
                    }
                    onClick={() => selectObject(object.id)}
                  >
                    <span>
                      {object.type === 'text'
                        ? object.text || 'Text'
                        : object.type}
                    </span>
                    <span>{object.type}</span>
                  </button>
                ))
              ) : (
                <div className="empty-panel compact">No design objects yet.</div>
              )}
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

export default App

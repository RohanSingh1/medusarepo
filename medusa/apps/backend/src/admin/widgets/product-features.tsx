import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Input, Textarea, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"

type WidgetProps = {
  data: {
    id: string
  }
}

type Feature = {
  id: string
  title: string
  description: string
  rank: number
}

type DraftFeature = Feature & { isNew?: boolean; isSaving?: boolean }

const ProductFeaturesWidget = ({ data: product }: WidgetProps) => {
  const [features, setFeatures] = useState<DraftFeature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/admin/products/${product.id}/features`, { credentials: "include" })
      .then((res) => res.json())
      .then(({ features }: { features: Feature[] }) => {
        setFeatures(
          [...features].sort((a, b) => a.rank - b.rank)
        )
      })
      .finally(() => setLoading(false))
  }, [product.id])

  const updateRow = (id: string, patch: Partial<DraftFeature>) => {
    setFeatures((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    )
  }

  const handleAdd = () => {
    setFeatures((rows) => [
      ...rows,
      {
        id: `new-${Date.now()}`,
        title: "",
        description: "",
        rank: rows.length,
        isNew: true,
      },
    ])
  }

  const handleSave = async (row: DraftFeature) => {
    if (!row.title.trim()) {
      toast.error("Title is required")
      return
    }

    updateRow(row.id, { isSaving: true })
    try {
      if (row.isNew) {
        const res = await fetch(`/admin/products/${product.id}/features`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: row.title,
            description: row.description,
            rank: row.rank,
          }),
        })
        if (!res.ok) throw new Error("Failed to create feature")
        const { feature } = await res.json()
        setFeatures((rows) =>
          rows.map((r) => (r.id === row.id ? { ...feature, isSaving: false } : r))
        )
      } else {
        const res = await fetch(
          `/admin/products/${product.id}/features/${row.id}`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: row.title,
              description: row.description,
            }),
          }
        )
        if (!res.ok) throw new Error("Failed to update feature")
        updateRow(row.id, { isSaving: false })
      }
      toast.success("Feature saved")
    } catch (err) {
      updateRow(row.id, { isSaving: false })
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  const handleRemove = async (row: DraftFeature) => {
    if (row.isNew) {
      setFeatures((rows) => rows.filter((r) => r.id !== row.id))
      return
    }

    updateRow(row.id, { isSaving: true })
    try {
      const res = await fetch(
        `/admin/products/${product.id}/features/${row.id}`,
        { method: "DELETE", credentials: "include" }
      )
      if (!res.ok) throw new Error("Failed to remove feature")
      setFeatures((rows) => rows.filter((r) => r.id !== row.id))
      toast.success("Feature removed")
    } catch (err) {
      updateRow(row.id, { isSaving: false })
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Product Features</Heading>
        <Button variant="secondary" size="small" onClick={handleAdd}>
          Add feature
        </Button>
      </div>
      <div className="flex flex-col gap-y-4 px-6 py-4">
        {loading ? (
          <span className="text-ui-fg-subtle text-small">Loading...</span>
        ) : features.length === 0 ? (
          <span className="text-ui-fg-subtle text-small">
            No features yet. Add one to show it on the storefront.
          </span>
        ) : (
          features.map((row) => (
            <div
              key={row.id}
              className="border-ui-border-base flex flex-col gap-y-2 rounded-lg border p-4"
            >
              <Input
                placeholder="Title"
                value={row.title}
                onChange={(e) => updateRow(row.id, { title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={row.description}
                onChange={(e) =>
                  updateRow(row.id, { description: e.target.value })
                }
              />
              <div className="flex gap-x-2">
                <Button
                  size="small"
                  onClick={() => handleSave(row)}
                  disabled={row.isSaving}
                >
                  Save
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleRemove(row)}
                  disabled={row.isSaving}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductFeaturesWidget

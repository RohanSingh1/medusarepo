import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Text, toast } from "@medusajs/ui"
import { useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "react"

type WidgetProps = {
  data: {
    id: string
    metadata?: Record<string, unknown> | null
  }
}

const SecondaryImageWidget = ({ data: product }: WidgetProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(
    (product.metadata?.secondary_image as string) || null
  )
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const saveMetadata = async (metadata: Record<string, unknown>) => {
    const res = await fetch(`/admin/products/${product.id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metadata }),
    })

    if (!res.ok) {
      throw new Error("Failed to save product")
    }

    // The dashboard's own product query cache doesn't know about this write
    // since it went through a raw fetch, not the shared data layer — without
    // this, the rest of the page (built-in metadata panel, etc.) keeps
    // showing stale data until a manual refresh.
    await queryClient.invalidateQueries({
      predicate: (query) =>
        JSON.stringify(query.queryKey).includes(product.id),
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("files", file)

      const uploadRes = await fetch("/admin/uploads", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error("Upload failed")
      }

      const { files } = await uploadRes.json()
      const url = files[0].url

      await saveMetadata({ ...product.metadata, secondary_image: url })

      setImageUrl(url)
      toast.success("Secondary image uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = async () => {
    setUploading(true)
    try {
      // Medusa merges the metadata object you send with what's already
      // stored — omitting a key leaves the old value untouched. Setting it
      // to null is what actually deletes it.
      await saveMetadata({ ...product.metadata, secondary_image: null })
      setImageUrl(null)
      toast.success("Secondary image removed")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Secondary Image</Heading>
      </div>
      <div className="px-6 py-4">
        {imageUrl ? (
          <div className="flex flex-col gap-y-4">
            <img
              src={imageUrl}
              alt="Secondary product image"
              className="w-full rounded-lg object-cover aspect-square"
            />
            <div className="flex gap-x-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Replace
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={handleRemove}
                disabled={uploading}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-4">
            <Text size="small" className="text-ui-fg-subtle">
              Upload a secondary image for this product, e.g. a lifestyle
              shot or a hover-swap image for the storefront listing grid.
            </Text>
            <Button
              variant="secondary"
              size="small"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload image"}
            </Button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
})

export default SecondaryImageWidget

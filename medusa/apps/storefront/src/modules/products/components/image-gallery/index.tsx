"use client"

import { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { Container, clx } from "@modules/common/components/ui"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selected, setSelected] = useState(0)
  const activeImage = images[Math.min(selected, images.length - 1)]

  if (!images.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <Container
        className="relative aspect-square w-full overflow-hidden bg-ui-bg-subtle"
        id={activeImage.id}
      >
        {!!activeImage.url && (
          <Image
            key={activeImage.id}
            src={activeImage.url}
            priority
            className="absolute inset-0 rounded-rounded"
            alt="Product image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        )}
      </Container>

      {images.length > 1 && (
        <div className="grid grid-cols-4 xsmall:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`View image ${index + 1}`}
              className={clx(
                "relative aspect-square overflow-hidden rounded-rounded bg-ui-bg-subtle transition-colors",
                index === selected
                  ? "ring-2 ring-brand-primary"
                  : "ring-1 ring-ui-border-base hover:ring-brand-secondary"
              )}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="120px"
                  style={{ objectFit: "cover" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery

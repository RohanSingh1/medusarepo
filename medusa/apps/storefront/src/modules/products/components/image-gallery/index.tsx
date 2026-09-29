import { HttpTypes } from "@medusajs/types"
import { Container } from "@modules/common/components/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images.length) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-brand-sand flex items-center justify-center">
        <span className="font-script text-brand-plum/15 text-[18vw] small:text-[8vw]">
          AURA
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {images.map((image, index) => {
        return (
          <Container
            key={image.id}
            className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-brand-sand"
            id={image.id}
          >
            {!!image.url && (
              <Image
                src={image.url}
                priority={index <= 2 ? true : false}
                className="absolute inset-0"
                alt={`Product image ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                style={{
                  objectFit: "cover",
                }}
              />
            )}
          </Container>
        )
      })}
    </div>
  )
}

export default ImageGallery

import { ReactNode } from "react"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import { StoreProductFeature } from "@lib/data/product-features"
import { Heading } from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
  features?: StoreProductFeature[]
}

const SectionCard = ({
  eyebrow,
  label,
  subheading,
  children,
}: {
  eyebrow: string
  label: string
  subheading: string
  children: ReactNode
}) => (
  <div className="rounded-[16px] bg-brand-sand p-6 small:p-8 w-full">
    <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand-pink">
      {eyebrow}
    </span>
    <Heading
      level="h3"
      className="font-display font-normal text-brand-deep-plum text-[28px] small:text-[32px] leading-[1.1] mt-1.5"
    >
      {label}
    </Heading>
    <p className="text-sm text-brand-deep-plum/55 mt-1.5 mb-6">
      {subheading}
    </p>
    {children}
  </div>
)

const ProductTabs = ({ product, features }: ProductTabsProps) => {
  const metadataEntries = Object.entries(product.metadata ?? {}).filter(
    ([key, value]) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      key !== "secondary_image"
  )
  const hasFeatures = !!features && features.length > 0
  const hasAdditionalInfo = metadataEntries.length > 0

  return (
    <div className="flex flex-col gap-6 w-full">
      <div
        className={`grid grid-cols-1 gap-6 ${
          hasAdditionalInfo ? "small:grid-cols-2" : ""
        }`}
      >
        <SectionCard
          eyebrow="Details"
          label="Product Information"
          subheading="The essentials — material, origin, and specs."
        >
          <ProductInfoTab product={product} />
        </SectionCard>
        {hasAdditionalInfo && (
          <SectionCard
            eyebrow="Details"
            label="Additional Information"
            subheading="A few more specs worth knowing."
          >
            <AdditionalInfoTab entries={metadataEntries} />
          </SectionCard>
        )}
      </div>
      {hasFeatures && (
        <SectionCard
          eyebrow="Highlights"
          label="Features"
          subheading="What makes this fragrance stand out."
        >
          <FeaturesTab features={features!} />
        </SectionCard>
      )}
      <SectionCard
        eyebrow="Logistics"
        label="Shipping & Returns"
        subheading="Delivery times, exchanges, and our return policy."
      >
        <ShippingInfoTab />
      </SectionCard>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-brand-deep-plum">
      <div className="flex flex-col gap-y-4">
        <div>
          <span className="font-semibold">Material</span>
          <p className="text-brand-deep-plum/72">
            {product.material ? product.material : "-"}
          </p>
        </div>
        <div>
          <span className="font-semibold">Country of origin</span>
          <p className="text-brand-deep-plum/72">
            {product.origin_country ? product.origin_country : "-"}
          </p>
        </div>
        <div>
          <span className="font-semibold">Type</span>
          <p className="text-brand-deep-plum/72">
            {product.type ? product.type.value : "-"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div>
          <span className="font-semibold">Weight</span>
          <p className="text-brand-deep-plum/72">
            {product.weight ? `${product.weight} g` : "-"}
          </p>
        </div>
        <div>
          <span className="font-semibold">Dimensions</span>
          <p className="text-brand-deep-plum/72">
            {product.length && product.width && product.height
              ? `${product.length}L x ${product.width}W x ${product.height}H`
              : "-"}
          </p>
        </div>
      </div>
    </div>
  )
}

const FeaturesTab = ({ features }: { features: StoreProductFeature[] }) => {
  return (
    <div className="flex flex-col gap-y-6 text-brand-deep-plum">
      {features.map((feature) => (
        <div key={feature.id}>
          <span className="font-semibold">{feature.title}</span>
          <p className="text-brand-deep-plum/72">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}

const AdditionalInfoTab = ({
  entries,
}: {
  entries: [string, unknown][]
}) => {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-brand-deep-plum">
      {entries.map(([key, value]) => (
        <div key={key}>
          <span className="font-semibold capitalize">
            {key.replace(/_/g, " ")}
          </span>
          <p className="text-brand-deep-plum/72">
            {typeof value === "object"
              ? JSON.stringify(value)
              : String(value)}
          </p>
        </div>
      ))}
    </div>
  )
}

const ShippingInfoTab = () => {
  const items = [
    {
      icon: <FastDelivery />,
      title: "Fast delivery",
      body: "Your package will arrive in 3-5 business days at your pick up location or in the comfort of your home.",
    },
    {
      icon: <Refresh />,
      title: "Simple exchanges",
      body: "Is the fit not quite right? No worries - we'll exchange your product for a new one.",
    },
    {
      icon: <Back />,
      title: "Easy returns",
      body: "Just return your product and we'll refund your money. No questions asked – we'll do our best to make sure your return is hassle-free.",
    },
  ]

  return (
    <div className="grid grid-cols-1 small:grid-cols-3 gap-4 text-brand-deep-plum">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex flex-col gap-2 rounded-[12px] bg-white p-5"
        >
          {item.icon}
          <span className="font-semibold">{item.title}</span>
          <p className="text-brand-deep-plum/72">{item.body}</p>
        </div>
      ))}
    </div>
  )
}

export default ProductTabs

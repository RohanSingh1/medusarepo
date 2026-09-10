"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import { StoreProductFeature } from "@lib/data/product-features"
import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
  features?: StoreProductFeature[]
}

const ProductTabs = ({ product, features }: ProductTabsProps) => {
  const metadataEntries = Object.entries(product.metadata ?? {}).filter(
    ([key, value]) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      key !== "secondary_image"
  )

  const tabs = [
    {
      label: "Product Information",
      component: <ProductInfoTab product={product} />,
    },
    ...(features && features.length > 0
      ? [
          {
            label: "Features",
            component: <FeaturesTab features={features} />,
          },
        ]
      : []),
    ...(metadataEntries.length > 0
      ? [
          {
            label: "Additional Information",
            component: <AdditionalInfoTab entries={metadataEntries} />,
          },
        ]
      : []),
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Material</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Country of origin</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Type</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Weight</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Dimensions</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const FeaturesTab = ({ features }: { features: StoreProductFeature[] }) => {
  return (
    <div className="text-small-regular py-8">
      <div className="flex flex-col gap-y-6">
        {features.map((feature) => (
          <div key={feature.id}>
            <span className="font-semibold">{feature.title}</span>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const AdditionalInfoTab = ({
  entries,
}: {
  entries: [string, unknown][]
}) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {entries.map(([key, value]) => (
          <div key={key}>
            <span className="font-semibold capitalize">
              {key.replace(/_/g, " ")}
            </span>
            <p>
              {typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Fast delivery</span>
            <p className="max-w-sm">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Simple exchanges</span>
            <p className="max-w-sm">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Easy returns</span>
            <p className="max-w-sm">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs

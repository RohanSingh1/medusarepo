import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  // variant.title is a snapshot taken when the variant was first created -
  // it doesn't get regenerated if an option (e.g. Color) is added to the
  // variant later, so it can silently go stale and drop options. Build the
  // label from the variant's actual current options instead.
  const options = variant?.options as
    | (HttpTypes.StoreProductVariant["options"][number] & {
        option?: { title?: string }
      })[]
    | undefined

  const label = options?.length
    ? options
        .map((o) => (o.option?.title ? `${o.option.title}: ${o.value}` : o.value))
        .join(" / ")
    : variant?.title

  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis"
    >
      {label}
    </Text>
  )
}

export default LineItemOptions

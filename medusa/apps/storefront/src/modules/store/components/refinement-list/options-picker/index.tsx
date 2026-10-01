"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { useEffect, useState } from "react"

import { ChevronDownMini } from "@medusajs/icons"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import clsx from "clsx"

type OptionsPickerProps = {
  selectedValueIds: string[]
  setOptionValueIds: (valueIds: string[]) => void
}

const OptionsPicker = ({
  selectedValueIds,
  setOptionValueIds,
}: OptionsPickerProps) => {
  const [options, setOptions] = useState<HttpTypes.StoreProductOption[]>([])
  const [openItems, setOpenItems] = useState<string[]>([])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await sdk.client.fetch<{
          product_options?: HttpTypes.StoreProductOption[]
        }>("/store/product-options", {
          method: "GET",
          query: {
            is_exclusive: false,
            fields: "*values",
          },
        })

        if (response?.product_options) {
          setOptions(response.product_options)
        }
      } catch (error) {
        console.error("Failed to fetch product options", error)
      }
    }

    fetchOptions()
  }, [])

  useEffect(() => {
    if (options.length) {
      setOpenItems(options.map((option) => option.id))
    }
  }, [options])

  if (!options.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-brand-deep-plum">
          Filter by
        </span>
      </div>
      <Accordion.Root
        type="multiple"
        value={openItems}
        onValueChange={(values) => setOpenItems(values as string[])}
        className="flex flex-col gap-y-1 divide-y divide-brand-deep-plum/10"
      >
        {options.map((option) => {
          const values =
            option.values
              ?.map((value) => ({
                id: value.id,
                label: value.value,
              }))
              .filter(
                (value): value is { id: string; label: string } =>
                  !!value.id && !!value.label
              ) || []

          if (!values.length) {
            return null
          }

          const toggleValue = (valueId: string) => {
            const isSelected = selectedValueIds.includes(valueId)
            const nextSelections = isSelected
              ? selectedValueIds.filter((id) => id !== valueId)
              : [...selectedValueIds, valueId]

            setOptionValueIds(Array.from(new Set(nextSelections)))
          }

          const isOpen = openItems.includes(option.id)
          const selectedCount = values.filter((value) =>
            selectedValueIds.includes(value.id)
          ).length
          const isColorOption = /color|colour/i.test(option.title ?? "")

          return (
            <Accordion.Item
              key={option.id}
              value={option.id}
              className="overflow-hidden"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-brand-deep-plum">
                      {option.title || "Option"}
                    </span>
                    <span className="text-sm text-brand-deep-plum/50">
                      ({selectedCount})
                    </span>
                  </div>
                  <span
                    className={clsx(
                      "flex h-7 w-7 items-center justify-center text-brand-deep-plum/50 transition-transform duration-150",
                      {
                        "rotate-180": isOpen,
                      }
                    )}
                  >
                    <ChevronDownMini />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-4 pt-1">
                <div className="flex flex-wrap gap-3">
                  {values.map((value) => {
                    const isSelected = selectedValueIds.includes(value.id)

                    if (isColorOption) {
                      return (
                        <button
                          key={value.id}
                          onClick={() => toggleValue(value.id)}
                          className="flex flex-col items-center gap-1.5 group"
                          aria-pressed={isSelected}
                          aria-label={value.label}
                          title={value.label}
                        >
                          <span
                            className={clsx(
                              "h-8 w-8 rounded-full transition-shadow shadow-[0_0_0_1px_rgba(59,26,51,0.12)]",
                              isSelected
                                ? "shadow-[0_0_0_2px_white,0_0_0_4px_theme(colors.brand.pink)]"
                                : "group-hover:shadow-[0_0_0_1px_rgba(59,26,51,0.3)]"
                            )}
                            style={{ backgroundColor: value.label.toLowerCase() }}
                          />
                          <span className="text-xs font-semibold text-brand-deep-plum/70">
                            {value.label}
                          </span>
                        </button>
                      )
                    }

                    return (
                      <button
                        key={value.id}
                        onClick={() => toggleValue(value.id)}
                        className={clsx(
                          "text-sm h-9 rounded-full px-3.5 flex items-center transition-colors duration-150 font-semibold",
                          {
                            "bg-brand-pink text-white": isSelected,
                            "bg-white text-brand-deep-plum/70 hover:bg-brand-blush/60":
                              !isSelected,
                          }
                        )}
                        aria-pressed={isSelected}
                      >
                        {value.label}
                      </button>
                    )
                  })}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </div>
  )
}

export default OptionsPicker

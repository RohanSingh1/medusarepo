import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  hasSelection?: boolean
  isValueAvailable?: (optionId: string, value: string) => boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
  hasSelection,
  isValueAvailable,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  const isColorOption = /color|colour/i.test(title)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-semibold text-brand-deep-plum">
        Select {title}
      </span>
      <div className="flex flex-wrap gap-3" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          const isSelected = v === current
          const unavailable =
            !!hasSelection && !!isValueAvailable && !isValueAvailable(option.id, v)

          if (isColorOption) {
            return (
              <button
                onClick={() => updateOption(option.id, v)}
                key={v}
                className={clx(
                  "flex flex-col items-center gap-1.5 group",
                  disabled && "opacity-50"
                )}
                disabled={disabled}
                data-testid="option-button"
                aria-label={v}
                title={unavailable ? `${v} - not available` : v}
              >
                <span className="relative h-9 w-9">
                  <span
                    className={clx(
                      "absolute inset-0 rounded-full transition-shadow shadow-[0_0_0_1px_rgba(59,26,51,0.12)]",
                      isSelected
                        ? "shadow-[0_0_0_2px_white,0_0_0_4px_theme(colors.brand.pink)]"
                        : "group-hover:shadow-[0_0_0_1px_rgba(59,26,51,0.3)]"
                    )}
                    style={{ backgroundColor: v.toLowerCase() }}
                  />
                  {unavailable && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/25">
                      <span className="text-white text-sm font-bold leading-none">
                        ✕
                      </span>
                    </span>
                  )}
                </span>
                <span
                  className={clx(
                    "text-xs font-semibold text-brand-deep-plum/70",
                    unavailable && "line-through text-brand-deep-plum/35"
                  )}
                >
                  {v}
                </span>
              </button>
            )
          }

          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "relative h-10 rounded-full px-4 text-sm font-semibold transition-colors",
                isSelected
                  ? "bg-brand-pink text-white"
                  : "bg-brand-sand text-brand-deep-plum hover:bg-brand-blush/60",
                unavailable && "opacity-50"
              )}
              disabled={disabled}
              data-testid="option-button"
              title={unavailable ? `${v} - not available` : v}
            >
              {unavailable && <span className="mr-1.5">✕</span>}
              <span className={clx(unavailable && "line-through")}>{v}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect

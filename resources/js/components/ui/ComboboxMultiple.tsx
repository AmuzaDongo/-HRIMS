"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

type Option = {
  label: string
  value: string
}

interface MultiComboboxProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

export function MultiCombobox({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  emptyText = "No items found.",
  className = "",
}: MultiComboboxProps) {
  const anchor = useComboboxAnchor()

  return (
    <Combobox
      multiple
      autoHighlight
      value={value}
      onValueChange={onChange}
    >
      <ComboboxChips ref={anchor} className={`w-full ${className}`}>
        <ComboboxValue>
          {(values) => (
            <>
              {values.map((val: string) => {
                const option = options.find((o) => o.value === val)
                return (
                  <ComboboxChip key={val}>
                    {option?.label ?? val}
                  </ComboboxChip>
                )
              })}
              <ComboboxChipsInput placeholder={placeholder} />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>

        <ComboboxList>
          {options.map((item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
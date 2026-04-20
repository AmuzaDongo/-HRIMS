"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

type Option = {
  label: string;
  value: string;
};

interface SearchableSelectProps {
  options?: Option[];
  value?: string | null | "";
  onChange: (value: string | null) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  options = [],
  value = null,
  onChange,
  placeholder = "Select option...",
  emptyText = "No results found.",
  disabled = false,
}: SearchableSelectProps) {
  const items = options.map((opt) => opt.value);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Combobox
      items={items}
      value={value || undefined}
      onValueChange={onChange}
      disabled={disabled}

      itemToStringValue={(itemValue: string) => {
        const option = options.find((o) => o.value === itemValue);
        return option?.label || itemValue;
      }}
    >
      <ComboboxInput
        placeholder={selectedOption?.label || placeholder}
        disabled={disabled}
        value={selectedOption?.label || ""}
      />

      <ComboboxContent className="pointer-events-auto">
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>

        <ComboboxList>
          {(itemValue: string) => {
            const option = options.find((o) => o.value === itemValue);
            if (!option) return null;

            return (
              <ComboboxItem key={itemValue} value={itemValue}>
                {option.label}
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}